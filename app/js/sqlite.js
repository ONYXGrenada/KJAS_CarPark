// DATABASE CREATION AND TESTING FILE
const sqlite3 = require('sqlite3')

const db = new sqlite3.Database('./db/testdb.sqlite3', (err)=>{
    if (err){
        console.log('Error when creating the database', err)
    } else {
        console.log('Database created!')
        //createTable()
        //updateData()
        //createTicketTable()
    }
    /*db.exec('PRAGMA foreign_keys = ON;', (error)=>{
        if (error){
            console.error("Pragma statement didn't work.")
        } else {
            console.log("Foreign Key Enforcement is on.")
        }
    });*/
})

const createUserTable = () => {
    console.log('Create database table for users')
    db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE,
        password TEXT, salt TEXT, firstName TEXT, lastName TEXT, userType TEXT, lastLogin DATETIME)`, insertAdminUser)
}

//Insert Admin User
const insertAdminUser = () => {
    console.log('Insert the default Administrator User')
    db.run('INSERT INTO users (username, password, firstName, lastName, userType) VALUES (?,?,?,?,?)', ['admin','admin','Admin','User','admin']);
}

//Insert Test User
const insertData = () => {
    console.log('Insert data')
    db.run('INSERT INTO users (username, password, firstName, lastName) VALUES (?,?,?,?)', ['test','test','Test','User']);
}

//Sample update query
const updateData = () => {
    console.log('Update data')
    db.run('UPDATE users SET firstName = ?, lastName = ? WHERE username = ?', ['Test','User', 'test']);
}

//Read from Users
read = () => {
    console.log('Read data from users');
    db.all('SELECT rowid AS id, username, password, firstName, lastName, userType, lastLogin FROM users',
    (err, rows) => {
        if (err) {
            console.log('Error: ' + err.message)
        } else {
            rows.forEach((row) => {
                console.log(row.id + '|' + row.username + '|' + row.firstName + '|' + row.lastName + '|' + row.userType
                + '|' + row.lastLogin);
            });
        }
    });
}

//Read from Tickets
readTickets = () => {
    console.log('Read data from tickets');
    db.all('SELECT ticketNumber, ticketType, createdDate, status, username FROM tickets', (err, rows) => {
        if (err) {
             console.log(err.message)
        } else {
            rows.forEach((row) => {
                console.log(row.ticketNumber + ' | ' + row.ticketType + ' | ' + row.createdDate + ' | ' + row.status + ' | ' + row.username);
            });
        }
    });
}

//Delete all Tickets (Testing)
removeTickets = () => {
    console.log('Delete data from tickets');
    db.all('DELETE FROM tickets');
}

//Remove User Table (Testing)
dropUserTable = () => {
    console.log('Delete the user table');
    db.all('DROP table users');
}

//Remove Ticket Table (Testing)
dropTicketTable = () => {
    console.log('Delete the ticket table');
    db.all('DROP table tickets');
}

//Create Ticket Table
function createTicketTable() {
    console.log('Create database table for Tickets')
    db.run(`CREATE TABLE IF NOT EXISTS tickets (ticketNumber INTEGER PRIMARY KEY AUTOINCREMENT, ticketType TEXT,
    createdDate DATETIME DEFAULT CURRENT_TIMESTAMP, closedDate DATETIME, status TEXT, ticketCost REAL, balance REAL,
    username TEXT)`)
}

//createTicketTable()

read()
readTickets()
//removeTickets()
// dropUserTable()
// dropTicketTable()
// createUserTable()
// createTicketTable()
//setTimeout(db.close, 2000)
db.close()