use std::slice::Iter;
use solana_program::account_info::{AccountInfo, next_account_info};
use solana_program::msg;
use solana_program::program_error::ProgramError;
use solana_program::pubkey::Pubkey;
use crate::states::asset::Asset;
use crate::utils::nft::burn_nft;
use crate::states::portfolio::{Portfolio, PortfolioStatus};
use crate::utils::accounts::{load_unchecked};
use crate::utils::constants::BP_DEC;
use crate::utils::programs::{check_associated_program, check_system_program, check_sysvar_program, check_token_program, is_signer};
use crate::utils::transfer::{find_or_create_associated_account, give_token};


pub fn collect_payment<'g>(program_id: &'g Pubkey, account_iter: &mut Iter<AccountInfo>) -> Result<(), ProgramError> {
    let auth_ai = next_account_info(account_iter)?;
    is_signer(auth_ai)?;
    let portfolio_ai = next_account_info(account_iter)?;
    let usdt_mint_ai = next_account_info(account_iter)?;
    let asset_mint_ai = next_account_info(account_iter)?;
    let asset_ai = next_account_info(account_iter)?;
    let auth_asset_ai = next_account_info(account_iter)?;
    let auth_vault_ai = next_account_info(account_iter)?;
    let token_storage_ai = next_account_info(account_iter)?;
    let system_program = next_account_info(account_iter)?;
    check_system_program(system_program)?;
    let token_program = next_account_info(account_iter)?;
    check_token_program(token_program)?;
    let associated_program = next_account_info(account_iter)?;
    check_associated_program(associated_program)?;
    let sysvar = next_account_info(account_iter)?;
    check_sysvar_program(sysvar)?;
    let mut portfolio = load_unchecked::<Portfolio>(portfolio_ai)?;
    portfolio.check_tag()?;
    let asset = load_unchecked::<Asset>(asset_ai)?;
    asset.check_tag()?;
    if portfolio.status != PortfolioStatus::Payed{
        return Err(ProgramError::InvalidAccountData);
    }
    if portfolio.token_storage != *token_storage_ai.key {
        return Err(ProgramError::InvalidAccountData);
    }
    if asset.portfolio != *portfolio_ai.key {
        return Err(ProgramError::InvalidAccountData);
    }
    if asset.mint != *asset_mint_ai.key {
        return Err(ProgramError::InvalidAccountData);
    }
    burn_nft(auth_ai.clone(), asset_mint_ai.clone(), auth_asset_ai.clone(), token_program.clone())?;
    let mut sum = 0;
    for i in asset.participation.iter() {
        if portfolio.payout_mask[*i as usize] > 0 {
            let bond = &mut portfolio.bonds[*i as usize];
            msg!("Bond amount: {}, used: {}, rate: {}, payout: {}", bond.amount, bond.used, bond.rate,
            (bond.amount * (bond.rate as u64 + BP_DEC)) / (BP_DEC * bond.used as u64));
            sum += (bond.amount * (bond.rate as u64 + BP_DEC)) / (BP_DEC * bond.used as u64);
        }
    }
    msg!("Asset payout: {}", sum);
    find_or_create_associated_account(auth_ai.clone(), auth_vault_ai.clone(), usdt_mint_ai.clone(), auth_ai.clone(),
    system_program.clone(), token_program.clone(), associated_program.clone(), sysvar.clone())?;
    give_token(sum, auth_vault_ai.clone(), token_storage_ai.clone(), usdt_mint_ai.key,
               token_program.clone(), portfolio_ai.clone(), program_id)
}