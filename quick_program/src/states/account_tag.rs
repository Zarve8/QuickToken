use borsh::{BorshDeserialize, BorshSerialize};


#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq)]
pub enum AccountTag{
    None,
    Company,
    Portfolio,
    Asset
}