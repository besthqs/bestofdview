<template>
  <div class="ofd-view-container"><OfdViewComp></OfdViewComp></div>
</template>
<script setup lang="ts">
import OfdViewComp from "../packages/OfdViewComp/index.vue";
</script>
<style scoped>
.ofd-view-container {
  width: 100%;
  height: calc(100vh - 100px);
}
</style>
