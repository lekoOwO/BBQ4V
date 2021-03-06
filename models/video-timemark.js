const mysql = require('mysql');
const db = require("./db")

const tableName = "`video-timemark`"

module.exports = {
    items: function (req, callback) {
        const sql = 'SELECT * FROM ' + tableName;
        return db.query(sql, callback);
    },
    item: function (req, callback) {
        const sql = mysql.format('SELECT * FROM ' + tableName + ' WHERE id = ?', [req.params.id]);
        return db.query(sql, callback);
    },
    add: function (req, callback) {  
        const sql = mysql.format('INSERT INTO ' + tableName + ' SET ?', req.body);
        return db.query(sql, callback);
    },
    delete: function (req, callback) {
        const sql = mysql.format('DELETE FROM ' + tableName + ' WHERE id = ?', [req.params.id]);
        return db.query(sql, callback);
    },
    put: function (req, callback) {
        // 使用 SQL 交易功能實現資料回滾，因為是先刪除資料在新增，且 Key 值須相同，如刪除後發現要新增的資料有誤，則使用 rollback() 回滾
        db.getConnection((err, connection) => {
            if (err) {
                callback(err)
            }
            else try {
                connection.beginTransaction(function (err) {
                    if (err) throw err;
                    
                    var sql = mysql.format('DELETE FROM ' + tableName + ' WHERE id = ?', [req.params.id]);
        
                    connection.query(sql, function (err, results, fields) {
                        // SQL DELETE 成功 results.affectedRows 會返回 1，反之 0
                        if (results.affectedRows) {
                            req.body.id = req.params.id;
                            sql = mysql.format('INSERT INTO ' + tableName + ' SET ?', req.body);
                            
                            connection.query(sql, function (err, results, fields) {
                                // 請求不正確
                                if (err) {
                                    connection.rollback(function () {
                                        callback(err, 400);
                                    });
                                } else {
                                    connection.commit(function (err) {
                                        if (err) callback(err, 400);
            
                                        callback(err, 200);
                                    });
                                }                        
                            });
                        } else {
                            // 指定的資源已不存在
                            callback(err, 410);
                        }
                    });
                });
            } finally {
                connection.release()
            }
        })
       
    },
    patch: function (req, callback) {       
        const sql = mysql.format('UPDATE ' + tableName + ' SET ? WHERE id = ?', [req.body, req.params.id]);
        return db.query(sql, callback);
    },
    getTimemarksOfVideo: function (req, callback) {
        const sql = mysql.format('SELECT * FROM ' + tableName + ' WHERE videoId = ?', [req.params.id]);
        return db.query(sql, callback);
    }
};
