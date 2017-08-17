const path = require('path')

// ------------------------------------------------------------

const electron = require('electron')
const { app, clipboard, globalShortcut, Menu, Tray, BrowserWindow } = electron

// ------------------------------------------------------------

const appMenu = require('./electron/menu')
const appTray = require('./electron/tray')
const appClipboard = require('./electron/clipboard')

// ------------------------------------------------------------

let mainWindow

app.on('ready', _ => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800
    })

    mainWindow.openDevTools()

    // mainWindow.loadURL(`file://${__dirname}/capture/capture.html`);
    // mainWindow.loadURL(`file://${__dirname}/gitstatus/gitstatus.html`);
    // mainWindow.loadURL(`file://${__dirname}/filelist/filelist.html`);
    mainWindow.loadURL(`file://${__dirname}/app/index.html`);
    
    mainWindow.on('close', _ => {
        mainWindow = null
    })

    // GLOBAL shortcuts: only use for focus on app
    globalShortcut.register('CommandOrControl+T', _ => {
        mainWindow.focus()
    })

	// TODO: LOCAL shortcuts && setup / naming convention on shortcuts....
    globalShortcut.register('CommandOrControl+Alt+D', _ => {
        mainWindow.webContents.send('capture', app.getPath('pictures'))
    })

    globalShortcut.register('CommandOrControl+T', _ => {
        mainWindow.webContents.send('shortcut-path-focus', 'weee!')
    })

    globalShortcut.register('Escape', _ => {
        mainWindow.webContents.send('shortcut-escape', 'weee!')
    })

    appMenu.buildAndSet(mainWindow)
    appTray.create();

    let stack = []
    appClipboard.checkForChange(clipboard, text => {
        stack = appClipboard.addToStack(text, stack)
        appClipboard.registerShortcuts(globalShortcut, clipboard, stack)

        appMenu.template[1].submenu = appClipboard.menuTemplate(clipboard, stack)
        appMenu.buildAndSet(mainWindow)

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