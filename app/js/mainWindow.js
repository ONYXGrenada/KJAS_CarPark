const {ipcRenderer, dialog, app, BrowserWindow} = require('electron')
const dbhelper = require("../../app/js/dbhelper")

let username
let welcomeMessage = document.querySelector('#welcome')

//Display welcome message
ipcRenderer.on('send:user', (event, user) => {
    welcomeMessage.innerHTML = 'Welcome ' + user.firstName + ' ' + user.lastName
    username = user.username
})

//Listen for CheckIn Button and generate ticket
document.querySelector('#btnCheckIn').addEventListener('click', async () => {
    let ticket = await dbhelper.createTicket(username)
    if (ticket.ticketNumber) {
        alert('Please check the printer for ticket# ' + ticket.ticketNumber)
        // Placeholder for print function or code
        console.log('This is where we print the ticket# '+ ticket.ticketNumber)
    } else {
        console.log('Something went very wrong!')
    }
})