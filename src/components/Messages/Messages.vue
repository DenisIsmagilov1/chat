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
    <ChatInfo />
  </div>
</template>

<script>
import MessagesHeader from "./MessagesHeader";
import MessagesList from "./MessagesList";
import MessagesFooter from "./MessagesFooter";
import ChatInfo from "../ChatInfo/ChatInfo";
import ChatListHeader from "../ChatList/ChatListHeader";

export default {
  components: {
    MessagesHeader,
    MessagesList,
    MessagesFooter,
    ChatInfo,
    ChatListHeader,
  },
  mounted() {
    //this.$store.dispatch("fetchMessagesRequest");
  },
};
</script>