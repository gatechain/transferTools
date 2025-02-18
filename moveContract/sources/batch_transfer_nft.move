module owner::send_nfts {
    use sui::transfer;
    use sui::tx_context::TxContext;

    public fun transfer_nft_batch<T: key + store>(
        mut nfts: vector<T>, 
        recipients: vector<address>, 
        ctx: &mut TxContext
    ) {
        // 确保 nfts 和 recipients 的长度相同
        let num_recipients = vector::length(&recipients);
        let num_nfts = vector::length(&nfts);
        assert!(num_nfts == num_recipients, 0);
        
        let mut i: u64 = 0;

        while (i < num_recipients) {
            let nft = vector::pop_back(&mut nfts);
            let recipient = vector::borrow(&recipients, num_recipients - i - 1);
            
            transfer::public_transfer<T>(nft, *recipient);
            i = i + 1;
        };

        assert!(vector::is_empty(&nfts), 0);

        // 显式地销毁空的 nfts 向量
        vector::destroy_empty<T>(nfts);
    }
}