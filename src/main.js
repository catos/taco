const path = require('path')

// ------------------------------------------------------------

const electron = require('electron')
const { app, clipboard, globalShortcut, Menu, Tray, BrowserWindow } = electron

// ------------------------------------------------------------

const appMenu = require('./menu')
const appTray = require('./tray')
const appClipboard = require('./clipboard')

// ------------------------------------------------------------

let mainWindow

app.on('ready', _ => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 500
    })

    mainWindow.openDevTools()

    // mainWindow.loadURL(`file://${__dirname}/capture/capture.html`);
    mainWindow.loadURL(`file://${__dirname}/gitstatus/gitstatus.html`);
    
    mainWindow.on('close', _ => {
        mainWindow = null
    })

    globalShortcut.register('CommandOrControl+Alt+D', _ => {
        mainWindow.webContents.send('capture', app.getPath('pictures'))
    })

    appMenu.buildAndSet()
    appTray.create();

    let stack = []
    appClipboard.checkForChange(clipboard, text => {
        stack = appClipboard.addToStack(text, stack)
        appClipboard.registerShortcuts(globalShortcut, clipboard, stack)

        appMenu.template[1].submenu = appClipboard.menuTemplate(clipboard, stack)
        appMenu.buildAndSet()

        console.log('stack', stack);
    })
})

app.on('will-quit', _ => {
    console.log('will-quit!')
    globalShortcut.unregisterAll()
})

app.on('quit', _ => {
    console.log('quit!')
})