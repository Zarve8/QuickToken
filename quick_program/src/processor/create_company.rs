use std::slice::Iter;
use solana_program::account_info::{AccountInfo, next_account_info};
use solana_program::program_error::ProgramError;
use solana_program::pubkey::Pubkey;
use crate::states::account_tag::AccountTag;
use crate::utils::accounts::{create, save};
use crate::states::company::Company;
use crate::utils::programs::{check_system_program, is_signer};


pub fn create_company<'g>(program_id: &'g Pubkey, account_iter: &mut Iter<AccountInfo>, name: Vec<u8>, description: Vec<u8>) -> Result<(), ProgramError> {
    let auth_ai = next_account_info(account_iter)?;
    is_signer(auth_ai)?;
    let company_ai = next_account_info(account_iter)?;
    let treasury_ai = next_account_info(account_iter)?;
    let salt_ai = next_account_info(account_iter)?;
    let system_program = next_account_info(account_iter)?;
    check_system_program(system_program)?;
    let (_key, bump) = Pubkey::find_program_address(&[
        "company".as_bytes(),
        program_id.as_ref(),
        auth_ai.key.as_ref(),
        salt_ai.key.as_ref(),
    ], program_id);
    let seeds: &[&[&[u8]]] = &[&["company".as_bytes(), program_id.as_ref(), auth_ai.key.as_ref(), salt_ai.key.as_ref(), &[bump]]];
    let size = 1 + 32 + 32 + 4 + name.len() + 4 + description.len();
    create(company_ai.clone(), auth_ai.clone(), system_program.clone(), size as u64, seeds, program_id)?;
    save(&Company {
        tag: AccountTag::Company,
        owner: auth_ai.key.clone(),
        treasury: treasury_ai.key.clone(),
        name,
        description
    }, company_ai)
}