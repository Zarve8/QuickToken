use borsh::{BorshDeserialize};
use solana_program::{
    account_info::{AccountInfo},
    program_error::ProgramError,
    pubkey::Pubkey,
    entrypoint::ProgramResult,
};
mod instruction;
mod create_company;
mod create_portfolio;
mod insert_bond;
mod start;
mod stop_sales;
mod payout;
mod buy_asset;
mod mint_asset;
mod collect_payment;
use crate::processor;
use crate::processor::instruction::Instruction;


pub struct Processor {}

impl Processor {
    pub fn process_instruction<'g>(_program_id: &'g Pubkey, accounts: &'g [AccountInfo<'g>], instruction_data: &[u8]) -> ProgramResult {
        let instruction = Instruction::try_from_slice(instruction_data)
            .map_err(|_| ProgramError::InvalidInstructionData)?;
        let accounts_iter = &mut accounts.iter();
        match instruction {
            Instruction::CreateCompany {name, description} => {
                processor::create_company::create_company(_program_id, accounts_iter, name, description)?;
            }
            Instruction::CreatePortfolio {bond_count} => {
                processor::create_portfolio::create_portfolio(_program_id, accounts_iter, bond_count)?;
            }
            Instruction::InsertBond {name, amount, rate} => {
                processor::insert_bond::insert_bond(_program_id, accounts_iter, name, amount, rate)?;
            }
            Instruction::MintAsset {url_id, participation} => {
                processor::mint_asset::mint_asset(_program_id, accounts_iter, url_id, participation)?;
            }
            Instruction::Start {period} => {
                processor::start::start(_program_id, accounts_iter, period)?;
            }
            Instruction::BuyAsset => {
                processor::buy_asset::buy_asset(_program_id, accounts_iter)?;
            }
            Instruction::StopSales => {
                processor::stop_sales::stop_sales(_program_id, accounts_iter)?;
            }
            Instruction::Payout {mask} => {
                processor::payout::payout(_program_id, accounts_iter, mask)?;
            }
            Instruction::CollectPayment => {
                processor::collect_payment::collect_payment(_program_id, accounts_iter)?;
            }
            //_ => {msg!("Instruction not implemented");}
        }
        Ok(())
    }
}
