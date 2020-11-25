import axios from 'axios';

class Api {

  baseUrl = 'https://marketbot.biz/chat_v2';
  settings = {
    withCredentials: true
  }

  fetchChats(botref, user_token, time, program, folder_id) {
    return axios.get(`${this.baseUrl}/peers_list`, {
      params: {
        botref,
        user_token,
        time,
        limit: 32,
        program,
        folder_id
      },
      ...this.settings,
    });
  }

  fecthUrgentChats(botref, user_token) {
    return axios.get(`${this.baseUrl}/urgent_peers`, {
      params: {
        botref,
        user_token,
      },
      ...this.settings,
    })
  }

  fetchFolders(botref, user_token,) {
    return axios.get(`${this.baseUrl}/folders`, {
      params: {
        botref,
        user_token,
      },
      ...this.settings,
    })
  }

  fetchQtyFolders(botref, user_token,) {
    return axios(`${this.baseUrl}/get_chat_counts`, {
      params: {
        botref,
        user_token,
      },
      ...this.settings,
    })
  }

  createFolder(botref, user_token, name) {

    const bodyFormData = new FormData();
    bodyFormData.append('botref', botref);
    bodyFormData.append('user_token', user_token);
    bodyFormData.append('name', name);

    return axios.post(`${this.baseUrl}/createfolder`, bodyFormData, {
      ...this.settings,
      'Content-Type': 'multipart/form-data'
    }
    )
  }

  fetchOptions(botref, user_token) {
    return axios.get(`${this.baseUrl}/opdata`, {
      params: {
        botref,
        user_token,
      },
      ...this.settings,
    })
  }

  createTemplate(botref, user_token, body) {
    const bodyFormData = new FormData();
    bodyFormData.append('botref', botref);
    bodyFormData.append('user_token', user_token);
    bodyFormData.append('name', body.name);
    bodyFormData.append('text', body.text);
    bodyFormData.append('type', body.type);

    if (body.image) {
      bodyFormData.append('image', body.image)
    }

    return axios.post(`${this.baseUrl}/submit_new_template`, bodyFormData, {
      ...this.settings,
      'Content-Type': 'multipart/form-data'
    })
  }

  deleteTemplate(botref, user_token, id) {
    return axios.get(`${this.baseUrl}/del_template`, {
      params: {
        botref,
        user_token,
        tpl_id: id
      },
      ...this.settings,
    })
  }

  fetchMessagesHistory(botref, user_token, program, chat, id) {
    return axios.get(`${this.baseUrl}/history`, {
      params: {
        botref,
        user_token,
        program,
        chat,
        id,
        limit: 32
      },
      ...this.settings,
    });
  }

  fetchChatInfo(botref, user_token, program, chat) {
    return axios.get(`${this.baseUrl}/chatinfo`, {
      params: {
        botref,
        user_token,
        program,
        chat
      },
      ...this.settings,
    });
  }

  leaveChat(botref, user_token, program, chat) {
    return axios.get(`${this.baseUrl}/leave`, {
      params: {
        botref,
        user_token,
        program,
        chat
      },
      ...this.settings,
    });
  }

  linkFolder(botref, user_token, program, chat, folder_id, unlink) {

    return axios.get(`${this.baseUrl}/linkfolder`, {
      params: {
        botref,
        user_token,
        program,
        chat,
        folder_id,
        unlink
      },
      ...this.settings,
    })
  }

  writeFirst(botref, user_token, phone, msg_text, tpl_id) {
    return axios.get(`${this.baseUrl}/write_first`, {
      params: {
        botref,
        user_token,
        phone,
        msg_text,
        tpl_id
      },
      ...this.settings,
    })
  }

  sendMessage(botref, user_token, program, chat, text, files, templateId) {
    let count = 0;
    const body = new FormData();
    body.append('botref', botref);
    body.append('user_token', user_token);
    body.append('program', program);
    body.append('chat', chat);

    if (templateId) {
      body.append('tpl_id', templateId)
    } else {
      if (text) {
        body.append('type0', 'text');
        body.append('msg_text0', text);
        count = count + 1;
      }

      if (files) {
        for (let i = 0; i < files.length; i++) {
          body.append(`type${count}`, files[i].type);
          body.append(`file${count}`, files[i].file);
          count = count + 1;
        }
      }
    }

    return axios.post(`${this.baseUrl}/send_message`, body, {
      ...this.settings,
      'Content-Type': 'multipart/form-data'
    });
  }

  toggleBanChat(botref, user_token, program, chat, unban) {
    return axios.get(`${this.baseUrl}/ban`, {
      params: {
        botref,
        user_token,
        program,
        chat,
        unban
      },
      ...this.settings,
    })
  }

  unreadMessages(botref, user_token, program, chat) {
    const body = new FormData();
    body.append('botref', botref);
    body.append('user_token', user_token);
    body.append('program', program);
    body.append('chat', chat);

    return axios.post(`${this.baseUrl}/reset_unread`, body, {
      ...this.settings,
      'Content-Type': 'multipart/form-data'
    });
  }

  searchMessages(botref, user_token, q, program, chat) {
    return axios.get(`${this.baseUrl}/search`, {
      ...this.settings,
      params: {
        botref,
        user_token,
        program,
        chat,
        q
      }
    })
  }

  onStart(botref, user_token, program, chat) {
    return axios.get(`${this.baseUrl}/onstart`, {
      ...this.settings,
      params: {
        botref,
        user_token,
        program,
        chat
      }
    })
  }

  updateStatusMessage(botref, user_token, program, chat, messages) {
    return axios.get(`${this.baseUrl}/msg_status`, {
      ...this.settings,
      params: {
        botref,
        user_token,
        program,
        chat,
        id: messages
      }
    })
  }

  deleteFolder(botref, user_token, folder_id) {
    return axios.get(`${this.baseUrl}/rmfolder`, {
      ...this.settings,
      params: {
        botref,
        user_token,
        folder_id
      }
    })
  }

}

export default new Api()