use borsh::{BorshDeserialize, BorshSerialize};


#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub enum AccountTag{
    None,
    Company,
    Portfolio,
    Asset
}