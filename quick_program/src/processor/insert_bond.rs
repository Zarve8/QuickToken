use std::slice::Iter;
use solana_program::account_info::{AccountInfo, next_account_info};
use solana_program::program_error::ProgramError;
use solana_program::pubkey::Pubkey;
use crate::states::bond::Bond;
use crate::states::company::Company;
use crate::states::portfolio::{Portfolio, PortfolioStatus};
use crate::utils::accounts::{load_unchecked, save};
use crate::utils::programs::is_signer;


pub fn insert_bond<'g>(_program_id: &'g Pubkey, account_iter: &mut Iter<AccountInfo>, name: Vec<u8>, amount: u64, rate: u16) -> Result<(), ProgramError> {
    let auth_ai = next_account_info(account_iter)?;
    is_signer(auth_ai)?;
    let company_ai = next_account_info(account_iter)?;
    let portfolio_ai = next_account_info(account_iter)?;
    let company = load_unchecked::<Company>(company_ai)?;
    let mut portfolio = load_unchecked::<Portfolio>(portfolio_ai)?;
    if company.owner != *auth_ai.key {
        return Err(ProgramError::IllegalOwner);
    }
    if portfolio.company != *company_ai.key {
        return Err(ProgramError::InvalidAccountData);
    }
    if portfolio.status != PortfolioStatus::Created {
        return Err(ProgramError::InvalidAccountData);
    }
    portfolio.bonds.push(Bond::new(name, amount, rate));
    save(&portfolio, portfolio_ai)
}