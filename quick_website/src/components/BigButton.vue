<template>
  <button type="button" class="small-button" v-on:click="func" :style="overrideStyle? overrideStyle : ''">
    <b>{{text}}</b>
  </button>
</template>

<script>
export default {
  name: "BigButton",
  props: ["text", "func", "overrideStyle"]
}
</script>

<style scoped>
.small-button {
  background-color: var(--none);
  outline: var(--none);
  border-radius: 10px;
  color: var(--white);
  border: 1px solid var(--cyan);
  padding: 2px;
  width: 220px;
}
.small-button:hover {
  color: var(--white-hover);
  border: 1px solid var(--cyan-hover);
}
.small-button:active {
  color: var(--white-press);
  border: 1px solid var(--cyan-press);
}
.small-button:disabled {
  color: var(--white-disabled);
  border: 1px solid var(--cyan-disabled);
}
</style>