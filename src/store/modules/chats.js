import Api from '../../services/api'

export default {
  state: {
    loading: false,
    lazyLoading: false,
    isLoaded: false,
    chats: []
  },
  mutations: {
    addChats(state, chats) {
      state.chats = chats
    },
    concatChats(state, chats) {
      state.chats = state.chats.concat(chats)
    },
    addChat(state, newChat) {
      state.chats.push(newChat)
    },
    setLoading(state, loading) {
      state.loading = loading
    },
    lazyAddChats(state, chats) {
      const idChats = state.chats.map(chat => chat.chat + chat.program);
      for (let chat of chats) {
        const chatId = chat.chat + chat.program;
        if (!(idChats.includes(chatId))) {
          state.chats.push(chat)
        }
      }
    },
    setLazyLoading(state, loading) {
      state.lazyLoading = loading
    },
    setLoaded(state, loaded) {
      state.isLoaded = loaded
    }
  },
  actions: {
    async fetchChatsRequest({ commit, rootState }) {
      try {
        commit('setLoading', true)
        commit("setLoaded", false)
        commit("addChats", [])

        const { botref, currentFolder } = rootState.meta;
        let { id, type, program, name } = currentFolder;

        if (type || program) {
          id = undefined
        }

        const chats = await Api.fetchChats(botref, 0, program, id);

        if (chats.data.peers.length > 0 && (name === rootState.meta.currentFolder.name)) {
          const lastMessageTime = chats.data.peers.slice(-1)[0].last_msg_time;

          commit('addChats', chats.data.peers)
          commit('setTime', lastMessageTime)
        } else {
          commit("setLoaded", true)
        }

      } catch (e) {
        console.log(e)
      } finally {
        commit('setLoading', false)
      }
    },
    async lazyChatsRequest({ commit, rootState }) {
      try {
        commit('setLazyLoading', true);

        const { botref, time, currentFolder } = rootState.meta;
        let { id, type, program, name } = currentFolder;

        if (type || program) {
          id = undefined
        }

        const chats = await Api.fetchChats(botref, time, program, id);

        if (chats.data.peers.length > 0 && (name === rootState.meta.currentFolder.name)) {
          const lastMessageTime = chats.data.peers.slice(-1)[0].last_msg_time;

          commit('lazyAddChats', chats.data.peers)
          commit('setTime', lastMessageTime)
        } else {
          commit("setLoaded", true)
        }

      } catch (e) {
        console.log(e)
      } finally {
        commit('setLazyLoading', false)
      }
    },
    async fetchUrgentChats({ commit, state, rootState }) {
      try {
        const { botref } = rootState.meta;

        const chats = await Api.fecthUrgentChats(botref);

        const sosChats = chats.data.sos.map(chat => {
          return {
            ...chat,
            sos: true
          }
        })

        const urgent = [...sosChats, ...chats.data.unread];
        const urgentIds = urgent.map(chat => chat.chat + chat.program);
        const peers = state.chats.filter(chat => !urgentIds.includes(chat.chat + chat.program));
        const newChats = [...urgent, ...peers];

        if (newChats) {
          commit('addChats', newChats)
        }

      } catch (e) {
        console.log(e)
      }
    },
    async updateChats({ commit, state, rootState }) {
      try {

        const { botref, currentFolder } = rootState.meta;
        let { id, type, program } = currentFolder;

        if (type || program) {
          id = undefined
        }

        const chats = await Api.fetchChats(botref, 0, program, id);

        let newChats = state.chats;

        for (let updChat of chats.data.peers) {
          newChats = newChats.map(chat => {
            if ((chat.chat == updChat.chat) && (chat.program == updChat.program) && !chat.searched) {
              return updChat
            }
            return chat
          })
        }
        commit('addChats', newChats);
      } catch (e) {
        console.log(e)
      }
    },
    async updateUrgentChats({ commit, state, rootState }) {
      try {
        const { botref } = rootState.meta;

        const chats = await Api.fecthUrgentChats(botref);

        const sosChats = chats.data.sos.map(chat => {
          return {
            ...chat,
            sos: true
          }
        })

        if (sosChats || chats.data.unread) {
          const updChats = [...sosChats, ...chats.data.unread];

          let newChats = state.chats;

          for (let updChat in updChats) {
            newChats = newChats.map(chat => {
              if ((chat.chat == updChat.chat) && (chat.program == updChat.program)) {
                return updChat
              }
              return chat
            })
          }

          commit('addChats', newChats)

        }

      } catch (e) {
        console.log(e)
      }
    },
    updateChat({ commit, state }, updChat) {
      const updChats = state.chats.map(chat => {
        if ((chat.chat == updChat.chat) && (chat.program == updChat.program)) {
          return updChat
        }
        return chat
      });
      commit('addChats', updChats)
    },
    async onStartChat({ rootState, commit, state }) {
      const { botref, currentChatId, currentProgram } = rootState.meta;

      const response = await Api.onStart(botref, currentProgram, currentChatId);

      if (response.data.is_known) {
        const searchedChat = response.data.selected_peer;
        searchedChat.searched = true;

        const chats = state.chats.filter(chat => chat.botref + chat.chat + chat.program != botref + currentChatId + currentProgram)
        commit("setIsKnown")
        commit("addChats", [...chats, searchedChat])
      }
    },
    resetUnreadMessages({ commit, rootState, state }) {
      const { botref, currentChatId, currentProgram } = rootState.meta;

      const chats = state.chats.map(chat => {
        if (chat.botref + chat.chat + chat.program == botref + currentChatId + currentProgram) {
          chat.unread_msg_count = 0;
        }
        return chat;
      });

      commit("addChats", chats);
    }
  },
  getters: {
    chatsLength(state) {
      return state.chats.length
    },
    getSortChats(state, rootGetter, rootState) {
      let chats;
      if (!rootState.meta.search && rootState.meta.currentFolder.type === "read") {
        chats = [...state.chats].filter(chat => chat.unread_msg_count === 0);
      } else {
        chats = [...state.chats];
      }

      return chats.sort((mess1, mess2) => {
        if (mess1.searched) {
          return -1
        } else if (mess2.searched) {
          return 1
        }

        if (mess1.sos === mess2.sos) {
          if (mess1.unread_msg_count === mess2.unread_msg_count) {
            return mess2.last_msg_time - mess1.last_msg_time
          } else {
            return mess2.unread_msg_count - mess1.unread_msg_count
          }
        } else {
          return mess1.sos ? -1 : 1
        }
      })
    },
    currentChat(state, getters, rootState) {
      const { currentChatId, currentProgram } = rootState.meta;

      return state.chats.find(item => item.chat + item.program === currentChatId + currentProgram) || null
    },
    getChatsByGroupId: (state, getters) => id => {
      return getters.getSortChats.filter(chat => chat.folder_id === id);
    },
    getChatsByProgram: (state, getters) => program => {
      return getters.getSortChats.filter(chat => chat.program === program);
    },
    getChatsByType: (state, getters) => type => {
      if (type === 'read') {
        return getters.getSortChats.filter(chat => chat.unread_msg_count === 0);
      } else if (type === "unread") {
        return getters.getSortChats.filter(chat => chat.unread_msg_count !== 0);
      } else {
        return getters.getSortChats
      }

    }
  }
}