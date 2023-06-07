<template>
  <div class="container">
    <div class="bottom-popup" id="load-popup">
      <div class="spinner-border reload" role="status"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoadPopup",
}
</script>

<style scoped>
.bottom-popup {
  display: none;
  position: absolute;
  width: 200px;
  height: 50px;
  border-radius: 15px;
  background-color: rgba(10, 10, 10, 0.95);
  box-shadow: inset 0px 0px 20px rgba(255,255,255,0.1);
  margin-top: calc(100vh - 90px);
}
.reload{
  justify-self: center;
  width: 36px;
  height: 36px;
  font-size: 20px;
  color: #99FFFF;
  margin-top: 7px;
  margin-left: 82px;
}
</style>