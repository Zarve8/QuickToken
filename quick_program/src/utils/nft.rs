use solana_program::account_info::AccountInfo;
use solana_program::program::invoke;
use solana_program::program_error::ProgramError;
use solana_program::rent::Rent;
use solana_program::{msg, system_instruction};
use solana_program::pubkey::Pubkey;
use solana_program::sysvar::Sysvar;
use spl_token::instruction::{initialize_mint, mint_to, burn};
//use crate::utils::standard_states::{Collection, Creator};
use mpl_token_metadata::instruction::{
    create_metadata_accounts_v3 as create_metadata_accounts
};
use mpl_token_metadata::state::{Collection, Creator};
use crate::utils::constants::ASSET_METADATA_URLS;


pub fn create_mint<'a>(auth_ai: AccountInfo<'a>, mint_ai: AccountInfo<'a>, system_program: AccountInfo<'a>,
                   token_program: AccountInfo<'a>, sysvar: AccountInfo<'a>) -> Result<(), ProgramError> {
    invoke(
        &system_instruction::create_account(
            auth_ai.key,
            mint_ai.key,
            Rent::get()?.minimum_balance(82),
            82,
            token_program.key
        ),
        &[auth_ai.clone(), mint_ai.clone(), token_program.clone(), system_program.clone()]
    )?;
    invoke(
        &initialize_mint(
            token_program.key,
            mint_ai.key,
            auth_ai.key,
            Option::Some(auth_ai.key),
            0
        )?,
        &[auth_ai, mint_ai, token_program, sysvar]
    )?;
    msg!("Mint account created");
    Ok(())
}


pub fn mint_nft<'a>(auth_ai: AccountInfo<'a>, mint_ai: AccountInfo<'a>, associated_account_ai: AccountInfo<'a>,
                         token_program: AccountInfo<'a>) -> Result<(), ProgramError> {
    invoke(
        &mint_to(
            token_program.key,
            mint_ai.key,
            associated_account_ai.key,
            auth_ai.key,
            &[],
            1
        )?,
        &[token_program, mint_ai, associated_account_ai, auth_ai]
    )?;
    msg!("Minted 1");
    Ok(())
}


pub fn burn_nft<'a>(auth_ai: AccountInfo<'a>, mint_ai: AccountInfo<'a>, associated_account_ai: AccountInfo<'a>,
                    token_program: AccountInfo<'a>) -> Result<(), ProgramError> {
    invoke(
        &burn(
            token_program.key,
            associated_account_ai.key,
            mint_ai.key,
            auth_ai.key,
            &[],
            1
        )?,
        &[token_program, mint_ai, associated_account_ai, auth_ai]
    )?;
    msg!("Burnt 1");
    Ok(())
}


pub fn create_metadata<'a>(url_id: u8, auth_ai: AccountInfo<'a>, mint_ai: AccountInfo<'a>, metadata_ai: AccountInfo<'a>, collection: &Pubkey,
                                system_program: AccountInfo<'a>, metadata_program: AccountInfo<'a>, sysvar: AccountInfo<'a>) -> Result<(), ProgramError> {
    let idx = create_metadata_accounts(
        *metadata_program.key,
        *metadata_ai.key,
        *mint_ai.key,
        *auth_ai.key,
        *auth_ai.key,
        *auth_ai.key,
        String::from("Asset"),
        String::from("AAA"),
        String::from(ASSET_METADATA_URLS[url_id as usize]),
        Option::Some(Vec::from([Creator{address: *auth_ai.key, verified: true, share: 100}])),
        0,
        true,
        true,
        Option::Some(
            Collection{
                verified: false,
                key: *collection
            }
        ),
        Option::None,
        Option::None
    );
    invoke(
        &idx,
        &[auth_ai, mint_ai, metadata_program, system_program, sysvar, metadata_ai]
    )?;
    msg!("Created metadata");
    Ok(())
}