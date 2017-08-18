const store = new Vuex.Store({
    state: {
        activeExplorer: 'explorer-1'
    },
    mutations: {
        setActiveExplorer: function (state, id) {
            state.activeExplorer = id
        }
    }
})

module.exports = store