const fs = require('fs')
const path = require('path')
const ipcRenderer = require('electron').ipcRenderer

const DEFAULT_PATH = (process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME
const PARENT_DIRECTORY = {
    order: -1,
    name: '..',
    isDirectory: true
}

Vue.component('filelist', {
    template: '#filelist',
    data: function () {
        return {
            path: DEFAULT_PATH,
            files: [PARENT_DIRECTORY]
        }
    },
    created: function () {
        this.getFiles()
    },
    mounted: function () {
        ipcRenderer.on('shortcut-path-focus', (event, message) => {
            this.$refs.path.focus()
		})
		
        ipcRenderer.on('shortcut-escape', (event, message) => {
            this.files.forEach((file) => {
				file.selected = false
			}, this);
        })
    },
    computed: {
        sortedFiles: function () {
            var cmp = function (a, b) {
                if (a > b) return +1;
                if (a < b) return -1;
                return 0;
            }

            return this.files
                .sort(function (a, b) {
                    return cmp(a.order, b.order) || cmp(a.name, b.name)
                })
        }
    },
    methods: {
        onChangeFolder: function (folder) {
            this.path = (folder === '..') ?
                path.join(this.path, '..') :
                path.join(this.path, folder)

            if (!this.path.length) {
                this.path = DEFAULT_PATH
            }

            this.getFiles()
        },
        getFiles: function () {
            var result = [PARENT_DIRECTORY]

            fs.readdir(this.path, (err, files) => {
                if (err) {
                    throw err;
                }

                for (let file of files) {
                    var stats = fs.lstatSync(path.join(this.path, file))

                    var entry = {
                        order: 1,
                        name: file,
						path: this.path,
						selected: false,
                        isDirectory: stats.isDirectory(),
                        size: stats.size,
                        created: stats.ctime.toISOString()
                    }

                    if (entry.isDirectory)
                        entry.order = 0

                    result.push(entry)
                }
            })
            this.files = result
        },
        // TODO: may want this to be separate method
        // fileStats: function (dir) {
        //     try {
        //         var stats = fs.lstatSync(dir)

        //         return {
        //             isDirectory: stats.isDirectory(),
        //             size: stats.size,
        //             created: stats.ctime.toISOString()
        //         }
        //     } catch (e) {
        //         return false
        //     }
        // },
    }
})
