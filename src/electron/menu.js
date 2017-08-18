const electron = require('electron')

const { app, globalShortcut, Menu } = electron
const name = app.getName();

exports.buildAndSet = (window) => {

    globalShortcut.register('CommandOrControl+Q', () => {
        app.quit()
    })

    var template = [
        {
            label: name,
            submenu: [
                {
                    label: `About ${name}`,
                    click: _ => {
                        console.log('About!');
                    },
                    role: 'about'
                },
                {
                    label: 'I am disabled',
                    enabled: false
                },
                {
                    label: 'Focus on explorer path',
                    click: _ => {
                        window.webContents.send('shortcut-path-focus')
                    },
                    accelerator: 'CommandOrControl+T'
                },
                {
                    label: 'Go to Home-folder',
                    click: _ => {
                        window.webContents.send('shortcut-goto-home')
                    },
                    accelerator: 'CommandOrControl+H'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Quit',
                    click: _ => {
                        app.quit()
                    },
                    accelerator: 'CommandOrControl+Q'
                }
            ]
        },
        {
            label: 'Clipboard',
            submenu: []
        }
    ]
        
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}