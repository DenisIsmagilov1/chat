import Api from '../../services/api';

export default {
  state: {
    mailFolders: [
      { id: 101, name: 'Непрочитанные', type: "unread", img: './static/img/close mail-grey.svg', imgHover: './static/img/close mail.svg' },
      { id: 102, name: 'Прочитанные', type: "read", img: './static/img/open mail-grey.svg', imgHover: './static/img/open mail.svg' },
      { id: 100, name: 'Все диалоги', type: "total", img: './static/img/all folders-grey.svg', imgHover: './static/img/all folders.svg' },
    ],
    programFolders: [
      { id: 200, name: 'Telegram', program: "TL", img: './static/img/telega.png' },
      { id: 203, name: 'Vkontakte', program: "VK", img: './static/img/telega.png' },
      { id: 201, name: 'WhatsApp', program: "WA", img: './static/img/whatsapp.png' },
      { id: 202, name: 'WA Business', program: "GS", img: './static/img/whatsapp.png' },
      { id: 204, name: 'Viber', program: "VB", img: './static/img/group_1.png' },
    ],
    folders: [],
    qtyFolders: null
  },
  mutations: {
    setFolders(state, folders) {
      state.folders = folders
    },
    addFolder(state, folder) {
      state.folders.push(folder)
    },
    setQtyFolders(state, qtyFolders) {
      state.qtyFolders = qtyFolders
    }
  },
  actions: {
    async fetchFoldersRequest({ commit, rootState }) {
      try {
        const { botref, userToken } = rootState.meta;

        const response = await Api.fetchFolders(botref, userToken);

        if (response.data.folders) {
          commit('setFolders', response.data.folders);
        }
      } catch (e) {
        console.log(e)
      }
    },
    async createFolderRequest({ commit, rootState }, folderName) {
      try {
        const { botref, userToken } = rootState.meta;

        const response = await Api.createFolder(botref, userToken, folderName);

        const { success, id, name } = response.data;

        if (success) {
          commit('addFolder', {
            id,
            name
          });
        }
      } catch (e) {
        console.log(e)
      }
    },
    async fetchQtyFoldersRequest({ commit, rootState }) {
      try {
        const { botref, userToken } = rootState.meta;

        const response = await Api.fetchQtyFolders(botref, userToken);

        if (response.data.counts) {
          commit('setQtyFolders', response.data.counts);
        }
      } catch (e) {
        console.log(e)
      }
    },
    async linkFolderRequest({ dispatch, rootState }, { folder_id, unlink }) {
      try {
        const { botref, currentChatId, currentProgram, userToken } = rootState.meta;

        const response = await Api.linkFolder(botref, userToken, currentProgram, currentChatId, folder_id, unlink);

        if (response.data.success) {
          dispatch("fetchChatInfoRequest");
          dispatch("fetchQtyFoldersRequest");
        }

      } catch (e) {
        console.log(e)
      }
    },
    async deleteFolderRequest({ dispatch, rootState }, folder_id) {
      try {
        const { botref, userToken } = rootState.meta;

        const response = await Api.deleteFolder(botref, userToken, folder_id);

        console.log(response)

        if (response.data.success) {
          dispatch("fetchFoldersRequest");
        }

      } catch (e) {
        console.log(e)
      }
    }
  },
  getters: {
    getQtyFolder: (state) => (folder) => {
      if (!state.qtyFolders) return 0;

      if (folder.type) {
        if (folder.type === 'total' || folder.type === 'unread') {
          return state.qtyFolders[folder.type] || 0
        } else {
          return state.qtyFolders["total"] - state.qtyFolders["unread"]
        }
      } else if (folder.program) {
        return state.qtyFolders.program[folder.program] || 0
      } else {
        return state.qtyFolders.folder[folder.id] || 0
      }
    }
  }
}
