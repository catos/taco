const shell = require('electron').shell
const path = require('path')

const ExplorerItem = require('../shared/explorer-item.js')

Vue.component('file', {
	template: '#file',
	props: ['file'],
	data: function () {
		return { 
			selected: false
		}
	},
	methods: {
		onClick: function () {
			this.file.selected = !this.file.selected
		},
		onDblClick: function (file) {
			if (file.isDirectory) {
				this.$emit('open-folder', file.name)
			} else {
				shell.openItem(path.join(file.path, file.name))
			}
		}
	},
	filters: {
		toShortSize: function (value) {
			return ExplorerItem.toShortSize(value)
		},
		toByteSize: function (value) {
			return ExplorerItem.toByteSize(value)
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