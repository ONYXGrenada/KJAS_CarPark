const {ipcRenderer} = require('electron')
//const dbhelper = require('../../app/js/dbhelper')
const dbconnection = require('../../app/js/dbconnection')

console.log("Admin:" + dbconnection.encryptPassword('admin'))

//listen for login button click

document.querySelector('form').addEventListener('submit', signUp)



//submit login request and respond to main.js

async function signUp(e){
    e.preventDefault();
    const username = document.querySelector('#txtUser').value
    const firstname = document.querySelector('#txtFirstName').value
    const lastname = document.querySelector('#txtLastName').value
    const password = document.querySelector('#txtPassword').value
    var usrType = document.querySelector('#ddlAccountType')
    const userType = usrType.options[usrType.selectedIndex].text
    let userAvailable = await dbconnection.checkUser(username)
    console.log(userAvailable)
    console.log(userType)

    if(userAvailable){
        document.querySelector("#available").style.display = 'none'
        let added = await dbconnection.insertUser(username, password, firstname, lastname, userType)
        if(added){
            console.log("User " + username + " successfully added.")
            document.querySelector(".form-signin").style.display = "none"
            document.querySelector("#successMessage").style.display = "block"

        }

    }
    else{
        document.querySelector("#available").style.display = 'block'
    }
}

