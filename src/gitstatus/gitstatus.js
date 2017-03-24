let fs = require('fs')
let exec = require('child_process').exec
let os = require('os')

let timer

function isDir(dir) {
    try {
        return fs.lstatSync(dir).isDirectory()
    } catch (e) {
        return false
    }
}

function checkGitStatus(dir) {
    exec('git status', {
        cwd: dir
    }, (err, stdout, stderr) => {
        console.log('err', err);
        console.log('stdout', stdout);
        console.log('stderr', stderr);

        if (err) {
            return setStatus('unknown')
        }

        if (/nothing to commit/.test(stdout)) {
            return setStatus('clean')
        }

        return setStatus('dirty')
    })
}

function formatDir(dir) {
    return /^~/.test(dir)
        ? os.homedir() + dir.substr(1).trim()
        : dir.trim()
}

function removeStatus() {
    const el = document.getElementById('status')
    el.classList.remove('unknown', 'clean', 'dirty')
    return el
}

function setStatus(status) {
    const el = removeStatus()
    el.classList.add(status);
}


document.getElementById('dir').addEventListener('keyup', event => {
    clearTimeout(timer)
    removeStatus()
    timer = setTimeout(_ => {
        const dir = formatDir(event.target.value)

        if (isDir(dir)) {
            checkGitStatus(dir)
        }
    }, 500)
})