<template>
  <div
    class="templates"
    :class="{
      open:
        $store.getters.getStatusPopup('templates') ||
        ($store.state.meta.newChatTemplatePopup && writeFirst),
      'templates-2': writeFirst,
    }"
  >
    <div @click="close" class="close-new close">
      <img src="@/assets/img/cancel-22.png" alt="" />
    </div>
    <div class="templates__header">
      <div class="templates__title">Ваши шаблоны</div>
      <form action="" class="templates__search templates__search-2">
        <div>
          <input
            v-model="searchString"
            type="text"
            placeholder="Поиск по названию..."
          />
          <img src="@/assets/img/search.png" alt="" />
        </div>
        <span class="templates__search_close">
          <img src="@/assets/img/cancel-22.png" alt="">
        </span>
      </form>
    </div>
    <div class="templates__content">
      <TemplateItem
        v-for="template of templates"
        :key="template.id"
        :template="template"
      />
    </div>
  </div>
</template>

<script>
import TemplateItem from "./TemplateItem";

export default {
  props: ["writeFirst"],
  data() {
    return {
      searchString: "",
    };
  },
  components: {
    TemplateItem,
  },
  computed: {
    templates() {
      const templates = this.$store.state.options.options.templates || [];
      return templates.filter((template) =>
        template.name.toLowerCase().includes(this.searchString.toLowerCase())
      );
    },
  },
  methods: {
    close() {
      if (this.writeFirst) {
        this.$store.commit("toggleNewChatTemplatePopup");
      } else {
        this.$store.commit("closePopups");
      }
    },
  },
};
</script>