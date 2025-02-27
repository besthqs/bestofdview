<template>
  <div class="ofd-view-container">
    <OfdViewComp
      :showOpenFileButton="showOpenFileButton"
      :ofdLink="ofdLink"
    ></OfdViewComp>
  </div>
</template>
<script setup lang="ts">
import OfdViewComp from "../packages/OfdViewComp/index.vue";
defineProps<{ showOpenFileButton: boolean; ofdLink?: string }>();
</script>
<style scoped>
.ofd-view-container {
  width: 100%;
  height: calc(100vh - 100px);
}
</style>
