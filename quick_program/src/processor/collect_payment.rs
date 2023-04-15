use std::slice::Iter;
use solana_program::account_info::{AccountInfo, next_account_info};
use solana_program::msg;
use solana_program::program_error::ProgramError;
use solana_program::pubkey::Pubkey;
use crate::states::asset::Asset;
use crate::states::nft::burn_nft;
use crate::states::portfolio::{Portfolio, PortfolioStatus};
use crate::utils::accounts::{load_unchecked};
use crate::utils::constants::BP_DEC;
use crate::utils::programs::is_signer;
use crate::utils::transfer::{give_token};


pub fn collect_payment<'g>(program_id: &'g Pubkey, account_iter: &mut Iter<AccountInfo>) -> Result<(), ProgramError> {
    let auth_ai = next_account_info(account_iter)?;
    is_signer(auth_ai)?;
    let portfolio_ai = next_account_info(account_iter)?;
    let asset_mint_ai = next_account_info(account_iter)?;
    let asset_ai = next_account_info(account_iter)?;
    let auth_asset_ai = next_account_info(account_iter)?;
    let auth_vault_ai = next_account_info(account_iter)?;
    let token_storage_ai = next_account_info(account_iter)?;
    let token_program = next_account_info(account_iter)?;
    let mut portfolio = load_unchecked::<Portfolio>(portfolio_ai)?;
    let asset = load_unchecked::<Asset>(asset_ai)?;
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
            sum += (bond.amount * (bond.rate as u64 + BP_DEC)) / (BP_DEC * bond.used as u64);
        }
    }
    msg!("Asset payout: {}", sum);
    give_token(sum, auth_vault_ai.clone(), token_storage_ai.clone(), asset_mint_ai.key,
               token_program.clone(), portfolio_ai.clone(), program_id)
}