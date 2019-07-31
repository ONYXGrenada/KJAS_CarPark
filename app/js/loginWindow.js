const {ipcRenderer} = require('electron')
const sqlite3 = require('sqlite3').verbose();

//start sqlite db connection
const db = new sqlite3.Database('./db/testdb.sqlite3', (err) => {
    if (err) {
        return console.error(err.message)
    }
    console.log('Connected to the in-memory SQLite database.')
})

//listen for login button click
document.querySelector('form').addEventListener('submit', submitForm)

//submit login request and respond to main.js
async function submitForm(e){
    console.log('this is a test')
    e.preventDefault()
    const username = document.querySelector('#txtUsr').value
    const password = document.querySelector('#txtPwd').value

    console.log(username, password)
    let auth = await login(username, password) 
    console.log(auth)
    console.log(auth.id)
    if (auth.id) ipcRenderer.send('login:successful', auth.username)
    else ipcRenderer.send('login:failure')
}

//Actually validate against database
function login(username, password){
    return new Promise((resolve, reject) => {
        db.get('SELECT username, id FROM users WHERE username = ? AND password = ?', username, password, (err, row) => {
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

// db.close((err) => {
//     if (err) {
//         return console.error(err.message);
//     }
//     console.log('Close the database connection.');
// });