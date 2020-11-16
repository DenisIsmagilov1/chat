<template>
  <div
    class="chat__list list-chat"
    :class="{
      'none-mobile': !!$store.state.meta.currentChatId,
    }"
  >
    <ChatListHeader />
    <div @scroll="onScroll" class="list-chat__scroll">
      <div v-if="$store.state.chats.loading">
        <ChatLoader></ChatLoader>
        <ChatLoader></ChatLoader>
        <ChatLoader></ChatLoader>
      </div>
      <div v-else-if="chats.length === 0" class="no-chats">No Chats!</div>
      <ChatListItem
        v-else
        v-for="chat in chats"
        :key="chat.chat + chat.program"
        :item="chat"
      />
    </div>
  </div>
</template>

<script>
import ChatListHeader from "./ChatListHeader";
import ChatListItem from "./ChatListItem";
import ChatLoader from "../loaders/ChatLoader";

export default {
  data() {
    return {
      updateChatInterval: null,
      updateUrgentInterval: null,
    };
  },
  components: {
    ChatListHeader,
    ChatListItem,
    ChatLoader,
  },
  computed: {
    chats() {
      return this.$store.getters.getSortChats;
    },
  },
  methods: {
    onScroll(event) {
      const { scrollHeight, clientHeight, scrollTop } = event.target;

      const needFetchChats =
        scrollHeight - clientHeight < scrollTop + 100 &&
        !this.$store.state.chats.lazyLoading &&
        !this.$store.state.chats.isLoaded;

      if (needFetchChats) {
        this.$store.dispatch("lazyChatsRequest");
      }
    },
  },
  beforeMount() {
    this.$store.dispatch("fetchChatsRequest");
    this.$store.dispatch("fetchUrgentChats");
    this.updateChatInterval = setInterval(() => {
      this.$store.dispatch("updateUrgentChats");
    }, 5000);
    this.updateUrgentInterval = setInterval(() => {
      this.$store.dispatch("updateChats");
    }, 5000);
  },
  updated() {
    clearInterval(this.updateChatInterval);
    clearInterval(this.updateUrgentInterval);
    if (this.$store.state.meta.currentFolder.type == "total") {
      this.updateChatInterval = setInterval(() => {
        this.$store.dispatch("updateUrgentChats");
      }, 5000);
      this.updateUrgentInterval = setInterval(() => {
        this.$store.dispatch("updateChats");
      }, 5000);
    }
  },
};
</script>