<template>
  <div @click="setFolder" class="letters-chat__item">

    <div class="letters-chat__item_grey">
      <img :src="folder.img" alt="" />
    </div>
    <div class="letters-chat__item_hover">
      <img :src="folder.imgHover" alt="" />
    </div>
    <div class="letters-chat__text" :class="{ visible: visible }">
      {{ folder.name }} ({{ count }})
    </div>
  </div>
</template>

<script>
export default {
  props: ["folder", "visible", "count"],
  methods: {
    setFolder() {
      this.$store.commit("setFolder", this.folder);
      if (this.folder.type === "read") {
        this.$store.dispatch("fetchChatsRequest");
      } else if (this.folder.type === "unread") {
        this.$store.commit("addChats", []);
        this.$store.commit("setLoaded", true);
        this.$store.dispatch("fetchUrgentChats");
      } else {
        this.$store.dispatch("fetchChatsRequest");
        this.$store.dispatch("fetchUrgentChats");
      }
    },
  },
};
</script>