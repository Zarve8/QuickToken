<template>
  <div class="col-6 col-md-4" v-if="asset">
    <div style="position: absolute; width: 0; height: 65%; border: 1px solid var(--title); margin-left: -15px;"></div>
    <b class="my-row" style="color: var(--white)">{{companyName}}</b>
    <div class="my-row d-none d-md-block" style="color: var(--text)">{{description}}</div>
    <b class="my-row" style="color: var(--white)">Assets</b>
    <div class="my-row d-flex" v-for="index in bonds.length" :key="index">
      <div style="margin-right: 10px;" :style="bonds[index-1].b? 'color: var(--cyan)' : 'color: var(--title)'">{{bonds[index-1].name}}</div>
      <div style="margin-right: 10px;" :style="bonds[index-1].b? 'color: var(--cyan)' : 'color: var(--title)'">{{bonds[index-1].amount}}USDT</div>
      <div style="margin-right: 10px;" :style="bonds[index-1].b? 'color: var(--cyan)' : 'color: var(--title)'">{{bonds[index-1].rate}}%</div>
    </div>
    <div class="my-row d-flex" >
      <div style="margin-right: 10px; color: var(--white)">Total Amount</div>
      <div style="color: var(--cyan)">{{amount}} USDT</div>
    </div>
    <div class="my-row d-flex"  v-if="expiration">
      <div style="margin-right: 10px; color: var(--white)">Expiration</div>
      <div style="color: var(--cyan)">{{expiration}}</div>
    </div>
    <BigButton text="Cash Out" :func="cashOut" style="margin-top: 20px;" v-if="this.portfolio.status===3"/>
  </div>
</template>

<script>
import BigButton from "@/components/BigButton";
import {displayNumber, getTime, periodToText, rateToStr} from "@/utils";
import BigInteger from "big-integer";
import {cashOutTx} from "@/helpers";
import {Transaction} from "@solana/web3.js";
export default {
  name: "AssetPayment",
  props: ["setUpdateProfile", "removeActiveAsset"],
  components: {BigButton},
  methods: {
    async update(asset, portfolio) {
      this.asset = asset;
      this.portfolio = portfolio;
      this.company = await global.DI.getCompanyInstance(this.portfolio.company);
      this.companyName = this.company.name.value;
      this.description = this.company.description.value;
      this.bonds = [];
      let sum = BigInteger("0");
      const bpDec = 10000;
      const bondArray = this.portfolio.bonds.array;
      let mask = this.portfolio.payout_mask;
      if(this.portfolio.status!==3) mask = new Array(this.portfolio.payout_mask.length).fill(1);
      const period = parseInt(this.portfolio.period.toString());
      this.asset.participation.forEach(index => {
        const bond = bondArray[index];
        const amount = bond.amount.multiply(BigInteger(bpDec + bond.rate).toString()).divide(BigInteger((bond.used*bpDec).toString()));
        if(mask[index] > 0 || this.portfolio.status!==3) {
          sum = sum.add(amount);
          this.bonds.push({
            name: bond.name.value,
            amount: displayNumber(amount, 6),
            rate: rateToStr(bond.rate, period),
            b: this.portfolio.status===3
          })
        }
        else {
          this.bonds.push({
            name: bond.name.value,
            amount: displayNumber(amount, 6),
            rate: rateToStr(bond.rate, period),
            b: false
          })
        }
      });
      this.amount = displayNumber(sum, 6);
      const time = await getTime();
      const end = parseInt(this.portfolio.end.toString());
      this.expiration = end > time? periodToText(end - time) : undefined;
    },
    async cashOut() {
      try {
        const tx = new Transaction();
        tx.add(await cashOutTx(global.getWallet(this).publicKey, this.asset, this.portfolio, this.company));
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
      expiration: undefined,
      bonds: [],
      asset: undefined,
      company: undefined,
      portfolio: undefined,
      companyName: "",
      description: "",
      amount: "",
    }
  }
}
</script>

