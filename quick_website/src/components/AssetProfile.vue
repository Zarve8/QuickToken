<template>
  <div class="col-6 col-md-4" v-if="asset">
  <div style="position: absolute; width: 0; height: 65%; border: 1px solid var(--title); margin-left: -15px;"></div>
  <b class="my-row" style="color: var(--white)">{{companyName}}</b>
  <div class="my-row d-none d-md-block" style="color: var(--text)">{{description}}</div>
  <b class="my-row" style="color: var(--white)">Assets</b>
  <div class="my-row d-flex" v-for="index in bonds.length" :key="index">
    <div class="title" style="margin-right: 10px;">{{bonds[index-1].name}}</div>
    <div class="title" style="margin-right: 10px;">{{bonds[index-1].amount}} USDT</div>
    <div class="title" style="margin-right: 10px;">{{bonds[index-1].rate}}%</div>
  </div>
  <div class="my-row d-flex">
    <div style="margin-right: 10px; color: var(--white)">Total Amount</div>
    <div style="color: var(--cyan)">{{amount}} USDT</div>
  </div>
  <div class="my-row d-flex">
    <div style="margin-right: 10px; color: var(--white)">Rate</div>
    <div style="color: var(--cyan)">{{rate}}%</div>
  </div>
  <div class="my-row d-flex" style="margin-bottom: 20px;">
    <div style="margin-right: 10px; color: var(--white)">Expiration</div>
    <div style="color: var(--cyan)">{{expiration}}</div>
  </div>
  <BigButton text="Buy" :func="buy"/>
  </div>
</template>

<script>
import BigButton from "@/components/BigButton";
import {displayNumber, getTime, periodToText, rateToStr} from "@/utils";
import BigInteger from "big-integer";
import {buyAssetTx} from "@/helpers";
import {Transaction} from "@solana/web3.js";
export default {
  name: "AssetProfile",
  props: ["setUpdateProfile", "removeActiveAsset"],
  components: {BigButton},
  methods: {
    async update(asset) {
      this.asset = asset;
      this.portfolio = await global.DI.getPortfolioInstance(asset.portfolio);
      this.company = await global.DI.getCompanyInstance(this.portfolio.company);
      this.companyName = this.company.name.value;
      this.description = this.company.description.value;
      this.bonds = [];
      const period = parseInt(this.portfolio.period.toString());
      let sum = BigInteger("0");
      let reward = BigInteger("0");
      const bpDec = 10000;
      const bondArray = this.portfolio.bonds.array;
      this.asset.participation.forEach(index => {
        const bond = bondArray[index];
        const amount = bond.amount.divide(BigInteger(bond.used.toString()));
        sum = sum.add(amount);
        reward = reward.add(amount.multiply(BigInteger((bpDec + bond.rate).toString())).divide(BigInteger(bpDec.toString())));
        this.bonds.push({
          name: bond.name.value,
          amount: displayNumber(amount, 6),
          rate: rateToStr(bond.rate, period)
        })
      });
      const time = await getTime();
      this.expiration = periodToText(this.portfolio.end - time);
      this.amount = displayNumber(sum, 6);
      this.rate = rateToStr(parseFloat(reward.multiply(BigInteger(bpDec.toString())).toString())/parseFloat(sum.toString())-bpDec, period);
    },
    async buy() {
      try {
        const tx = new Transaction();
        tx.add(await buyAssetTx(global.getWallet(this).publicKey, this.asset, this.portfolio, this.company));
        await global.signTx(tx, []);
        this.asset = undefined;
        this.removeActiveAsset();
      }
      catch (e) {
        console.log(e);
        global.alertError(e);
      }
    }
  },
  async mounted() {
    this.setUpdateProfile(this.update)
  },
  data() {
    return {
      bonds: [],
      asset: undefined,
      company: undefined,
      portfolio: undefined,
      companyName: "",
      description: "",
      amount: "",
      expiration: "",
      rate: "",
    }
  }
}
</script>
