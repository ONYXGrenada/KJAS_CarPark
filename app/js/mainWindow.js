const {ipcRenderer} = require('electron')
const dbhelper = require("../../app/js/dbhelper")

let welcomeMessage = document.querySelector('#welcome')
// document.getElementById('loginUsername').innerHTML = "Welcome "
// const usernameDiv = document.querySelector('#loginUsername')
// usernameDiv.innerHTML = 'Welcome ' + username

ipcRenderer.on('send:user', (event, user) => {
    welcomeMessage.innerHTML = "Welcome " + user.firstName + " " + user.lastName
//document.getElementById('loginUsername').innerHTML = "Welcome " + username
})