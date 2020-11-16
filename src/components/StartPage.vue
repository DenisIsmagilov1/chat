<template>
  <div class="chat__start start-chat">
    <div class="start-chat__body">
      <div class="start-chat__img">
        <img src="@/assets/img/avatar.jpg" alt="" />
      </div>
      <div class="start-chat__title">Добрый день, {{ name }}</div>
      <div class="start-chat__text">
        Выберите нужный вам диалог для беседы с клиентом или
      </div>
      <div @click="toggleNewChatPopup" class="start-chat__btm new-chat">
        <svg x="0px" y="0px" width="18px" height="18px" viewBox="0 0 512 512">
          <linearGradient
            id="SVGID_1_"
            gradientUnits="userSpaceOnUse"
            x1="59.8756"
            y1="420.5679"
            x2="449.9832"
            y2="93.2288"
          >
            <stop offset="0" style="stop-color: #5d2c91"></stop>
            <stop offset="1" style="stop-color: #d6496f"></stop>
          </linearGradient>
          <path
            fill="#c44475"
            d="M256,0c50.531,0,99.676,15,142.117,43.375c9.184,6.137,11.648,18.559,5.512,27.742  c-6.141,9.184-18.563,11.648-27.742,5.512C340.043,52.664,298.59,40,256,40C136.898,40,40,136.898,40,256s96.898,216,216,216  s216-96.898,216-216c0-39.504-10.758-78.145-31.105-111.738c-5.723-9.445-2.703-21.746,6.746-27.469  c9.445-5.723,21.742-2.703,27.465,6.746C499.242,163.383,512,209.188,512,256c0,68.379-26.629,132.668-74.98,181.02  S324.379,512,256,512s-132.668-26.629-181.02-74.98S0,324.379,0,256S26.629,123.332,74.98,74.98S187.621,0,256,0z M236,366.5  v-90.018h-90c-11.046,0-20-8.954-20-20s8.954-20,20-20h90V145.5c0-11.046,8.954-20,20-20s20,8.954,20,20v90.982h90  c11.046,0,20,8.954,20,20c0,11.046-8.954,20-20,20h-90V366.5c0,11.046-8.954,20-20,20S236,377.546,236,366.5L236,366.5z"
          ></path>
        </svg>
        Начните новый диалог
      </div>
    </div>
  </div>
</template>

<script>

export default {
  components: {
  },
  methods: {
    toggleNewChatPopup() {
      this.$store.commit("openPopup", "write first");
    },
  },
  computed: {
    name() {
      return this.$store.getters["nickname"];
    },
  },
};
</script>