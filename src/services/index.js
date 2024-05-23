const dbInfor = require("../config/index");
const mysql = require("mysql");
const connection = mysql.createConnection(dbInfor);
module.exports = connection;
