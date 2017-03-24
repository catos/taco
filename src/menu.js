const electron = require('electron')

const { app, globalShortcut, Menu } = electron
const name = app.getName();

exports.template = [
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

exports.buildAndSet = _ => {

    globalShortcut.register('CommandOrControl+Q', () => {
        app.quit()
    })

    Menu.setApplicationMenu(Menu.buildFromTemplate(this.template))
}