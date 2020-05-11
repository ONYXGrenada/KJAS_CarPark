const mysql = require('mysql');

var connection = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: '',
    database: 'carpark'
});

connection.connect((err) => {
    if (err){
        console.log(err.message)
    } else {
        console.log('Connected!')
    }
});

// User login
function login(username, password) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT id, username, firstName, lastName, status FROM users WHERE username = ? AND password = ?', [username, encryptPassword(password)], function(err, result) {
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
function checkUser(username) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT username FROM users WHERE username = ?', [username], function(err, result) {
            if (err) {
                reject('Error: ' + err.message)
                console.log('Error encountered')
            } else if (result.length == 0) {
                console.log('user does not exist in database. OK to create. ')
                //resolve('member not found')
                resolve(true)
                // encryptPassword(username)


            } else {
                if (result.length > 0) {
                    console.log('Username not available')
                    // resolve(result[0])
                    resolve(false)
                    // alert("This username (" + username + ") is already taken. Please try another.")


                }
            }
        })
    })
}

function encryptPassword(password){
    var salt = '@lT4-'
    var crypto = require('crypto')
    var saltedPassword = salt + password

    var encryptedPassword = crypto.createHash('md5').update(saltedPassword).digest('hex')
    console.log(encryptedPassword);
    return encryptedPassword
}

// Insert User
function insertUser(username, password, firstName, lastName, userType) {
    return new Promise((resolve, reject) => {
        console.log('Insert User Function')
        connection.query('SELECT username FROM users WHERE username = ?', [username], function(err, result) {
            if (err) {
                reject('Error: ' + result.message)
            } else if (result.length == 1) {
                console.log('User already in table.')
                resolve(0)
            } else {
                connection.query('INSERT INTO users (username, password, firstName, lastName, userType) VALUES (?,?,?,?,?)', [username, encryptPassword(password), firstName, lastName, userType]);
                resolve(1)
            }
        })
    })
}

// (De)activate User
function activateUser(username, action) {
    return new Promise((resolve, reject) => {
        console.log('Activate/Deactivate User Function')
        let sql = ''
        if(action == 'Activate'){
            sql = 'UPDATE users SET status = 1  WHERE username = ?'
        }
        else if (action == 'Deactivate'){
            sql = 'UPDATE users SET status = 3  WHERE username = ?'
        }
        connection.query(sql, [username], function(err, result) {
            if (err) {
                reject('Error: ' + result.message)
            }  else {
                resolve(1)
            }
        })
    })
}



// Create Ticket function to generate ticket in the ticket table
function createTicket(username, ticketType) {
    return new Promise((resolve, reject) => {
        // Checks to see if ticket type exists 
        connection.query('SELECT id, unitCost, displayName FROM ticketType WHERE ticketType = ? AND status = ? ORDER BY id Desc LIMIT 1', [ticketType, 'active'], function(err, result) {
            if (err) {
                reject('Ticket Type not found - Error: ' + result.message)
            } if (result.length > 0){
                connection.query('INSERT INTO tickets (ticketType, description, status, rate, username) VALUES (?,?,?,?,?)', [ticketType, result[0].displayName, 'open', result[0].unitCost, username], function(err) {
                    if (err) {
                        reject('Error: ' + err.message)
                    } else {
                        // Select last created ticket for the current user 
                        connection.query('SELECT id FROM tickets WHERE username = ? ORDER BY id Desc LIMIT 1', [username], function(err, result) {
                            if (err) {
                                reject('Error: ' + err.message)
                            } else {
                                if (result) {
                                    // Create ticket number for last created ticket
                                    connection.query('UPDATE tickets SET ticketNumber = ? WHERE id = ?', [result[0].id, result[0].id], function(err) {
                                        if (err) {
                                            reject('Error: ' + err.message)
                                        }
                                        else {
                                            // Return last created ticket number to main program
                                            connection.query('SELECT ticketNumber, createdDate, description FROM tickets WHERE username = ? ORDER BY id Desc LIMIT 1', [username], function(err, result) {
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

// Create Ticket function to generate special ticket in the special ticket table
//Create Monthly Ticket function to generate ticket in the ticket table
function createMonthlyTicket(username, ticketType, registrationNumber) {
    return new Promise((resolve, reject) => {
        //Checks to see if ticket type exists
        connection.query('SELECT id, unitCost, displayName FROM ticketType WHERE id = ? AND status = ? ORDER BY id Desc LIMIT 1', [ticketType, 'active'], function(err, result) {
            if (err) {
                reject('Ticket Type not found - Error: ' + result.message)
            }
            if (result.length > 0){
                connection.query('INSERT INTO tickets (ticketType, description, status, username, noOfVisits) VALUES (?,?,?,?,?)', [ticketType, result[0].displayName, 'open', username, 0], function(err) {
                    if (err) {
                        reject('Error: ' + err.message)
                    } else {
                        //Select last created ticket for the current user
                        connection.query('SELECT id, noOfVisits FROM tickets WHERE username = ? ORDER BY id Desc LIMIT 1', [username], function(err, result) {
                            if (err) {
                                reject('Error: ' + err.message)
                            } else {
                                if (result) {
                                    //Create ticket number for last created ticket
                                    connection.query('UPDATE tickets SET ticketNumber = ?, noOfVisits = ? WHERE id = ?', [registrationNumber, parseInt(result[0].noOfVisits)+1, result[0].id], function(err) {
                                        if (err) {
                                            reject('Error: ' + err.message)
                                        }
                                        else {
                                            //Return last created ticket number to main program
                                            connection.query('SELECT ticketNumber, createdDate, description FROM tickets WHERE username = ? ORDER BY id Desc LIMIT 1', [username], function(err, result) {
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
function createSpecialTicket(username, ticketType, vehicleRegistration, startDate, endDate) {
    return new Promise((resolve, reject) => {
        // Checks to see if ticket type exists 
        connection.query('SELECT id, unitCost, displayName FROM ticketType WHERE ticketType = ? AND status = ? ORDER BY id Desc LIMIT 1', [ticketType, 'active'], function(err, result) {
            if (err) {
                reject('Ticket Type not found - Error: ' + err.message)
            } if (result.length > 0){
                connection.query('INSERT INTO specialTickets (ticketType, vehicleRegistration, description, status, startDate, endDate, rate, username) VALUES (?,?,?,?,?,?,?)', [ticketType, vehicleRegistration, result[0].displayName, 'open', startDate, endDate, result[0].unitCost, username], function(err) {
                    if (err) {
                        reject('Error: ' + err.message)
                    } else {
                        // Return last created ticket number to main program
                        connection.query('SELECT vehicleRegistration, createdDate, description FROM specialTickets WHERE username = ? ORDER BY id Desc LIMIT 1', [username], function(err, result) {
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
        })
    })
}

// Get Ticket based on ticket number
function getTicket(ticketNumber, username) {
    return new Promise((resolve, reject) => {
        // Select last created ticket for the current user 
        connection.query('SELECT * FROM tickets WHERE ticketNumber = ? AND username = ? ORDER BY id Desc LIMIT 1', [ticketNumber, username], function(err, result) {
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

// Create Ticket type
function createTicketType(ticketType, unitCost, username) {
    return new Promise((resolve, reject) => {
        console.log('Insert new ticket Type')

        // Checks to see if ticket exists in database
        connection.query('SELECT id FROM ticketType WHERE ticketType = ? AND status = ? ORDER BY id Desc LIMIT 1', [ticketType, 'open'], function(err, result) {
            if (err) {
                reject('Ticket not found - Error: ' + err.message)
            } else if (result.length == 1) {
                resolve(result)
                console.log('Old ticket already in table.')
                // If ticket exists then update existing ticket to closed status
                connection.query('UPDATE ticketType SET status = ? WHERE id = ?', ['closed', result[0].id], function(err) { 
                    if (err) {
                        reject('Error: ' + err.message)
                    }
                })
            } else {
                reject('Error: ' + err.message)
            }

            // Insert new ticket type into table
            connection.query('INSERT INTO ticketType (ticketType, unitCost, status, username) VALUES (?,?,?,?)', [ticketType, unitCost, 'open', username], function(err) {
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

// Retrieve Ticket Details
function retrieveTicketTypeInfo(ticketType) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT ticketType, unitCost, status, createdDate, displayName, description, username FROM ticketType WHERE ticketType = ?', [ticketType], function(err, result) {
            if (err) {
                reject('Cannot find ticket - Error: ' + err.message)
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

// Create the Receipt
function createReceipt(ticketNumber, ticketStatus, ticketCost, receiptStatus, balance, amountPaid, amountDue, paymentMethod, chequeNumber, username) {
    return new Promise((resolve, reject) => {
        // Checks to see if ticket exists in database
        connection.query('SELECT ticketNumber, ticketType, createdDate, closedDate, status, rate, ticketCost, balance, username FROM tickets WHERE ticketNumber = ? ORDER BY id Desc LIMIT 1', [ticketNumber], function(err, result) {
            if (err) {
                reject('Cannot create receipt - Error: ' + err.message)
            } else {
                if (result) {
                    // Create receipt code here
                    connection.query('UPDATE tickets SET status = ?, ticketCost = ?, balance = ? WHERE ticketNumber = ?', [ticketStatus, ticketCost, balance, ticketNumber], function(err) { 
                        if (err) {
                            reject('Cannot create receipt - Error: ' + err.message)
                        } else {
                            connection.query('INSERT INTO receipts (ticketNumber, ticketType, status, ticketCost, amountPaid, balance, amountDue, paymentMethod, chequeNumber, username) VALUES (?,?,?,?,?,?,?,?,?,?,?)', [ticketNumber, result[0].ticketType, receiptStatus, ticketCost, amountPaid, balance, amountDue, paymentMethod, chequeNumber, username], function(err) {
                                if (err) {
                                    reject('Cannot create receipt - Error: ' + err.message)
                                } else {
                                    connection.query('UPDATE receipts SET receiptNumber = LAST_INSERT_ID() WHERE id = LAST_INSERT_ID()', function(err) {
                                        if (err) {
                                            reject('Cannot use LAST_INSERT_ID() - Error: ' + err.message)
                                        } else {
                                            connection.query('SELECT * FROM receipts WHERE id = LAST_INSERT_ID()', function (err,result) {
                                                if (err) {

                                                } else {
                                                    resolve(result[0])
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                } else {
                    resolve('Database Error')
                }                
            }
        })
    })
}

// Create the Receipt for Lost Tickets
function createLostTicketReceipt(receiptStatus, ticketCost, amountPaid, balance, amountDue, paymentMethod, chequeNumber, username) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO receipts (status, ticketCost, amountPaid, balance, amountDue, paymentMethod, chequeNumber, username) VALUES (?,?,?,?,?,?,?,?)', [receiptStatus, ticketCost, amountPaid, balance, amountDue, paymentMethod, chequeNumber, username], function(err) {
            if (err) {
                reject('Cannot create receipt - Error: ' + err.message)
            } else {
                connection.query('UPDATE receipts SET receiptNumber = LAST_INSERT_ID() WHERE id = LAST_INSERT_ID()', function(err) {
                    if (err) {
                        reject('Cannot use LAST_INSERT_ID() - Error: ' + err.message)
                    } else {
                        connection.query('SELECT * FROM receipts WHERE id = LAST_INSERT_ID()', function (err,result) {
                            if (err) {

                            } else {
                                resolve(result[0])
                            }
                        })
                    }
                })
            }
        })           
    })
}

// Get receipt based on ticket number
function getReceipt(ticketNumber, username) {
    return new Promise((resolve, reject) => {
        // Select last created receipt for the current user based on the ticket number
        connection.query('SELECT * FROM receipts WHERE ticketNumber = ? AND username ORDER BY id Desc LIMIT 1', [ticketNumber, username], function(err, result) {
            if (err) {
                reject('Error: ' + err.message)
            } else {
                if (result.length == 1) {
                    resolve(result)
                } else {
                    resolve('Database Error')
                }
            }
        })
    })
}

// Get the last receipt created
function getLastReceipt(username) {
    return new Promise((resolve, reject) => {
        // Select last created receipt for the current user 
        connection.query('SELECT * FROM receipts WHERE username = ? ORDER BY id Desc LIMIT 1', [username], function(err, result) {
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

// connection.end();

module.exports.login = login
module.exports.insertUser = insertUser
module.exports.createTicket = createTicket
module.exports.createMonthlyTicket = createMonthlyTicket
module.exports.createSpecialTicket = createSpecialTicket
module.exports.getTicket = getTicket
module.exports.createTicketType = createTicketType
module.exports.retrieveTicketTypeInfo = retrieveTicketTypeInfo
module.exports.createReceipt = createReceipt
module.exports.createLostTicketReceipt = createLostTicketReceipt
module.exports.getLastReceipt = getLastReceipt
module.exports.checkUser = checkUser
module.exports.encryptPassword = encryptPassword
module.exports.activateUser = activateUser
