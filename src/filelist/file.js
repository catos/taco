const shell = require('electron').shell;
const path = require('path');

Vue.component('file', {
    template: '#file',
    props: ['file'],
    methods: {
        onClick: function (file) {
            console.log('onClick', file);

            if (file.isDirectory)
                this.$emit('change-folder', file.name)

            shell.openItem(path.join(file.path, file.name))
        }
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