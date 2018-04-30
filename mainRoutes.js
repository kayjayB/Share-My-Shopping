var path = require("path");
var express = require("express");
var mainRouter = express.Router();
var mysql = require('mysql');
var url = require('url');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
});

// let connnect_config = function() {
//     // Process the environment variable defining the MySQL connection parameters
//     let str = process.env.MYSQLCONNSTR_localdb
//     let reg = str.split(';');
//     let database = reg[0].split('=')[1]
//     let source = reg[1].split('=')[1]
//     let [host, port] = source.split(':')
//     let user = reg[2].split('=')[1]
//     let password = reg[3].split('=')[1]

//     // Create the connection and return
//     let auth = {
//         host: host,
//         user: user,
//         password: password,
//         database: database,
//         port: parseInt(port)
//     }
//     return mysql.createConnection(auth)
// }

// let connection = connnect_config();

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});

connection.query('CREATE DATABASE IF NOT EXISTS list_db', function(err) {
    if (err) throw err;
    connection.query('USE list_db', function(err) {
        if (err) throw err;
        connection.query('DROP TABLE IF EXISTS items', function(err) {
            if (err) throw err;
            connection.query('CREATE TABLE IF NOT EXISTS items(' +
                'id INT NOT NULL AUTO_INCREMENT,' +
                'PRIMARY KEY(id),' +
                'name VARCHAR(50),' +
                'category VARCHAR(50),' +
                'token VARCHAR(50)' +
                ')',
                function(err) {
                    if (err) throw err;
                });
        });
    });
});

mainRouter.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'views', 'landingPage.html'));
});

mainRouter.get('/items/:tokens', function(req, res) {
    if (req.params.tokens) {
        var tokens = req.params.tokens;
        connection.query("SELECT * FROM items WHERE token = " + tokens, req.body,
            function(err, result) {
                if (err) throw err;
                res.send(result);
                console.log(result)
            }
        );
    } else {
        let result = [];
        console.log("im empty");
        res.send(result);
    }

});

mainRouter.get('/token', function(req, res) {
    connection.query('SELECT token FROM items', req.body,
        function(err, result) {
            if (err) throw err;
            res.send(result);
        }
    );
});

mainRouter.post('/items', function(req, res) {
    connection.query('INSERT INTO items SET ?', req.body,
        function(err, result) {
            if (err) throw err;
            res.send('Item added to database with ID: ' + result.insertId);
        }
    );
});

mainRouter.post('/edititem', function(req, res) {
    connection.query('UPDATE items SET name = ? WHERE id = ?', [req.body.name, req.body.id],
        function(err, result) {
            if (err) throw err;
            //res.send('Item edited in database with ID: ' + result.insertId);
        }
    );
});

mainRouter.get("/about", function(req, res) {
    res.sendFile(path.join(__dirname, "views", "about.html"));
});

module.exports = mainRouter;