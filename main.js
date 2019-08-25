const {app, BrowserWindow, Menu, ipcMain, dialog} = require('electron');
const url = require('url');
const path = require('path');
//const fs = require('fs');

// SET ENV
process.env.NODE_ENV = 'development';

let mainWindow;
let loginWindow;
let printWindow;

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
    loginWindow.setMenuBarVisibility(false)
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
    // //Send print data to template
    // printWindow.webContents.send('send:data', data)
    //Print html file
    printWindow.webContents.on('did-finish-load', () => {
        //Print PDF Test
        // printWindow.webContents.printToPDF({}, (error, data) => {
        //     if (error) console.log(error.message)
        //     fs.writeFileSync('app/tmp/print.pdf', data, (error) => {
        //         if (error) {
        //             console.log(error.message)
        //         } else {
        //             console.log('Write PDF successfully.')
        //         }
        //     })
        // })
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
        const options = {
            type: 'info',
            title: 'Pay Ticket',
            message: 'Functionality not yet programmed!',
            buttons: ['Ok']
        }
        dialog.showMessageBox(null, options)
    })

    //Pay Ticket Message Box
    ipcMain.on('send:lost', (event) => {
        const options = {
            type: 'info',
            title: 'Lost Ticket',
            message: 'Functionality not yet programmed!',
            buttons: ['Ok']
        }
        dialog.showMessageBox(null, options)
    })
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