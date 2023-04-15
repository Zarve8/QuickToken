use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::program_error::ProgramError;
use solana_program::pubkey::Pubkey;
use crate::states::account_tag::AccountTag;


#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct Asset{
    pub tag: AccountTag,
    pub portfolio: Pubkey,
    pub mint: Pubkey,
    pub participation: Vec<u8>
}

impl Asset {
    pub fn check_tag(&self) -> Result<(), ProgramError> {
        if self.tag != AccountTag::Asset {
            return Err(ProgramError::InvalidAccountData);
        }
        Ok(())
    }
}