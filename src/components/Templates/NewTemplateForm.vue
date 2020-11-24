<template>
  <div class="new-templates__body">
    <div class="new-templates__line">
      <b-select v-model="chosenOption">
        <option v-for="option of options" :value="option" :key="option.id">
          {{ option.title }}
        </option>
      </b-select>
      <div
        v-if="chosenOption.image === 1"
        @click="chooseImage"
        class="new-templates__frame new-templates__frame_screen"
      >
        <img src="@/assets/img/image.png" alt="" />
        <span> Изображение</span>
        <input
          class="input-file"
          type="file"
          ref="file"
          accept="image/*"
          @change="changeFile"
        />
      </div>
    </div>
    <form
      @submit.prevent="createTemplate"
      action=""
      class="new-templates__form"
    >
      <div class="new-templates__block">
        <div class="new-templates__input">
          <textarea
            v-model="templateName"
            type="text"
            placeholder="Название шаблона..."
          />
        </div>
        <div class="new-templates__input new-templates__input_2">
          <textarea-autosize
            v-model="templateText"
            placeholder="Введите текст шаблона..."
            :min-height="1"
            :max-height="43"
          />
        </div>
        <div class="new-templates__frame new-templates__frame_mobile">
          <img src="@/assets/img/image.png" alt="" />
          <span> Изображение</span>
        </div>
      </div>
      <div class="new-templates__wrapper">
        <div class="templates__item new-templates__item">
          <div class="new-templates__image">
            <img v-if="imageUrl" :src="imageUrl" alt="" />
          </div>
          <span v-for="(text, index) in textArray" :key="index"
            >{{ text }}<br
          /></span>
        </div>
      </div>
      <div class="new-templates__line new-templates__line_end">
        <div @click="toggleNewFormOpen" class="new-templates__back">Назад</div>
        <button class="new-templates__btm">
          <svg
            width="26px"
            height="24px"
            viewBox="0 0 612 792"
            enable-background="new 0 0 612 792"
            xml:space="preserve"
          >
            <linearGradient
              id="SVGID_3_"
              gradientUnits="userSpaceOnUse"
              x1="47.041"
              y1="747.3461"
              x2="441.8425"
              y2="416.0682"
              gradientTransform="matrix(1.1953 0 0 1.1953 8.2423 -267.3557)"
            >
              <stop offset="0" style="stop-color: #5d2c91" />
              <stop offset="1" style="stop-color: #d6496f" />
            </linearGradient>
            <path
              fill="url(#SVGID_3_)"
              d="M594.1,416.751c-4.074,1.057-101.844,25.867-282.118,25.867  c-179.951,0-288.896-24.664-293.446-25.714C5.671,413.935-2.352,401.1,0.618,388.235c2.966-12.86,15.797-20.887,28.655-17.921  c0.439,0.1,18.898,4.257,52.556,9.117c3.66-16.532,15.204-65.808,33.135-115.812c12.966-36.156,26.66-65.25,40.704-86.477  c20.937-31.648,44.172-47.695,69.056-47.695c16.661,0,35.222,6.575,56.743,20.104c15.516,9.754,35.711,9.798,51.448,0.118  c22.113-13.607,40.29-20.222,55.568-20.222c27.753,0,53.39,19.979,76.198,59.382c14.766,25.507,28.98,59.818,42.254,101.978  c3.964,12.594-3.03,26.017-15.624,29.982c-12.595,3.962-26.018-3.031-29.982-15.624c-31.786-100.967-60.746-127.906-72.846-127.906  c-0.938,0-9.772,0.368-30.512,13.131c-31.121,19.149-71.139,19.008-101.95-0.36c-17.676-11.112-27.196-12.771-31.297-12.771  c-10.399,0-35.741,21.589-64.755,102.499c-15.518,43.275-26.188,86.936-30.467,105.647c46.854,5.041,108.7,9.401,182.48,9.401  c173.453,0,269.194-24.099,270.141-24.343c12.785-3.284,25.815,4.4,29.112,17.174C614.533,400.411,606.871,413.44,594.1,416.751z   M540.287,531.071v13.148c0,58.902-32.155,118.336-103.992,118.336c-28.274,0-51.677-10.077-69.557-29.95  c-14.339-15.937-23.073-35.766-30.779-53.262c-11.966-27.168-18.392-38.113-28.557-40.547c-9.277,2.405-15.435,13.126-27.089,39.681  c-7.743,17.644-16.518,37.643-30.953,53.758c-18.021,20.118-41.591,30.32-70.057,30.32c-31.929,0-60.498-17.008-80.446-47.892  c-15.492-23.988-24.742-55.238-24.742-83.593c0-29.659,24.13-53.789,53.789-53.789c1.469,0,2.937,0.135,4.382,0.405l11.036,2.058  c38.021,7.091,76.911,10.685,115.591,10.685h43.506h9.563h43.507c38.679,0,77.571-3.595,115.595-10.686l11.03-2.057  c1.445-0.27,2.913-0.405,4.383-0.405C516.158,477.282,540.287,501.412,540.287,531.071z M246.277,538.125  c-37.431-0.703-74.956-4.521-111.72-11.377l-8.019-1.495c-2.639,0.619-4.61,2.993-4.61,5.819c0,34.938,21.828,83.672,57.375,83.672  c31.354,0,41.678-20.047,57.228-55.479C239.627,552.209,242.772,545.041,246.277,538.125z M492.475,531.071  c0-2.826-1.971-5.2-4.61-5.819l-8.013,1.494c-36.316,6.773-73.371,10.581-110.344,11.351c3.695,7.183,6.978,14.639,10.209,21.975  c15.378,34.916,25.588,54.671,56.579,54.671c52.128,0,56.18-53.979,56.18-70.524V531.071z"
            />
          </svg>
          <span> Отправить на модерацию</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chosenOption: { id: 1, title: "Текст", image: 0 },
      options: [
        { id: 1, title: "Текст", image: 0 },
        { id: 2, title: "Текст + картинка", image: 1 },
      ],
      templateName: "",
      templateText: "",
      image: "",
      imageUrl: "",
    };
  },
  props: ["toggleNewFormOpen"],
  computed: {
    textArray() {
      return this.templateText.trim().split("\n");
    },
  },
  methods: {
    createTemplate() {
      if (this.templateName.trim() && this.templateText.trim()) {
        this.$store.dispatch("createTemplateRequest", {
          name: this.templateName,
          text: this.templateText,
          type: this.chosenOption.image,
          image: this.image,
        }),
          (this.templateName = this.templateText = this.image = "");
        this.toggleNewFormOpen();
      }
    },
    changeFile() {
      this.image = this.$refs.file.files[0];
      this.imageUrl = URL.createObjectURL(this.image);
    },
    chooseImage() {
      this.$refs.file.click();
    },
  },
};
</script>

<style scoped>
.input-file {
  display: none;
}
</style>