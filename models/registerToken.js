var mysql = require('mysql');
const db = require("./db")
var tableName = '`register-token`';

module.exports = {
    add: function (req, callback){
        const sql = mysql.format(`INSERT INTO ${tableName} SET ?`, req.body);
        return db.query(sql, callback);
    },

    items: function (req, callback) {
        const sql = 'SELECT * FROM ' + tableName;
        return db.query(sql, callback);
    },

    item: function (req, callback) {
        const sql = mysql.format(`SELECT * FROM ${tableName} WHERE token = ?`, [req.params.token]);
        return db.query(sql, callback);
    },

    use: function (req, callback){
        const sql = mysql.format(`UPDATE ${tableName} SET remaining = remaining - 1 WHERE token = ? AND remaining > 0`, [req.params.token]);
        return db.query(sql, callback);
    },

    delete: function (req, callback) {
        const sql = mysql.format(`DELETE FROM ${tableName} WHERE token = ?`, [req.params.token]);
        return db.query(sql, callback);
    }
}