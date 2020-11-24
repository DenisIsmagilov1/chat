import Api from '../../services/api';

export default {
  state: {
    botref: '', // 62b769d71658
    currentChatId: null,
    chatInfo: null,
    currentProgram: null,
    currentFolder: { id: 100, name: 'Все диалоги', type: "total", img: './static/img/all folders-grey.svg', imgHover: './static/img/all folders.svg' },
    time: 0,
    popups: [
      { title: "write first", open: false },
      { title: "templates", open: false },
      { title: "settings", open: false },
      { title: "files", open: false },
    ],
    newChatPopup: false,
    newChatTemplatePopup: false,
    foldersIsOpen: false,
    chatInfoOpen: false,
    search: false,
    searchMessages: [],
    searchChatMessages: [],
    indexMessage: 0,
    isKnown: false
  },
  mutations: {
    setIsKnown(state) {
      state.isKnown = true;
    },
    setBotref(state, botref) {
      state.botref = botref;
    },
    toggleNewChatPopup(state) {
      state.newChatPopup = !state.newChatPopup
    },
    setChatId(state, chatId) {
      state.currentChatId = chatId
    },
    setProgram(state, program) {
      state.currentProgram = program
    },
    setTime(state, time) {
      state.time = time
    },
    toggleOpenFolders(state) {
      state.foldersIsOpen = !state.foldersIsOpen
    },
    setFolder(state, folder) {
      state.currentFolder = folder
    },
    setChatInfo(state, chatInfo) {
      state.chatInfo = chatInfo
    },
    toggleChatInfo(state) {
      state.chatInfoOpen = !state.chatInfoOpen
    },
    toggleNewChatTemplatePopup(state) {
      state.newChatTemplatePopup = !state.newChatTemplatePopup
    },
    setNewChatTemplatePopup(state, bool) {
      state.newChatTemplatePopup = bool
    },
    openPopup(state, title) {
      state.popups = state.popups.map(popup => {
        if (popup.title === title) {
          popup.open = true;
        } else {
          popup.open = false
        }
        return popup;
      })
    },
    closePopups(state) {
      state.popups = state.popups.map(popup => {
        popup.open = false;
        return popup;
      })
    },
    setConnected(state) {
      state.chatInfo.is_connected = true;
    },
    setSearch(state, bool) {
      state.search = bool;
    },
    setSearchMessages(state, messages) {
      state.searchMessages = messages
    },
    setSearchChatMessages(state, messages) {
      state.searchChatMessages = messages
    },
    setIndexMessage(state, index) {
      state.indexMessage = index;
    }
  },
  actions: {
    async fetchChatInfoRequest({ state, commit }) {
      try {
        const { currentChatId, botref, currentProgram } = state;

        const response = await Api.fetchChatInfo(botref, currentProgram, currentChatId);

        if (response.data && (currentChatId === state.currentChatId)) {
          commit('setChatInfo', response.data)
        }

      } catch (e) {
        console.log(e)
      }
    },
    async leaveChat({ commit }) {
      try {
        // const { currentChatId, botref, currentProgram, chatInfo } = state;

        // if (chatInfo.is_connected) {
        const response = true //await Api.leaveChat(botref, currentProgram, currentChatId);

        if (response) {
          commit("setChatId", null);
          commit("setProgram", null);
          commit("setChatInfo", null);
          commit("setMessages", []);
        }
        // }
      } catch (e) {
        console.log(e)
      }
    },
    async leaveChatRequest({ commit, state }) {
      try {
        const { currentChatId, botref, currentProgram, chatInfo } = state;

        if (chatInfo.is_connected) {
          const response = await Api.leaveChat(botref, currentProgram, currentChatId);

          if (response) {
            commit("setChatId", null);
            commit("setProgram", null);
            commit("setChatInfo", null);
            commit("setMessages", []);
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    async toggleBanChatRequest({ state, dispatch }) {
      try {
        const { currentChatId, botref, currentProgram, chatInfo } = state;
        const { is_banned } = chatInfo;

        const response = await Api.toggleBanChat(botref, currentProgram, currentChatId, is_banned);

        if (response.data.success) {
          dispatch("fetchChatInfoRequest")
        }

      } catch (e) {
        console.log(e)
      }
    }
  },
  getters: {
    getStatusPopup: (state) => (title) => {
      const popup = state.popups.find(popup => popup.title === title);
      return popup.open || false;
    },
    currentChatId(state) {
      return state.currentChatId;
    },
    currentProgram(state) {
      return state.currentProgram;
    },
    chatIsConnected(state) {
      if (state.chatInfo) {
        return state.chatInfo.is_connected || false;
      }

      return false
    },
    isBannedChat(state) {
      if (state.chatInfo) {
        return state.chatInfo.is_banned;
      }
      return true;
    }
  }
}