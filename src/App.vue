<template>
  <div class="wrapper">
    <div class="chat">
      <div class="chat__container" :class="{ pad: folderIsOpen }">
        <LeftBar />
        <div class="chat__row">
          <ChatList />
          <StartPage
            v-if="!$store.state.meta.currentChatId && !$store.state.meta.search"
          />
          <Messages v-else />
          <FilesPopup />
        </div>
        <NewChatPopup />
        <TemplateListPopup />
        <TemplateListPopup
          :writeFirst="true"
          v-if="$store.state.meta.newChatTemplatePopup"
        />
        <SettingsPopup />
      </div>
    </div>
  </div>
</template>

<script>
import LeftBar from "./components/Folders/FolderBar";
import ChatList from "./components/ChatList/ChatList";
import Messages from "./components/Messages/Messages";
import FilesPopup from "./components/Messages/MessageWidgets/FilesWidget/FilesPopup";
import StartPage from "./components/StartPage";
import NewChatPopup from "./components/ChatList/NewChatPopup";
import TemplateListPopup from "./components/Templates/TemplateListPopup";
import SettingsPopup from "./components/Templates/SettingsPopup";
export default {
  components: {
    LeftBar,
    ChatList,
    Messages,
    FilesPopup,
    StartPage,
    NewChatPopup,
    TemplateListPopup,
    SettingsPopup,
  },
  computed: {
    folderIsOpen() {
      return this.$store.state.meta.foldersIsOpen;
    },
  },
  async beforeMount() {
    const { botref, chat, program, user_token } = this.$route.query;

    this.$store.commit("setBotref", botref);
    this.$store.commit("setUserToken", user_token);
    this.$store.commit("setChatId", chat);
    this.$store.commit("setProgram", program);
    await this.$store.dispatch("fetchOptionsRequest");
    if (botref && chat && program) {
      await this.$store.dispatch("onStartChat");
      if (this.$store.state.meta.isKnown) {
        await this.$store.dispatch("fetchChatInfoRequest");
        await this.$store.dispatch("fetchFirstMessagesRequest");
      }
    }
  },
};
</script>
