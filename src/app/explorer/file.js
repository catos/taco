const shell = require('electron').shell
const path = require('path')

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
		dynamicFileSize: function (value) {
			if (!value)
				return ''

			let unit = ' B'
			let result = value

			// Display size in KB
			if (value > 1024) {
				result = Math.round(value / 1024)
				unit = ' KB'
			}

			// Display size in MB
			if (value > 1048576) {
				result = Math.round(value / 1024 / 1024)
				unit = ' MB'
			}

			// Format number
			result = result.toLocaleString(undefined, { minimumFractionDigits: 0 })

			return result.concat(unit)
		},
		byteSize: function (value) {
			if (!value)
				return ''

			// Format number
			value = value.toLocaleString(undefined, { minimumFractionDigits: 0 })

			return value.concat(' KB')
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