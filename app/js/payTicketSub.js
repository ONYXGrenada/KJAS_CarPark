const {ipcRenderer} = require('electron')
//const dbhelper = require('../../app/js/dbhelper')
const connection = require('../../app/js/dbconnection')


//Listen for Ticket Number
document.querySelector('#txtTicketNumber').addEventListener('keyup', async(e) => {
    e.preventDefault()
    console.log("e.keycode " + e.keyCode)
    if (e.keyCode == 13) {
        const ticketNumber = document.querySelector('#txtTicketNumber').value
        let ticket = await connection.getTicket(ticketNumber)

        if (ticket.id > 0) {
            document.querySelector('#customerTicket').removeAttribute('hidden')
            //document.querySelector('#customerTicket').setAttribute("hidden", false)
            ipcRenderer.send('window:resize', 500)
        }

        else {
            document.querySelector('#customerTicket').setAttribute("hidden", true)
            ipcRenderer.send('window:resize', 150)
        }


        //Set ticket values
        let endTime = new Date()
        let ticketDuration = convertMS(endTime - ticket.createdDate)
        //let timeSpent = ticketDuration.hour + 1
        let timeSpent = Math.ceil(Math.abs(endTime.getTime() - ticket.createdDate.getTime()) / 3600000)
        // let ticketCost = ticket.rate * ticketDuration.hour
        let ticketCost = ticket.rate * timeSpent
        let displaySTime = ticket.createdDate.getFullYear() + "/" + ticket.createdDate.getMonth() + "/" + ticket.createdDate.getDate() + " " + ticket.createdDate.getHours() + ":" + ticket.createdDate.getMinutes() + ":" + ticket.createdDate.getSeconds()
        let displayETime = endTime.getFullYear() + "/" + endTime.getMonth() + "/" + endTime.getDate() + " " + endTime.getHours() + ":" + endTime.getMinutes() + ":" + endTime.getSeconds()

        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        })





        document.getElementById('sTime').innerHTML = "Enter Time: " + displaySTime
        document.getElementById('eTime').innerHTML = "Exit Time: " + displayETime
        document.getElementById('duration').innerHTML = "Duration: " + ticketDuration.day + " day(s) " + ticketDuration.hour + " hour(s) " + ticketDuration.minute + " mintue(s) " + ticketDuration.seconds + " second(s)" 
        document.getElementById('tType').innerHTML = "Ticket Type: " + ticket.ticketType
        document.getElementById('tCost').innerHTML = "Cost: " + formatter.format(ticketCost)

        //calculate cost (need ticket create date, rate and now)
        console.log(ticket.id + " this is where the ticket is supposed to print")
    }
})


function convertMS( milliseconds ) {
    var day, hour, minute, seconds;
    seconds = Math.floor(milliseconds / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    return {
        day: day,
        hour: hour,
        minute: minute,
        seconds: seconds
    };
}

//Listen for Ticket Number TEST
// document.querySelector('#btnPayTicket').addEventListener('click', async (e) => {
//     e.preventDefault()
//     console.log("Pay Ticket Button listener")

//     const ticketNumber = document.querySelector('#txtTicketNumber').value
//     let ticket = await dbhelper.getTicket(ticketNumber)
//     //calculate cost (need ticket create date, rate and now)
//     console.log(ticket + " this is where the ticket is supposed to print")

// })


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