const store = new Vuex.Store({
    state: {
        count: 0,
        activeExplorer: 'explorer-1'
    },
    mutations: {
        increment: state => state.count++,
        decrement: state => state.count--,
        setActiveExplorer: function (state, id) {
            state.activeExplorer = id
        }
    }
})

module.exports = store