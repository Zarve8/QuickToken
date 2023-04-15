use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::pubkey::Pubkey;
use crate::states::account_tag::AccountTag;


#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct Company {
    pub tag: AccountTag,
    pub owner: Pubkey,
    pub treasury: Pubkey,
    pub name: Vec<u8>,
    pub description: Vec<u8>
}