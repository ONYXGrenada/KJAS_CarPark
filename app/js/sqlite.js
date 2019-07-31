// DATABASE CREATION AND TESTING FILE
const sqlite3 = require('sqlite3')

const db = new sqlite3.Database("./db/testdb.sqlite3", (err)=>{
    if (err){
        console.log('Error when creating the database', err)
    } else {
        console.log('Database created!')
        createTable()
    }

    /*db.exec('PRAGMA foreign_keys = ON;', (error)=>{
        if (error){
            console.error("Pragma statement didn't work.")
        } else {
            console.log("Foreign Key Enforcement is on.")
        }
    });*/
})

const createTable = () => {
    console.log("Create database table for users")
    db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE,
        password TEXT, salt TEXT, firstName TEXT, lastName TEXT, lastLogin DATE)`, insertData)
}

const insertData = () =>{
    console.log("Insert data")
    db.run('INSERT INTO users (username, password, firstname, lastname) VALUES (?,?,?,?)', ["test","test","Test","User"]);
}

read = () => {
    console.log("Read data from users");
    db.all("SELECT rowid AS id, username, password, firstname, lastname FROM users", (err, rows)=>{
        rows.forEach((row)=>{
            console.log(row.id + ": " + row.username);
        });
    });
}
read()
db.close()