<template>
  <div
    class="chat-item__footer footer-chat-item"
    :class="{ disabled: $store.getters.isBannedChat }"
  >
    <div class="footer-chat-item__body">
      <form @submit.prevent="createMessage" action="">
        <div @keydown.enter="pressEnter" class="footer-chat-item__input">
          <textarea-autosize
            @keydown="pressEnter"
            v-if="!template"
            v-model="text"
            name=""
            id="textarea"
            ref="text"
            :min-height="16"
            :max-height="200"
            placeholder="Введите сообщение"
          />
          <div v-else class="footer-chat-item__input_template">
            <div class="footer-chat-item__input_img">
              <img :src="template.image" alt="" />
            </div>
            <div class="footer-chat-item__input_text">
              {{ template.text }}
            </div>
          </div>
          <button
            @click="createMessage"
            class="footer-chat-item__button active"
          >
            <svg width="22px" height="19px" viewBox="0 0 512 512">
              <linearGradient
                id="SVGID_3_"
                gradientUnits="userSpaceOnUse"
                x1="61.866"
                y1="318.2997"
                x2="444.3639"
                y2="-2.6542"
              >
                <stop offset="0" style="stop-color: #5D2C91" />
                <stop offset="1" style="stop-color: #D6496F" />
              </linearGradient>
              <path
                fill="url(#SVGID_3_)"
                d="M506.015,73.272c-9.581-19.192-28.862-31.18-50.418-31.285H55.854c-0.115,0-0.231,0.001-0.346,0.003  C31.31,42.409,10.705,57.485,3.013,80.397C0.984,86.44,0.001,92.589,0.001,98.644c0.001,16.916,7.681,33.089,21.714,44.095  c0.222,0.175,0.449,0.344,0.679,0.51l136.643,98.089v172.83c0,0.132,0.002,0.263,0.004,0.395  c0.476,24.126,15.668,44.697,38.702,52.407c23.097,7.731,47.68,0.429,62.628-18.604c0.065-0.082,0.129-0.166,0.192-0.249  l34.153-44.925c6.686-8.794,4.975-21.341-3.817-28.025c-8.793-6.685-21.34-4.976-28.025,3.817l-34.043,44.781  c-6.664,8.371-15.755,6.155-18.391,5.273c-2.609-0.874-11.108-4.536-11.403-15.103v-182.86c0-6.443-3.103-12.491-8.337-16.248  L46.122,111.044c-8.163-6.631-6.042-15.373-5.189-17.916c0.858-2.556,4.477-10.882,15.123-11.14h383.105l-180.81,92.138  c-9.843,5.016-13.755,17.059-8.739,26.9c5.015,9.842,17.058,13.754,26.9,8.739l187.733-95.666l-135.99,178.883  c-6.686,8.795-4.976,21.341,3.817,28.025c8.793,6.685,21.34,4.976,28.025-3.817l140.596-184.942  c0.041-0.054,0.082-0.108,0.122-0.162C513.575,114.943,515.568,92.406,506.015,73.272z"
              />
            </svg>
          </button>
        </div>
        <div class="footer-chat-item__flex">
          <div class="footer-chat-item__icons">
            <FilesButton :sendMessage="createMessage" />
            <MicroWidget />
            <EmojiWidget :onClick="addEmoji" />
          </div>
          <div
            @click="toggleTemplateListPopup"
            class="footer-chat-item__templates"
          >
            <div class="footer-chat-item__templates_icon">
              <svg width="23.5px" height="23.5px" viewBox="0 0 612 792">
                <linearGradient
                  id="SVGID_3_"
                  gradientUnits="userSpaceOnUse"
                  x1="7.4748"
                  y1="758.6858"
                  x2="489.0609"
                  y2="354.5871"
                  gradientTransform="matrix(1.1953 0 0 1.1953 8.2423 -267.3545)"
                >
                  <stop offset="0" style="stop-color: #5d2c91" />
                  <stop offset="1" style="stop-color: #d6496f" />
                </linearGradient>
                <path
                  fill="url(#SVGID_3_)"
                  d="M512.328,293.031H323.906c-46.137,0-83.672-37.535-83.672-83.672v-18.688  c0-46.137,37.535-83.672,83.672-83.672h188.422C558.465,107,596,144.535,596,190.672v18.688  C596,255.496,558.465,293.031,512.328,293.031z M323.906,154.813c-19.773,0-35.859,16.087-35.859,35.859v18.688  c0,19.773,16.087,35.859,35.859,35.859h188.422c19.773,0,35.859-16.087,35.859-35.859v-18.688c0-19.773-16.087-35.859-35.859-35.859  H323.906z M596,605.328c0-13.203-10.703-23.906-23.906-23.906s-23.906,10.703-23.906,23.906c0,19.773-16.087,35.859-35.859,35.859  H323.906c-19.773,0-35.859-16.087-35.859-35.859V418.102c0-19.773,16.087-35.859,35.859-35.859h188.422  c19.773,0,35.859,16.087,35.859,35.859v67.695c0,13.203,10.703,23.906,23.906,23.906S596,499,596,485.797v-67.695  c0-46.137-37.535-83.672-83.672-83.672H323.906c-46.137,0-83.672,37.535-83.672,83.672v187.227  c0,46.137,37.535,83.672,83.672,83.672h188.422C558.465,689,596,651.465,596,605.328z M116.359,689H97.672  C51.535,689,14,651.465,14,605.328V190.672C14,144.535,51.535,107,97.672,107h18.688c46.137,0,83.672,37.535,83.672,83.672v414.656  C200.031,651.465,162.496,689,116.359,689z M97.672,154.813c-19.773,0-35.859,16.087-35.859,35.859v414.656  c0,19.773,16.087,35.859,35.859,35.859h18.688c19.773,0,35.859-16.087,35.859-35.859V190.672c0-19.773-16.087-35.859-35.859-35.859  H97.672z"
                />
              </svg>
            </div>
            <div class="footer-chat-item__templates_text">Шаблоны</div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import EmojiWidget from "./MessageWidgets/EmojiWidget";
import MicroWidget from "./MessageWidgets/MicroWidget";
import FilesButton from "./MessageWidgets/FilesWidget/FilesButton";

export default {
  components: {
    EmojiWidget,
    MicroWidget,
    FilesButton,
  },
  computed: {
    text: {
      get() {
        return this.$store.state.messages.text;
      },
      set(text) {
        return this.$store.commit("updateText", text);
      },
    },
    template() {
      const templates = this.$store.state.options.options.templates;
      if (templates) {
        const id = this.$store.getters.templateId;
        return templates.find((template) => template.id == id);
      }
      return null;
    },
  },
  methods: {
    createMessage() {
      this.$store.dispatch("sendMessage");
      this.$store.commit("setSendedMessage", true);
      setTimeout(() => this.$store.commit("setSendedMessage", false), 500);
    },
    toggleTemplateListPopup() {
      this.$store.commit("openPopup", "templates");
      this.$store.commit("setNewChatTemplatePopup", false);
    },
    addEmoji(emoji) {
      this.text += emoji;
    },
    pressEnter(event) {
      if (this.$store.state.options.enterSendMessage) {
        if (event.key === "Enter" && event.shiftKey) {
          // this.text = this.text + "\n";
        } else if (event.key === "Enter") {
          this.text = this.text.trimRight();
          this.createMessage();
        }
        this.$refs.text.$el.focus();
      }
    },
  },
};
</script>

<style scoped>
.disabled {
  pointer-events: none;
  opacity: 0.4;
}
</style>
