<template>
  <button @click="handleClick">bx button</button>
</template>
<script setup lang="ts">
const handleClick = () => {
  alert("bx button clicked");
};
</script>
