const fs = require('fs')
const path = require('path')
const ipcRenderer = require('electron').ipcRenderer

const HOMEPATH = (process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME
const PARENT_DIRECTORY = {
	order: -1,
	name: '..',
	iconClass: 'fa-folder-o',
	isDirectory: true
}

Vue.component('explorer', {
	template: '#explorer',
	props: ['id'],
	data: function () {
		return {
			path: HOMEPATH,
			files: [PARENT_DIRECTORY]
		}
	},
	created: function () {
		this.getFiles()
	},
	mounted: function () {
		ipcRenderer.on('shortcut-path-focus', () => {
			this.$refs.path.focus()
		})

		ipcRenderer.on('shortcut-goto-home', () => {
			if (this.$store.state.activeExplorer === this.id) {
				this.path = HOMEPATH
				this.getFiles()
			}
		})

		ipcRenderer.on('shortcut-escape', () => {
			this.files.forEach((file) => {
				file.selected = false
			}, this)
		})
	},
	computed: {
		sortedFiles: function () {
			let cmp = function (a, b) {
				if (a > b) return +1
				if (a < b) return -1
				return 0
			}

			return this.files
				.sort(function (a, b) {
					return cmp(a.order, b.order) || cmp(a.name, b.name)
				})
		},
		isActive: function () {
			return this.$store.state.activeExplorer === this.id
		}
	},
	methods: {
		onMouseOver: function () {
			this.$store.commit('setActiveExplorer', this.id)
		},
		changeFolder: function (folder) {
			this.path = (folder === '..') ?
				path.join(this.path, '..') :
				path.join(this.path, folder)

			if (!this.path.length) {
				this.path = HOMEPATH
			}

			this.getFiles()
		},
		getFiles: function () {
			let result = [PARENT_DIRECTORY]

			fs.readdir(this.path, (err, files) => {
				if (err) {
					throw err
				}

				for (let file of files) {
					let stats = this.fileStats(path.join(this.path, file))

					let entry = {
						order: 1,
						name: file,
						path: this.path,
						iconClass: 'fa-file-o',
						selected: false,
						isDirectory: stats.isDirectory,
						size: stats.size,
						created: stats.created
					}

					if (entry.isDirectory) {
						entry.order = 0
						entry.iconClass = 'fa-folder-o'
					}

					result.push(entry)
				}
			})
			this.files = result
		},
		fileStats: function (path) {
			try {
				let stats = fs.lstatSync(path)

				return {
					isDirectory: stats.isDirectory(),
					size: stats.size,
					created: stats.ctime.toISOString()
				}
			} catch (e) {
				return false
			}
		},
	}
})
