<template>
  <div
    class="chat__item chat-item"
    :class="{
      block1: !!$store.state.meta.currentChatId,
    }"
  >
    <ChatListHeader :mobile="true" />
    <MessagesHeader />
    <MessagesList />
    <MessagesFooter />
    <NewChatPopup />
    <TemplateListPopup />
    <TemplateListPopup
      :writeFirst="true"
      v-if="$store.state.meta.newChatTemplatePopup"
    />
    <ChatInfo />
    <SettingsPopup />
  </div>
</template>

<script>
import MessagesHeader from "./MessagesHeader";
import MessagesList from "./MessagesList";
import MessagesFooter from "./MessagesFooter";
import NewChatPopup from "../ChatList/NewChatPopup";
import TemplateListPopup from "../Templates/TemplateListPopup";
import SettingsPopup from "../Templates/SettingsPopup";
import ChatInfo from "../ChatInfo/ChatInfo";
import ChatListHeader from "../ChatList/ChatListHeader";

export default {
  components: {
    MessagesHeader,
    MessagesList,
    MessagesFooter,
    NewChatPopup,
    TemplateListPopup,
    SettingsPopup,
    ChatInfo,
    ChatListHeader,
  },
  mounted() {
    //this.$store.dispatch("fetchMessagesRequest");
  },
};
</script>