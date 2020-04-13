const {ipcRenderer} = require('electron')
const dbconnection = require('../../app/js/dbconnection')
const appUtils = require('../../app/js/appUtils')

let lostTicketFee = document.querySelector('#txtLostTicketFee')
let paymentMethod
let paymentAmount
let chequeNumber
let paymentReturn = document.querySelector('#txtPaymentReturn')
let ticketTypeInfo
let userInfo
let payment

// Get the user on window creation
ipcRenderer.on('send:user', (event, user) => {
    userInfo = user
    getLostFee()
})

// function to return the lost ticket fee
async function getLostFee() {
    ticketTypeInfo = await dbconnection.retrieveTicketTypeInfo('lost')
    lostTicketFee.innerHTML = ticketTypeInfo.unitCost
}

// Listen for changes to payment method
document.querySelector('#txtPaymentMethod').addEventListener('change', () => {
    if (document.getElementById('txtPaymentMethod').value == 'cheque') {
        let data = {
            height: 350,
            window: 'lostTicketSub'
        }
        ipcRenderer.send('window:resize', data)
        document.getElementById('txtChequeNumber').hidden = false
    } else {
        let data = {
            height: 300,
            window: 'lostTicketSub'
        }
        ipcRenderer.send('window:resize', data)
        document.getElementById('txtChequeNumber').hidden = true
    }
})

// Listen for form changes
document.querySelector('#collectPayment').addEventListener('change', () => {
    paymentMethod = document.querySelector('#txtPaymentMethod').value
    paymentAmount = document.querySelector('#txtPaymentAmount').value
    chequeNumber = document.querySelector('#txtChequeNumber').value
    if (paymentMethod == 'cash' && paymentAmount != null) {
        document.querySelector('#btnPayTicket').disabled = false
    } else if (paymentMethod == 'cheque' && paymentAmount != null && chequeNumber != null) {
        document.querySelector('#btnPayTicket').disabled = false
    } else {
        document.querySelector('#btnPayTicket').disabled = true
    }
})

// Listen for keypress on PayAmount
document.querySelector('#txtPaymentAmount').addEventListener('keypress', () => {
    document.querySelector('#collectPayment').dispatchEvent(new Event('change'))
})


// Listen for Generate Ticket Button and generate ticket
document.querySelector('#btnPayTicket').addEventListener('click', async () => {
    payment = appUtils.processPayment(ticketTypeInfo.unitCost, paymentMethod, paymentAmount, chequeNumber)
    paymentReturn.innerHTML = 'Please return $' + payment.change + ' to the customer.'
    let receipt = await dbconnection.createLostTicketReceipt(payment.paymentStatus, payment.cost, payment.payAmount, payment.balance, payment.cost, payment.method, payment.chequeNumber, userInfo.username)
    if (receipt.receiptNumber) {
        //Pop up dialog box displaying ticket number
        let data = {
        receipt: receipt,
        parentWindow: 'lostTicketSub'
        }
        ipcRenderer.send('send:receipt', data)
        // Placeholder for print function or code
        console.log('This is where we print the receipt# ' + receipt.receiptNumber)
    } else {
        console.log('Something went very wrong!')
    }
})
