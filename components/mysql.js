var mysql      = require('mysql');
var config = require('config');
var myConfig = config.get('mysql');

var connection = mysql.createConnection({
    host     :  myConfig.host,
    user     :  myConfig.user,
    password :  myConfig.password,
    database :  myConfig.database
});

connection.connect();

module.exports = connection;

/*
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
});*/
