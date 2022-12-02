const mysql = require('mysql');
const express = require('express');
const path = require('path');
var router = express.Router();

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "CS411sql-YM!",
  database: "yugmdb"
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login'});
});

router.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username1;
	let password = request.body.password1;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		con.query('SELECT * FROM Login WHERE Username = ? AND Password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				update_query = `UPDATE Login ` +
                    `SET LoginTime=CURRENT_TIMESTAMP() ` +
                    `WHERE Username="${username}" AND Password="${password}"`
				con.query(update_query, function (err3) {
					console.log("Updating Login time");
					if (err3) throw err3;
				});
				response.redirect('/');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

router.post('/createUser', function(request, response) {
	// Capture the input fields
	let username = request.body.username2;
	let password = request.body.password2;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
    console.log("Creating User");
		con.query(`SELECT * FROM Login WHERE Username = "${username}" AND Password = "${password}"`, function(error, results, fields) {
			// If there is an issue with the query, output the error
      console.log(results)
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect("/");
        		response.end();
			} else {
				con.query(`INSERT INTO Login (Username, Password) VALUES ("${username}","${password}")`, function(error2, results2) {
					if (error2) throw error2;
					
					request.session.loggedin = true;
							request.session.username = username;
					response.redirect('/');
					response.end(); 
					});
			}			
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});




module.exports = router;
