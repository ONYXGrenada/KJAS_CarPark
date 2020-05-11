const {ipcRenderer} = require('electron')
const dbconnection = require('../../app/js/dbconnection')

let userInfo
let welcomeMessage = document.querySelector('#welcome')

//Display welcome message
ipcRenderer.on('send:user', (event, user) => {
    welcomeMessage.innerHTML = 'Welcome ' + user.firstName + ' ' + user.lastName
    userInfo = user
})

//Listen for change in (de)activation action
document.querySelector('#ddlActionType').addEventListener('change', async () => {
    var usrType = document.querySelector('#ddlActionType')
    const action = usrType.options[usrType.selectedIndex].text
    // console.log(action.substring(0, action.indexOf(" ")))
    console.log(usrType.selectedIndex)
    document.querySelector("#btnProceed").innerHTML = action.substring(0, action.indexOf(" "))
    document.querySelector("#btnProceed").style.display = "inline-block"
    document.querySelector("#btnProceed").disabled = false



})


//Listen for Activation Cancel button
document.querySelector('#btnCancel').addEventListener('click', async () => {
    document.querySelector("#admincover").style.display = "none"
})

//Listen for Activate / Deactivate User button and show the relevant screen
document.querySelector('#btnUserActivation').addEventListener('click', () => {
    document.querySelector("#ddlActionType").selectedIndex = "0"
    document.querySelector("#btnProceed").disabled = true
    document.querySelector("#txtUserName").value = ""
    document.querySelector("#admincover").style.display = "block"
    document.querySelector("#btnProceed").style.display = "none"

})

//Listen for Activate Button
document.querySelector('#btnProceed').addEventListener('click', () => {
    let user = document.querySelector("#txtUserName").value
    let action = document.querySelector("#btnProceed").innerHTML
    let activationResult = dbconnection.activateUser(user, action)
    console.log(activationResult)
})
//Listen for Sign Up Button
document.querySelector('#btnSignUp').addEventListener('click', () => {

    ipcRenderer.send('send:signup')
})

