const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    title: 'TalentFlow AI',
    icon: path.join(__dirname, '../public/favicon.ico'),
    autoHideMenuBar: true,
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    // Wait a moment for Vite to start before loading
    setTimeout(() => {
      mainWindow.loadURL('http://localhost:5173/');
    }, 2000);
  } else {
    // Load the index.html of the app
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
