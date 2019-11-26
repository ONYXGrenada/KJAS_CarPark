const {app, BrowserWindow, Menu, ipcMain, dialog} = require('electron');
const url = require('url');
const path = require('path');
//const fs = require('fs');

// SET ENV
process.env.NODE_ENV = 'development';

let mainWindow;
let loginWindow;
let printWindow;
let payTicketSub;

//Create mainWindow
function createMainWindow() {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        show: false
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'app/windows/mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    //Open the DevTools
    //mainWindow.webContents.openDevTools()

    mainWindow.on('closed', () => {
        app.quit();
    })

    //Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert menu
    Menu.setApplicationMenu(mainMenu);
}

//Create loginWindow
function createLoginWindow() {
    loginWindow = new BrowserWindow({
        parent: mainWindow,
        width: 400,
        height: 300,
        webPreferences: {
            nodeIntegration: true
        }
    });
    loginWindow.setMenuBarVisibility(true)
    //Load html into window
    loginWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'app/windows/loginWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    //loginWindow.toggleDevTools()

    //Quit app when login window closed
    loginWindow.on('closed', () => {
        //loginWindow = null
        if (!mainWindow.isVisible()) {
            app.quit()
        } else {
            loginWindow = null
        }
    })
}

//Create printWindow
function createPrintWindow(templateUrl, data) {
    printWindow = new BrowserWindow({
        parent: mainWindow,
        width: 200,
        height: 400,
        webPreferences: {
            nodeIntegration: true
        },
        show: false
    });
    printWindow.setMenuBarVisibility(false)
    //Load html into window
    printWindow.loadURL(url.format({
        pathname: path.join(__dirname, templateUrl),
        protocol: 'file:',
        slashes: true
    }));
    //Print html file
    printWindow.webContents.on('did-finish-load', () => {
        //Send print data to template
        printWindow.webContents.send('send:data', data)
        //Print the contents of the HTML Template
        printWindow.webContents.print({
            silent: false
        }, (success) => {
            if (success) {
                printWindow.close()
            } else {
                console.log(success.message)
            }
        })
    })
    //Clean up on close
    printWindow.on('closed', () => {
        printWindow = null
    })
}

//Create Pay Ticket Sub
function createPayTicketSub() {
    payTicketSub = new BrowserWindow({
        parent: mainWindow,
        width: 400,
        height: 150,
        webPreferences: {
            nodeIntegration: true
        }
    });
    payTicketSub.setMenuBarVisibility(true)
    //Load html into window
    payTicketSub.loadURL(url.format({
        pathname: path.join(__dirname, 'app/windows/payTicketSub.html'),
        protocol: 'file:',
        slashes: true
    }));

    //Quit app when payTicketSub closed
    payTicketSub.on('closed', () => {
        payTicketSub = null   
    })
}

//Create Lost Ticket Sub
function createLostTicketSub() {
    lostTicketSub = new BrowserWindow({
        parent: mainWindow,
        width: 400,
        height: 150,
        webPreferences: {
            nodeIntegration: true
        }
    });
    lostTicketSub.setMenuBarVisibility(true)
    //Load html into window
    lostTicketSub.loadURL(url.format({
        pathname: path.join(__dirname, 'app/windows/lostTicketSub.html'),
        protocol: 'file:',
        slashes: true
    }));

    //Quit app when lostTicketSub closed
    lostTicketSub.on('closed', () => {
        lostTicketSub = null   
    })
}

//Initialize application
app.on('ready', () => {
    createMainWindow()
    createLoginWindow()

    //Get login confirmation
    ipcMain.on('login:successful', (event, user) => {
        mainWindow.show()
        mainWindow.webContents.send('send:user', user)
        //event.sender.send('send:username', username)
        loginWindow.close()
    });

    //Get failed login
    ipcMain.on('login:failure', (event, close) => {
        app.quit()
    });

    //Ticket Message Box
    ipcMain.on('send:ticket', (event, ticket) => {
        //Generate receipt in print window
        createPrintWindow('app/templates/ticket.html', ticket)
        const options = {
            type: 'info',
            title: 'Ticket',
            message: 'Please check the printer for ticket# ' + ticket.ticketNumber,
            buttons: ['Ok']
        }
        dialog.showMessageBox(null, options)
    })

    //Pay Ticket Message Box
    ipcMain.on('send:pay', (event) => {
        createPayTicketSub()
    })

    //Lost Ticket Message Box
    ipcMain.on('send:lost', (event) => {
        createLostTicketSub()
        // const options = {
        //     type: 'info',
        //     title: 'Lost Ticket',
        //     message: 'Functionality not yet programmed!',
        //     buttons: ['Ok']
        // }
        // dialog.showMessageBox(null, options)
    })

    //Adjust window size
    ipcMain.on('window:resize', (event, arg) => {
        payTicketSub.setSize(400, arg)
    });
})

//Quit app when all windows are closed
app.on('window-all-closed', () => {
    app.quit()
})

//Create menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' :
                'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

// Add developer tools option if in dev
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu:[
            {
                role: 'reload'
            },
            {
                label: 'Toggle DevTools',
                accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    });
}