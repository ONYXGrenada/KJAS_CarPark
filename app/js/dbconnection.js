const mysql = require('mysql');

var connection = mysql.createConnection({
    host    : 'localhost',
    user    : 'admin',
    password: 'Pa$$word1',
    database: 'carpark'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
  });

  function login(username, password) {
    return new Promise((resolve, reject) => {
        console.log('MySql Database Used')
        connection.query('SELECT id, username, firstName, lastName FROM users WHERE username = ? AND password = ?', [username, password], function(err, result) {
            if (err) {
                reject('Error: ' + err.message)
            } else {
                if (result) {
                    resolve(result[0])
                    //console.log(result[0].id)

                    let loginDateTime = new Date().toISOString().substr(0, 19).replace('T', ' ')
                    connection.query('UPDATE users SET lastLogin = ? WHERE username = ?', [loginDateTime, username], function(err, result) {
                        if (err) {
                            console.log('Error: ' + err.message)
                        }
                    })
                } else {
                    resolve('username or password is incorrect')
                }
            }
        })

        
    })
}
   
  //connection.end();

  module.exports.login = login