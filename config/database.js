const mysql = require('mysql2/promise');
const {logger} = require('./winston');

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host: 'database-1.cohwvksyim93.ap-northeast-2.rds.amazonaws.com',
    user: 'xx0hn',
    port: '3306',
    password: 'hsh970412',
    database: 'RC_webservice'
});

module.exports = {
    pool: pool
};