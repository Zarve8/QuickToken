<template>
  <div class="container" style="margin-top: 90px;">
    <div class="row">
      <NFTCard :text="cards[index-1].text" :image="cards[index-1].image" :outline="cards[index-1].outline"
               v-for="index in cards.length" :key="index" :click="cards[index-1].redirectFunc"/>
    </div>
  </div>
</template>

<script>
import NFTCard from "@/components/NFTCard";
import {searchCompaniesByOwner} from "@/helpers";
import {getTime, periodToText} from "@/utils";
const liabilityImages = ["/LaibilityCard1.png", "/LaibilityCard2.png", "/LaibilityCard3.png"];
export default {
  name: "LiabilitiesPage",
  components: {NFTCard},
  methods: {
    async update(wallet) {
      [this.companies, this.portfolios] = await searchCompaniesByOwner(wallet, global.connection, global.DI);
      if(this.companies.length===0) return;
      global.company = this.companies[0];
      this.time = await getTime();
      this.portfolios.forEach(portfolio => {
          if(portfolio.status===3||portfolio.status===0) return;
          const end = parseInt(portfolio.end.toString());
          if(end <= this.time) {
            this.cards.push({
              image: liabilityImages[portfolio.image%3],
              text: "Expired",
              outline: "var(--red)",
              redirectFunc: () => {
                this.$router.push({ path: '/bank/payout', query: { portfolio: portfolio.publicKey.toBase58(), wallet: this.$route.query.wallet } })
              }
            })
          }
          else {
            this.cards.push({
              image: liabilityImages[portfolio.image%3],
              text: "Expiration "+periodToText(end-this.time),
              outline: "var(--text)",
              redirectFunc: () => {
                this.$router.push({ path: '/bank/payout', query: { portfolio: portfolio.publicKey.toBase58(), wallet: this.$route.query.wallet } })
              }
            })
          }
      });
    },
  },
  async mounted() {
    global.showLoading(true)
    try {
      this.time = await getTime();
      await this.update(global.getWallet(this).publicKey);
    }
    catch (e) {
      console.log(e);
      global.alertError(e);
    }
    global.showLoading(false)
  },
  data(){
    return {
      time: 0,
      companies: [],
      portfolios: [],
      cards: []
    }
  }
}
</script>
