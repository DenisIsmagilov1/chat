import Api from '../../services/api'

export default {
  state: {
    isLoading: false,
    isLazyLoading: false,
    isLoaded: false,
    lastMessageId: 0,
    freshMessageId: null,
    templateId: null,
    text: '',
    files: [],
    messages: [],
    needUpdate: true,
    sendedMessage: false,
    updatedMessage: false,
    once: false,
  },
  mutations: {
    setMessages(state, messages) {
      state.messages = messages
    },
    setNeedUpdate(state, bool) {
      state.needUpdate = bool
    },
    concatMessages(state, messages) {
      state.messages = state.messages.concat(messages)
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
    setLoadedMessages(state, stateLoaded) {
      state.isLoaded = stateLoaded
    },

    setLastMessageId(state, id) {
      state.lastMessageId = id
    },
    setFreshMessageId(state, id) {
      state.freshMessageId = id
    },
    setTemplateId(state, id) {
      if (state.templateId === id) {
        state.templateId = null;
      } else {
        state.templateId = id;
      }
    },
    nullTemplateId(state) {
      state.templateId = null;
    },
    updateText(state, text) {
      state.text = text;
    },
    setFiles(state, files) {
      state.files = files
    },
    pushFiles(state, files) {
      state.files.push(files)
    },
    setReadStatus(state) {
      state.messages[0].status = "seen"
    },
    setSendedMessage(state, bool) {
      state.sendedMessage = bool;
    },
    setOnce(state, bool) {
      state.once = bool
    },
    setUpdatedMessage(state, bool) {
      state.updatedMessage = bool;
    }
  },
  actions: {
    async fetchFirstMessagesRequest({ commit, rootState }) {
      try {
        commit('setMessages', [])
        commit('setLoadedMessages', false)
        commit('setLoadingMessages', true)

        const { botref, currentChatId, currentProgram, userToken } = rootState.meta;

        const response = await Api.fetchMessagesHistory(botref, userToken, currentProgram, currentChatId, 0);

        if (response.data.messages.length) {
          const messages = response.data.messages;

          commit('setMessages', messages)
          commit('setLastMessageId', messages.slice(-1)[0].id)
          commit('setFreshMessageId', messages[0].id)

          if (messages.length < 32) {
            commit('setLoadedMessages', true)
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

          const { botref, currentChatId, currentProgram, userToken } = rootState.meta;
          let { lastMessageId } = state;
          lastMessageId = -lastMessageId;

          const response = await Api.fetchMessagesHistory(botref, userToken, currentProgram, currentChatId, lastMessageId);

          if (response.data.messages.length && (currentChatId === rootState.meta.currentChatId)) {
            const messages = response.data.messages;

            commit('concatMessages', messages)
            commit('setLastMessageId', messages.slice(-1)[0].id)

            if (messages.length < 32) {
              commit('setLoadedMessages', true)
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
      if (state.freshMessageId && !state.updatedMessage) {
        try {
          commit("setUpdatedMessage", true)
          const { botref, currentChatId, currentProgram, userToken } = rootState.meta;
          let { freshMessageId } = state;

          const response = await Api.fetchMessagesHistory(botref, userToken, currentProgram, currentChatId, freshMessageId);

          if (response.data.messages.length && (currentChatId === rootState.meta.currentChatId)) {
            const messages = response.data.messages;

            commit('setStartMessages', messages)
            commit('setFreshMessageId', messages[0].id)
            //commit('setReadStatus')
          }

        } catch (e) {
          console.log(e)
        } finally {
          commit("setUpdatedMessage", false)
        }
      }
    },
    async writeFirstRequest({ commit, dispatch, state, rootState }, { phone, message }) {
      const { botref, userToken } = rootState.meta;
      const { templateId } = state;

      const response = await Api.writeFirst(botref, userToken, phone, message, templateId);

      commit("setTemplateId", null)

      if (response.data.peer) {

        const newChat = {
          ...response.data.peer,
          last_msg_text: response.data.msg_text
        };

        if (!rootState.chats.chats.map((chat) => chat.chat + chat.program).includes(newChat.chat + newChat.program)) {
          commit("addChat", newChat);
        }
        console.log(newChat)
        commit("setChatId", newChat.chat);
        commit("setProgram", newChat.program);
        dispatch("fetchChatInfoRequest");
        dispatch("fetchFirstMessagesRequest");
      }
    },
    async sendMessage({ dispatch, commit, state, rootState }) {
      try {
        if (!state.sendedMessage) {
          const { text, files, templateId } = state;
          commit("updateText", '')
          const { botref, currentChatId, currentProgram, userToken } = rootState.meta;

          const response = await Api.sendMessage(botref, userToken, currentProgram, currentChatId, text, files, templateId);

          commit('closePopups');
          console.log(response)
          if (response.data.success) {
            dispatch('updateMessages')
            commit("setFiles", [])
            commit("setTemplateId", null)
            commit("setConnected")
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    resendMessage({ dispatch, commit }, text) {
      commit('updateText', text);
      dispatch('sendMessage');
    },
    async unreadMessagesRequest({ rootState }) {
      try {
        const { botref, currentChatId, currentProgram, userToken } = rootState.meta;

        Api.unreadMessages(botref, userToken, currentProgram, currentChatId);

      } catch (e) {
        console.log(e)
      }
    },
    async searchAllChats({ commit, rootState }, query) {
      try {
        const { botref, userToken } = rootState.meta;

        const response = await Api.searchMessages(botref, userToken, query);

        if (response.data.peers) {
          let chats = response.data.peers;
          const messages = response.data.messages;

          chats = chats.map(chat => {
            const message = messages.find(m => m.botref + m.chat + m.program == chat.botref + chat.chat + chat.program)
            chat.last_msg_text = message.text
            return chat
          })

          commit("addChats", chats);
        }
        if (response.data.messages) {
          commit("setSearchMessages", response.data.messages);
        }

      } catch (e) {
        console.log(e)
      }
    },
    async fetchSearchMessage({ commit, rootState }) {
      try {
        const { searchMessages, botref, currentChatId, currentProgram, userToken } = rootState.meta;

        let message = searchMessages.find(message => message.botref == botref & message.chat == currentChatId & message.program == currentProgram)
        message.searched = 'searched';

        const oldresponse = await Api.fetchMessagesHistory(botref, userToken, currentProgram, currentChatId, message.id);
        const newresponse = await Api.fetchMessagesHistory(botref, userToken, currentProgram, currentChatId, -message.id);

        const messages = [...oldresponse.data.messages, message, ...newresponse.data.messages];

        commit("setLastMessageId", messages.slice(-1)[0].id)
        commit("setFreshMessageId", messages[0].id)
        commit("setMessages", messages);

      } catch (e) {
        console.log(e)
      }
    },
    async searchInChat({ commit, dispatch, rootState }, query) {
      try {
        commit("setIndexMessage", 0)
        const { botref, currentProgram, currentChatId, userToken } = rootState.meta;

        const response = await Api.searchMessages(botref, userToken, query, currentProgram, currentChatId);

        if (response.data.messages) {
          commit("setSearchChatMessages", response.data.messages);
          dispatch("fetchSearchMessageChat")
        }

      } catch (e) {
        console.log(e)
      }
    },
    async fetchSearchMessageChat({ commit, rootState }, index = 0) {
      try {
        const { searchChatMessages, botref, currentChatId, currentProgram, userToken } = rootState.meta;

        let message = searchChatMessages[index]
        if (message) {
          message.searched = 'searched';

          const oldresponse = await Api.fetchMessagesHistory(botref, userToken, currentProgram, currentChatId, message.id);
          const newresponse = await Api.fetchMessagesHistory(botref, userToken, currentProgram, currentChatId, -message.id);

          const messages = [...oldresponse.data.messages, message, ...newresponse.data.messages];

          commit("setLastMessageId", messages.slice(-1)[0].id)
          commit("setFreshMessageId", messages[0].id)
          commit("setMessages", messages);
          commit("setIndexMessage", index);
        }

      } catch (e) {
        console.log(e)
      }
    },
    async updateStatusMessage({ rootState, state, commit }) {
      const { botref, currentChatId, currentProgram, userToken } = rootState.meta;
      const sentMessages = state.messages.filter(mess => mess.status != "seen");
      const sentMessagesId = sentMessages.map(mess => mess.id).join(',')

      const response = await Api.updateStatusMessage(botref, userToken, currentProgram, currentChatId, sentMessagesId);

      if (response) {

        const seenMessagesId = [];
        for (let key in response.data) {

          if (response.data[key] == "seen") {
            seenMessagesId.push(key)
          }
        }

        let change = false;
        const updMessages = state.messages.map(mess => {
          if (seenMessagesId.includes(String(mess.id))) {
            mess.status = "seen";
            change = true
          }
          return mess;
        })

        if (change)
          commit("setMessages", updMessages)
      }
    }
  },
  getters: {
    templateId(state) {
      return state.templateId;
    }
  }
}