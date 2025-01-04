<template>
  <div><OfdViewComp :sealClick="sealClick"></OfdViewComp></div>
</template>
<script setup lang="ts">
import OfdViewComp from "../packages/OfdViewComp/index.vue";
const sealClick = (seal: any) => {
  alert(JSON.stringify(seal));
};
</script>
