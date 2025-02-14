module owner::send_tokens {
    use sui::pay;
    use sui::coin::{Coin};
    use sui::sui::{SUI};

    public fun transfer_sui_batch<T>(
        recipients: vector<address>,
        coin: &mut Coin<T>, 
        amounts: vector<u64>,
        ctx: &mut tx_context::TxContext
    ) {
        // 确保 recipients 和 amounts 的长度相同
        assert!(vector::length(&recipients) == vector::length(&amounts), 0);
        
        // 遍历每个接收者，并进行转账
        let num_recipients = vector::length(&recipients);
        let mut i: u64 = 0;

        while (i < num_recipients) {
            let recipient = vector::borrow(&recipients, i);
            let amount = vector::borrow(&amounts, i);
            
            pay::split_and_transfer<T>(coin, *amount, *recipient, ctx);
            i = i + 1;
        }
    }
}