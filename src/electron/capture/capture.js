const electron = require('electron')
const fs = require('fs')
const path = require('path')

const {desktopCapturer, ipcRenderer: ipc, screen } = electron

function getMainSource(desktopCapturer, screen, done) {
    const options = {
        types: ['screen'],
        thumbnailSize: screen.getPrimaryDisplay().workAreaSize
    }

    desktopCapturer.getSources(options, (err, sources) => {
        if (err) {
            return console.log('Cannot capture screen: ', err)
        }

        const isMainSource = source => source.name === 'Entire screen' || source.name === 'Screen 1'
        done(sources.filter(isMainSource)[0])
    })
}

function onCapture(evt, targetPath) {
    getMainSource(desktopCapturer, screen, source => {
        const png = source.thumbnail.toPng()
        const name = `capture-${new Date().getTime()}.png`;
        const filePath = path.join(targetPath, name)
        writeScreenshot(png, filePath)
    })
}

function writeScreenshot(png, filePath) {
    fs.writeFile(filePath, png, err => {
        if (err) {
            return console.log('Failed to write screen: ', err)
        }
    })
}

ipc.on('capture', onCapture)