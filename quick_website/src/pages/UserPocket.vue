<template>
  <div class="container" style="margin-top: 90px;">
    <div class="row">
      <div class="col-6 col-md-8">
        <div class="row">
          <NFTCard v-for="index in cards.length" :key="index" :index="index-1"
                   :text="cards[index-1].text" :image="cards[index-1].image"
                   :outline="(index - 1) === activeIndex? cards[index-1].outlineChosen : cards[index-1].outline"
                   :click="setActiveIndex"/>
        </div>
      </div>
      <div class="col-6 col-md-4">
        <AssetPayment :set-update-profile="setUpdateProfile" :remove-active-asset="removeActiveAsset"/>
      </div>
    </div>
  </div>
</template>

<script>
import NFTCard from "@/components/NFTCard";
import AssetPayment from "@/components/AssetPayment";
import {searchOwnedAssets} from "@/helpers";
import {getTime, periodToText} from "@/utils";
const assetImages = ["/AssetCard1.png", "/AssetCard2.png", "/AssetCard3.png", "/AssetCard4.png", "/AssetCard5.png",
  "/AssetCard6.png", "/AssetCard7.png", "/AssetCard8.png", "/AssetCard9.png", "/AssetCard10.png"];
export default {
  name: "UserPocket",
  components: {AssetPayment, NFTCard},
  methods: {
    setActiveIndex(value) {
      this.activeIndex = value;
      this.updateProfile(this.assets[value], this.portfolios[value]);
    },
    removeActiveAsset(){
      const index = this.activeIndex;
      this.activeIndex = -1;
      this.assets.splice(index, 1);
      this.cards.splice(index, 1);
      this.$forceUpdate();
    },
    async update() {
      this.assets = await searchOwnedAssets(global.getWallet(this).publicKey, global.connection, global.DI);
      this.portfolios = [];
      this.cards = [];
      for(let i = 0; i < this.assets.length; i++) {
        const asset = this.assets[i];
        const portfolio = await global.DI.getPortfolioInstance(asset.portfolio);
        this.portfolios.push(portfolio);
        const end = parseInt(portfolio.end.toString());
        if(end <= this.time) {
          console.log(end, this.time);
          this.cards.push({
            text: "Expired",
            image: assetImages[asset.image%10],
            outline: "var(--cyan-press)",
            outlineChosen: "var(--cyan-hover)"
          })
        }
        else {
          this.cards.push({
            text: "Expiration: "+periodToText(end-this.time),
            image: assetImages[asset.image%10],
            outline: "var(--dark-grey)",
            outlineChosen: "var(--white)"
          })
        }
      }
    },
    setUpdateProfile(func) {
      this.updateProfile = func;
    }
  },
  async mounted() {
    global.showLoading(true);
    this.time = await getTime();
    await this.update();
    global.showLoading(false);
  },
  data(){
    return {
      time: 0,
      assets: [],
      portfolios: [],
      activeIndex: -1,
      cards: [],
      updateProfile: () => {},
    }
  }
}
</script>
