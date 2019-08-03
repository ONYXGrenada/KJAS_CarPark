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
    let user = await dbhelper.login(username, password) 
    console.log(user)
    console.log(user.id)
    if (user.id) ipcRenderer.send('login:successful', user)
    else ipcRenderer.send('login:failure')
}