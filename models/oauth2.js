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
        if (!req.headers.authorization) {
            res.customStatus = 401;
            res.customError = { error: 'invalid_client', error_description: '沒有 token！' };
        }
    
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] == 'Bearer') {
            jwt.verify(req.headers.authorization.split(' ')[1], conf.jwtSecret, function (err, decoded) {
                if (err) {
                    res.customStatus = 400;

                    switch (err.name) {
                        // JWT 過期
                        case 'TokenExpiredError':
                            res.customError = { error: 'invalid_grant', error_description: 'token 過期！' };
                            break;
                        // JWT 無效
                        case 'JsonWebTokenError':
                            res.customError = { error: 'invalid_grant', error_description: 'token 無效！' };
                            break;
                    }
                } else {
                    req.user = decoded;                    
                }
            });
        }

        next();
    },
    // Web API 存取控制
    accessControl: function (allowedRoles) {
        return function (req, res, next) {
            if (!req.user.role.length) {
                res.customStatus = 400;
                res.customError = { error: 'unauthorized_client', error_description: '權限不足！' };
            } else {
                // 舊版權限管理轉新版
                if (Array.isArray(allowedRoles)) {
                    allowedRoles = {
                        role: allowedRoles
                    }
                }

                return new Promise(async (resolve, reject) => {
                    let allowed = false;

                    if (allowedRoles.role) {
                        for (const allowedRole of allowedRoles.role) {
                            if (allowedRole[0] === "!") {
                                if (req.user.role !== allowedRole.slice(1)) {
                                    allowed = true;
                                    break;
                                }
                            } else if (req.user.role === allowedRole) {
                                allowed = true;
                                break;
                            }
                        }
                    }
                    if (!allowed && allowedRoles.user) {
                        for await (let userId of allowedRoles.user) {
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
                        for await (const allowedRole of allowedRoles.group) {
                            if (Number.isInteger(allowedRole)) {
                                if (groupIds.include(allowedRole)) {
                                    allowed = true;
                                }
                            } else {
                                // 使用 {table: TABLE_NAME, where: WHERE_CONSTRAINT} 來查詢使用者所屬群組 id 是否在指定的 table 內
                                const tableName = await allowedRole.table;
                                const sql = mysql.format('SELECT 1 FROM ' + tableName + ` WHERE ${await (allowedRole.where) || "TRUE"} AND groupId IN (?) =`, [groupIds]);
                                const [results, _] = await db.queryP(sql);
                                if (results.length) {
                                    allowed = true;
                                }
                            }
                        }
                    }
                    if (!allowed) {
                        res.customStatus = 400;
                        res.customError = { error: 'unauthorized_client', error_description: '權限不足！' };
                    }
                    next()
                })
            }
        }
    }
};
