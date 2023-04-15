use solana_program::account_info::AccountInfo;
use solana_program::program_error::ProgramError;


pub fn is_signer(ai: &AccountInfo) -> Result<(), ProgramError> {
    if !ai.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    Ok(())
}