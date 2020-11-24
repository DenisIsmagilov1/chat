<template>
  <div
    @click="setTemplateId"
    class="templates__line"
    :class="{ 'settings-templates-delete': deletable }"
  >
    <div class="templates__name">{{ template.name }}</div>
    <div class="templates__item">
      <div class="new-templates__image">
        <img v-if="template.image" :src="template.image" alt="" />
      </div>
      <span v-for="(text, index) in textArray" :key="index"
        >{{ text }}<br
      /></span>
    </div>
    <div
      v-if="deletable"
      @click="deleteTemplate"
      class="settings-templates-delete_item"
    >
      <img src="@/assets/img/delete.png" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  props: ["template", "deletable"],
  computed: {
    textArray() {
      return this.template.text.trim().split("\n");
    },
  },
  methods: {
    deleteTemplate() {
      this.$store.dispatch("deleteTemplateRequest", this.template.id);
    },
    setTemplateId() {
      if (!this.deletable) {
        this.$store.commit("setTemplateId", this.template.id);
        this.$store.commit("closePopups");
        this.$store.commit("setNewChatTemplatePopup", false);
      }
    },
  },
};
</script>