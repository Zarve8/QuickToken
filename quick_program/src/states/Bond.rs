use borsh::{BorshDeserialize, BorshSerialize};


#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct Bond{
    pub name: Vec<u8>,
    pub amount: u64,
    pub rate: u16,
    pub used: u16,
    pub sold: u16
}

impl Bond {
    pub fn new(name: Vec<u8>, amount: u64, rate: u16) -> Self {
        Bond{name, amount, rate, used: 0, sold: 0}
    }
}