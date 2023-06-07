<template>
  <div class="container" style="margin-top: 90px;">
    <div class="row">
      <div class="col-6 col-md-8">
        <div class="row">
          <BigNFTCard v-for="index in cards.length" :key="index" :index="index-1"
                   :text="cards[index-1].text" :image="cards[index-1].image"
                   :outline="(index - 1) === activeIndex? 'var(--white)' : 'var(--text)'"
                   :click="setActiveIndex"/>
        </div>
      </div>
      <AssetProfile :set-update-profile="setUpdateProfile" :remove-active-asset="removeActiveAsset"/>
    </div>
  </div>
</template>

<script>
import {searchSellingAssets} from "@/helpers";
import BigNFTCard from "@/components/BigNFTCard";
import AssetProfile from "@/components/AssetProfile";
const assetImages = ["/AssetCard1.png", "/AssetCard2.png", "/AssetCard3.png", "/AssetCard4.png", "/AssetCard5.png",
  "/AssetCard6.png", "/AssetCard7.png", "/AssetCard8.png", "/AssetCard9.png", "/AssetCard10.png"];
export default {
  name: "AssetMarket",
  components: {AssetProfile, BigNFTCard},
  methods: {
    setActiveIndex(value) {
      this.activeIndex = value;
      this.updateProfile(this.assets[value]);
    },
    setUpdateProfile(func) {
      this.updateProfile = func;
    },
    removeActiveAsset(){
      const index = this.activeIndex;
      this.activeIndex = -1;
      this.assets.splice(index, 1);
      this.cards.splice(index, 1);
      this.$forceUpdate();
    },
  },
  async mounted() {
    global.showLoading(true);
    this.assets = await searchSellingAssets(global.connection, global.DI);
    this.cards = [];
    this.assets.forEach(asset => {
      this.cards.push({text: "", image: assetImages[asset.image%10]});
    });
    global.showLoading(false)
  },
  data(){
    return {
      assets: [],
      updateProfile: () => {},
      activeIndex: -1,
      cards: []
    }
  }
}
</script>
