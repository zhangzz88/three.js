import { createStore } from 'vuex'

export default createStore({
  state: {
    //three页面的自适应高度和宽度
    threeJsWidth: 0,
    threeJsHeight: 0,
  },
  getters: {
    getFnn1(state) {
      return state
    },
  },
  mutations: {
    editThee(state, { threeJsWidth, threeJsHeight }) {
      state.threeJsWidth = threeJsWidth
      state.threeJsHeight = threeJsHeight - 50
    },
  },
  actions: {},
  modules: {},
})
