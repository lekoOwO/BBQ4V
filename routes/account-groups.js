var express = require('express');
var oauth2 = require('../models/oauth2');
var accountGroups = require('../models/account-groups');

var router = express.Router();

// oauth2.accessControl 定義在這，對 Web API 的所有 CRUD 確認權限
/*
router.use(oauth2.accessControl, function (req, res, next) {
    // 無權限
    if (res.customError) {
        res.status(res.customStatus).json(res.customError);
        return;
    }

    next();
});
*/

// 獲取 /accounts 請求
router.route('/')
    // 取得所有資源
    // oauth2.accessControl 定義在這，可針對 Web API 的 CRUD 個別確認權限
    // 只有 admin 可以看帳號列表
    .get(oauth2.accessControl(["admin"]), function (req, res) {
        // 無權限
        if (res.customError) {
            res.status(res.customStatus).json(res.customError);
            return;
        }

        accountGroups.items(req, function (err, results, fields) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }

            // 沒有找到指定的資源
            if (!results.length) {
                res.sendStatus(404);
                return;
            }

            res.json(results);
        });
    })
    // 新增一筆資源
    .post(oauth2.accessControl(["admin"]),function (req, res) {
        accountGroups.add(req, function (err, results, fields) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }

            // 新的資源已建立 (回應新增資源的 id)
            res.status(201).json(results.insertId);
        });
    });

// 獲取如 /accounts/1 請求
router.route('/:id')
    // 取得指定的一筆資源
    .get(oauth2.accessControl(["admin"]), function (req, res) {
        accountGroups.item(req, function (err, results, fields) {
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
    // 刪除指定的一筆資源
    .delete(oauth2.accessControl(["admin"]), function (req, res) {        
        accountGroups.delete(req, function (err, results, fields) {
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
    // 覆蓋指定的一筆資源
    .put(oauth2.accessControl(["admin"]), function (req, res) {
        accountGroups.put(req, function (err, results) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }

            if (results === 410) {
                res.sendStatus(410);
                return;
            }
            
            accountGroups.item(req, function (err, results, fields) {
                res.json(results);
            });
        });
    })
    // 更新指定的一筆資源 (部份更新)
    .patch(oauth2.accessControl(["admin"]), function (req, res) {
        accountGroups.patch(req, function (err, results, fields) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }
            
            if (!results.affectedRows) {
                res.sendStatus(410);
                return;
            }
            
            // response 被更新的資源欄位，但因 request 主體的欄位不包含 id，因此需自行加入
            req.body.id = req.params.id;
            res.json([req.body]);
        });
    });

router.route("/find")
    .get(function (req, res) {
        accountGroups.find(req, function (err, results, fields) {
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
module.exports = router;