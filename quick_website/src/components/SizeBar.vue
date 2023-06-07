<template>
  <nav class="navbar navbar-expand" id="navbar">
    <h6 class="centered" style="color: white; text-align: center; margin-top: 20px; margin-left: 50vw;">
      {{width}}px: {{activeBreakpoint}}
    </h6>
  </nav>
</template>

<script>
export default {
  name: 'SizeBar',
  mounted() {
    new ResizeObserver(this.onResized).observe(document.getElementById('navbar'))
  },
  methods: {
    onResized() {
      const breakpointsBounds = [0, 576, 768, 992, 1200, 1400, 10000];
      const breakpointsName = ['extra sm', 'sm', 'md', 'lg', 'xl', 'xxl'];
      this.width = this.$vssWidth;
      for(let i = 0; i < breakpointsName.length; i++){
        if(this.width > breakpointsBounds[i] && this.width < breakpointsBounds[i+1]){
          this.activeBreakpoint = breakpointsName[i];
          return;
        }
      }
      this.activeBreakpoint = 'undefined';
    }
  },
  data() {
    return {
      width: 0,
      activeBreakpoint: 'none'
    }
  }
}
</script>


<style>
.navbar{
  background-color: var(--black);
  border-bottom: 1px solid var(--dark-grey);
  height: 100px;
}
</style>