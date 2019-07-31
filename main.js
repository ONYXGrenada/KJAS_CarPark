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
          }
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'app/windows/mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('closed', ()=>{
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
        //frame: false
    });
    loginWindow.setMenuBarVisibility(false)
    //Load html into window
    loginWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'app/windows/loginWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    loginWindow.toggleDevTools()
    //Quit app when login window closed
    loginWindow.on('closed', ()=>{
        loginWindow = null;
    })
}

//Initialize application
app.on('ready', () => {
    createLoginWindow()

    //Get login confirmation
    ipcMain.on('login:successful', (e, username) => {
    createMainWindow()
    mainWindow.send('login', username)
    loginWindow.close(); 
    // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
    //addWindow = null;
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
if(process.env.NODE_ENV !== 'production'){
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