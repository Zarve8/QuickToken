use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::program_error::ProgramError;
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

impl Company {
    pub fn check_tag(&self) -> Result<(), ProgramError> {
        if self.tag != AccountTag::Company {
            return Err(ProgramError::InvalidAccountData);
        }
        Ok(())
    }
}