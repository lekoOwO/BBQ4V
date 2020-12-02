var express = require('express');
var accounts = require('../models/accounts');
var registerToken = require('../models/registerToken');

var router = express.Router();

router.route("/:token")
    .post(function (req, res) {
        registerToken.use(req, function (err, results, fields) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }

            if (results.changedRows <= 0) {
                res.sendStatus(403).json("Token does not exist or remaining times exhausted.");
            }

            accounts.add(req, function (err, results, fields) {
                if (err) {
                    res.sendStatus(500);
                    return console.error(err);
                }
    
                // 新的資源已建立 (回應新增資源的 id)
                res.status(201).json(results.insertId);
            });
        })
    })