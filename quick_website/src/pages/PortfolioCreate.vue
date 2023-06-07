<template>
  <div class="container pool col-12 col-md-9 col-lg-7 col-xl-6 col-xxl-5">
    <div class="my-row" style="margin-bottom: 20px">
      <b class="title">Make a Query</b>
      <SmallButton text="Demo" override-style="position: relative; float: right;" :func="demo"/>
    </div>
    <InputField v-if="Company===undefined" placeholder="Company Name" style-override="margin-bottom: 10px;" :text="companyName" :max-letters="20"/>
    <InputField v-if="Company===undefined" placeholder="Description" style-override="margin-bottom: 10px;" :rows="5"
                :min-height="100" :text="description" :max-letters="199"/>
    <div class="my-row">
      <b class="title">Expiration</b>
      <div style="position: relative; float: right;">
        <InputField placeholder="period" max-width="75" :text="period" :center-text="true" :max-letters="5"/>
      </div>
    </div>
    <div class="my-row">
      <b class="title">Portfolio</b>
      <SmallButton text="Add" override-style="position: relative; float: right;" :func="addPortfolio"/>
    </div>
    <div v-for="index in bonds.length" :key="index" class="my-row">
      <InputField placeholder="Name" max-width="175" :text="bonds[index-1].name" style-override="margin-right: 20px;"
                  :center-text="true" :max-letters="12"/>
      <InputField placeholder="Amount" max-width="100" :text="bonds[index-1].amount" style-override="margin-right: 20px;"
                  :center-text="true" :max-letters="8" :only-number="true"/>
      <InputField placeholder="Rate" max-width="60" :text="bonds[index-1].rate" style-override="margin-right: 20px;"
                  :center-text="true" :max-letters="4" :only-number="true"/>
      <div type="button" v-on:click="removePortfolio(index-1)" class="cross">❌</div>
    </div>
    <div class="my-row">
      <b class="title">Payment Matrix</b>
      <SmallButton text="Add" override-style="position: relative; float: right;" :func="addPaymentRow"/>
    </div>
    <div class="my-row" style="display: flex;">
      <div v-for="index in bonds.length" :key="index" style="color: var(--cyan); margin-right: 10px; width: 100px; text-align: center;">
        {{ bonds[index - 1].name.value }}
      </div>
    </div>
    <div v-for="j in assetsNumber" :key="j" class="my-row" style="display: flex;">
      <div v-for="i in bonds.length" :key="i"
           style="color: var(--cyan); margin-right: 10px; width: 100px; display: flex; justify-content: center;">
        <TickForm :array="paymentMatrix[i-1]" :index="j-1"/>
      </div>
      <div type="button" v-on:click="removePaymentRow(j-1)" class="cross" style="position: relative; margin-left: auto; right: 0;">❌</div>
    </div>
    <div class="my-row" style="display: flex; justify-content: center;">
      <BigButton text="Submit" :func="submit"/>
    </div>
  </div>
</template>


<script>
import InputField from "@/components/InputField";
import SmallButton from "@/components/SmallButton";
import {percentToRate, State} from "@/utils";
import TickForm from "@/components/TickForm";
import BigButton from "@/components/BigButton";
import {Transaction} from "@solana/web3.js";
import {PublicKey} from "@solana/web3.js";
import {
  createCompanyTx,
  createPortfolioTx, getPortfolioAddress,
  insertBondTx,
  mintAssetTx,
  searchCompaniesByOwner,
  startPortfolioTx
} from "@/helpers";
export default {
  name: "PortfolioCreate",
  components: {BigButton, TickForm, SmallButton, InputField},
  methods: {
    demo(){
      this.companyName.setValue("J.P. Morgan");
      this.description.setValue("JPMorgan Chase (NYSE: JPM) is one of the oldest financial institutions in the United States. With a history dating back over 200 years, here's where we stand today.");
      this.bonds = [
        {name: new State("FMHI"), amount: new State("16000"), rate: new State("5")},
        {name: new State("LTPZ"), amount: new State("8000"), rate: new State("15")},
        {name: new State("TIP"), amount: new State("12000"), rate: new State("8")},
      ];
      this.paymentMatrix = [
        new State([1, 1, 0, 0, 1, 1]),
        new State([0, 0, 1, 1, 1, 1]),
        new State([1, 1, 1, 1, 0, 1])];
      this.assetsNumber = 6;
      this.period = new State("120");
    },
    addPortfolio() {
      if(this.bonds.length >= 5) return;
      this.bonds.push({name: new State(""), amount: new State(""), rate: new State("")});
      this.paymentMatrix.push(new State(Array(this.assetsNumber).fill(0)));
    },
    removePortfolio(index) {
      if(this.bonds.length <= 1) return;
      this.bonds.splice(index, 1);
      this.paymentMatrix.splice(index, 1);
    },
    addPaymentRow() {
      if(this.assetsNumber >= 10) return;
      this.assetsNumber += 1;
      for(let i = 0; i < this.paymentMatrix.length; i++) {
        this.paymentMatrix[i].setValue(this.paymentMatrix[i].value.concat([0]))
      }
    },
    removePaymentRow(index) {
      if(this.assetsNumber <= 1) return;
      this.assetsNumber -= 1;
      for(let i = 0; i < this.paymentMatrix.length; i++) {
        this.paymentMatrix[i].value.splice(index, 1);
      }
    },
    async submit() {
      try {
        let tx = new Transaction();
        let signers = [];
        if(this.Company!==undefined) {
          this.companyName.setValue(this.Company.name.value);
          this.description.setValue(this.Company.description.value);
        }
        if(this.companyName==="") throw "Empty company name";
        if(this.description==="") throw "Empty description";
        if(this.period.value==="0"||this.period.value==="") throw "Null period";
        const wallet = global.getWallet(this).publicKey;
        this.bonds.forEach(({name, amount, rate}) => {
          if(name.value==="") throw "Empty bond name";
          if(amount.value===""||amount.value==="0") throw "Null amount";
          if(rate.value===""||rate.value==="0") throw "Null rate";
        });
        for(let i = 0; i < this.bonds.length; i++){
          let usedAssetsCount = 0;
          for(let j = 0; j < this.assetsNumber; j++) {
            if(this.paymentMatrix[i].value[j] > 0) {
              usedAssetsCount += 1;
            }
          }
          if(usedAssetsCount === 0) throw "Bond with empty usage";
        }
        for(let j = 0; j < this.assetsNumber; j++) {
          let usedBondsCount = 0;
          for(let i = 0; i < this.bonds.length; i++) {
            if(this.paymentMatrix[i].value[j] > 0) {
              usedBondsCount += 1;
            }
          }
          if(usedBondsCount === 0) throw "Asset not used";
        }
        const [intstr, Company] = await createCompanyTx(wallet, this.companyName.value, this.description.value);
        tx.add(intstr);
        const [instr2, Portfolio] = await createPortfolioTx(wallet, Company, this.bonds.length+1, this.companiesCount);
        tx.add(instr2);
        for(let i = 0; i < this.bonds.length; i++) {
          tx.add(await insertBondTx(wallet, Company, Portfolio, this.bonds[i].name.value, percentToRate(this.bonds[i].rate.value, this.period.value*3600*24), this.bonds[i].amount.value+'000000'))
        }
        await global.signTx(tx, []);
        for(let j = 0; j < this.assetsNumber; j += 3) {
          tx = new Transaction();
          signers = [];
          for(let k = 0; k < 3 && j + k < this.assetsNumber; k++){
            let usage = [];
            for (let i = 0; i < this.bonds.length; i++) {
              if(this.paymentMatrix[i].value[j] > 0){
                usage.push(i);
              }
            }
            const [instr3, mint] = await mintAssetTx(wallet, Company, Portfolio, (this.companiesCount*5 + j + k)%10, usage);
            tx.add(instr3);
            signers.push(mint);
          }
          await global.signTx(tx, signers);
        }
        tx = new Transaction();
        tx.add(await startPortfolioTx(wallet, Company, Portfolio, this.period.value*3600*24));
        await global.signTx(tx, []);
        this.$router.push({ path: '/bank', query: {wallet: this.$route.query.wallet}});
      }
      catch (e) {
        console.log(e);
        global.alertError(e);
      }
    }
  },
  async mounted() {
    global.showLoading(true);
    this.companiesCount = 0;
    if(this.$route.query.company) {
      this.Company = await global.DI.getCompanyInstance(new PublicKey(this.$route.query.company));
      this.Portfolio = await global.DI.getPortfolioInstance(await getPortfolioAddress(this.Company.owner, this.Company.publicKey));
      this.companiesCount = this.Portfolio.image + 1;
      global.showLoading(false)
      return;
    }
    const [companies, _] = await searchCompaniesByOwner(global.getWallet(this).publicKey, global.connection, global.DI);
    if(companies.length > 0) {
      this.companiesCount = companies.length;
      global.company = companies[0];
      this.$router.push({ path: '/bank/query', query: { company: global.company.publicKey.toBase58(), wallet: this.$route.query.wallet } });
      this.Company = companies[0];
    }
    global.showLoading(false)
  },
  data() {
    return {
      companiesCount: 0,
      Company: undefined,
      Portfolio: undefined,
      period: new State(""),
      companyName: new State(""),
      description: new State(""),
      bonds: [{name: new State(""), amount: new State(""), rate: new State("")}],
      paymentMatrix: [new State([0])],
      assetsNumber: 1
    }
  }
}
</script>