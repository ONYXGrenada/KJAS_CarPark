const {ipcRenderer} = require('electron')
const dbhelper = require("../../app/js/dbhelper")

//listen for login button click
document.querySelector('form').addEventListener('submit', submitForm)

//submit login request and respond to main.js
async function submitForm(e){
    console.log('this is a test')
    e.preventDefault()
    const username = document.querySelector('#txtUser').value
    const password = document.querySelector('#txtPassword').value

    console.log(username, password)
    let auth = await dbhelper.login(username, password) 
    console.log(auth)
    console.log(auth.id)
    if (auth.id) ipcRenderer.send('login:successful', auth.username)
    else ipcRenderer.send('login:failure')
}