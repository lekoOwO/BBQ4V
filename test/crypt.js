var crypto = require('crypto'); // 加解密軟體 (內建模組)
var conf = require('../conf');

const password = "abbabarrl";

const crypted = crypto.createHmac('sha256', conf.dbSecret)
    .update(password)
    .digest('hex');

console.log(crypted);