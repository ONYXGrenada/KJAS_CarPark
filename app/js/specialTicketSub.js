const {ipcRenderer} = require('electron')
//const dbhelper = require('../../app/js/dbhelper')
const connection = require('../../app/js/dbconnection')


//Listen for Ticket Number
document.querySelector('#btnDailyTicket').addEventListener('click', async() => {
    //e.preventDefault()
    //console.log("e.keycode " + e.keyCode)
    if (document.querySelector('#ticketInfoArea').getAttribute('hidden')) {
        document.querySelector('#ticketInfoArea').removeAttribute('hidden')
        ipcRenderer.send('window:resize-special', 700)
    }

    else {
        document.querySelector('#ticketInfoArea').setAttribute("hidden", true)
        ipcRenderer.send('window:resize-special', 300)
    }

    //document.getElementById('sTime').innerHTML = "Enter Time: " + displaySTime

})