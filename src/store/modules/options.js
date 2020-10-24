import Api from '../../services/api'

export default {
  state: {
    options: {}
  },
  mutations: {
    setOptions(state, options) {
      state.options = options
    },
    removeTemplate(state, id) {
      state.options.templates = state.options.templates.filter(template => template.id !== id)
    }
  },
  actions: {
    async fetchOptionsRequest({ commit, rootState }) {
      const { botref } = rootState.meta;

      const response = await Api.fetchOptions(botref);

      commit('setOptions', response.data)
    },
    async deleteTemplateRequest({ commit, rootState }, id) {
      const { botref } = rootState.meta;

      const response = await Api.deleteTemplate(botref, id);

      if (response.data.success) {
        commit('removeTemplate', id)
      }
    },
    async createTemplateRequest({ dispatch, rootState }, template) {
      const { botref } = rootState.meta;

      const response = await Api.createTemplate(botref, template);
      console.log(response)

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
    }
  }
}
