const mysql = require('mysql');
const conf = require('../conf');

var pool = mysql.createPool(conf.db);

function query(sql, cb) {
    return pool.query(sql, cb);
}

function queryP(sql) {
    return new Promise((resolve, reject) => {
        pool.query(sql, (err, results, fields) => {
            if (err) reject(err)
            else resolve([results, fields])
        });
    })
}

function getConnection(cb) {
    return pool.getConnection((err, connection) => {
        if (err) {
            cb(err);
        }
        cb(null, connection);
    })
}

// pool.on('release', function (connection) {
//     console.log('Connection %d released', connection.threadId);
// });

module.exports = {
    query,
    queryP,
    getConnection
}