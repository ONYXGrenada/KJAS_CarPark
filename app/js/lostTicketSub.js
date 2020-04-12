const {ipcRenderer} = require('electron')
const dbconnection = require('../../app/js/dbconnection')

let lostTicketFee = document.querySelector("#lostTicketFee")
let ticketInfo
let userInfo

// Get the user on window creation
ipcRenderer.on('send:user', (event, user) => {
    userInfo = user
})

// function to return the lost ticket fee
async function getLostFee() {
    ticketInfo = await dbconnection.retrieveTicketInfo('lost')
    lostTicketFee.innerHTML = ticketInfo.unitCost
}

//Listen for Generate Ticket Button and generate ticket
document.querySelector('#btnGenerateTicket').addEventListener('click', async () => {
    let ticket = await dbconnection.createTicket(userInfo.username, 'lost')
    if (ticket.ticketNumber) {
        //Pop up dialog box displaying ticket number
        ipcRenderer.send('send:ticket', ticket)
        // Placeholder for print function or code
        console.log('This is where we print the ticket# ' + ticket.ticketNumber)
    } else {
        console.log('Something went very wrong!')
    }
})
