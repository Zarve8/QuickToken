use solana_program::{
    account_info::{AccountInfo},
    program_error::ProgramError,
    pubkey::Pubkey,
    msg
};


pub fn is_signer(ai: &AccountInfo) -> Result<(), ProgramError> {
    if !ai.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    Ok(())
}

pub fn get_system_program() -> Result<Pubkey, ProgramError>{
    let key = Pubkey::try_from("11111111111111111111111111111111")
        .map_err(|_| ProgramError::IncorrectProgramId)?;
    Ok(key)
}

pub fn get_token_program() -> Result<Pubkey, ProgramError>{
    let key = Pubkey::try_from("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
        .map_err(|_| ProgramError::IncorrectProgramId)?;
    Ok(key)
}
pub fn get_associated_program() -> Result<Pubkey, ProgramError>{
    let key = Pubkey::try_from("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL")
        .map_err(|_| ProgramError::IncorrectProgramId)?;
    Ok(key)
}

pub fn get_metadata_program() -> Result<Pubkey, ProgramError>{
    let key = Pubkey::try_from("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
        .map_err(|_| ProgramError::IncorrectProgramId)?;
    Ok(key)
}

pub fn get_sysvar_program() -> Result<Pubkey, ProgramError>{
    let key = Pubkey::try_from("SysvarRent111111111111111111111111111111111")
        .map_err(|_| ProgramError::IncorrectProgramId)?;
    Ok(key)
}

pub fn check_system_program(ai: &AccountInfo) -> Result<(), ProgramError> {
    if *ai.key != get_system_program()? {
        msg!("Invalid SystemProgram");
        return Err(ProgramError::IncorrectProgramId);
    }
    Ok(())
}

pub fn check_token_program(ai: &AccountInfo) -> Result<(), ProgramError> {
    if *ai.key != get_token_program()? {
        msg!("Invalid TokenProgram");
        return Err(ProgramError::IncorrectProgramId);
    }
    Ok(())
}

pub fn check_associated_program(ai: &AccountInfo) -> Result<(), ProgramError> {
    if *ai.key != get_associated_program()? {
        msg!("Invalid AssociatedProgram");
        return Err(ProgramError::IncorrectProgramId);
    }
    Ok(())
}

pub fn check_metadata_program(ai: &AccountInfo) -> Result<(), ProgramError> {
    if *ai.key != get_metadata_program()? {
        msg!("Invalid MetadataProgram");
        return Err(ProgramError::IncorrectProgramId);
    }
    Ok(())
}

pub fn check_sysvar_program(ai: &AccountInfo) -> Result<(), ProgramError> {
    if *ai.key != get_sysvar_program()? {
        msg!("Invalid SysvarRent Program");
        return Err(ProgramError::IncorrectProgramId);
    }
    Ok(())
}

