<template>
  <div>
    <MailFolderItem
      v-for="folder of mailFolders"
      :key="folder.id"
      :folder="folder"
      :visible="folderIsOpen"
      :count="$store.getters.getQtyFolder(folder)"
    />
    <FolderItem
      v-for="folder of programFolders"
      :key="folder.id"
      :folder="folder"
      :visible="folderIsOpen"
      :count="$store.getters.getQtyFolder(folder)"
    />
    <FolderItem
      v-for="folder of folders"
      :key="folder.id"
      :folder="folder"
      :visible="folderIsOpen"
      :count="$store.getters.getQtyFolder(folder)"
    />
  </div>
</template>

<script>
import FolderItem from "./FolderItem";
import MailFolderItem from "./MailFolderItem";

export default {
  components: {
    FolderItem,
    MailFolderItem,
  },
  computed: {
    folderIsOpen() {
      return this.$store.state.meta.foldersIsOpen;
    },
    mailFolders() {
      return this.$store.state.folders.mailFolders;
    },
    programFolders() {
      return this.$store.state.folders.programFolders;
    },
    folders() {
      return this.$store.state.folders.folders;
    },
    getQtyFolder(folder) {
      if (folder.program) {
        return this.$store.state.folders.qtyFolders.program[folder.program];
      }
      return 0;
    },
  },
  mounted() {
    this.$store.dispatch("fetchFoldersRequest");
    this.$store.dispatch("fetchQtyFoldersRequest");
    setInterval(() => this.$store.dispatch("fetchQtyFoldersRequest"), 5000);
  },
};
</script>