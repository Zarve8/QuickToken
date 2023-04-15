use std::slice::Iter;
use solana_program::account_info::{AccountInfo, next_account_info};
use solana_program::msg;
use solana_program::program_error::ProgramError;
use solana_program::pubkey::Pubkey;
use crate::states::company::Company;
use crate::states::portfolio::{Portfolio, PortfolioStatus};
use crate::utils::accounts::{load_unchecked, save};
use crate::utils::constants::{BP_DEC};
use crate::utils::programs::is_signer;
use crate::utils::transfer::take_token;


pub fn payout<'g>(_program_id: &'g Pubkey, account_iter: &mut Iter<AccountInfo>, mask: Vec<u8>) -> Result<(), ProgramError> {
    let auth_ai = next_account_info(account_iter)?;
    is_signer(auth_ai)?;
    let company_ai = next_account_info(account_iter)?;
    let portfolio_ai = next_account_info(account_iter)?;
    let auth_vault_ai = next_account_info(account_iter)?;
    let token_storage_ai = next_account_info(account_iter)?;
    let token_program = next_account_info(account_iter)?;
    let company = load_unchecked::<Company>(company_ai)?;
    let mut portfolio = load_unchecked::<Portfolio>(portfolio_ai)?;
    if company.owner != *auth_ai.key {
        return Err(ProgramError::IllegalOwner);
    }
    if portfolio.company != *company_ai.key {
        return Err(ProgramError::InvalidAccountData);
    }
    if portfolio.status != PortfolioStatus::Sold {
        return Err(ProgramError::InvalidAccountData);
    }
    if portfolio.token_storage != *token_storage_ai.key {
        return Err(ProgramError::InvalidAccountData);
    }
    let mut sum = 0;
    for (bond, m) in portfolio.bonds.iter().zip(mask.iter()) {
        if *m > 0 && bond.sold > 0{
            msg!("Bond amount: {}, sold: {}, used: {}, rate: {}, payment: {}", bond.amount, bond.sold, bond.used, bond.rate,
                (bond.amount * (BP_DEC + bond.rate as u64) * bond.sold as u64) / (BP_DEC * bond.used as u64));
            sum += (bond.amount * (BP_DEC + bond.rate as u64) * bond.sold as u64) / (BP_DEC * bond.used as u64);
        }
    }
    msg!("Payout sum: {}", sum);
    take_token(sum, auth_vault_ai.clone(), token_storage_ai.clone(), auth_ai.clone(), token_program.clone())?;
    portfolio.payout_mask = mask;
    portfolio.status = PortfolioStatus::Payed;
    save(&portfolio, portfolio_ai)
}