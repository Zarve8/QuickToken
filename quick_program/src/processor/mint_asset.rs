use std::slice::Iter;
use solana_program::account_info::{AccountInfo, next_account_info};
use solana_program::program_error::ProgramError;
use solana_program::pubkey::Pubkey;
use crate::states::account_tag::AccountTag;
use crate::states::asset::Asset;
use crate::states::company::Company;
use crate::utils::nft::{create_metadata, create_mint, mint_nft};
use crate::states::portfolio::{Portfolio, PortfolioStatus};
use crate::utils::accounts::{create, load_unchecked, save};
use crate::utils::programs::{check_metadata_program, check_system_program, check_sysvar_program, check_token_program, is_signer};
use crate::utils::transfer::{create_token_vault};


pub fn mint_asset<'g>(program_id: &'g Pubkey, account_iter: &mut Iter<AccountInfo>, url_id: u8, participation: Vec<u8>) -> Result<(), ProgramError> {
    let auth_ai = next_account_info(account_iter)?;
    is_signer(auth_ai)?;
    let company_ai = next_account_info(account_iter)?;
    let portfolio_ai = next_account_info(account_iter)?;
    let asset_mint_ai = next_account_info(account_iter)?;
    let asset_ai = next_account_info(account_iter)?;
    let asset_storage_ai = next_account_info(account_iter)?;
    let metadata_ai = next_account_info(account_iter)?;
    let system_program = next_account_info(account_iter)?;
    check_system_program(system_program)?;
    let token_program = next_account_info(account_iter)?;
    check_token_program(token_program)?;
    let metadata_program = next_account_info(account_iter)?;
    check_metadata_program(metadata_program)?;
    let sysvar = next_account_info(account_iter)?;
    check_sysvar_program(sysvar)?;
    let company = load_unchecked::<Company>(company_ai)?;
    company.check_tag()?;
    let mut portfolio = load_unchecked::<Portfolio>(portfolio_ai)?;
    portfolio.check_tag()?;
    if company.owner != *auth_ai.key {
        return Err(ProgramError::IllegalOwner);
    }
    if portfolio.company != *company_ai.key {
        return Err(ProgramError::InvalidAccountData);
    }
    if portfolio.status != PortfolioStatus::Created {
        return Err(ProgramError::InvalidAccountData);
    }
    create_mint(auth_ai.clone(), asset_mint_ai.clone(), system_program.clone(), token_program.clone(),
                sysvar.clone())?;
    create_token_vault(asset_storage_ai.clone(), asset_mint_ai.clone(), auth_ai.clone(), system_program.clone(),
    token_program.clone(), sysvar.clone(), portfolio_ai.clone(), program_id)?;
    mint_nft(auth_ai.clone(), asset_mint_ai.clone(), asset_storage_ai.clone(), token_program.clone())?;
    let (_key, bump) = Pubkey::find_program_address(&[
        "asset".as_bytes(),
        program_id.as_ref(),
        portfolio_ai.key.as_ref(),
        asset_mint_ai.key.as_ref(),
    ], program_id);
    let seeds: &[&[&[u8]]] = &[&["asset".as_bytes(), program_id.as_ref(), portfolio_ai.key.as_ref(), asset_mint_ai.key.as_ref(), &[bump]]];
    let size = 1 + 32 + 32 + 4 + participation.len() * 1;
    create(asset_ai.clone(), auth_ai.clone(), system_program.clone(), size as u64, seeds, program_id)?;
    create_metadata(url_id, auth_ai.clone(), asset_mint_ai.clone(), metadata_ai.clone(), portfolio_ai.key,
    system_program.clone(), metadata_program.clone(), sysvar.clone())?;
    for i in participation.iter() {
        portfolio.bonds[*i as usize].used += 1;
    }
    let asset = Asset{tag: AccountTag::Asset, mint: *asset_mint_ai.key, portfolio: *portfolio_ai.key, participation};
    save(&asset, asset_ai)?;
    save(&portfolio, portfolio_ai)
}