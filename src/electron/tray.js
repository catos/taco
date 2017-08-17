const electron = require('electron')
const path = require('path')

const { app, Tray, Menu } = electron
const name = app.getName();

exports.template = [
    {
        label: 'Quit',
        click: _ => {
            app.quit()
        },
        accelerator: 'CmdOrCtrl+W'
    }
]


exports.create = _ => {
    const tray = new Tray(path.join('src', 'electron/images/electron-icon.png'))

    let menu = Menu.buildFromTemplate(this.template);
    tray.setContextMenu(menu)

    tray.setToolTip(`My great ${name}!`)
}
