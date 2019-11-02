const {ipcRenderer} = require('electron')
//const dbhelper = require('../../app/js/dbhelper')
const connection = require('../../app/js/dbconnection')


//Listen for Ticket Number
document.querySelector('#btnDailyTicket').addEventListener('click', async() => {
    //e.preventDefault()
    //console.log("e.keycode " + e.keyCode)
    let ticketTypeInfo = await connection.getTicketType('hourly')

    if (!(document.querySelector('#ticketInfoArea').getAttribute('hidden'))) {
        document.querySelector('#ticketInfoArea').removeAttribute('hidden')
        ipcRenderer.send('window:resize-special', 400, 800)
    }

    // if (document.querySelector('#ticketInfoArea').getAttribute('hidden')) {
    //     document.querySelector('#ticketInfoArea').setAttribute("hidden", true)
    //     ipcRenderer.send('window:resize-special', 300)
    // }

    document.getElementById('ticketType').innerHTML = ticketTypeInfo.displayName
    document.getElementById('ticketInfo').innerHTML = ticketTypeInfo.description
    document.getElementById('ticketCost').innerHTML = "Ticket Cost: $" + ticketTypeInfo.unitCost.toFixed(2)
})

document.querySelector('#btnDailySubmit').addEventListener('click', async() => {
    
})