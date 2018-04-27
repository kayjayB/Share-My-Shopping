var path = require("path");
var express = require("express");
var mainRouter = express.Router();
var mysql = require('mysql');

let connection = function () {
	// Process the environment variable defining the MySQL connection parameters
	let str = process.env.MYSQLCONNSTR_localdb
	let reg = str.match(/Database=(.+?);Data Source=(.+?):(.+?);User Id = (.+?); Password = (.+) /)
	let database = reg[1]
	let host = reg[2]
	let port = reg[3]
	let user = reg[4]
	let password = reg[5]

	// Create the connection and return
	let auth = {
		host: host,
		user: user,
		password: password,
		database: database,
		port: parseInt(port)
	}
	return mysql.createConnection(auth)
}


connection.connect((err) => {
	if (err) throw err;
	console.log('Connected!');
});

connection.query('CREATE DATABASE IF NOT EXISTS list_db', function (err) {
	if (err) throw err;
	connection.query('USE list_db', function (err) {
		if (err) throw err;
		connection.query('CREATE TABLE IF NOT EXISTS items('
			+ 'id INT NOT NULL AUTO_INCREMENT,'
			+ 'PRIMARY KEY(id),'
			+ 'name VARCHAR(50)'
			+ ')', function (err) {
				if (err) throw err;
			});
	});
});

mainRouter.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'views', 'landingPage.html'));
});

mainRouter.get('/items', function (req, res) {
		connection.query('SELECT name FROM items', req.body,
		function (err, result) {
			if (err) throw err;
			res.send(result);
		}
	);
});

mainRouter.post('/items', function (req, res) {
	connection.query('INSERT INTO items SET ?', req.body,
		function (err, result) {
			if (err) throw err;
			res.send('Item added to database with ID: ' + result.insertId);
		}
	);
});

mainRouter.get("/about", function(req, res){
	res.sendFile(path.join(__dirname, "views", "about.html"));
});


module.exports = mainRouter;
