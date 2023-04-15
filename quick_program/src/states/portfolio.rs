use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::program_error::ProgramError;
use solana_program::pubkey::Pubkey;
use crate::states::account_tag::AccountTag;
use crate::states::bond::Bond;


#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq)]
pub enum PortfolioStatus{
    Created,
    Started,
    Sold,
    Payed
}


#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct Portfolio{
    pub tag: AccountTag,
    pub company: Pubkey,
    pub token_storage: Pubkey,
    pub bump: u8,
    pub status: PortfolioStatus,
    pub period: u64,
    pub bonds: Vec<Bond>,
    pub payout_mask: Vec<u8>
}

impl Portfolio {
    pub fn new(company: &Pubkey, token_storage: &Pubkey, bump: u8) -> Self {
        Portfolio {
            tag: AccountTag::Portfolio,
            company: company.clone(),
            token_storage: token_storage.clone(),
            bump,
            period: 0,
            status: PortfolioStatus::Created,
            bonds: Vec::new(),
            payout_mask: Vec::new()
        }
    }

    pub fn check_tag(&self) -> Result<(), ProgramError> {
        if self.tag != AccountTag::Portfolio {
            return Err(ProgramError::InvalidAccountData);
        }
        Ok(())
    }
}