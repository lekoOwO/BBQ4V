var mysql = require('mysql');
var jwt = require('jsonwebtoken');  // JWT 簽名和驗證
var conf = require('../conf');
const db = require("./db")
const accountGroups = require("../models/account-groups")

var tableName = 'accounts';
var sql;

module.exports = {
    // 使用者登入認證
    login: function (req, callback) {
        sql = mysql.format('SELECT * FROM ' + tableName + ' WHERE username = ? AND password = ?', [req.body.username, req.body.password]);
        return db.query(sql, callback);
    },
    // 產生 OAuth 2.0 和 JWT 的 JSON 格式令牌訊息
    createToken: function (req, callback) {   
        let payload = {
            iss: req.results[0].username,
            sub: conf.name,
            role: req.results[0].role,   // 自訂聲明。用來讓伺服器確認使用者的角色權限 (決定使用者能使用 Web API 的權限)
            id: req.results[0].id
        };

        // 產生 JWT
        let token = jwt.sign(payload, conf.jwtSecret, {
            algorithm: 'HS256',
            expiresIn: conf.increaseTime + 's'  // JWT 的到期時間 (當前 UNIX 時間戳 + 設定的時間)。必須加上時間單位，否則預設為 ms (毫秒)
        })
                
        // JSON 格式符合 OAuth 2.0 標準，除自訂 info 屬性是為了讓前端取得額外資訊 (例如使用者名稱)，
        return callback({
            access_token: token,
            token_type: 'bearer',
            expires_in: (Date.parse(new Date()) / 1000) + conf.increaseTime,    // UNIX 時間戳 + conf.increaseTime
            role: req.results[0].role,
            info: {
                username: req.results[0].username,
                id: req.results[0].id
            }
        });
    },
    // 驗證 JWT
    tokenVerify: function (req, res, next) {
        // 沒有 JWT
        req.isTokenVerified = true;

        if (!req.headers.authorization) {
            return res.status(401).json({ error: 'invalid_client', error_description: '沒有 token！' })
        }
    
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] == 'Bearer') {
            jwt.verify(req.headers.authorization.split(' ')[1], conf.jwtSecret, function (err, decoded) {
                if (err) {
                    res.customStatus = 400;

                    switch (err.name) {
                        // JWT 過期
                        case 'TokenExpiredError':
                            return res.status(401).json({ error: 'invalid_grant', error_description: 'token 過期！' })
                            break;
                        // JWT 無效
                        case 'JsonWebTokenError':
                            return res.status(401).json({ error: 'invalid_grant', error_description: 'token 無效！' })
                            break;
                    }
                } else {
                    req.user = decoded;   
                    next();                 
                }
            });
        }
    },
    // Web API 存取控制
    accessControl: function (allowedRoles) {
        const tmp = async function (req, res, next) {
            if (!req.user || !req.user.role.length) {
                res.status(401).json({ error: 'unauthorized_client', error_description: '權限不足！' })
            } else {
                // 舊版權限管理轉新版
                if (Array.isArray(allowedRoles)) {
                    allowedRoles = {
                        role: allowedRoles
                    }
                }

                let allowed = false;

                if (allowedRoles.role) {
                    for await (const roleRule of allowedRoles.role) {
                        if (roleRule[0] === "!") {
                            if (req.user.role !== roleRule.slice(1)) {
                                allowed = true;
                                break;
                            }
                        } else if (req.user.role === roleRule) {
                            allowed = true;
                            break;
                        }
                    }
                }
                if (!allowed && allowedRoles.user) {
                    for await (const userId of allowedRoles.user) {
                        if (req.user.id === parseInt(userId)) {
                            allowed = true;
                            break;
                        }
                    }
                }

                if (!allowed && allowedRoles.group) {
                    const accountId = req.user.id;
                    const [results, _] = await accountGroups.getGroup(accountId);

                    const groupIds = results.map(x => x.groupId)
                    for await (const rule of allowedRoles.group) {
                        if (Number.isInteger(rule)) {
                            if (groupIds.include(rule)) {
                                allowed = true;
                            }
                        } else {
                            // 使用 {table: TABLE_NAME, where: WHERE_CONSTRAINT} 來查詢使用者所屬群組 id 是否在指定的 table 內
                            const tableName = await rule.table;
                            const sql = mysql.format('SELECT 1 FROM ' + tableName + ` WHERE ${await (rule.where) || "TRUE"} AND groupId IN (?) =`, [groupIds]);
                            const [results, _] = await db.queryP(sql);
                            if (results.length) {
                                allowed = true;
                            }
                        }
                    }
                }
                if (!allowed) {
                    return res.status(400).json({ error: 'unauthorized_client', error_description: '權限不足！' })
                }
                else next()
            }
        }
        return (req, res, next) => {
            if (!req.isTokenVerified) {
                this.tokenVerify(req, res, () => {
                    tmp(req, res, next)
                })
            } else {
                tmp(req, res, next)
            }
        }
    }
};
