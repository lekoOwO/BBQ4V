var express = require('express');
var oauth2 = require('../models/oauth2');
var registerToken = require('../models/registerToken');

const { v4: uuidv4 } = require('uuid');

var router = express.Router();

router.route('/')
    .get(oauth2.accessControl(["admin"]), function (req, res) {
        // 無權限
        if (res.customError) {
            res.status(res.customStatus).json(res.customError);
            return;
        }

        registerToken.items(req, function (err, results, fields) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }



            res.json(results);
        });
    })
    .post(oauth2.accessControl(["admin"]), function (req, res) {
        req.body.token = uuidv4()
        registerToken.add(req, function (err, results, fields) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }
            
            res.status(201).json(req.body.token);
        });
    });

router.route('/:token')
    .get(function (req, res) {
        registerToken.item(req, function (err, results, fields) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }

            if (!results.length) {
                res.sendStatus(404);
                return;
            }

            res.json(results);
        });
    })
    .delete(oauth2.accessControl(["admin"]), function (req, res) {        
        registerToken.delete(req, function (err, results, fields) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }

            // 指定的資源已不存在
            // SQL DELETE 成功 results.affectedRows 會返回 1，反之 0
            if (!results.affectedRows) {
                res.sendStatus(410);
                return;
            }

            // 沒有內容 (成功)
            res.sendStatus(204);
        });
    })

module.exports = router;