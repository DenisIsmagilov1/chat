import Api from '../../services/api'

export default {
  state: {
    isLoading: false,
    isLazyLoading: false,
    isLoaded: false,
    lastMessageId: 0,
    freshMessageId: null,
    messages: []
  },
  mutations: {
    setMessages(state, messages) {
      state.messages = messages
    },
    concatMessages(state, messages) {
      state.messages = messages.concat(state.messages)
    },
    setStartMessages(state, messages) {
      state.messages = [...messages, ...state.messages]
    },

    setLoadingMessages(state, loadingState) {
      state.isLoading = loadingState
    },
    setLazyLoading(state, loadingState) {
      state.isLazyLoading = loadingState
    },
    setLoaded(state, stateLoaded) {
      state.isLoaded = stateLoaded
    },

    setLastMessageId(state, id) {
      state.lastMessageId = id
    },
    setFreshMessageId(state, id) {
      state.freshMessageId = id
    },
  },
  actions: {
    async fetchFirstMessagesRequest({ commit, rootState }) {
      try {
        commit('setMessages', [])
        commit('setLoaded', false)
        commit('setLoadingMessages', true)

        const { botref, currentChatId, currentProgram } = rootState.meta;

        const response = await Api.fetchMessagesHistory(botref, currentProgram, currentChatId, 0);

        if (response.data.messages.length) {
          const messages = response.data.messages;

          commit('setMessages', messages)
          commit('setLastMessageId', messages.slice(-1)[0].id)
          commit('setFreshMessageId', messages[0].id)

          if (messages.length < 32) {
            commit('setLoaded', true)
          }
        }
      } catch (e) {
        console.log(e)
      } finally {
        commit('setLoadingMessages', false)
      }
    },
    async lazyLoadMessages({ commit, state, rootState }) {
      if (!state.isLoaded && !state.isLazyLoading) {
        try {
          commit('setLazyLoading', true)

          const { botref, currentChatId, currentProgram } = rootState.meta;
          let { lastMessageId } = state;
          lastMessageId = -lastMessageId;
          const saveChatId = currentChatId;

          const response = await Api.fetchMessagesHistory(botref, currentProgram, currentChatId, lastMessageId);

          if (response.data.messages.length && (saveChatId === currentChatId)) {
            const messages = response.data.messages;

            commit('concatMessages', messages)
            commit('setLastMessageId', messages.slice(-1)[0].id)

            if (messages.length < 32) {
              commit('setLoaded', true)
            }
          }

        } catch (e) {
          console.log(e)
        } finally {
          commit('setLazyLoading', false)
        }
      }
    },
    async updateMessages({ commit, state, rootState }) {
      if (state.freshMessageId) {
        try {
          const { botref, currentChatId, currentProgram } = rootState.meta;
          let { freshMessageId } = state;
          const saveChatId = currentChatId;

          const response = await Api.fetchMessagesHistory(botref, currentProgram, currentChatId, freshMessageId);

          if (response.data.messages.length && (saveChatId === currentChatId)) {
            const messages = response.data.messages;

            commit('setStartMessages', messages)
            commit('setFreshMessageId', messages[0].id)
          }

        } catch (e) {
          console.log(e)
        }
      }
    },
    async createMessage() {

    }
  },

  getters: {
  }
}