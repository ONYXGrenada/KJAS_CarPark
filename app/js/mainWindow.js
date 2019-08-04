const {ipcRenderer} = require('electron')
const dbhelper = require("../../app/js/dbhelper")

let welcomeMessage = document.querySelector('#welcome')

//Display welcome message
ipcRenderer.on('send:user', (event, user) => {
    welcomeMessage.innerHTML = 'Welcome ' + user.firstName + ' ' + user.lastName
})