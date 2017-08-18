const store = require('./store')

var app = new Vue({
    el: '#app',
    store,
    data: {},
    computed: {
        count() {
            return this.$store.state.count
        }
    },
    methods: {
        increment: function () {
            store.commit('increment')
        },
        decrement: function () {
            store.commit('decrement')
        }
    }
})