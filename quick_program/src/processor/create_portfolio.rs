use std::slice::Iter;
use solana_program::account_info::{AccountInfo, next_account_info};
use solana_program::{msg};
use solana_program::program_error::ProgramError;
use solana_program::pubkey::Pubkey;
use crate::utils::accounts::{create, save};
use crate::states::portfolio::Portfolio;
use crate::utils::constants::USDT_MINT;
use crate::utils::programs::is_signer;
use crate::utils::transfer::create_token_vault;


pub fn create_portfolio<'g>(program_id: &'g Pubkey, account_iter: &mut Iter<AccountInfo>, bond_count: u32) -> Result<(), ProgramError> {
    let auth_ai = next_account_info(account_iter)?;
    is_signer(auth_ai)?;
    let company_ai = next_account_info(account_iter)?;
    let portfolio_ai = next_account_info(account_iter)?;
    let mint_ai = next_account_info(account_iter)?;
    let token_storage_ai = next_account_info(account_iter)?;
    let system_program = next_account_info(account_iter)?;
    let token_program = next_account_info(account_iter)?;
    let sysvar = next_account_info(account_iter)?;
    if mint_ai.key.to_string() != USDT_MINT {
        msg!("Invlaid USDT mint address");
        //return Err(ProgramError::InvalidAccountData);
    }
    let (_key, bump) = Pubkey::find_program_address(&[
        "portfolio".as_bytes(),
        program_id.as_ref(),
        auth_ai.key.as_ref(),
        company_ai.key.as_ref(),
    ], program_id);
    let seeds: &[&[&[u8]]] = &[&["portfolio".as_bytes(), program_id.as_ref(), auth_ai.key.as_ref(), company_ai.key.as_ref(), &[bump]]];
    let size = 1 + 32 + 1 + 1 + 4 + bond_count * (4 + 40 + 8 + 2 + 2 + 2) + 4 + bond_count * 1;
    create(portfolio_ai.clone(), auth_ai.clone(), system_program.clone(), size as u64, seeds, program_id)?;
    create_token_vault(token_storage_ai.clone(), mint_ai.clone(), auth_ai.clone(), system_program.clone(),
    token_program.clone(), sysvar.clone(), portfolio_ai.clone(), program_id)?;
    save(&Portfolio::new(company_ai.key, token_storage_ai.key, bump), portfolio_ai)
}