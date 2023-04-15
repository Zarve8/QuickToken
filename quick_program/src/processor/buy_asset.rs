use std::slice::Iter;
use solana_program::account_info::{AccountInfo, next_account_info};
use solana_program::msg;
use solana_program::program_error::ProgramError;
use solana_program::pubkey::Pubkey;
use crate::states::asset::Asset;
use crate::states::company::Company;
use crate::states::portfolio::{Portfolio, PortfolioStatus};
use crate::utils::accounts::{load_unchecked, save};
use crate::utils::programs::{check_token_program, is_signer};
use crate::utils::transfer::{give_token, take_token};


pub fn buy_asset<'g>(program_id: &'g Pubkey, account_iter: &mut Iter<AccountInfo>) -> Result<(), ProgramError> {
    let auth_ai = next_account_info(account_iter)?;
    is_signer(auth_ai)?;
    let company_ai = next_account_info(account_iter)?;
    let portfolio_ai = next_account_info(account_iter)?;
    let asset_ai = next_account_info(account_iter)?;
    let auth_vault_ai = next_account_info(account_iter)?;
    let treasury_ai = next_account_info(account_iter)?;
    let asset_storage_ai = next_account_info(account_iter)?;
    let auth_asset_ai = next_account_info(account_iter)?;
    let token_program = next_account_info(account_iter)?;
    check_token_program(token_program)?;
    let company = load_unchecked::<Company>(company_ai)?;
    company.check_tag()?;
    let mut portfolio = load_unchecked::<Portfolio>(portfolio_ai)?;
    portfolio.check_tag()?;
    if company.treasury != *treasury_ai.key {
        return Err(ProgramError::InvalidAccountData);
    }
    if portfolio.company != *company_ai.key {
        return Err(ProgramError::InvalidAccountData);
    }
    if portfolio.status != PortfolioStatus::Started{
        return Err(ProgramError::InvalidAccountData);
    }
    let asset = load_unchecked::<Asset>(asset_ai)?;
    asset.check_tag()?;
    if asset.portfolio != *portfolio_ai.key {
        return Err(ProgramError::InvalidAccountData);
    }
    let mut sum = 0;
    for i in asset.participation.iter() {
        let bond = &portfolio.bonds[*i as usize];
        msg!("BondId: {}, amount: {}, used: {}", *i, bond.amount, bond.used);
        sum += bond.amount / bond.used as u64;
        portfolio.bonds[*i as usize].sold += 1;
        msg!("Used: {}, Sold: {}", portfolio.bonds[*i as usize].used, portfolio.bonds[*i as usize].sold);
    }
    msg!("Asset cost: {}", sum);
    take_token(sum, auth_vault_ai.clone(), treasury_ai.clone(), auth_ai.clone(), token_program.clone())?;
    give_token(1, auth_asset_ai.clone(), asset_storage_ai.clone(), &asset.mint, token_program.clone(),
    portfolio_ai.clone(), program_id)?;
    save(&portfolio, portfolio_ai)
}