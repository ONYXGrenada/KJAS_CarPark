const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const url = require("url");
const path = require("path");

// SET ENV
process.env.NODE_ENV = "development";

let mainWindow;
let loginWindow;
let printWindow;
let payTicketSub;
let lostTicketSub;

// Create mainWindow
function createMainWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
    show: false,
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "app/windows/mainWindow.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  // Open the DevTools
  // mainWindow.webContents.openDevTools()

  mainWindow.on("closed", () => {
    app.quit();
  });

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);
}

// Create loginWindow
function createLoginWindow() {
  loginWindow = new BrowserWindow({
    parent: mainWindow,
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  loginWindow.setMenuBarVisibility(true);
  // Load html into window
  loginWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "app/windows/loginWindow.html"),
      protocol: "file:",
      slashes: true,
    })
  );
  // loginWindow.toggleDevTools()

  // Quit app when login window closed
  loginWindow.on("closed", () => {
    // loginWindow = null
    if (!mainWindow.isVisible()) {
      app.quit();
    } else {
      loginWindow = null;
    }
  });
}

// Create printWindow
function createPrintWindow(templateUrl, data, parentWindow) {
  printWindow = new BrowserWindow({
    parent: parentWindow,
    width: 200,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
    },
    show: false,
  });
  printWindow.setMenuBarVisibility(false);
  // Load html into window
  printWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, templateUrl),
      protocol: "file:",
      slashes: true,
    })
  );
  // Print html file
  printWindow.webContents.on("did-finish-load", () => {
    // Send print data to template
    printWindow.webContents.send("send:data", data);
    // Print the contents of the HTML Template
    printWindow.webContents.print(
      {
        silent: false,
      },
      (success) => {
        if (success) {
          printWindow.close();
        } else {
          console.log(success.message);
        }
      }
    );
  });
  // Clean up on close
  printWindow.on("closed", () => {
    printWindow = null;
  });
}

// Create Pay Ticket Sub
function createPayTicketSub() {
  payTicketSub = new BrowserWindow({
    parent: mainWindow,
    width: 400,
    height: 150,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  payTicketSub.setMenuBarVisibility(true);
  // Load html into window
  payTicketSub.loadURL(
    url.format({
      pathname: path.join(__dirname, "app/windows/payTicketSub.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  // Quit app when payTicketSub closed
  payTicketSub.on("closed", () => {
    payTicketSub = null;
  });
}

// Create Lost Ticket Sub
function createLostTicketSub() {
  lostTicketSub = new BrowserWindow({
    parent: mainWindow,
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  lostTicketSub.setMenuBarVisibility(true);
  // Load html into window
  lostTicketSub.loadURL(
    url.format({
      pathname: path.join(__dirname, "app/windows/lostTicketSub.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  // Quit app when lostTicketSub closed
  lostTicketSub.on("closed", () => {
    lostTicketSub = null;
  });
}

// Initialize application
app.on("ready", () => {
  createMainWindow();
  createLoginWindow();

  // Get login confirmation
  ipcMain.on("login:successful", (event, user) => {
    mainWindow.show();
    mainWindow.webContents.send("send:user", user);
    loginWindow.close();
  });

  // Get failed login
  ipcMain.on("login:failure", (event, close) => {
    app.quit();
  });

  // Ticket Print Window
  ipcMain.on("send:ticket", (event, data) => {
    // Generate ticket in print window
    if (data.parentWindow == "mainWindow") {
      createPrintWindow("app/templates/receipt.html", data.ticket, mainWindow);
    } else {
      // Won't do much
      createPrintWindow(
        "app/templates/receipt.html",
        data.ticket,
        data.parentWindow
      );
    }
    const options = {
      type: "info",
      title: "Ticket",
      message:
        "Please check the printer for ticket# " + data.ticket.ticketNumber,
      buttons: ["Ok"],
    };
    dialog.showMessageBox(null, options);
  });

  // Receipt Print Window
  ipcMain.on("send:receipt", (event, data) => {
    // Trying to properly set the parent windows
    if (data.parentWindow == "lostTicketSub") {
      createPrintWindow(
        "app/templates/receipt.html",
        data.receipt,
        lostTicketSub
      );
    } else if (data.parentWindow == "payTicketSub") {
      createPrintWindow(
        "app/templates/receipt.html",
        data.receipt,
        payTicketSub
      );
    } else {
      // Won't do much
      createPrintWindow(
        "app/templates/receipt.html",
        data.receipt,
        data.parentWindow
      );
    }
    const options = {
      type: "info",
      title: "Receipt",
      message: "Please check the printer for receipt# " + data.receipt.id,
      buttons: ["Ok"],
    };
    dialog.showMessageBox(null, options);
  });

  // Pay Ticket Window Trigger
  ipcMain.on("send:pay", (event, user) => {
    createPayTicketSub();
    // Need to wait for the window to load before sending the user
    payTicketSub.webContents.once("did-finish-load", () => {
      payTicketSub.webContents.send("send:user", user);
    });
  });

  // Lost Ticket Window Trigger
  ipcMain.on("send:lost", (event, user) => {
    createLostTicketSub();
    // Need to wait for the window to load before sending the user
    lostTicketSub.webContents.once("did-finish-load", () => {
      lostTicketSub.webContents.send("send:user", user);
    });
  });

  // Adjust window size
  ipcMain.on("window:resize", (event, data) => {
    if (data.window == "lostTicketSub") {
      lostTicketSub.setSize(400, data.height);
    } else if (data.window == "payTicketSub") {
      payTicketSub.setSize(400, data.height);
    } else {
      // Nothing yet
    }
  });
});

// Quit app when all windows are closed
app.on("window-all-closed", () => {
  app.quit();
});

// Create menu template
const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Quit",
        accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        },
      },
    ],
  },
];

// Add developer tools option if in dev
if (process.env.NODE_ENV !== "production") {
  mainMenuTemplate.push({
    label: "Developer Tools",
    submenu: [
      {
        role: "reload",
      },
      {
        label: "Toggle DevTools",
        accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
    ],
  });
}
