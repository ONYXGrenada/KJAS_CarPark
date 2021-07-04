const {ipcRenderer} = require('electron')
//const dbhelper = require('../../app/js/dbhelper')
const dbconnection = require('../../app/js/dbconnection')

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
    //console.log("Function worked")
    let user = await dbconnection.login(username, password) 
    //check if login successful
    console.log(user.id + " - " + user.username)
    if (user.id){
        ipcRenderer.send('login:successful', user)
    } 
    else{
        loginAttemptCount++
        //console.log("Count: " + loginAttemptCount)
        if (loginAttemptCount > 3) {
            ipcRenderer.send('login:failure', close)
        }
    }
}