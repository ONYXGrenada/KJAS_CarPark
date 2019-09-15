const mysql = require('mysql');

var connection = mysql.createConnection({
    host    : 'localhost',
    user    : 'admin',
    password: 'Pa$$word1',
    database: 'carpark'
});

connection.connect();

//Test function
// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//     if (error) throw error;
//     console.log('The solution is: ', results[0].solution);
//   });

//User login
function login(username, password) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT id, username, firstName, lastName FROM users WHERE username = ? AND password = ?', [username, password], function(err, result) {
            if (err) {
                reject('Error: ' + err.message)
                console.log('Error encountered')
            } else if (result.length == 0) {
                console.log('member not found')
                resolve('member not found')
            } else {
                if (result.length > 0) {
                    console.log('Member found')
                    resolve(result[0])
                    let loginDateTime = new Date().toISOString().substr(0, 19).replace('T', ' ')
                    connection.query('UPDATE users SET lastLogin = ? WHERE username = ?', [loginDateTime, username], function(err, result) {
                        if (err) {
                            console.log('Error: ' + err.message)
                        }
                    })
                }
            }
        })        
    })
}

//Insert User
function insertUser(username, password, firstName, lastName) {
    return new Promise((resolve, reject) => {
        console.log('Insert User Function')
        connection.query('SELECT username FROM users WHERE username = ?', username, (err, result) => {
            if (err) {
                reject('Error: ' + result.message)
            } else if (result.length == 1) {
                console.log('User already in table.')
                resolve(0)
            } else {
                connection.query('INSERT INTO users (username, password, firstName, lastName) VALUES (?,?,?,?)', [username, password, firstName, lastName]);
                resolve(1)
            }
        })
    })
}

//Create Ticket function to generate ticket in the ticket table
function createTicket(username) {
    return new Promise((resolve, reject) => {
        //Checks to see if ticket exists in database
        connection.query('SELECT id, unitCost FROM ticketType WHERE ticketType = ? AND status = ? ORDER BY id Desc LIMIT 1', 'standard', 'open', (err, result) => {
            if (err) {
                reject('Ticket not found - Error: ' + result.message)
            }
            if (result){
                //rate = row.unitCost
                console.log(result[0].unitCost + "~rate display - 1")
                //include the rest of the function in this area
                connection.query('INSERT INTO tickets (ticketType, status, rate, username) VALUES (?,?,?,?)', ['standard', 'open', result[0].unitCost, username], (err) => {
                    if (err) {
                        reject('Error: ' + err.message)
                    } else {
                        //Select last created ticket for the current user 
                        connection.query('SELECT id FROM tickets WHERE username = ? ORDER BY id Desc LIMIT 1', username, (err, result) => {
                            if (err) {
                                reject('Error: ' + err.message)
                            } else {
                                if (result) {
                                    //Create ticket number for last created ticket
                                    connection.query('UPDATE tickets SET ticketNumber = ? WHERE id = ?', [result[0].id, result[0].id], (err) => {
                                        if (err) {
                                            reject('Error: ' + err.message)
                                        }
                                        else {
                                            //Return last created ticket number to main program
                                            connection.query('SELECT ticketNumber, createdDate FROM tickets WHERE username = ? ORDER BY id Desc LIMIT 1', username, (err, result) => {
                                                if (err) {
                                                    reject('Error: ' + err.message)
                                                } else {
                                                    if (result.length == 1) {
                                                        resolve(result[0])
                                                    } else {
                                                        resolve('Database Error')
                                                    }
                                                }
                                            })
                                        }
                                    })
                                } else {
                                    resolve('Database Error')
                                }
                            }
                        })
                    }
                })
            }
        })        
    })
}

//Get Ticket based on ticket number
function getTicket(ticketNumber) {
    return new Promise((resolve, reject) => {
        //Select last created ticket for the current user 
        connection.query('SELECT * FROM tickets WHERE ticketNumber = ? ORDER BY id Desc LIMIT 1', ticketNumber, (err, result) => {
            if (err) {
                reject('Error: ' + err.message)
            } else {
                if (result.length == 1) {
                    resolve(result[0])
                } else {
                    resolve('Database Error')
                }
            }
        })
    })
}

//Create Ticket type
function createTicketType(ticketType, unitCost, username) {
    return new Promise((resolve, reject) => {
        console.log('Insert new ticket Type')

        //Checks to see if ticket exists in database
        connection.query('SELECT id FROM ticketType WHERE ticketType = ? AND status = ? ORDER BY id Desc LIMIT 1', ticketType, 'open', (err, result) => {
            if (err) {
                reject('Ticket not found - Error: ' + err.message)
            } else if (result.length == 1) {
                resolve(result)
                console.log('Old ticket already in table.')
                //If ticket exists then update existing ticket to closed status
                connection.query('UPDATE ticketType SET status = ? WHERE id = ?', ['closed', result[0].id], (err) => { 
                    if (err) {
                        reject('Error: ' + err.message)
                    }
                })
            } else {
                reject('Error: ' + err.message)
            }

            //Insert new ticket type into table
            connection.query('INSERT INTO ticketType (ticketType, unitCost, status, username) VALUES (?,?,?,?)', [ticketType, unitCost, 'open', username], (err) => {
                if (err) {
                    reject('Cannot create ticket - Error: ' + err.message)
                }
                else {
                    resolve('Ticket successfully created')
                }
            })

        })
    })    
}
   
  //connection.end();

  module.exports.login = login