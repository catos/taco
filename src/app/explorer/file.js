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
		kbSize: function (value) {
			if (!value)
				return ''

			// Display size in KB
			let result = Math.floor(value / 1024)

			// Min size is 1
			if (result < 1)
				result = 1

			// Format number
			result = result.toLocaleString(undefined, { minimumFractionDigits: 0 })

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