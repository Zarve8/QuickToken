<template>
  <div style="overflow: hidden; border-radius: 25px; padding: 0px;"
       class="col-3 col-md-2 col-lg-2 col-xl-2 m-1 m-md-1 m-lg-2 m-lg-2 square"
       :style="outline? 'border: 1px solid '+outline+';' : ''"
       type="button" v-on:click="click(index)">
    <img :src="image" style="height: 100%; width: 100%;"/>
    <div style="position: relative; height:0; width: 100%;">
      <div style="color: var(--white); position: absolute; text-align: center; margin-top: -25px; width: 100%;">{{text}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NFTCard",
  props: ["text", "image", "click", "outline", "overrideClass", "index"]
}
</script>
