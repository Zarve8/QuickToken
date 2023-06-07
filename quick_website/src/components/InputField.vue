<template>
  <input v-if="rows===undefined" class="input-field"
         :value="text.value"
         @input="event => text.setValue(filter(event.target.value, event))"
         :placeholder="placeholder"
         aria-label="" aria-describedby="basic-addon3"
         :style="(styleOverride? styleOverride : '')
         + (centerText? 'text-align: center;' : '')
         + (minHeight? 'min-height: '+minHeight + 'px;' : '')
         + (maxWidth? 'max-width: '+maxWidth+'px;' : 'width: 100%;')"/>
  <textarea v-else class="input-field"
            :value="text.value"
            @input="event => text.setValue(filter(event.target.value, event))"
            :placeholder="placeholder"
            aria-label="" aria-describedby="basic-addon3"
            :style="(styleOverride? styleOverride : '')
         + (centerText? 'text-align: center;' : '')
         + (minHeight? 'min-height: '+minHeight + 'px;' : '')
         + (maxWidth? 'max-width: '+maxWidth+'px;' : 'width: 100%;')"/>
</template>

<script>
export default {
  name: "InputField",
  props: ["placeholder", "text", "maxWidth", "minHeight", "centerText", "styleOverride", "onlyNumber", "maxLetters", "rows"],
  methods: {
    filter(value, event) {
      if(this.onlyNumber) {
        value = value.replace(/\D/g,'');;
      }
      if(this.maxLetters) {
        value = value.slice(0, this.maxLetters);
      }
      event.target.value = value;
      return value;
    }
  }
}
</script>

<style scoped>
.input-field {
  background-color: var(--none);
  border-radius: 10px;
  border: 1px solid var(--border);
  outline: none;
  padding: 2px 10px 2px 10px;
  color: var(--grey);
  overflow: clip;
}
.input-field:active {
  outline: 1px solid transparent;
}
</style>