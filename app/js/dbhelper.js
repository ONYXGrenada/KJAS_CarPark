const sqlite3 = require('sqlite3').verbose();

//start sqlite db connection
const db = new sqlite3.Database('./app/db/testdb.sqlite3', (err) => {
    if (err) {
        return console.error(err.message)
    }
    console.log('Connected to the in-memory SQLite database.')
})

//Create User Table
function createUserTable() {
    console.log('Create database table for users')
    db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE,
    password TEXT, salt TEXT, firstName TEXT, lastName TEXT, userType TEXT, lastLogin TEXT)`, insertAdminUser)
}

//Insert Admin User
const insertAdminUser = () =>{
    console.log('Insert the default Administrator User')
    db.get('SELECT username FROM users WHERE username = ?', 'admin', (err, row) => {
        if (err) {
            reject('Error: ' + err.message)
        } else {
            if (row) {
                console.log('Administrator User already in table.')
            } else {
                db.run('INSERT INTO users (username, password, firstName, lastName) VALUES (?,?,?,?)', ['admin','admin','Admin','User']);
            }
        }
    })    
}

//Create Ticket Table
function createTicketTable() {
    console.log('Create database table for Tickets')
    db.run(`CREATE TABLE IF NOT EXISTS tickets (id INTEGER PRIMARY KEY AUTOINCREMENT, ticketNumber TEXT, ticketType TEXT,
    createdDate DATETIME DEFAULT CURRENT_TIMESTAMP, closedDate DATETIME, status TEXT, rate REAL, ticketCost REAL, balance REAL,
    username TEXT)`)
}

//Create Special Arrangement Ticket Table
function createSpecialTicketTable() {
    console.log('Create database table for Special Tickets')
    db.run(`CREATE TABLE IF NOT EXISTS specialTickets (id INTEGER PRIMARY KEY AUTOINCREMENT, vehicleRegistration TEXT,
    ticketType TEXT, startDate DATETIME, endDate DATETIME, rate REAL, status TEXT, ticketCost REAL, balance REAL, username TEXT)`)
}

//Create Receipt Table
function createReceiptTable() {
    console.log('Create database table for Receipt')
    db.run(`CREATE TABLE IF NOT EXISTS receipts (id INTEGER PRIMARY KEY AUTOINCREMENT, ticketNumber TEXT, ticketType TEXT,
    createdDate DATETIME DEFAULT CURRENT_TIMESTAMP, closedDate DATETIME, status TEXT, ticketCost REAL, amountPaid REAL, balance REAL, 
    amountDue REAL, paymentMethod TEXT, chequeNumber TEXT, username TEXT)`)
}

//Create Ticket Type Table
function createTicketTypeTable() {
    console.log('Create database table for Ticket Type')
    db.run(`CREATE TABLE IF NOT EXISTS ticketType (id INTEGER PRIMARY KEY AUTOINCREMENT, ticketType TEXT, unitCost REAL, status TEXT,
    createdDate DATETIME DEFAULT CURRENT_TIMESTAMP, username TEXT)`)
}

//Insert Standard Ticket
function createTicketType(ticketType, unitCost, username) {
    return new Promise((resolve, reject) => {
        console.log('Insert new ticket Type')

        //Checks to see if ticket exists in database
        db.get('SELECT id FROM ticketType WHERE ticketType = ? AND status = ? ORDER BY id Desc LIMIT 1', ticketType, 'open', (err, row) => {
            if (err) {
                reject('Ticket not found - Error: ' + err.message)
            }
            
            else {
                if (row) {
                    resolve(row)
                    console.log('Old ticket already in table.')
                    //If ticket exists then update existing ticket to closed status
                    db.run('UPDATE ticketType SET status = ? WHERE id = ?', ['closed', row.id], (err) => { 
                        if (err) {
                            reject('Error: ' + err.message)
                        }
                    })
                }
            }

            //Insert new ticket type into table
            db.run('INSERT INTO ticketType (ticketType, unitCost, status, username) VALUES (?,?,?,?)', [ticketType, unitCost, 'open', username], (err) => {
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

//Login function to actually validate against database
function login(username, password) {
    return new Promise((resolve, reject) => {
        db.get('SELECT username, id, firstName, lastName FROM users WHERE username = ? AND password = ?', username,
        password, (err, row) => {
            if (err) {
                reject('Error: ' + err.message)
            } else {
                if (row) {
                    resolve(row)
                    let loginDateTime = new Date().toISOString().substr(0, 19).replace('T', ' ')
                    db.run('UPDATE users SET lastLogin = ? WHERE username = ?', [loginDateTime, username],
                    (err) => {
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

//Create Ticket function to generate ticket in the ticket table
function createTicket(username) {
    return new Promise((resolve, reject) => {
        //Checks to see if ticket exists in database
        db.get('SELECT id, unitCost FROM ticketType WHERE ticketType = ? AND status = ? ORDER BY id Desc LIMIT 1', 'standard', 'open', (err, row) => {
            if (err) {
                reject('Ticket not found - Error: ' + err.message)
            }
            if (row){
                //rate = row.unitCost
                console.log(row.unitCost + "~rate display - 1")
                //include the rest of the function in this area
                db.run('INSERT INTO tickets (ticketType, status, rate, username) VALUES (?,?,?,?)', ['standard', 'open', row.unitCost, username], (err) => {
                    if (err) {
                        reject('Error: ' + err.message)
                    } else {
                        //Select last created ticket for the current user 
                        db.get('SELECT id FROM tickets WHERE username = ? ORDER BY id Desc LIMIT 1', username, (err, row) => {
                            if (err) {
                                reject('Error: ' + err.message)
                            } else {
                                if (row) {
                                    //Create ticket number for last created ticket
                                    db.run('UPDATE tickets SET ticketNumber = ? WHERE id = ?', [row.id, row.id], (err) => {
                                        if (err) {
                                            reject('Error: ' + err.message)
                                        }
                                        else {
                                            //Return last created ticket number to main program
                                            db.get('SELECT ticketNumber, createdDate FROM tickets WHERE username = ? ORDER BY id Desc LIMIT 1', 
                                            username, (err, row) => {
                                                if (err) {
                                                    reject('Error: ' + err.message)
                                                } else {
                                                    if (row) {
                                                        resolve(row)
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
        db.get('SELECT * FROM tickets WHERE ticketNumber = ?', ticketNumber, (err, row) => {
            if (err) {
                reject('Error: ' + err.message)
            } else {
                if (row) {
                    resolve(row)
                } else {
                    resolve('Database Error')
                }
            }
        })
    })
}

//Create database tables
createUserTable();
createTicketTable();
createSpecialTicketTable();
createReceiptTable();
createTicketTypeTable();
//createTicketType('standard', 2.00, 'sys');

// db.close((err) => {
//     if (err) {
//         return console.error(err.message);
//     }
//     console.log('Close the database connection.');
// });

module.exports.login = login
module.exports.createTicket = createTicket
module.exports.getTicket = getTicket