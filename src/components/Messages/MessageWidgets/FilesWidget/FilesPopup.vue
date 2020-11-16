<template>
  <div
    class="chat__preview preview-chat"
    :class="{ open: $store.getters.getStatusPopup('files') }"
  >
    <div class="preview-chat__content">
      <div class="preview-chat__slider-big">
        <VueSlickCarousel
          v-if="files.length"
          @afterChange="afterChangeSlide"
          ref="carousel"
        >
          <SliderItem v-for="file in files" :key="file.id" :file="file" />
        </VueSlickCarousel>
        <div v-else class="preview-chat__slider-big_item">
          <div class="preview-chat__slider-big_file">Файлы не выбраны</div>
        </div>
      </div>
    </div>
    <div class="preview-chat__footer">
      <div class="preview-chat__slider-small">
        <div class="preview-chat__slider-small_item">
          <FooterItem
            v-for="file in files"
            :key="file.id"
            :goToSlide="goToSlide"
            :file="file"
            :activeSlides="getActiveSlide"
            :deleteFile="deleteFile"
          />
          <button
            @click="chooseFiles"
            class="preview-chat__slider-small_item__add"
          >
            <img src="@/assets/img/plus.png" alt="" />
          </button>
        </div>
      </div>
      <input
        ref="files"
        @change="changeFiles"
        class="file-input"
        type="file"
        multiple
      />
      <form @submit.prevent="createMessage" action="">
        <button class="preview-chat__button">
          <svg width="22px" height="19px" viewBox="0 0 512 512">
            <linearGradient
              id="SVGID_3_"
              gradientUnits="userSpaceOnUse"
              x1="61.866"
              y1="318.2997"
              x2="444.3639"
              y2="-2.6542"
            >
              <stop offset="0" style="stop-color: #5d2c91"></stop>
              <stop offset="1" style="stop-color: #d6496f"></stop>
            </linearGradient>
            <path
              fill="url(#SVGID_3_)"
              d="M506.015,73.272c-9.581-19.192-28.862-31.18-50.418-31.285H55.854c-0.115,0-0.231,0.001-0.346,0.003  C31.31,42.409,10.705,57.485,3.013,80.397C0.984,86.44,0.001,92.589,0.001,98.644c0.001,16.916,7.681,33.089,21.714,44.095  c0.222,0.175,0.449,0.344,0.679,0.51l136.643,98.089v172.83c0,0.132,0.002,0.263,0.004,0.395  c0.476,24.126,15.668,44.697,38.702,52.407c23.097,7.731,47.68,0.429,62.628-18.604c0.065-0.082,0.129-0.166,0.192-0.249  l34.153-44.925c6.686-8.794,4.975-21.341-3.817-28.025c-8.793-6.685-21.34-4.976-28.025,3.817l-34.043,44.781  c-6.664,8.371-15.755,6.155-18.391,5.273c-2.609-0.874-11.108-4.536-11.403-15.103v-182.86c0-6.443-3.103-12.491-8.337-16.248  L46.122,111.044c-8.163-6.631-6.042-15.373-5.189-17.916c0.858-2.556,4.477-10.882,15.123-11.14h383.105l-180.81,92.138  c-9.843,5.016-13.755,17.059-8.739,26.9c5.015,9.842,17.058,13.754,26.9,8.739l187.733-95.666l-135.99,178.883  c-6.686,8.795-4.976,21.341,3.817,28.025c8.793,6.685,21.34,4.976,28.025-3.817l140.596-184.942  c0.041-0.054,0.082-0.108,0.122-0.162C513.575,114.943,515.568,92.406,506.015,73.272z"
            ></path>
          </svg>
        </button>
      </form>
    </div>
    <div @click="close" class="preview-chat__close">
      <img src="@/assets/img/close-files.png" alt="" />
    </div>
  </div>
</template>

<script>
import VueSlickCarousel from "vue-slick-carousel";
import SliderItem from "./SliderItem";
import FooterItem from "./FooterItem";
import "vue-slick-carousel/dist/vue-slick-carousel.css";

export default {
  data() {
    return {
      activeSlide: 0,
    };
  },
  components: {
    VueSlickCarousel,
    SliderItem,
    FooterItem,
  },
  computed: {
    files: {
      get() {
        return this.$store.state.messages.files;
      },
      set(files) {
        this.$store.commit("setFiles", files);
      },
    },
  },
  methods: {
    close() {
      this.$store.commit("closePopups");
    },
    goToSlide(id) {
      this.$refs.carousel.goTo(id);
    },
    afterChangeSlide(index) {
      this.activeSlide = index;
    },
    chooseFiles() {
      this.$refs.files.click();
    },
    changeFiles() {
      let counter = this.files.length;
      const newFiles = [];
      for (let i = 0; i < this.$refs.files.files.length; i++) {
        const file = this.$refs.files.files[i];
        newFiles.push({
          id: counter,
          type: this.getFileType(file.type),
          file: file,
          url: URL.createObjectURL(file),
        });
        counter += 1;
      }
      this.$store.commit("setFiles", [...newFiles]);
    },
    getFileType(rawType) {
      const type = rawType.split("/")[0];
      const knownType = ["image", "video", "audio"];
      if (knownType.includes(type)) {
        return type;
      }
      return "file";
    },
    getActiveSlide() {
      return this.activeSlide;
    },
    deleteFile(id) {
      this.files = this.files.filter((item) => item.id !== id);
    },
    createMessage() {
      this.$store.commit("closePopups");
      this.$store.dispatch("sendMessage");
    },
  },
};
</script>

<style scoped>
.file-input {
  display: none;
}
</style>
