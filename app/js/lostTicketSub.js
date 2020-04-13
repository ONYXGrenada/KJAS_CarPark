const {ipcRenderer} = require('electron')
const dbconnection = require('../../app/js/dbconnection')
const appUtils = require('../../app/js/appUtils')

let lostTicketFee = document.querySelector('#lostTicketFee')
let ticketTypeInfo
let userInfo
let payment

// Get the user on window creation
ipcRenderer.on('send:user', (event, user) => {
    userInfo = user
})

// function to return the lost ticket fee
async function getLostFee() {
    ticketTypeInfo = await dbconnection.retrieveTicketTypeInfo('lost')
    lostTicketFee.innerHTML = ticketTypeInfo.unitCost
}

// Listen for changes to payment method
document.querySelector('#txtPaymentMethod').addEventListener('change', () => {
    if (document.getElementById('txtPaymentMethod').value == 'cheque') {
        document.getElementById('txtChequeNumber').hidden = false
    } else {
        document.getElementById('txtChequeNumber').hidden = true
    }
})


// Listen for Generate Ticket Button and generate ticket
document.querySelector('#btnPayTicket').addEventListener('click', async () => {
    payment = appUtils.processPayment(ticketTypeInfo.unitCost, document.querySelector('#txtPaymentMethod').value, document.querySelector('#txtPaymentAmount').value,)
    let receipt = await dbconnection.createLostTicketReceipt(payment.paymentStatus, payment.cost, payment.payAmount, payment.balance, payment.cost, payment.method, payment.chequeNumber, userInfo.username)
    if (receipt.receiptNumber) {
        //Pop up dialog box displaying ticket number
        ipcRenderer.send('send:receipt', receipt)
        // Placeholder for print function or code
        console.log('This is where we print the receipt# ' + receipt.receiptNumber)
    } else {
        console.log('Something went very wrong!')
    }
})
