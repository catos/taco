const electron = require('electron')
const fs = require('fs')
const path = require('path')

function updateFileList(dir, cb) {

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
            let label = file

            result += '<div'
            if (isDir(path.join(dir, file))) {
                result += ' class="directory"'
                label = '/' + file
            }
            result += '>'
            result += label
            result += '</div>'
        }
        document.getElementById('tree-left').innerHTML = result
    });

    cb()
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

// Array.from(document.getElementsByClassName('directory')).forEach(function (item, index, array) {
//     console.log(item)
//     item.addEventListener('mouseup', event => {
//         const dir = event.target.value.trim()
//         console.log('dir', dir)
//         updateFileList(dir)
//     })
// })


updateFileList()