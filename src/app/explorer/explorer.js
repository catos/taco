const fs = require('fs')
const path = require('path')
const ipcRenderer = require('electron').ipcRenderer

const ExplorerItem = require('../shared/explorer-item.js')

const HOMEPATH = (process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME
const PARENT_DIRECTORY = new ExplorerItem('..', {
	order: -1,
	path: '..',
	isDirectory: true
})

Vue.component('explorer', {
	template: '#explorer',
	props: ['id'],
	data: function () {
		return {
			path: HOMEPATH,
			pathValue: HOMEPATH,
			fileSuggestions: [],
			files: [PARENT_DIRECTORY],
			summary: {
				total: 0,
				folders: 0,
				files: 0
			}
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
		openFolder: function (folder) {
			this.path = (folder === '..') ?
				path.join(this.path, '..') :
				path.join(this.path, folder)

			if (!this.path.length) {
				this.path = HOMEPATH
			}

			this.getFiles()
		},
		openPath: function () {
			// TODO: open item, not just folder
			this.path = this.pathValue
			this.getFiles()
		},
		autoCompleteSearch: function (event) {
			if (event.which !== 13) {
				let folderPartial = this.pathValue
					.replace(this.path, '')
					.replace(path.sep, '')
					.toLowerCase()

				if (!folderPartial.length) {
					return
				}

				this.fileSuggestions = []
				let self = this
				this.files.find(function (file) {
					if (file.name.toLowerCase().startsWith(folderPartial))
						self.fileSuggestions.push(file.name)
				})
				console.log('folderPartial: ', folderPartial, ', this.fileSuggestions: ', this.fileSuggestions)
			}
		},
		autoCompleteTraverse: function () {
			this.pathValue = path.join(
				this.path,
				this.fileSuggestions[0])
		},
		getFiles: function () {
			// Append trailing slash
			this.path = path.join(this.path, path.sep)

			// Reset path value to current path
			this.pathValue = this.path

			// Init result with '..' and read directory
			let result = [PARENT_DIRECTORY]
			fs.readdir(this.path, (err, files) => {
				if (err) {
					throw err
				}

				for (let fileName of files) {
					let stats = this.fileStats(path.join(this.path, fileName))

					let item = new ExplorerItem(fileName, {
						order: 1,
						path: this.path,
						selected: false,
						isDirectory: stats.isDirectory,
						size: stats.size === undefined ? 0 : stats.size,
						created: stats.created
					})

					if (item.isDirectory) {
						item.order = 0
					}

					result.push(item)
				}
				this.getSummary()
			})

			this.files = result
		},
		getSummary: function () {
			this.summary = {
				total: 0,
				folders: 0,
				files: 0,
				size: 0
			}

			this.files.forEach(function (file) {
				this.summary.size += file.size
				this.summary.total++

				if (file.isDirectory) {
					this.summary.folders++
				} else {
					this.summary.files++
				}
			}, this)
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
	},
	filters: {
		toShortSize: function (value) {
			return ExplorerItem.toShortSize(value)
		}
	}
})
