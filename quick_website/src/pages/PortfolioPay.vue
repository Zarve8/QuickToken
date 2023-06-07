<template>
  <div class="container pool col-12 col-md-9 col-lg-7 col-xl-6 col-xxl-5">
    <div class="my-row" style="margin-bottom: 20px">
      <b class="title">Payout</b>
      <SmallButton text="Demo" override-style="position: relative; float: right;" :func="demo"/>
    </div>
    <div class="row my-row gy-3">
      <div v-for="index in assetNames.length" :key="index" class="col-6 col-md-4 col-xl-3 d-flex">
        <div style="color: var(--cyan); position: relative; margin-left: auto; right: 5px;">{{assetNames[index-1]}}</div>
        <TickForm :array="assetPayments" :index="index-1" override-style="position: relative; margin-left: auto; right: 5px;"/>
      </div>
    </div>
    <div class="my-row d-flex" style="margin-bottom: 20px">
      <div style="color: var(--text)">Total Sum</div>
      <div style="color: var(--cyan); margin-left: 25px;">{{sumText}} USDT</div>
    </div>
    <div class="my-row" style="display: flex; justify-content: center;">
      <BigButton text="Submit" :func="submit"/>
    </div>
  </div>
</template>

<script>
import BigButton from "@/components/BigButton";
import SmallButton from "@/components/SmallButton";
import TickForm from "@/components/TickForm";
import {State} from "@/utils";
import {payoutTx, stopSalesTx} from "@/helpers";
import {PublicKey, Transaction} from "@solana/web3.js";
import BigInteger from "big-integer";
import {displayNumber} from "@/utils";
export default {
  name: "PortfolioPay",
  components: {TickForm, SmallButton, BigButton},
  methods: {
    demo() {
      this.assetPayments.setValue([1, 0, 1]);
    },
    updateValue(){
      const bpDec = 10000;
      this.sum = BigInteger("0");
      const mask = this.assetPayments.value;
      const bonds = this.Portfolio.bonds.array;
      for(let i = 0; i < mask.length; i++) {
        if(mask[i] && bonds[i].used){
          this.sum = this.sum.add(BigInteger((bonds[i].sold * (bonds[i].rate + bpDec)).toString())
              .multiply(bonds[i].amount)
              .divide(BigInteger((bonds[i].used*bpDec).toString())));
        }
      }
      this.sumText = displayNumber(this.sum, 6);
    },
    setAssetPayment(value) {
      this.assetPayments = value;
      this.updateValue();
    },
    async submit() {
      try{
        const wallet = global.getWallet(this).publicKey;
        const tx = new Transaction();
        tx.add(await stopSalesTx(wallet, this.Portfolio));
        tx.add(await payoutTx(wallet, this.Portfolio, this.assetPayments.value));
        await global.signTx(tx, []);
        this.$router.push({ path: '/bank', query: {wallet: this.$route.query.wallet}});
      }
      catch (e) {
        console.log(e);
        global.alertError(e);
      }
    },
  },
  async mounted() {
    const portfolioAddress = this.$route.query.portfolio;
    this.Portfolio = await global.DI.getPortfolioInstance(new PublicKey(portfolioAddress));
    this.Portfolio.bonds.array.forEach(bond => {
      this.assetNames.push(bond.name.value);
    });
    this.assetPayments.setValue(Array(this.Portfolio.bonds.length).fill(1));
    this.updateValue();
  },
  data() {
    return {
      sum: 0,
      sumText: "0",
      Portfolio: undefined,
      assetNames: [],
      assetPayments: new State([])
    }
  }
}
</script>

<style scoped>

</style>