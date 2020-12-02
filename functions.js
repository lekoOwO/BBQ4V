var crypto = require('crypto'); // 加解密軟體 (內建模組)
var conf = require('./conf');

module.exports = {
    // 將明文密碼加密
    passwdCrypto: function (req, res, next) {
        if (req.body.password) {
            req.body.password = crypto.createHmac('sha256', conf.dbSecret)
                                .update(req.body.password)
                                .digest('hex');
        }

        next();
    }
};
