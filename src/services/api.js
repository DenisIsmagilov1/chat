import axios from 'axios';

class Api {

  baseUrl = 'https://marketbot.biz/chat_v2';
  settings = {
    withCredentials: true
  }

  fetchChats(botref, time, program, folder_id) {
    return axios.get(`${this.baseUrl}/peers_list`, {
      params: {
        botref,
        time,
        limit: 32,
        program,
        folder_id
      },
      ...this.settings,
    });
  }

  fecthUrgentChats(botref) {
    return axios.get(`${this.baseUrl}/urgent_peers`, {
      params: {
        botref
      },
      ...this.settings,
    })
  }

  fetchFolders(botref) {
    return axios.get(`${this.baseUrl}/folders`, {
      params: {
        botref
      },
      ...this.settings,
    })
  }

  fetchQtyFolders(botref) {
    return axios(`${this.baseUrl}/get_chat_counts`, {
      params: {
        botref
      },
      ...this.settings,
    })
  }

  createFolder(botref, name) {

    const bodyFormData = new FormData();
    bodyFormData.append('botref', botref);
    bodyFormData.append('name', name);

    return axios.post(`${this.baseUrl}/createfolder`, bodyFormData, {
      ...this.settings,
      'Content-Type': 'multipart/form-data'
    }
    )
  }

  fetchOptions(botref) {
    return axios.get(`${this.baseUrl}/opdata`, {
      params: {
        botref
      },
      ...this.settings,
    })
  }

  createTemplate(botref, body) {
    const bodyFormData = new FormData();
    bodyFormData.append('botref', botref);
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

  deleteTemplate(botref, id) {
    return axios.get(`${this.baseUrl}/del_template`, {
      params: {
        botref,
        tpl_id: id
      },
      ...this.settings,
    })
  }

  fetchMessagesHistory(botref, program, chat, id) {
    console.log("History")
    return axios.get(`${this.baseUrl}/history`, {
      params: {
        botref,
        program,
        chat,
        id,
        limit: 32
      },
      ...this.settings,
    });
  }

  fetchChatInfo(botref, program, chat) {
    return axios.get(`${this.baseUrl}/chatinfo`, {
      params: {
        botref,
        program,
        chat
      },
      ...this.settings,
    });
  }

  leaveChat(botref, program, chat) {
    return axios.get(`${this.baseUrl}/leave`, {
      params: {
        botref,
        program,
        chat
      },
      ...this.settings,
    });
  }

  linkFolder(botref, program, chat, folder_id, unlink) {

    return axios.get(`${this.baseUrl}/linkfolder`, {
      params: {
        botref,
        program,
        chat,
        folder_id,
        unlink
      },
      ...this.settings,
    })
  }

  writeFirst(botref, phone, msg_text, tpl_id) {
    return axios.get(`${this.baseUrl}/write_first`, {
      params: {
        botref,
        phone,
        msg_text,
        tpl_id
      },
      ...this.settings,
    })
  }

  sendMessage(botref, program, chat, text, files, templateId) {
    let count = 0;
    const body = new FormData();
    body.append('botref', botref);
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

  toggleBanChat(botref, program, chat, unban) {
    return axios.get(`${this.baseUrl}/ban`, {
      params: {
        botref,
        program,
        chat,
        unban
      },
      ...this.settings,
    })
  }

  unreadMessages(botref, program, chat) {
    const body = new FormData();
    body.append('botref', botref);
    body.append('program', program);
    body.append('chat', chat);

    return axios.post(`${this.baseUrl}/reset_unread`, body, {
      ...this.settings,
      'Content-Type': 'multipart/form-data'
    });
  }

  searchMessages(botref, q, program, chat) {
    return axios.get(`${this.baseUrl}/search`, {
      ...this.settings,
      params: {
        botref,
        program,
        chat,
        q
      }
    })
  }

  onStart(botref, program, chat) {
    return axios.get(`${this.baseUrl}/onstart`, {
      ...this.settings,
      params: {
        botref,
        program,
        chat
      }
    })
  }

  updateStatusMessage(botref, program, chat, messages) {
    return axios.get(`${this.baseUrl}/msg_status`, {
      ...this.settings,
      params: {
        botref,
        program,
        chat,
        id: messages
      }
    })
  }

  deleteFolder(botref, folder_id) {
    return axios.get(`${this.baseUrl}/rmfolder`, {
      ...this.settings,
      params: {
        botref,
        folder_id
      }
    })
  }

}

export default new Api()