require('dotenv').config()
const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    database: 'mysql',
    password: 'rootroot'
    }); // PLANET SCALE CONNECTION

module.exports = connection.promise()