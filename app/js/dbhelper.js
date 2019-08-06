const sqlite3 = require('sqlite3').verbose();

//start sqlite db connection
const db = new sqlite3.Database('./db/testdb.sqlite3', (err) => {
    if (err) {
        return console.error(err.message)
    }
    console.log('Connected to the in-memory SQLite database.')
})

//Create User Table
function createUserTable() {
    console.log("Create database table for users")
    db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE,
    password TEXT, salt TEXT, firstName TEXT, lastName TEXT, userType TEXT, lastLogin TEXT)`, insertAdminUser)
}

//Insert Admin User
const insertAdminUser = () =>{
    console.log("Insert the default Administrator User")
    db.run('INSERT INTO users (username, password, firstName, lastName) VALUES (?,?,?,?)', ["admin","admin","Admin","User"]);
}

//Create Ticket Table
function createTicketTable() {
    console.log("Create database table for Tickets")
    db.run(`CREATE TABLE IF NOT EXISTS tickets (ticketNumber INTEGER PRIMARY KEY AUTOINCREMENT, ticketType TEXT,
    createdDate DATETIME DEFAULT CURRENT_TIMESTAMP, closedDate DATETIME, status TEXT, ticketCost REAL, balance REAL,
    username TEXT)`)
}

//Create Special Arrangement Ticket Table
function createSpecialTicketTable() {
    console.log("Create database table for Special Tickets")
    db.run(`CREATE TABLE IF NOT EXISTS specialTickets (id INTEGER PRIMARY KEY AUTOINCREMENT, vehicleRegistration TEXT,
    ticketType TEXT, startDate DATETIME, endDate DATETIME, status TEXT, ticketCost REAL, balance REAL, username TEXT)`)
}

//Create Transaction Table
function createTransactionTable() {
    console.log("Create database table for Transaction")
    db.run(`CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, ticketNumber TEXT,
    status TEXT, tranDate DATETIME, ticketCost REAL, amountPaid REAL, balance REAL, receiptNumber TEXT)`)
}

//Login function to actually validate against database
function login(username, password) {
    return new Promise((resolve, reject) => {
        db.get('SELECT username, id, firstName, lastName FROM users WHERE username = ? AND password = ?', username,
        password, (err, row) => {
            if (err) {
                reject("Error: " + err.message)
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
        db.run('INSERT INTO tickets (status, username) VALUES (?,?)', ["open", username], (err) => {
            if (err) {
                reject("Error: " + err.message)
            } else {
                db.get('SELECT ticketNumber FROM tickets WHERE username = ? ORDER BY ticketNumber Desc', 
                username, (err, row) => {
                    if (err) {
                        reject("Error: " + err.message)
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
    })
}

// db.close((err) => {
//     if (err) {
//         return console.error(err.message);
//     }
//     console.log('Close the database connection.');
// });

module.exports.login = login
module.exports.createTicket = createTicket