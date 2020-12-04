const mysql = require('mysql');
const conf = require('../conf');

var pool = mysql.createPool(conf.db);

function query(sql, cb) {
    return pool.query(sql, cb);
}

function getConnection(cb) {
    return pool.getConnection((err, connection) => {
        if (err) {
            cb(err);
        }
        cb(null, connection);
    })
}

pool.on('release', function (connection) {
    console.log('Connection %d released', connection.threadId);
});

module.exports = {
    query,
    getConnection
}