var path = require("path");
var express = require("express");
var mainRouter = express.Router();
var mysql = require('mysql');
var sgMail = require('@sendgrid/mail');

sgMail.setApiKey('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');

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
                'token VARCHAR(50),' +
                'completed VARCHAR(50),' +
                'quantity INT(20),' +
                'arrayIndex INT(20)' +
                ')',
                function(err) {
                    if (err) throw err;
                });
        });
        connection.query('DROP TABLE IF EXISTS lists', function(err) {
            if (err) throw err;
            connection.query('CREATE TABLE IF NOT EXISTS lists(' +
                'id INT NOT NULL AUTO_INCREMENT,' +
                'PRIMARY KEY(id),' +
                'token VARCHAR(50),' +
                'email VARCHAR(100)' +
                ')',
                function(err) {
                    if (err) throw err;
                });
        });
        connection.query('DROP TABLE IF EXISTS listNames', function(err) {
            if (err) throw err;
            connection.query('CREATE TABLE IF NOT EXISTS listNames(' +
                'id VARCHAR(50),' +
                'PRIMARY KEY(id),' +
                'name VARCHAR(100)' +
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
            }
        );
    } else {
        let result = [];
        res.send(result);
    }

});

mainRouter.get('/itemsordered/:token', function(req, res) {
    if (req.params.token) {
        var token = req.params.token;
        connection.query("SELECT * FROM items WHERE token = " + token + " ORDER BY completed ASC", req.body,
            function(err, result) {
                if (err) throw err;
                res.send(result);
            }
        );
    } else {
        let result = [];
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
    connection.query('UPDATE items SET name = ?, category = ?, completed = ? WHERE name = ? AND token = ?', [req.body.newName, req.body.category, req.body.completed, req.body.oldName, req.body.token],
        function(err, result) {
            if (err) throw err;
        }
    );
});

mainRouter.post('/deleteitem', function(req, res) {
    connection.query('DELETE FROM items WHERE name = ? AND token = ?', [req.body.name, req.body.token],
        function(err, result) {
            if (err) throw err;
        }
    );
});

mainRouter.get("/about", function(req, res) {
    res.sendFile(path.join(__dirname, "views", "about.html"));
});

mainRouter.get('/share/:token', function(req, res) {
    var token = req.params.token;
    connection.query("SELECT email FROM lists WHERE token = " + token, req.body,
        function(err, result) {
            if (err) throw err;
            res.send(result);
        }
    );
});

mainRouter.post('/remove-share', function(req, res) {
    connection.query('DELETE FROM lists WHERE token = ? AND email = ?', [req.body.token, req.body.email],
        function(err, result) {
            if (err) throw err;
        }
    );
});

mainRouter.post('/add-name', function(req, res) {
    connection.query('INSERT INTO listNames (id, name) VALUES (?,?) ON DUPLICATE KEY UPDATE name = ?', [req.body.token, req.body.name, req.body.name],
        function(err, result) {
            if (err) throw err;
        }
    );
});

mainRouter.get('/name/:token', function(req, res) {
    var token = req.params.token;
    connection.query('SELECT name FROM listNames WHERE id = ' + token, [req.body],
        function(err, result) {
            if (err) throw err;
            res.send(result);
        }
    );
});

mainRouter.post('/delete', function(req, res) {
    connection.query('TRUNCATE items', req.body,
        function(err, result) {
            if (err) throw err;
        }
    );
});

mainRouter.post('/share', function(req, res) {
    connection.query('INSERT INTO lists SET ?', req.body,
        function(err, result) {
            if (err) throw err;
            res.send('Item added to lists table with ID: ' + result.insertId);
        }
    );

    let msg = {
        to: req.body.email,
        from: 'notifications@sharemyshopping.com',
        subject: 'A shopping list has been shared with you',
        text: 'text',
        html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' +
            '<html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">' +
            '<head>' +
            '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />' +
            '<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" /><!--[if !mso]><!-->' +
            '<meta http-equiv="X-UA-Compatible" content="IE=Edge" /><!--<![endif]-->' +
            '<!--[if (gte mso 9)|(IE)]>' +
            '<xml>' +
            '<o:OfficeDocumentSettings>' +
            '<o:AllowPNG/>' +
            '<o:PixelsPerInch>96</o:PixelsPerInch>' +
            '</o:OfficeDocumentSettings>' +
            '</xml>' +
            '<![endif]-->' +
            '<!--[if (gte mso 9)|(IE)]>' +
            '<style type="text/css">' +
            'body {width: 600px;margin: 0 auto;}' +
            'table {border-collapse: collapse;}' +
            'table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}' +
            'img {-ms-interpolation-mode: bicubic;}' +
            '</style>' +
            '<![endif]-->' +
            '<style type="text/css">' +
            'body, p, div {' +
            'font-family: arial,helvetica,sans-serif;' +
            'font-size: 14px;' +
            '}' +
            'body {' +
            'color: #626262;' +
            '}' +
            'body a {' +
            'color: #0088cd;' +
            'text-decoration: none;' +
            '}' +
            'p { margin: 0; padding: 0; }' +
            'table.wrapper {' +
            'width:100% !important;' +
            'table-layout: fixed;' +
            '-webkit-font-smoothing: antialiased;' +
            '-webkit-text-size-adjust: 100%;' +
            '-moz-text-size-adjust: 100%;' +
            '-ms-text-size-adjust: 100%;' +
            '}' +
            'img.max-width {' +
            '  max-width: 100% !important;' +
            '}' +
            '.column.of-2 {' +
            '  width: 50%;' +
            '}' +
            '.column.of-3 {' +
            '  width: 33.333%;' +
            '}' +
            '.column.of-4 {' +
            '  width: 25%;' +
            '}' +
            '@media screen and (max-width:480px) {' +
            '.preheader .rightColumnContent,' +
            '.footer .rightColumnContent {' +
            '    text-align: left !important;' +
            '}' +
            '.preheader .rightColumnContent div,' +
            '.preheader .rightColumnContent span,' +
            '.footer .rightColumnContent div,' +
            '.footer .rightColumnContent span {' +
            '  text-align: left !important;' +
            '}' +
            '.preheader .rightColumnContent,' +
            '.preheader .leftColumnContent {' +
            '  font-size: 80% !important;' +
            '  padding: 5px 0;' +
            '}' +
            'table.wrapper-mobile {' +
            '  width: 100% !important;' +
            '  table-layout: fixed;' +
            '}' +
            'img.max-width {' +
            '  height: auto !important;' +
            '  max-width: 480px !important;' +
            '}' +
            'a.bulletproof-button {' +
            '  display: block !important;' +
            '  width: auto !important;' +
            '  font-size: 80%;' +
            '  padding-left: 0 !important;' +
            '  padding-right: 0 !important;' +
            '}' +
            '.columns {' +
            '  width: 100% !important;' +
            '}' +
            '.column {' +
            '  display: block !important;' +
            '  width: 100% !important;' +
            '  padding-left: 0 !important;' +
            '  padding-right: 0 !important;' +
            '  margin-left: 0 !important;' +
            '  margin-right: 0 !important;' +
            '}' +
            '}' +
            '</style>' +
            '<!--user entered Head Start-->' +
            '<!--End Head user entered-->' +
            '</head>' +
            '<body>' +
            '<center class="wrapper" data-link-color="#0088cd" data-body-style="font-size: 14px; font-family: arial,helvetica,sans-serif; color: #626262; background-color: #F4F4F4;">' +
            '<div class="webkit">' +
            '<table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#F4F4F4">' +
            '<tr>' +
            '<td valign="top" bgcolor="#F4F4F4" width="100%">' +
            '<table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">' +
            '<tr>' +
            '<td width="100%">' +
            '<table width="100%" cellpadding="0" cellspacing="0" border="0">' +
            '<tr>' +
            '<td>' +
            '<!--[if mso]>' +
            '<center>' +
            '<table><tr><td width="600">' +
            '<![endif]-->' +
            '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width:600px;" align="center">' +
            '<tr>' +
            '<td role="modules-container" style="padding: 0px 0px 0px 0px; color: #626262; text-align: left;" bgcolor="#F4F4F4" width="100%" align="left">' +
            '<table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%"' +
            'style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">' +
            '<tr>' +
            '<td role="module-content">' +
            '<p>This is the preheader text.</p>' +
            '</td>' +
            '</tr>' +
            '</table>' +
            '<table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">' +
            '<tr>' +
            '<td style="padding:0px 0px 0px 0px;"' +
            'height="100%"' +
            'valign="top"' +
            'bgcolor="">' +
            '<div style="text-align: right;"><span style="font-family:verdana,geneva,sans-serif;"><span style="font-size:10px;">Email not displaying correctly? <a href="[weblink]">View it</a> in your browser.</span></span>' +
            '</div>' +
            '</td>' +
            '</tr>' +
            '</table>' +
            '<table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">' +
            '<tr>' +
            '<td style="font-size:6px;line-height:10px;background-color:#40e0d0;padding:10px 0px 20px 0px;" valign="top" align="center">' +
            '<img class="max-width" width="600" src="https://image.ibb.co/eJRsMJ/screenshot_sharemyshopping_azurewebsites_net_2018_05_09_20_39_43.png" alt="" border="0" style="display:block;color:#000;text-decoration:none;font-family:Helvetica, arial, sans-serif;font-size:16px;max-width:100% !important;width:100%;height:auto !important;">' +
            '</td>' +
            '</tr>' +
            '</table>' +
            '<table class="module"' +
            'role="module"' +
            'data-type="spacer"' +
            'border="0"' +
            'cellpadding="0"' +
            'cellspacing="0"' +
            'width="100%"' +
            'style="table-layout: fixed;">' +
            '<tr>' +
            '<td style="padding:0px 0px 30px 0px;"' +
            'role="module-content"' +
            'bgcolor="#ffffff">' +
            '</td>' +
            '</tr>' +
            '</table>' +
            '<table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">' +
            '<tr>' +
            '<td style="font-size:6px;line-height:10px;background-color:#FFFFFF;padding:0px 0px 0px 0px;" valign="top" align="left">' +
            '<img class="max-width" width="600" src="https://i.imgflip.com/18umul.jpg" alt="" border="0" style="display:block;color:#000;text-decoration:none;font-family:Helvetica, arial, sans-serif;font-size:16px;max-width:100% !important;width:100%;height:auto !important;">' +
            '</td>' +
            '</tr>' +
            '</table>' +
            '<table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">' +
            '<tr>' +
            '<td style="padding:34px 23px 34px 23px;background-color:#ffffff;"' +
            'height="100%"' +
            'valign="top"' +
            'bgcolor="#ffffff">' +
            '<h1 style="text-align: center;"><span style="color:#2D2D2D;">A Shopping List has been Shared with You</span></h1>' +
            '</td>' +
            '</tr>' +
            '</table>' +
            '<table class="module" role="module" data-type="code" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">' +
            '<tr>' +
            '<td height="100%" valign="top">' +
            '<div style="background-color: #ffffff; text-align: center; padding-bottom:50px; font-size: 20px; font-weight: bold">' +
            req.body.token +
            '</div>' +
            '</td>' +
            '</tr>' +
            '</table><table border="0" cellPadding="0" cellSpacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed" width="100%"><tbody><tr><td align="center" bgcolor="#ffffff" class="outer-td" style="padding:0px 0px 51px 0px;background-color:#ffffff"><table border="0" cellPadding="0" cellSpacing="0" class="button-css__deep-table___2OZyb wrapper-mobile" style="text-align:center"><tbody><tr><td align="center" bgcolor="#32a9d6" class="inner-td" style="-webkit-border-radius:0px;-moz-border-radius:0px;border-radius:0px;font-size:15px;text-align:center;background-color:inherit"><a style="background-color:#32a9d6;height:px;width:px;font-size:15px;line-height:px;font-family:Helvetica, Arial, sans-serif;color:#ffffff;padding:14px 56px 13px 56px;text-decoration:none;-webkit-border-radius:0px;-moz-border-radius:0px;border-radius:0px;border:1px solid #32A9D6;display:inline-block" href="https://sharemyshopping.azurewebsites.net/" target="_blank">View the list here</a></td></tr></tbody></table></td></tr></tbody></table>' +
            '<table class="module"' +
            'role="module"' +
            'data-type="spacer"' +
            'border="0"' +
            'cellpadding="0"' +
            'cellspacing="0"' +
            'width="100%"' +
            'style="table-layout: fixed;">' +
            '<tr>' +
            '<td style="padding:0px 0px 3px 0px;"' +
            'role="module-content"' +
            'bgcolor="#32a9d6">' +
            '</td>' +
            '</tr>' +
            '</table>' +
            '<table  border="0"' +
            'cellpadding="0"' +
            'cellspacing="0"' +
            'align="center"' +
            'width="100%"' +
            'role="module"' +
            'data-type="columns"' +
            'data-version="2"' +
            'style="padding:48px 34px 17px 34px;background-color:#32a9d6;box-sizing:border-box;"' +
            'bgcolor="#32a9d6">' +
            '<tr role="module-content">' +
            '<td height="100%" valign="top">' +
            '<!--[if (gte mso 9)|(IE)]>' +
            '<center>' +
            '<table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-spacing:0;border-collapse:collapse;table-layout: fixed;" >' +
            '<tr>' +
            '<![endif]-->' +
            '<!--[if (gte mso 9)|(IE)]>' +
            '<td width="266.000px" valign="top" style="padding: 0px 0px 0px 0px;border-collapse: collapse;" >' +
            '<![endif]-->' +
            '<table  width="266.000"' +
            'style="width:266.000px;border-spacing:0;border-collapse:collapse;margin:0px 0px 0px 0px;"' +
            'cellpadding="0"' +
            'cellspacing="0"' +
            'align="left"' +
            'border="0"' +
            'bgcolor="#32a9d6"' +
            'class="column column-0 of-2' +
            'empty"' +
            '>' +
            '<tr>' +
            '<td style="padding:0px;margin:0px;border-spacing:0;">' +
            '<table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">' +
            '<tr>' +
            '<td style="padding:0px 0px 0px 0px;background-color:#32a9d6;"' +
            'height="100%"' +
            'valign="top"' +
            'bgcolor="#32a9d6">' +
            '<div style="font-size: 10px; line-height: 150%; margin: 0px;">&nbsp;</div>' +
            '<div style="font-size: 10px; line-height: 150%; margin: 0px;">&nbsp;</div>' +
            '<div style="font-size: 10px; line-height: 150%; margin: 0px;"><a href="[unsubscribe]"><span style="color:#FFFFFF;">The Fantastic Group 7</span></a></div>' +
            '</td>' +
            '</tr>' +
            '</table>' +
            '</td>' +
            '</tr>' +
            '</table>' +
            '<!--[if (gte mso 9)|(IE)]>' +
            '</td>' +
            '<![endif]-->' +
            '<!--[if (gte mso 9)|(IE)]>' +
            '<td width="266.000px" valign="top" style="padding: 0px 0px 0px 0px;border-collapse: collapse;" >' +
            '<![endif]-->' +
            '<table  width="266.000"' +
            'style="width:266.000px;border-spacing:0;border-collapse:collapse;margin:0px 0px 0px 0px;"' +
            'cellpadding="0"' +
            'cellspacing="0"' +
            'align="left"' +
            'border="0"' +
            'bgcolor="#32a9d6"' +
            'class="column column-1 of-2' +
            'empty"' +
            '>' +
            '<tr>' +
            '<td style="padding:0px;margin:0px;border-spacing:0;">' +
            '<table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">' +
            '<tr>' +
            '<td style="padding:0px 0px 0px 0px;background-color:#32a9d6;"' +
            'height="100%"' +
            'valign="top"' +
            'bgcolor="#32a9d6">' +
            '<div style="font-size: 10px; line-height: 150%; margin: 0px;">&nbsp;</div>' +
            '<div style="font-size: 10px; line-height: 150%; margin: 0px;">&nbsp;</div>' +
            '<div style="font-size: 10px; line-height: 150%; margin: 0px; text-align: right;"><span style="color:#ffffff;">University of the Witwatersrand</span></div>' +
            '</td>' +
            '</tr>' +
            '</table>' +
            '</td>' +
            '</tr>' +
            '</table>' +
            '<!--[if (gte mso 9)|(IE)]>' +
            '</td>' +
            '<![endif]-->' +
            '<!--[if (gte mso 9)|(IE)]>' +
            '<tr>' +
            ' </table>' +
            '</center>' +
            '<![endif]-->' +
            '</td>' +
            '</tr>' +
            '</table>' +
            '</td>' +
            '</tr>' +
            '</table>' +
            '<!--[if mso]>' +
            '</td></tr></table>' +
            '</center>' +
            '<![endif]-->' +
            '</td>' +
            '</tr>' +
            '</table>' +
            '</td>' +
            '</tr>' +
            '</table>' +
            '</td>' +
            '</tr>' +
            '</table>' +
            '</div>' +
            '</center>' +
            '</body>' +
            '</html>',
    };
    sgMail.send(msg);
});

module.exports = mainRouter;