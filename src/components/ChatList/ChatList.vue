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
      <div v-else-if="chats.length === 0" class="no-chats">
        <div class="no-chats__icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 0 512.00092 512"
            width="20px"
          >
            <path
              d="m34.144531 5.859375c-7.8125-7.8125-20.476562-7.8125-28.285156 0-7.808594 7.808594-7.8125 20.472656 0 28.285156l52.191406 52.1875c-37.542969 42.125-58.050781 94.703125-58.050781 149.667969 0 49.425781 16.160156 96.253906 46.871094 136.171875l-45.414063 112.332031c-3.050781 7.546875-1.222656 16.191406 4.621094 21.855469 3.808594 3.691406 8.832031 5.640625 13.925781 5.640625 2.726563 0 5.472656-.554688 8.066406-1.699219l128.65625-56.714843c31.441407 12.222656 64.792969 18.414062 99.273438 18.414062 52.824219 0 102.898438-14.460938 145.769531-41.949219l76.089844 76.09375c3.90625 3.902344 9.023437 5.855469 14.140625 5.855469s10.238281-1.953125 14.144531-5.855469c7.808594-7.8125 7.808594-20.476562 0-28.285156zm221.855469 426.140625c-32.054688 0-62.917969-6.234375-91.738281-18.527344-5.089844-2.171875-10.851563-2.136718-15.914063.09375l-91.347656 40.265625 31.367188-77.589843c2.792968-6.90625 1.511718-14.796876-3.320313-20.46875-29.46875-34.574219-45.046875-75.988282-45.046875-119.773438 0-44.300781 16.371094-86.839844 46.386719-121.328125l286.300781 286.300781c-34.722656 20.355469-74.644531 31.027344-116.6875 31.027344zm0 0"
            />
            <path
              d="m162.921875 59.089844c29.167969-12.667969 60.484375-19.089844 93.078125-19.089844 119.105469 0 216 87.925781 216 196 0 34.1875-9.847656 67.839844-28.476562 97.316406-5.902344 9.335938-3.117188 21.691406 6.21875 27.59375 3.316406 2.09375 7.011718 3.09375 10.667968 3.09375 6.632813 0 13.121094-3.296875 16.925782-9.316406 22.675781-35.882812 34.664062-76.921875 34.664062-118.6875 0-63.375-26.855469-122.855469-75.621094-167.488281-48.269531-44.179688-112.328125-68.511719-180.378906-68.511719-38.109375 0-74.789062 7.535156-109.011719 22.398438-10.132812 4.402343-14.777343 16.179687-10.378906 26.3125 4.402344 10.132812 16.179687 14.777343 26.3125 10.378906zm0 0"
            />
          </svg>
        </div>
        <div class="no-chats__text">В данной папке нет ни одного диалога</div>
      </div>
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