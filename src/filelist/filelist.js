const fs = require('fs')
const path = require('path')

const DELIMITER = '\\'
const PARENT_DIRECTORY = {
    order: -1,
    name: '..',
    stats: {
        isDirectory: true
    }
}

Vue.component('filelist', {
    // template: '#filelist',
    template: `
        <div class="filelist">
            <div class="mdl-textfield mdl-js-textfield">
                <input id="path" class="mdl-textfield__input" type="text" v-model="path" @keyup.enter="getFiles()" />
                <label class="mdl-textfield__label" for="path">Path</label>
            </div>                
            <table class="mdl-data-table mdl-js-data-table">
                <tr class="file" v-bind:class="{ folder: file.stats.isDirectory }" v-for="file in sortedFiles" @click="gotoFolder(file.name)">
                    <td class="mdl-data-table__cell--non-numeric">{{ file.name }}</td>    
                    <td class="size">{{ file.stats.size | kbSize }}</td>
                    <td class="created">{{ file.stats.created | toShortDate }}</td>
                </tr>
            </table>
        </div>
    `,
    data: function () {
        return {
            path: DELIMITER,
            files: [PARENT_DIRECTORY]
        }
    },
    created: function () {
        this.getFiles()
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
        gotoFolder: function (folder) {
            if (folder === '..') {
                this.path = this.path.substring(0, this.path.lastIndexOf(DELIMITER))
            } else {
                this.path = path.join(this.path, folder)
            }

            if (!this.path.length) {
                this.path = DELIMITER
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
                    var stats = this.fileStats(path.join(this.path, file))

                    var entry = {
                        order: 1,
                        name: file,
                        stats: stats
                    }

                    if (stats.isDirectory)
                        entry.order = 0

                    result.push(entry)
                }
            })
            this.files = result
        },
        fileStats: function (dir) {
            try {
                var stats = fs.lstatSync(dir)

                return {
                    isDirectory: stats.isDirectory(),
                    size: stats.size,
                    created: stats.ctime.toISOString()
                }
            } catch (e) {
                return false
            }
        },
    },
    filters: {
        kbSize: function (value) {
            if (!value)
                return ''

            var result = Math.floor(value / 1024)

            if (result < 1)
                result = 1

            return result + ' KB'
        },
        toShortDate: function (value) {
            if (!value)
                return ''

            if (value.length < 10)
                return value

            return value.slice(0, 10)
        }
    }
})
