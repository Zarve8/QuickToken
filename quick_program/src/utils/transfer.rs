use solana_program::{
    account_info::{AccountInfo},
    program_error::ProgramError,
    pubkey::Pubkey,
    program::{invoke_signed, invoke},
    system_instruction,
    instruction::{AccountMeta, Instruction},
    sysvar::{rent::Rent, Sysvar},
};


pub fn take_token<'a>(amount: u64, from_ai: AccountInfo<'a>, to_ai: AccountInfo<'a>,
                      auth_ai: AccountInfo<'a>, token_program: AccountInfo<'a>) -> Result<(), ProgramError>{
    if amount == 0 {return Ok(());}
    let idx = spl_token::instruction::transfer(
        &token_program.key,
        &from_ai.key,
        &to_ai.key,
        &auth_ai.key,
        &[],
        amount,
    )?;
    invoke(
        &idx,
        &[from_ai, to_ai, auth_ai, token_program]
    )?;
    Ok(())
}


pub fn give_token<'a>(amount: u64, to_ai: AccountInfo<'a>, token_storage_ai: AccountInfo<'a>, mint: &Pubkey, token_program: AccountInfo<'a>,
                      portfolio_ai: AccountInfo<'a>, program_id: &Pubkey) -> Result<(), ProgramError>{
    if amount == 0 {return Ok(());}
    let (_key, bump) = Pubkey::find_program_address(&[
        "vault".as_bytes(),
        program_id.as_ref(),
        portfolio_ai.key.as_ref(),
        mint.as_ref(),
    ], program_id);
    let seeds: &[&[&[u8]]] = &[&["vault".as_bytes(), program_id.as_ref(), portfolio_ai.key.as_ref(), mint.as_ref(), &[bump]]];
    let idx = spl_token::instruction::transfer(
        &token_program.key,
        &token_storage_ai.key,
        &to_ai.key,
        &token_program.key,
        &[],
        amount,
    )?;
    invoke_signed(
        &idx,
        &[token_program, token_storage_ai, to_ai, portfolio_ai],
        seeds
    )
}


pub fn create_token_vault<'a>(token_storage_ai: AccountInfo<'a>, mint_ai: AccountInfo<'a>, payer_ai: AccountInfo<'a>,
                              system_program: AccountInfo<'a>, token_program: AccountInfo<'a>, sysvar: AccountInfo<'a>,
                              portfolio_ai: AccountInfo<'a>, program_id: &Pubkey) -> Result<(), ProgramError> {
    let (_key, bump) = Pubkey::find_program_address(&[
        "vault".as_bytes(),
        program_id.as_ref(),
        portfolio_ai.key.as_ref(),
        mint_ai.key.as_ref(),
    ], program_id);
    let seeds: &[&[&[u8]]] = &[&["vault".as_bytes(), program_id.as_ref(), portfolio_ai.key.as_ref(), mint_ai.key.as_ref(), &[bump]]];
    let idx = system_instruction::create_account(
        payer_ai.key,
        token_storage_ai.key,
        Rent::get()?.minimum_balance(165),
        165,
        &token_program.key
    );
    invoke_signed(
        &idx,
        &[payer_ai.clone(), token_storage_ai.clone(), system_program.clone()],
        seeds
    )?;
    let idx = &Instruction {
        accounts: vec![
            AccountMeta::new(*token_storage_ai.key, false),
            AccountMeta::new_readonly(*mint_ai.key, false),
            AccountMeta::new_readonly(*token_program.key, false),
            AccountMeta::new_readonly(*sysvar.key, false),
        ],
        data: Vec::from([1]),
        program_id: *token_program.key,
    };
    invoke(
        &idx,
        &[mint_ai, token_storage_ai, sysvar, portfolio_ai, token_program],
    )?;
    Ok(())
}