<template>
  <div>
    <h1>test</h1>
    <div class="ofd-main">
      <div class="ofd-left">
        <label
          ><input
            type="checkbox"
            v-model="showOpenFileButton"
          />显示打开文件按钮</label
        >

        <button @click="open999ofd">打开999.ofd</button>
      </div>
      <div class="ofd-right">
        <testOfdview
          :showOpenFileButton="showOpenFileButton"
          :ofdLink="ofdLink"
          v-if="showOfdCmp"
        ></testOfdview>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import testOfdview from "./components/testOfdview.vue";

const showOpenFileButton = ref(true);
const showOfdCmp = ref(true);
const ofdLink = ref<string>();
const open999ofd = () => {
  console.log("打开999.ofd");
  showOfdCmp.value = false;
  requestAnimationFrame(() => {
    ofdLink.value = "./999.ofd";
    showOfdCmp.value = true;
  });
};
</script>
<style scoped>
.ofd-main {
  display: flex;
}

.ofd-left {
  width: 100px;
}

.ofd-right {
  width: calc(100% - 100px);
}
</style>
