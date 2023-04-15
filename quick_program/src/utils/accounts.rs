use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{AccountInfo},
    program_error::ProgramError,
    pubkey::Pubkey,
    program::{invoke_signed},
    system_instruction,
    sysvar::{rent::Rent, Sysvar},
    borsh::try_from_slice_unchecked
};



pub fn load_unchecked<T: BorshDeserialize + BorshSerialize + Clone>(ai: &AccountInfo) -> Result<T, ProgramError> {
    let state = try_from_slice_unchecked::<T>(&ai.data.borrow())
        .map_err(|_| ProgramError::BorshIoError(String::from("Can not load account")))?;
    Ok(state)
}

pub fn save<T: BorshDeserialize + BorshSerialize + Clone>(data: &T, ai: &AccountInfo) -> Result<(), ProgramError> {
    data.serialize(&mut *ai.data.borrow_mut())
        .map_err(|_| ProgramError::BorshIoError(String::from("Can not save account")))?;
    Ok(())
}

pub fn create<'a>(ai: AccountInfo<'a>, payer_ai: AccountInfo<'a>, system_program: AccountInfo<'a>,
                  size: u64, seeds: &[&[&[u8]]], program_id: &Pubkey) -> Result<(), ProgramError>{
    let idx = system_instruction::create_account(
        payer_ai.key,
        ai.key,
        Rent::get()?.minimum_balance(size as usize),
        size as u64,
        program_id
    );
    invoke_signed(
        &idx,
        &[payer_ai, ai, system_program],
        seeds
    )
        .map_err(|_| ProgramError::BorshIoError(String::from("Can not create account")))?;
    Ok(())
}

pub fn check_owned(ai: &AccountInfo, program_id: &Pubkey) -> Result<(), ProgramError> {
    if *ai.owner != *program_id{
        return Err(ProgramError::BorshIoError(String::from("Invalid account owner")));
    }
    Ok(())
}