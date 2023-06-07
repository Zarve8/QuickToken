<template>
  <button type="button" class="small-button" v-on:click="func" :style="overrideStyle? overrideStyle : ''">
    {{text}}
  </button>
</template>

<script>
export default {
  name: "SmallButton",
  props: ["text", "func", "overrideStyle"]
}
</script>

<style scoped>
.small-button {
  background-color: var(--none);
  outline: var(--none);
  border-radius: 10px;
  color: var(--title);
  border: 1px solid var(--cyan);
  padding: 2px;
  width: 110px;
}
.small-button:hover {
  color: var(--title-hover);
  border: 1px solid var(--cyan-hover);
}
.small-button:active {
  color: var(--title-press);
  border: 1px solid var(--cyan-press);
}
.small-button:disabled {
  color: var(--title-disabled);
  border: 1px solid var(--cyan-disabled);
}
</style>