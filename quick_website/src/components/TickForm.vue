<template>
  <button v-if="array.value[index] > 0" type="button" class="tick-active" v-on:click="click" :style="overrideStyle">
    <span class="checkmark">&#10003;</span>
  </button>
  <button v-else type="button" class="tick-passive" v-on:click="click" :style="overrideStyle">
    <span class="checkmark" style="visibility: collapse">&#10003;</span>
  </button>
</template>

<script>
export default {
  name: "TickForm",
  props: ["array", "index", "overrideStyle"],
  methods: {
    click(){
      let array = this.array.value;
      array[this.index] ^= 1;
      this.array.setValue(array);
    }
  }
}
</script>

<style scoped>
.tick-active{
  width: 25px;
  height: 25px;
  background-color: #D1D1E5;
  border: 1px solid var(--border);
  border-radius: 5px;
}
.tick-passive{
  width: 25px;
  height: 25px;
  background-color: var(--none);
  border: 1px solid var(--border);
  border-radius: 5px;
}
.checkmark {
  font-size: 15px;
  color: var(--title);
}
</style>