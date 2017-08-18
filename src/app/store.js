const store = new Vuex.Store({
    state: {
        count: 0,
        activeFilelist: 'filelist-1'
    },
    mutations: {
        increment: state => state.count++,
        decrement: state => state.count--,
        setActiveFilelist: function (state, id) {
            state.activeFilelist = id
        }
    }
})

module.exports = store