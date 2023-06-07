<template>
  <div class="container mt-14">
    <div class="col-4 col-xl-3 main-title">
      <b>The first blockchain platform for the tokenization of financial assets</b>
      <br/>
      <div class="main-text">We enable investors to receive guaranteed income in fiat currency, and banks and enterprises to expand by selling loan
      portfolios from the balance sheet</div>
      <div class="row mt-14" style="display: grid; grid-auto-flow: column">
        <router-link :to="w('/bank')" type="button" class="main-button col-11 col-lg-10">
          For Banks
        </router-link>
        <router-link :to="w('/user')" type="button" class="main-button col-11 col-lg-10 justify-self-end">
          For Users
        </router-link>
      </div>
    </div>
    <img src="@/assets/graphics.png" class="graphics col-6 col-xl-4 offset-4 offset-xl-5"/>
  </div>
</template>

<script>
export default {
  name: "MainPage",
  methods: {
    w(path) {
      if(this.$route.query.wallet) return path + '?wallet='+this.$route.query.wallet
      return "/";
    },
  },
  mounted() {
    global.showLoading(false);
  }
}
</script>

<style scoped>
  .graphics {
    position: absolute;
  }
  .main-title{
    position: absolute;
    color: var(--white);
    font-size: 30px;
  }
  .main-text {
    color: var(--grey);
    font-size: 15px;
  }
  .main-button {
    background-color: var(--none);
    outline: var(--none);
    border-radius: 10px;
    color: var(--white);
    border: 1px solid var(--cyan);
    padding: 2px;
    text-align: center;
    height: 40px;
    font-size: 20px;
  }
  .main-button:hover {
    color: var(--white-hover);
    border: 1px solid var(--cyan-hover);
  }
  .main-button:active {
    color: var(--white-press);
    border: 1px solid var(--cyan-press);
  }
  .main-button:disabled {
    color: var(--white-disabled);
    border: 1px solid var(--cyan-disabled);
  }
</style>