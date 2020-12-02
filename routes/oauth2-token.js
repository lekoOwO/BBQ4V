var express = require('express');
var oauth2 = require('../models/oauth2');

var router = express.Router();

router.route('/')
    .post(
        function (req, res, next) {
            // 驗證 OAuth 2.0 授權類型
            if (!req.body.grant_type || req.body.grant_type != 'password') {
                res.status(400).json({ error: 'unsupported_grant_type', error_description: '授權類型無法識別，本伺服器僅支持 Password 類型！' });
                return;
            }

            oauth2.login(req, function (err, results, fields) {
                if (err) {
                    res.sendStatus(500);
                    return console.error(err);
                }

                if (!results.length) {
                    res.status(401).json({ error: 'invalid_client', error_description: '登入驗證失敗！' });
                    return;
                }

                req.results = results;
                next();
            });
        },
        function (req, res) {
            oauth2.createToken(req, function (results) {
                // 確保客戶端瀏覽器不緩存此請求 (OAuth 2.0 標準)
                res.header('Cache-Control', 'no-store');
                res.header('Pragma', 'no-cache');
                
                res.json(results);
            });
        });

module.exports = router;
