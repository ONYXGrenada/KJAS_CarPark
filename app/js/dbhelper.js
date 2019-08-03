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
        password TEXT, salt TEXT, firstName TEXT, lastName TEXT, lastLogin DATE)`, insertData)
}

//Create Ticket Table
function createSpecialTicketTable() {
    console.log("Create database table for Special Tickets")
    db.run(`CREATE TABLE IF NOT EXISTS tickets (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE,
        password TEXT, salt TEXT, firstName TEXT, lastName TEXT, lastLogin DATE)`)
}

//Create Transaction Table
function createTransactionTable() {
    console.log("Create database table for Transaction")
    db.run(`CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE,
        password TEXT, salt TEXT, firstName TEXT, lastName TEXT, lastLogin DATE)`)
}

//Actually validate against database
function login(username, password){
    return new Promise((resolve, reject) => {
        db.get('SELECT username, id, firstName, lastName FROM users WHERE username = ? AND password = ?', username, password, (err, row) => {
            if (err) {
                reject("Error: " + err.message)
            } else {
                if (row) {
                    resolve(row)
                } else {
                    resolve('username or password is incorrect')
                }
            }
        })
    })
}

//Create Ticket

// db.close((err) => {
//     if (err) {
//         return console.error(err.message);
//     }
//     console.log('Close the database connection.');
// });

module.exports.login = login