<template>
  <div class="footer-chat-item__button micro">
    <div class="micro__first-item">
      <div class="micro__title">Для начала записи нажмите кнопку:</div>
      <a @click="toggleRecorder" class="micro__icon micro__icon-1">
        <img src="@/assets/img/play.png" alt="" />
      </a>
    </div>
    <div
      class="micro__two-item"
      :class="{ open: isRecording || this.recordList.length }"
    >
      <!-- <a v-if="recordList.length" :href="recordList[0].url" download
        >download</a
      > -->
      <div class="micro__timer">{{ getTime }}</div>
      <div
        @click="stopRecorder"
        class="micro__icon"
        :class="{ disabled: this.recordList.length }"
      >
        <img src="@/assets/img/stop.png" alt="" />
      </div>
      <div class="micro__line">
        <div @click="deleteAudio" class="micro__delete">
          <img src="@/assets/img/micro__delete.png" alt="" />
        </div>
        <button @click="sendMessage" class="micro__btn">
          <svg width="22px" height="19px" viewBox="0 0 512 512">
            <linearGradient
              id="SVGID_1_"
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
              fill="url(#SVGID_1_)"
              d="M506.015,73.272c-9.581-19.192-28.862-31.18-50.418-31.285H55.854c-0.115,0-0.231,0.001-0.346,0.003  C31.31,42.409,10.705,57.485,3.013,80.397C0.984,86.44,0.001,92.589,0.001,98.644c0.001,16.916,7.681,33.089,21.714,44.095  c0.222,0.175,0.449,0.344,0.679,0.51l136.643,98.089v172.83c0,0.132,0.002,0.263,0.004,0.395  c0.476,24.126,15.668,44.697,38.702,52.407c23.097,7.731,47.68,0.429,62.628-18.604c0.065-0.082,0.129-0.166,0.192-0.249  l34.153-44.925c6.686-8.794,4.975-21.341-3.817-28.025c-8.793-6.685-21.34-4.976-28.025,3.817l-34.043,44.781  c-6.664,8.371-15.755,6.155-18.391,5.273c-2.609-0.874-11.108-4.536-11.403-15.103v-182.86c0-6.443-3.103-12.491-8.337-16.248  L46.122,111.044c-8.163-6.631-6.042-15.373-5.189-17.916c0.858-2.556,4.477-10.882,15.123-11.14h383.105l-180.81,92.138  c-9.843,5.016-13.755,17.059-8.739,26.9c5.015,9.842,17.058,13.754,26.9,8.739l187.733-95.666l-135.99,178.883  c-6.686,8.795-4.976,21.341,3.817,28.025c8.793,6.685,21.34,4.976,28.025-3.817l140.596-184.942  c0.041-0.054,0.082-0.108,0.122-0.162C513.575,114.943,515.568,92.406,506.015,73.272z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
    <svg width="20px" height="24px" viewBox="0 0 612 792">
      <linearGradient
        id="SVGID_1_"
        gradientUnits="userSpaceOnUse"
        x1="83.6335"
        y1="719.0267"
        x2="412.1547"
        y2="443.3647"
        gradientTransform="matrix(1.1953 0 0 1.1953 8.2423 -267.3545)"
      >
        <stop offset="0" style="stop-color: #5d2c91" />
        <stop offset="1" style="stop-color: #d6496f" />
      </linearGradient>
      <path
        fill="url(#SVGID_1_)"
        d="M180.492,396V225.508C180.492,156.303,236.795,100,306,100s125.508,56.303,125.508,125.508v60.961  c0,13.203-10.703,23.906-23.906,23.906s-23.906-10.703-23.906-23.906v-60.961c0-42.841-34.854-77.695-77.695-77.695  s-77.695,34.854-77.695,77.695V396c0,42.841,34.854,77.695,77.695,77.695s77.695-34.854,77.695-77.695  c0-13.203,10.703-23.906,23.906-23.906s23.906,10.703,23.906,23.906c0,69.205-56.303,125.508-125.508,125.508  S180.492,465.205,180.492,396z M527.133,396c0-13.203-10.703-23.906-23.906-23.906c-13.203,0-23.906,10.703-23.906,23.906  c0,95.569-77.751,173.32-173.32,173.32S132.68,491.569,132.68,396c0-13.203-10.703-23.906-23.906-23.906S84.867,382.797,84.867,396  c0,113.857,86.494,207.892,197.227,219.849v38.338H211.57c-13.203,0-23.906,10.703-23.906,23.906S198.367,702,211.57,702h191.25  c13.203,0,23.906-10.703,23.906-23.906s-10.703-23.906-23.906-23.906h-72.914v-38.338C440.639,603.892,527.133,509.857,527.133,396z  "
      />
    </svg>
  </div>
</template>

<script>
import Recorder from "../../../services/recorder";
import moment from "moment";

export default {
  data() {
    return {
      recorder: this._initRecorder(),
      recordList: [],
      timer: null,
      seconds: 0,
    };
  },
  beforeDestroy() {
    this.stopRecorder();
  },
  methods: {
    toggleRecorder() {
      this.setTimer();

      if (!this.isRecording || (this.isRecording && this.isPause)) {
        this.recorder.start();
      } else {
        this.recorder.pause();
      }
    },
    stopRecorder() {
      if (!this.isRecording) {
        return;
      }
      this.clearTimer();
      this.recorder.stop();
      this.recordList = this.recorder.recordList();
      console.log(this.recordList);

      this.$store.commit("setFiles", [
        {
          type: "audio",
          file: this.recordList[0].blob,
        },
      ]);
    },
    _initRecorder() {
      return new Recorder();
    },
    deleteAudio() {
      if (this.recordList.length) {
        this.recordList = [];
        this.$store.commit("setFiles", []);
        this.seconds = 0;
        this.recorder.records = [];
      }
    },
    sendMessage(event) {
      event.preventDefault();
      if (this.recordList.length) {
        this.recordList = [];
        this.$store.dispatch("sendMessage");
        this.seconds = 0;
        this.recorder.records = [];
      }
    },
    setTimer() {
      this.timer = setInterval(() => this.seconds++, 1000);
    },
    clearTimer() {
      clearInterval(this.timer);
    },
  },
  computed: {
    isPause() {
      return this.recorder.isPause;
    },
    isRecording() {
      return this.recorder.isRecording;
    },
    getTime() {
      let time = moment(this.seconds * 1000);
      return time.format("m:ss");
    },
  },
};
</script>