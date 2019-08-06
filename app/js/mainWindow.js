const {ipcRenderer} = require('electron')
const dbhelper = require("../../app/js/dbhelper")

let userInfo
let welcomeMessage = document.querySelector('#welcome')

//Display welcome message
ipcRenderer.on('send:user', (event, user) => {
    welcomeMessage.innerHTML = 'Welcome ' + user.firstName + ' ' + user.lastName
    userInfo= user
})

//Listen for CheckIn Button and generate ticket
document.querySelector('#btnGenerateTicket').addEventListener('click', async () => {
    let ticket = await dbhelper.createTicket(userInfo.username)
    if (ticket.ticketNumber) {
        alert('Please check the printer for ticket# ' + ticket.ticketNumber)
        // Placeholder for print function or code
        console.log('This is where we print the ticket# '+ ticket.ticketNumber)
    } else {
        console.log('Something went very wrong!')
    }
})

//Listen for CheckOut Button and close ticket after payment (How to handle Bar Code Scanner?)
document.querySelector('#btnPayTicket').addEventListener('click', () => {

})