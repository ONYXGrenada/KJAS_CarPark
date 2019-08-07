const {ipcRenderer} = require('electron')
const dbhelper = require('../../app/js/dbhelper')

let userInfo
let welcomeMessage = document.querySelector('#welcome')

//Display welcome message
ipcRenderer.on('send:user', (event, user) => {
    welcomeMessage.innerHTML = 'Welcome ' + user.firstName + ' ' + user.lastName
    userInfo= user
})

//Listen for Generate Ticket Button and generate ticket
document.querySelector('#btnGenerateTicket').addEventListener('click', async () => {
    let ticket = await dbhelper.createTicket(userInfo.username)
    if (ticket.ticketNumber) {
        //Pop up dialog box displaying ticket number
        ipcRenderer.send('send:ticket', ticket)
        // Placeholder for print function or code
        console.log('This is where we print the ticket# ' + ticket.ticketNumber)
    } else {
        console.log('Something went very wrong!')
    }
})

//Listen for Pay Ticket Button and close ticket after payment (How to handle Bar Code Scanner?)
document.querySelector('#btnPayTicket').addEventListener('click', () => {
    ipcRenderer.send('send:pay')
})

//Listen for Lost Ticket Button
document.querySelector('#btnLostTicket').addEventListener('click', () => {
    ipcRenderer.send('send:lost')
})