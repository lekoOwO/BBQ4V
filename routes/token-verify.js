var express = require('express');
var oauth2 = require('../models/oauth2');

var router = express.Router();

router.use(oauth2.tokenVerify, function (req, res, next) {
    if (res.customError) {
        res.status(res.customStatus).json(res.customError);
        return;
    }

    next();
});

module.exports = router;
