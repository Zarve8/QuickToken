import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router'
import SolanaWallets from 'solana-wallets-vue';
import { WalletMultiButton } from 'solana-wallets-vue';
import 'solana-wallets-vue/styles.css';

// ++++++++++ Solana Wallet Adapter ++++++++++
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';

const walletOptions = {
    wallets: [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter(),
    ],
    autoConnect: true,
}
// ++++++++++ Routes ++++++++++
import App from "@/App";
import LiabilitiesPage from "@/pages/LiabilitiesPage";
import PortfolioCreate from "@/pages/PortfolioCreate";
import PortfolioPay from "@/pages/PortfolioPay";
import UserPocket from "@/pages/UserPocket";
import AssetMarket from "@/pages/AssetMarket";
import MainPage from "@/pages/MainPage";


const routes = [
    { path: '/', component: MainPage, name: 'Home' },
    { path: '', component: MainPage, name: 'Home' },
    { path: '/bank/query', component: PortfolioCreate, name: 'Query' },
    { path: '/bank/', component:  LiabilitiesPage, name: "Bank"},
    { path: '/bank/payout', component:  PortfolioPay, name: "Payout"},
    { path: '/user/', component:  UserPocket, name: "User"},
    { path: '/user/buy', component:  AssetMarket, name: "Market"},
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})
// ++++++++++ App ++++++++++
createApp(App)
    .use(router)
    .use(SolanaWallets, walletOptions, WalletMultiButton)
    .mount('#app');
