<template>
  <div class="navbar-expand nav_background">
    <div class="container">
      <div class="navbar" v-if="$route.path==='/'">
        <div type="button" class="nav-item" v-on:click="toMain">
          <img src="@/assets/logo.png" style="height: 50px; margin-top: -10px;">
        </div>
        <router-link :to="w('/bank')" class="nav-element">Bank</router-link>
        <router-link :to="w('/user')" class="nav-element">User</router-link>
        <wallet-multi-button dark></wallet-multi-button>
      </div>
      <div class="navbar" v-else-if="$route.path==='/user'||$route.path==='/user/buy'">
        <router-link to="/" class="nav-item">
          <img src="@/assets/logo.png" style="height: 50px; margin-top: -10px;">
        </router-link>
        <router-link :to="w('/bank')" class="nav-element">Bank</router-link>
        <div class="nav-element-chosen" v-if="$route.path==='/user'">Pocket</div>
        <router-link :to="w('/user')" class="nav-element" v-else>Pocket</router-link>
        <div class="nav-element-chosen" v-if="$route.path==='/user/buy'">Market</div>
        <router-link :to="w('/user/buy')" class="nav-element" v-else>Market</router-link>
        <wallet-multi-button dark></wallet-multi-button>
      </div>
      <div class="navbar" v-else-if="$route.path==='/bank'||$route.path==='/bank/query'||$route.path==='/bank/payout'">
        <router-link to="/" class="nav-item">
          <img src="@/assets/logo.png" style="height: 50px; margin-top: -10px;">
        </router-link>
        <div class="nav-element-chosen" v-if="$route.path==='/bank'">Liabilities</div>
        <router-link :to="w('/bank')" class="nav-element" v-else>Liabilities</router-link>
        <div class="nav-element-chosen" v-if="$route.path==='/bank/query'">Query</div>
        <div class="nav-element" type="button" v-on:click="toQuery" v-else>Query</div>
        <router-link :to="w('/user')" class="nav-element">User</router-link>
        <wallet-multi-button dark></wallet-multi-button>
      </div>
    </div>
  </div>
</template>


<script>
import { WalletMultiButton } from 'solana-wallets-vue';
export default {
  name: "NavBar",
  components: {
    WalletMultiButton
  },
  methods: {
    toMain(){
      window.open('/', "_self");
    },
    w(path) {
      if(this.$route.query.wallet) return path + '?wallet='+this.$route.query.wallet
      return "/";
    },
    toQuery(){
      let query = {};
      if(this.$route.query.wallet) query["wallet"] = this.$route.query.wallet;
      if(global.company) query["company"] = global.company.publicKey.toBase58();
      this.$router.push({ path: '/bank/query', query: query});
    }
  }
}
</script>

<style>
#app .swv-button-trigger p {
  margin-top: 0px;
}
</style>

<style scoped>
.navbar-expand{
  margin-bottom: 20px;
}
.navbar{
  padding-top: 25px;
  padding-bottom: 25px;
}
.nav-element {
  color: var(--white);
  text-decoration: none;
  font-weight: bold;
}
.nav-element-chosen {
  color: #4ac4c4;
  text-decoration: none;
  font-weight: bold;
}
</style>