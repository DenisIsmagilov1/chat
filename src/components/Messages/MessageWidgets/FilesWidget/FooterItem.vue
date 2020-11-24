<template>
  <div
    @click="goToSlide(file.id)"
    class="preview-chat__slider-small_img"
    :class="{ 'slick-current': activeSlides() === file.id }"
  >
    <img v-if="file.type === 'image'" :src="file.url" alt="" />
    <img v-else src="@/assets/img/filee.png" alt="" />
    <div
      @click.stop="deleteFile(file.id)"
      class="preview-chat__slider-small_img__delete"
    ></div>
  </div>
</template>

<script>
export default {
  props: ["file", "goToSlide", "activeSlides", "deleteFile"],
};
</script>