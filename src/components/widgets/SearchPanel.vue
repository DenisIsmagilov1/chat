<template>
  <span
    v-if="!open"
    @click="openForm"
    class="header-list-chat__icon search search-1"
  >
    <svg
      class="header-list-chat__icon_none header-list-chat__icon_none-1"
      width="22px"
      height="22px"
      viewBox="0 0 612 792"
    >
      <linearGradient
        id="SVGID_1_"
        gradientUnits="userSpaceOnUse"
        x1="23.294"
        y1="643.2184"
        x2="559.7175"
        y2="193.1057"
      >
        <stop offset="0" style="stop-color: #5d2c91" />
        <stop offset="1" style="stop-color: #d6496f" />
      </linearGradient>
      <path
        fill="url(#SVGID_1_)"
        d="M360.984,90c-138.41,0-251.016,112.606-251.016,251.016c0,60.894,21.802,116.787,58.003,160.3L7.06,661.132  c-9.368,9.304-9.419,24.441-0.116,33.808c4.674,4.705,10.818,7.06,16.963,7.06c6.09,0,12.183-2.314,16.846-6.945l161.129-160.033  c43.34,35.606,98.767,57.009,159.103,57.009c43.062,0,85.556-11.096,122.883-32.089c11.508-6.471,15.59-21.047,9.118-32.556  c-6.471-11.507-21.047-15.592-32.556-9.118c-30.186,16.977-64.574,25.95-99.445,25.95c-112.046,0-203.203-91.157-203.203-203.203  s91.157-203.203,203.203-203.203s203.203,91.157,203.203,203.203c0,35.299-9.184,70.056-26.556,100.515  c-6.542,11.469-2.547,26.069,8.921,32.611c11.469,6.541,26.069,2.547,32.611-8.921C600.645,427.556,612,384.607,612,341.016  C612,202.606,499.394,90,360.984,90z"
      />
    </svg>
  </span>
  <form
    @submit.prevent
    v-else
    class="search__body search__body-1 open"
    action=""
  >
    <div @click="closeForm" class="close-search-1 close">
      <img src="@/assets/img/cancel-22.png" alt="" />
    </div>
    <div class="search__input">
      <input
        autofocus="true"
        v-model="query"
        type="text"
        placeholder="Поиск..."
      />
    </div>
  </form>
</template>

<script>
import _ from "lodash";

export default {
  props: ["toggleOuterOpen", "allSearch", "onDispatch"],
  data() {
    return {
      open: false,
      query: "",
    };
  },
  methods: {
    openForm() {
      this.open = true;
      if (this.toggleOuterOpen) {
        this.toggleOuterOpen();
      }
    },
    closeForm() {
      this.open = false;
      this.query = "";
      if (this.toggleOuterOpen) {
        this.toggleOuterOpen();
      }
      if (this.allSearch) {
        this.$store.commit("setChatId", null);
        this.$store.commit("setProgram", null);
        this.$store.commit("setMessages", []);
        this.$store.commit("setChatInfo", null);
      }
    },
    onChange() {
      this.$store.dispatch(this.onDispatch, this.query);
      if (this.allSearch) {
        this.$store.commit("setChatId", null);
        this.$store.commit("setProgram", null);
        this.$store.commit("setMessages", []);
        this.$store.commit("setChatInfo", null);
      }
    },
    debouncer: _.debounce((method) => {
      method();
    }, 500),
  },
  watch: {
    query() {
      if (this.query) {
        this.$store.commit("setSearch", true);
        this.$store.commit("setNeedUpdate", false);
        this.debouncer(this.onChange);
      } else {
        this.$store.commit("setSearch", false);
        this.$store.commit("setNeedUpdate", true);
        if (this.allSearch) {
          this.$store.dispatch("fetchChatsRequest");
          this.$store.dispatch("fetchUrgentChats");
        }
      }
    },
  },
};
</script>