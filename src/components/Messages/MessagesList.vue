<template>
  <div
    @scroll="onScroll"
    class="chat-item__content content-chat-content"
    :class="{
      'info-pad': $store.state.meta.chatInfoOpen,
    }"
  >
    <div
      class="content-chat-content__arrows"
      :class="{ open: visibleArrows() }"
    >
      <div
        @click="fetchNextMessage"
        class="content-chat-content__arrows_item content-chat-content__arrows_item-up"
        :class="{ disabled_arrow: !countNext }"
      >
        <img src="@/assets/img/arrow-up.png" alt="" />
        <div v-if="countNext" class="content-chat-content__arrows_number">
          {{ countNext }}
        </div>
      </div>
      <div
        @click="fetchPrevMessage"
        class="content-chat-content__arrows_item content-chat-content__arrows_item-down"
        :class="{ disabled_arrow: !countPrev }"
      >
        <img src="@/assets/img/arrow-down.png" alt="" />
        <div v-if="countPrev" class="content-chat-content__arrows_number">
          {{ countPrev }}
        </div>
      </div>
    </div>
    <div v-if="$store.state.messages.isLoading">
      <MessageLoader></MessageLoader>
      <MessageLoader :reversed="true"></MessageLoader>
      <MessageLoader></MessageLoader>
    </div>
    <MessagesItem
      v-for="message in messages"
      :ref="message.searched"
      :key="message.id"
      :message="message"
    />
  </div>
</template>

<script>
import MessagesItem from "./MessagesItem";
import MessageLoader from "../loaders/MessageLoader";

export default {
  data() {
    return {
      afterFirstScroll: false,
      updateInterval: null,
      lazyLoading: false,
      scrollBottom: false,
    };
  },
  components: {
    MessagesItem,
    MessageLoader,
  },
  computed: {
    messages() {
      return this.$store.state.messages.messages;
    },
    countNext() {
      return (
        this.$store.state.meta.searchChatMessages.length -
        1 -
        this.$store.state.meta.indexMessage
      );
    },
    countPrev() {
      return this.$store.state.meta.indexMessage;
    },
    freshMessageId() {
      return this.$store.state.messages.freshMessageId;
    },
  },
  methods: {
    onScroll(event) {
      if (this.afterFirstScroll) {
        const { scrollTop, scrollHeight, clientHeight } = event.target;

        const scrollForTop = scrollHeight - clientHeight - scrollTop * -1;

        if (scrollForTop < 200) {
          this.$store.dispatch("lazyLoadMessages");
          this.lazyLoading = true;
        }
      }
      this.afterFirstScroll = true;
    },
    setIntervalUpdate() {
      if (!this.$store.state.messages.isLoading) {
        console.log("setInterval");
        return setInterval(() => this.$store.dispatch("updateMessages"), 5000);
      }
      return null;
    },
    clearIntervalUpdate() {
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
      }
    },
    visibleArrows() {
      const { search, searchChatMessages } = this.$store.state.meta;
      return search && searchChatMessages.length > 1;
    },
    fetchNextMessage() {
      const nextIndex = this.$store.state.meta.indexMessage + 1;
      this.$store.dispatch("fetchSearchMessageChat", nextIndex);
    },
    fetchPrevMessage() {
      const prevIndex = this.$store.state.meta.indexMessage - 1;
      this.$store.dispatch("fetchSearchMessageChat", prevIndex);
    },
  },
  mounted() {
    let elem = this.$el;
    elem.scrollTop = elem.scrollHeight;
    setInterval(() => this.$store.dispatch("updateStatusMessage"), 5000);
  },
  beforeUpdate() {
    this.clearIntervalUpdate();
  },
  updated() {
    console.log("update");
    this.$store.dispatch("resetUnreadMessages");
    this.$store.dispatch("unreadMessagesRequest");
    this.afterFirstScroll = false;
    if (this.$store.state.meta.search && this.$refs.searched) {
      const { offsetTop } = this.$refs.searched[0].$el;
      const { innerHeight } = window;
      let scroll = 0;

      if (Math.abs(offsetTop) > Math.abs(innerHeight)) {
        scroll = Math.abs(offsetTop) + 40;
      }

      let elem = this.$el;
      elem.scrollTop = -scroll;
    } else if (this.scrollBottom) {
      let elem = this.$el;
      elem.scrollTop = elem.scrollHeight;
      this.scrollBottom = false;
    }
    this.lazyLoading = false;
    this.updateInterval = this.setIntervalUpdate();
  },
  watch: {
    freshMessageId() {
      this.scrollBottom = true;
    },
  },
};
</script>