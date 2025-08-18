const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'

// Keep a global reference of the window object
let mainWindow

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../src/assets/images/header/logo2.png'),
    show: false, // Don't show until ready-to-show
    titleBarStyle: 'default'
  })

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    // Open DevTools in development
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    
    // Focus on window
    if (isDev) {
      mainWindow.focus()
    }
  })

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    // Dereference the window object
    mainWindow = null
  })

  // Handle window controls via IPC or other events here
  mainWindow.webContents.on('new-window', (event, navigationUrl) => {
    // In this example, we'll ask the operating system
    // to open this event's url in the default browser.
    event.preventDefault()
    require('electron').shell.openExternal(navigationUrl)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  createWindow()

  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Security: Prevent navigation to external websites
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl)
    
    if (parsedUrl.origin !== 'http://localhost:5173' && parsedUrl.origin !== 'file://') {
      event.preventDefault()
    }
  })
})

// Handle app protocol for deep linking (optional)
app.setAsDefaultProtocolClient('enjoy-admin')

// IPC handlers
ipcMain.handle('app-version', () => {
  return app.getVersion()
})

ipcMain.handle('platform', () => {
  return process.platform
})

// Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault()
    require('electron').shell.openExternal(navigationUrl)
  })
})

// Set application menu (optional)
// Remove menu bar for all environments
Menu.setApplicationMenu(null)