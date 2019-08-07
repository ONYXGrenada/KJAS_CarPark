const {ipcRenderer} = require('electron')
const dbhelper = require('../../app/js/dbhelper')

//listen for login button click
document.querySelector('form').addEventListener('submit', submitForm)

let loginAttemptCount = 0

//submit login request and respond to main.js
async function submitForm(e){
    e.preventDefault()
    //get username and password from window
    const username = document.querySelector('#txtUser').value
    const password = document.querySelector('#txtPassword').value
    //sqlite login
    let user = await dbhelper.login(username, password) 
    //check if login successful
    if (user.id){
        ipcRenderer.send('login:successful', user)
    } 
    else{
        loginAttemptCount++
        if (loginAttemptCount > 3) {
            ipcRenderer.send('login:failure', close)
        }
    }
}