// Functions and Utilites that will be resused within the app

// function payment(cost, method,payAmount, balance, change, chequeNumber, paymentStatus) {
//     this.cost = cost
//     this.method = method
//     this.payAmount = payAmount
//     this.balance = balance
//     this.change = change
//     this.chequeNumber = chequeNumber
//     this.paymentStatus = paymentStatus
// }

function processPayment(cost, method, payAmount, chequeNumber) {
    let balance
    let change
    let paymentStatus
    if (method == "cash") {
        balance = cost - payAmount
        if (balance < 0) {
            change = balance * -1
            balance = 0
            paymentStatus = 'paid'
        } else if (balance == 0) {
            change = 0
            balance = 0
            paymentStatus = 'paid'
        } else {
            change = 0
            paymentStatus = 'outstanding'
        }
    } else { 
        if (payAmount != cost) {
            const options = {
                type: 'info',
                title: 'Cheque Payment',
                message: 'Cheque amount is not equal to the cost of the ticket. Please check and try again',
                buttons: ['Ok']
            }
            dialog.showMessageBox(null, options)
            balance = cost - payAmount
            change = 0 
            paymentStatus = 'unpaid'
        } else {
            balance = 0
            change = 0
            paymentStatus = 'paid'
        }
    }

    return payment = {
        cost: cost,
        method: method,
        payAmount: payAmount,
        balance: balance,
        change: change,
        chequeNumber: chequeNumber,
        paymentStatus: paymentStatus
    }
}

module.exports.processPayment = processPayment