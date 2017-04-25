const electron = require('electron')
const fs = require('fs')

function updateFileList(dir) {
    
    if (!dir) {
        dir = 'c:\\'
    }
console.log('dir', dir);
    var result = ""
    fs.readdir(dir, (err, files) => {
        if (err) {
            throw err;
        }

        for (let file of files) {
            // console.log(file);
            result += file + "<br />"
        }
        document.getElementById('tree-left').innerHTML = result
    });
    console.log('result', result)
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

updateFileList()