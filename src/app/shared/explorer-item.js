module.exports = class ExplorerItem {

    constructor(name, params) {
        this.name = name

        let defaults = {
            order: 1,
            path: '',
            selected: false,
            isDirectory: false,
            size: 0,
            created: ''
        }
        let result = Object.assign({},
            defaults,
            params)

        this.order = result.order
        this.path = result.path
        this.selected = result.selected
        this.isDirectory = result.isDirectory
        this.size = result.size
        this.created = result.created
    }

    getIcon() {
        return this.isDirectory ? 'fa-folder-o' : 'fa-file-o'
    }

    static toShortSize(value) {
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
        return result.toLocaleString(undefined, { minimumFractionDigits: 0 }).concat(unit)
    }

    static toByteSize(value) {
        if (!value)
            return ''

        // Format number
        return value.toLocaleString(undefined, { minimumFractionDigits: 0 }).concat(' bytes')
    }
}