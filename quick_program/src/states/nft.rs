use solana_program::account_info::AccountInfo;
use solana_program::program::invoke;
use solana_program::program_error::ProgramError;
use solana_program::rent::Rent;
use solana_program::{msg, system_instruction};
use solana_program::sysvar::Sysvar;
use spl_token::instruction::{initialize_mint, mint_to, burn};


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