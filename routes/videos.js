var express = require('express');
var oauth2 = require('../models/oauth2');
var videos = require('../models/videos');

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

// 獲取 /videos 請求
router.route('/')
    // 取得所有資源
    // oauth2.accessControl 定義在這，可針對 Web API 的 CRUD 個別確認權限
    .get(oauth2.accessControl(["admin"]), (function (req, res) {
        // 無權限
        if (res.customError) {
            res.status(res.customStatus).json(res.customError);
            return;
        }

        videos.items(req, function (err, results, fields) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }

            res.json(results);
        });
    }))
    .post(oauth2.accessControl(['!guest']), function (req, res) {
        videos.add(req, function (err, results, fields) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }

            
            res.status(201).json(results.insertId);
        });
    });

router.route('/:id')
    .get(function (req, res) {
        videos.item(req, function (err, results, fields) {
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
        videos.delete(req, function (err, results, fields) {
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
    .put(oauth2.accessControl(["!guest"]), function (req, res) {
        videos.put(req, function (err, results) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }

            if (results === 410) {
                res.sendStatus(410);
                return;
            }
            
            videos.item(req, function (err, results, fields) {
                res.json(results);
            });
        });
    })
    // 更新指定的一筆資源 (部份更新)
    .patch(oauth2.accessControl(["!guest"]), function (req, res) {
        videos.patch(req, function (err, results, fields) {
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

router.route('/streamer/:id')
    .get(function (req, res) {
        videos.getVideosOfStreamer(req, function (err, results, fields) {
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