<template>
  <div class="chat-item__header header-item-chat">
    <div v-if="currentChat" class="header-item-chat__body">
      <span v-if="!searchOpen" class="header-item-chat__line line">
        <span class="line__name"> {{ currentChat.profile.nickname }} </span>
        <div class="line__number">
          {{ currentChat.profile.login }}
          <span
            class="line__messenger"
            :class="{
              tg: ['TL', 'VK'].includes(currentChat.program),
              wp: ['GS', 'WA'].includes(currentChat.program),
              vb: ['VB'].includes(currentChat.program),
            }"
          >
            {{ program.split(" ")[0] }}
          </span>
        </div>
      </span>
      <span  v-if="!searchOpen" @click="toggleChatInfo" class="header-item-chat__info info-open">
        <svg width="23px" height="23px" viewBox="0 0 612 792">
          <linearGradient
            id="SVGID_2_"
            gradientUnits="userSpaceOnUse"
            x1="52.0816"
            y1="718.4609"
            x2="444.3309"
            y2="389.3246"
            gradientTransform="matrix(1.1953 0 0 1.1953 8.2423 -267.3545)"
          >
            <stop offset="0" style="stop-color: #5d2c91" />
            <stop offset="1" style="stop-color: #d6496f" />
          </linearGradient>
          <path
            fill="url(#SVGID_2_)"
            d="M306,702c-81.735,0-158.579-31.83-216.375-89.625C31.83,554.578,0,477.735,0,396  s31.83-158.579,89.625-216.375C147.421,121.83,224.265,90,306,90s158.579,31.83,216.375,89.625C580.17,237.421,612,314.265,612,396  c0,60.399-17.928,119.142-51.845,169.873c-7.338,10.977-22.184,13.923-33.16,6.586c-10.977-7.338-13.925-22.185-6.587-33.16  c28.642-42.84,43.781-92.392,43.781-143.299c0-142.365-115.822-258.188-258.188-258.188S47.813,253.635,47.813,396  S163.635,654.188,306,654.188c47.222,0,93.406-12.857,133.561-37.181c11.292-6.841,25.992-3.232,32.833,8.061  c6.841,11.292,3.232,25.992-8.061,32.834C416.707,686.75,361.956,702,306,702z M306,265.711c13.203,0,23.906-10.703,23.906-23.906  S319.203,217.898,306,217.898c-13.203,0-23.906,10.703-23.906,23.906S292.797,265.711,306,265.711z M329.906,550.195V337.43  c0-13.203-10.703-23.906-23.906-23.906s-23.906,10.703-23.906,23.906v212.766c0,13.203,10.703,23.906,23.906,23.906  C319.203,574.102,329.906,563.399,329.906,550.195z"
          />
        </svg>
      </span>
      <div class="header-item-chat__search">
        <SearchPanel :onDispatch="'searchInChat'"  />
      </div>
    </div>
    <div
      v-if="isConnected"
      @click="setNullChatId"
      class="header-item-chat__exit"
    >
      <span class="header-item-chat__exit_text"> Выход из диалога </span>
      <span class="header-item-chat__exit_icon">
        <svg width="22px" height="19px" viewBox="0 0 512 512">
          <linearGradient
            id="SVGID_2_"
            gradientUnits="userSpaceOnUse"
            x1="-19.4643"
            y1="70.8286"
            x2="375.6626"
            y2="402.3794"
            gradientTransform="matrix(1 0 0 -1 8.84 488.04)"
          >
            <stop offset="0" style="stop-color: #5d2c91" />
            <stop offset="1" style="stop-color: #d6496f" />
          </linearGradient>
          <path
            fill="url(#SVGID_2_)"
            d="M362,362v40c0,44.113-35.887,80-80,80H81c-44.113,0-80-35.887-80-80V110c0-44.113,35.887-80,80-80  h201c44.113,0,80,35.887,80,80v40c0,11.047-8.953,20-20,20s-20-8.953-20-20v-40c0-22.055-17.945-40-40-40H81  c-22.055,0-40,17.945-40,40v292c0,22.055,17.945,40,40,40h201c22.055,0,40-17.945,40-40v-40c0-11.047,8.953-20,20-20  S362,350.953,362,362z M498.355,221.645l-44.785-44.785c-7.813-7.813-20.477-7.813-28.285,0c-7.813,7.809-7.813,20.473,0,28.281  L457.141,237H217c-11.047,0-20,8.953-20,20s8.953,20,20,20h240.141l-31.855,31.859c-7.813,7.809-7.813,20.473,0,28.281  c3.906,3.906,9.023,5.859,14.141,5.859c5.121,0,10.238-1.953,14.145-5.859l44.785-44.785  C517.852,272.859,517.852,241.141,498.355,221.645z"
          />
        </svg>
      </span>
    </div>
  </div>
</template>

<script>
import SearchPanel from "../widgets/SearchPanel";
import { getProgram } from "../../services/utils";

export default {
  components: {
    SearchPanel,
  },
  computed: {
    currentChat() {
      return this.$store.getters.currentChat;
    },
    program() {
      return getProgram(this.currentChat.program);
    },
    isConnected() {
      return this.$store.getters.chatIsConnected;
    },
  },
  methods: {
    setNullChatId() {
      this.$store.dispatch("leaveChat");
    },
    toggleChatInfo() {
      this.$store.commit("toggleChatInfo");
    },
  },
};
</script>