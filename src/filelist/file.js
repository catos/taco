Vue.component('file', {
    template: '#file',
    props: ['file'],
    methods: {
        changeFolder: function (folder) {
            console.log('file -> changeFolder', folder);
            this.$emit('change-folder', folder)
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