const {ipcRenderer} = require('electron')
const dbhelper = require('../../app/js/dbhelper')


//Listen for Ticket Number
document.querySelector('#txtTicketNumber').addEventListener('change', async (e) => {
    e.preventDefault()
    console.log("ticket number field listener")
    if (e.keyCode == 13) {
        const ticketNumber = document.querySelector('#txtTicketNumber').value
        let ticket = await dbhelper.getTicket(ticketNumber)
        //calculate cost (need ticket create date, rate and now)
        console.log(ticket + " this is where the ticket is supposed to print")
    }
})

//Listen for Ticket Number TEST
document.querySelector('#btnPayTicket').addEventListener('click', async (e) => {
    e.preventDefault()
    console.log("Pay Ticket Button listener")

    const ticketNumber = document.querySelector('#txtTicketNumber').value
    let ticket = await dbhelper.getTicket(ticketNumber)
    //calculate cost (need ticket create date, rate and now)
    console.log(ticket + " this is where the ticket is supposed to print")

})


//listen for Pay Ticket button click
//document.querySelector('form').addEventListener('submit', submitForm)

//submit login request and respond to main.js
// async function submitForm(e){
//     e.preventDefault()
//     //get ticket number from window
//     const ticketNumber = document.querySelector('#txtTicketNumber').value
//     //sqlite login
//     let user = await dbhelper.login(username, password) 
//     //check if login successful
//     if (user.id){
//         ipcRenderer.send('login:successful', user)
//     } 
//     else{
//         loginAttemptCount++
//         if (loginAttemptCount > 3) {
//             ipcRenderer.send('login:failure', close)
//         }
//     }
// }