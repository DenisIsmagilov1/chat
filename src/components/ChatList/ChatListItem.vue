<template>
  <div
    class="list-chat__item item-list-chat"
    :class="{
      active: CurrentChatId + CurrentProgram == item.chat + item.program,
    }"
    @click="setChat(item.chat, item.program)"
  >
    <div class="item-list-chat__body">
      <div
        class="item-list-chat__icon item-list-chat__icon_new icon"
        :class="{ icon_new: item.sos }"
        :style="'background-color:' + color()"
      >
        <p class="icon_name">
          {{ firstCharNickname }}
        </p>
        <span v-if="item.unread_msg_count != 0">{{
          item.unread_msg_count
        }}</span>
      </div>
      <div class="item-list-chat__block">
        <div class="item-list-chat__line line">
          <span class="line__name">
            {{ nickname || login }}
          </span>
          <div class="line__number">
            {{ login }}
            <span
              class="line__messenger"
              :class="{
                tg: ['TL', 'VK'].includes(item.program),
                wp: ['GS', 'WA'].includes(item.program),
                vb: ['VB'].includes(item.program),
              }"
            >
              {{ program.split(" ")[0] }}
            </span>
          </div>
        </div>
        <div
          v-if="item.last_msg_text || item.unread_msg_count"
          class="item-list-chat__text"
          :class="{ 'item-list-chat__text_new': item.unread_msg_count != 0 }"
        >
          {{ textMessage }}
        </div>
        <div class="item-list-chat__date">{{ getDate }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { convertDate, getProgram, getColor } from "../../services/utils";

export default {
  props: ["item"],
  computed: {
    getDate() {
      return convertDate(this.item.last_msg_time);
    },
    program() {
      return getProgram(this.item.program);
    },
    CurrentChatId() {
      return this.$store.state.meta.currentChatId;
    },
    CurrentProgram() {
      return this.$store.state.meta.currentProgram;
    },
    firstCharNickname() {
      const nickname = this.item.profile.nickname || this.item.profile.login;

      let firtsChar = nickname[0] || " ";

      if (
        0xd800 <= firtsChar.charCodeAt(0) &&
        firtsChar.charCodeAt(0) <= 0xdbff
      ) {
        firtsChar = firtsChar + nickname[1];
      }

      return firtsChar;
    },
    textMessage() {
      if (this.item.last_msg_text && this.item.last_msg_text.length > 20) {
        return this.item.last_msg_text.slice(0, 20) + "...";
      } else {
        return this.item.last_msg_text;
      }
    },
    login() {
      if (this.item.profile.login && this.item.profile.login.length > 12) {
        return this.item.profile.login.slice(0, 12) + "...";
      }
      return this.item.profile.login;
    },
    nickname() {
      if (this.item.profile.nickname && this.item.profile.nickname.length > 9) {
        return this.item.profile.nickname.slice(0, 9) + "..";
      }
      return this.item.profile.nickname;
    },
  },
  methods: {
    setChat(id, program) {
      this.$store.commit("setChatId", id);
      this.$store.commit("setProgram", program);

      this.$store.dispatch("fetchChatInfoRequest");

      if (!this.$store.state.meta.search) {
        this.$store.dispatch("fetchFirstMessagesRequest");

        // if (!this.item.isRead) {
        //   this.$store.dispatch("updateChat", {
        //     id,
        //     isRead: true,
        //   });
        // }
        this.$store.dispatch("unreadMessagesRequest");
      } else {
        this.$store.dispatch("fetchSearchMessage");
        this.$store.commit("setOnce", true);
      }
    },
    color() {
      return getColor(this.firstCharNickname);
    },
  },
};
</script>