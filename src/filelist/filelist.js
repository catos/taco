const electron = require('electron')
const fs = require('fs')

function updateFileList(dir) {
    fs.readdir(dir, (err, files) => {
        if (err) {
            throw err;
        }

        for (let file of files) {
            console.log(file);
        }
    });
}

function isDir(dir) {
    try {
        return fs.lstatSync(dir).isDirectory()
    } catch (e) {
        return false
    }
}

document.getElementById('dir').addEventListener('keyup', event => {
    const dir = event.target.value.trim()
    if (event.code === 'Enter' && isDir(dir)) {
        updateFileList(dir)
    }
})