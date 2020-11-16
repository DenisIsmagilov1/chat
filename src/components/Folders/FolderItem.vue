<template>
  <div @click="setFolder" class="letters-chat__item letters-chat__item_round">
    <div v-if="folder.img" class="letters-chat__item_s">
      <img :src="folder.img" alt="" />
    </div>
    <div v-else class="letters-chat__item_s">
      <img src="@/assets/img/group_1_копия.png" alt="" />
    </div>
    <div class="letters-chat__text" :class="{ visible: visible }">
      {{ folder.name }} ({{ count }})
    </div>
    <div
      @click.stop="deleteFolder"
      class="letters-chat__delete"
      :class="{ visible: !folder.program && visible }"
    >
      <img src="@/assets/img/cancel-22.png" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  props: ["folder", "visible", "count"],
  methods: {
    setFolder() {
      this.$store.commit("setFolder", this.folder);
      this.$store.dispatch("fetchChatsRequest");
    },
    deleteFolder() {
      this.$store.dispatch("deleteFolderRequest", this.folder.id);
    },
  },
};
</script>