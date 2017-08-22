const electron = require('electron')
const { app, globalShortcut, BrowserWindow } = electron
const electronLocalshortcut = require('electron-localshortcut')

let win = null

app.on('ready', function () {
	win = new BrowserWindow({
		width: 1600,
		height: 900,
		frame: false,
	})

	win.openDevTools()
	win.loadURL('file://' + __dirname + '/../app/index.html')

	win.on('close', function () {
		win = null
		electronLocalshortcut.unregisterAll(win)
		console.log('win.on -> close')
	})

	// Local shortcuts
	electronLocalshortcut.register(win, 'CommandOrControl+H', () => {
		win.webContents.send('shortcut-goto-home')
	})

	electronLocalshortcut.register(win, 'Escape', () => {
		win.webContents.send('shortcut-escape')
	})

	electronLocalshortcut.register(win, 'CommandOrControl+T', () => {
		win.webContents.send('shortcut-focus-path')
	})
})

app.on('will-quit', function () {
	console.log('will-quit!')
	globalShortcut.unregisterAll()
})

app.on('quit', function () {
	console.log('quit!')
})