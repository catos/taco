const electron = require('electron')
const { app, globalShortcut, BrowserWindow } = electron

// ------------------------------------------------------------

const appMenu = require('./menu')
const appTray = require('./tray')
// const appClipboard = require('./clipboard')

// ------------------------------------------------------------

let mainWindow = null

app.on('ready', function () {
	mainWindow = new BrowserWindow({
		width: 1600,
		height: 900
	})

	mainWindow.openDevTools()

	// mainWindow.loadURL(`file://${__dirname}/capture/capture.html`);
	// mainWindow.loadURL(`file://${__dirname}/gitstatus/gitstatus.html`);
	mainWindow.loadURL('file://' + __dirname + '/../app/index.html')

	mainWindow.on('close', function () {
		mainWindow = null
	})

	// GLOBAL shortcuts: only use for focus on app
	// globalShortcut.register('CommandOrControl+T', function ()  {
	//     mainWindow.focus()
	// })

	// TODO: LOCAL shortcuts && setup / naming convention on shortcuts....
	globalShortcut.register('CommandOrControl+Alt+D', function () {
		mainWindow.webContents.send('capture', app.getPath('pictures'))
	})

	globalShortcut.register('Escape', function () {
		mainWindow.webContents.send('shortcut-escape', 'weee!')
	})

	appMenu.buildAndSet(mainWindow)
	appTray.create()

	// let stack = []
	// appClipboard.checkForChange(clipboard, text => {
	//     stack = appClipboard.addToStack(text, stack)
	//     appClipboard.registerShortcuts(globalShortcut, clipboard, stack)

	//     appMenu.template[1].submenu = appClipboard.menuTemplate(clipboard, stack)
	//     appMenu.buildAndSet(mainWindow)

	//     console.log('stack', stack);
	// })
})

app.on('will-quit', function () {
	console.log('will-quit!')
	globalShortcut.unregisterAll()
})

app.on('quit', function () {
	console.log('quit!')
})