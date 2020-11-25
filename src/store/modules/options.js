import Api from '../../services/api'

export default {
  state: {
    enterSendMessage: true,
    options: {}
  },
  mutations: {
    setOptions(state, options) {
      state.options = options
    },
    removeTemplate(state, id) {
      state.options.templates = state.options.templates.filter(template => template.id !== id)
    },
    toggleEnterSendMessage(state) {
      state.enterSendMessage = !state.enterSendMessage;
    }
  },
  actions: {
    async fetchOptionsRequest({ commit, rootState }) {
      const { botref, userToken } = rootState.meta;

      const response = await Api.fetchOptions(botref, userToken);
      commit('setOptions', response.data)
    },
    async deleteTemplateRequest({ commit, rootState }, id) {
      const { botref, userToken } = rootState.meta;

      const response = await Api.deleteTemplate(botref, userToken, id);

      if (response.data.success) {
        commit('removeTemplate', id)
      }
    },
    async createTemplateRequest({ dispatch, rootState }, template) {
      const { botref, userToken } = rootState.meta;

      const response = await Api.createTemplate(botref, userToken, template);

      if (response.data.success) {
        dispatch('fetchOptionsRequest')
      }
    }
  },
  getters: {
    templates(state) {
      return state.templates
    },
    moderatedTemplates(state) {
      const templates = state.options.templates || []
      return templates.filter(template => template.moderated)
    },
    notModeratedTemplates(state) {
      const templates = state.options.templates || []
      return templates.filter(template => !template.moderated)
    },
    currentTemplate(state, rootState) {
      if (state.templates) {
        const id = rootState.templateId;
        return state.templates.find(template => template.id === id)
      }
      return null
    },
    nickname(state) {
      if (state.options.operator_profile) {
        return (
          state.options.operator_profile.nickname ||
          state.options.operator_profile.login ||
          "Noname"
        );
      }
      return "Noname";
    }
  }
}
