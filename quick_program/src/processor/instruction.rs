use borsh::{BorshDeserialize, BorshSerialize};


#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub enum Instruction{
    CreateCompany {name: Vec<u8>, description: Vec<u8>},
    CreatePortfolio {bond_count: u32},
    InsertBond {name: Vec<u8>, amount: u64, rate: u16},
    MintAsset {url_id: u8, participation: Vec<u8>},
    BuyAsset,
    Start {period: u64},
    StopSales,
    Payout {mask: Vec<u8>},
    CollectPayment
}