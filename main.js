const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const url = require('url');
const path = require('path');

// SET ENV
process.env.NODE_ENV = 'development';

let mainWindow;
let loginWindow;

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

//Initialize application
app.on('ready', () => {
    //createLoginWindow()
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