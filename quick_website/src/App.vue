<template>
  <LoadPopup/>
  <NavBar/>
  <img src="@/assets/cells.png" style="position: absolute; z-index: -1; width: 100vw; height: calc(100vh - 120px);"/>
  <router-view/>
</template>

<script>
import NavBar from "@/components/NavBar";
import {reactive} from "vue";
import {useAnchorWallet} from "solana-wallets-vue";
import {Provider} from "@project-serum/anchor";
import { computed } from 'vue';
import {Connection, PublicKey} from "@solana/web3.js";
import {DIContainer} from "@/helpers";
import WebMemoryAllocator from "@/memory_allocator";
import signer from 'nacl-signature';
import {} from "@/alerts"; // Do not remove!
import LoadPopup from "@/components/LoadPopup";
export default {
  name: 'App',
  components: {
    LoadPopup,
    NavBar,
  },
  methods: {
    async verifyWallet(){
      try{
        return this.wallet.publicKey.toBase58();
        // const msg = "QuickToken wants to sign you these message to verify wallet: "+this.wallet.publicKey.toBase58()+'.';
        // const encodedMessage = new TextEncoder().encode(msg);
        // if(window.solflare){
        //   console.log(window)
        //   if(window.solflare.isConnected) {
        //     return this.wallet.publicKey.toBase58();
        //   }
        // }
        // const signature = await window.solana.signMessage(encodedMessage, "utf8");
        // if (signer.verify(msg, Buffer.from(signature.signature).toString('base64'), this.wallet.publicKey.toBuffer().toString('base64'))){
        //   return this.wallet.publicKey.toBase58();
        // }
        // else{
        //   return undefined;
        // }
      }
      catch (_e){
        return undefined;
      }
    },
    async checkWallet(key) {
      if(this.$route.query.wallet){
        if(key.toBase58()===this.$route.query.wallet) return;
      }
      global.company = undefined;
      key = await this.verifyWallet();
      if(key) {
        this.$router.push({ query: {wallet: key}, path: this.$route.path });
        return;
      }
      this.$router.push({ path: '' });
    }
  },
  setup() {
    const showLoading = (bActive) => {
      const e = document.getElementById("load-popup");
      if(bActive) {
        e.style.display = "block";
      }
      else {
        e.style.display = "none";
      }
    }
    global.showLoading = showLoading;
    let activeIndex = 0;
    const urlPool = [
        "https://api.devnet.solana.com",
        "https://solana-devnet.g.alchemy.com/v2/uqjB8krus2EJ9Mv4CTeNr9Rj8RjvWfkg",
        "https://solana-devnet.g.alchemy.com/v2/w_kg_aNeMbaOaO_WopzQCE4IEhgGNj0w",
        "https://solana-devnet.g.alchemy.com/v2/aVpwQhJTyn80NiNTdwMbaodflUXX4wlK"
    ];
    let activeUrl = urlPool[activeIndex];
    function switchUrl(){
      console.log("Switching Url:", urlPool[activeIndex], "->", urlPool[(activeIndex+1)%urlPool.length]);
      activeIndex = (activeIndex+1)%urlPool.length
      activeUrl = urlPool[activeIndex];
      provider.value.connection._rpcEndpoint = activeUrl;
      return true;
    }
    const customFetchTimeout = async (url, options, timeout = 7000) => {
      return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), timeout)
        )
      ]);
    }
    const fetchFunc = async (url, data) => {
      let switch_res = true;
      //console.log(data)
      while(switch_res){
        try{
          const res = await customFetchTimeout(activeUrl, data, 2000);
          //console.log(res)
          if((res.status >= 200 && res.status < 300) || res.status === 400) return res;
          switch_res = switchUrl();
        }
        catch (e){
          console.log(e)
          switch_res = switchUrl();
        }
      }
      throw "Cannot connect to Solana node";
    }
    const preflightCommitment = 'processed'
    const commitment = 'confirmed'
    const wallet = reactive(useAnchorWallet());
    const connection = new Connection("https://api.devnet.solana.com", {fetch: fetchFunc});
    const DI = new DIContainer(connection, new WebMemoryAllocator());
    const provider = computed(() => new Provider(connection, wallet.value, {preflightCommitment, commitment}));
    const signTx = async (tx, signers) => {
      try {
        tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
        tx.feePayer = wallet.value.publicKey
        let signedTx = await provider.value.wallet.signTransaction(tx);
        if(signers.length > 0) signedTx.partialSign(...signers);
        let signature = await connection.sendRawTransaction(signedTx.serialize(), {skipPreflight: false});
        await connection.confirmTransaction(signature, "confirmed");
        global.showLoading(true);
        await connection.confirmTransaction(signature, "max");
        //window.open("https://explorer.solana.com/tx/"+signature+"?cluster=devnet", '_blank');
        global.alertTx();
        global.showLoading(false);
        return true;
      } catch (e) {
        global.showLoading(false);
        console.log(e);
        throw "Transaction failed";
      }
    }
    const getWallet = (self) => {
      try {
        if(!self.$route.query.wallet) {
          throw "Not specified"
        }
        return {publicKey: new PublicKey(self.$route.query.wallet)};
      }
      catch(e) {
        return {publicKey: new PublicKey("11111111111111111111111111111111")};
      }
    }
    global.connection = connection;
    global.signTx = signTx;
    global.DI = DI;
    global.wallet = wallet;
    global.getWallet = getWallet;
    return {
      wallet,
      provider,
      signTx,
    }
  },
  watch: {
    wallet: {
      deep: true,
      handler(newVal) {
        if(newVal){
          if(newVal.publicKey) {
            this.checkWallet(newVal.publicKey);
          }
        }
      }
    }
  }
}
</script>

<style>
@import "styles.css";
</style>
