const {ipcRenderer} = require('electron')

let ticketNumber = document.querySelector('#ticketNumber')
let ticketDate = document.querySelector('#ticketDate')
let ticketTime = document.querySelector('#ticketTime')
let parseDateTime
//Get ticket data to display on ticket template
ipcRenderer.on('send:data', (event, data) => {
    ticketNumber.innerHTML = 'Ticket #: ' + data.ticketNumber + '<br>'
    //Split Date and Time
    parseDateTime = data.createdDate.split(" ")
    ticketDate.innerHTML = 'Date: ' + parseDateTime[0] + '<br>'
    ticketTime.innerHTML = 'Time: ' + parseDateTime[1] + '<br>'
})