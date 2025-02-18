const { Transaction } = require("@mysten/sui/transactions");
const { SuiClient } = require("@mysten/sui/client");
const { Ed25519Keypair } = require("@mysten/sui/keypairs/ed25519");
const { fromBase64 } = require("@mysten/sui/utils");
const getSignerKeypair = (secretKey) => {
    console.log(fromBase64(secretKey))
  const privKeyArray = Uint8Array.from(Array.from(fromBase64(secretKey)));
  console.log(privKeyArray)
  const keypair = Ed25519Keypair.fromSecretKey(
    Uint8Array.from(privKeyArray).slice(1)
  );
  return keypair;
};

async function transferSuiDirect() {
  
    var TEST_MNEMONICS = ""
    const keypair_ed25519 = Ed25519Keypair.deriveKeypair(TEST_MNEMONICS, "m/44'/784'/0'/0'/0'");
    console.log(keypair_ed25519.getSecretKey())
    console.log(keypair_ed25519.getPublicKey().toSuiAddress())

    const keypair = keypair_ed25519;
    // const coins = await client.getAllCoins({
    //   owner: keypair_ed25519.getPublicKey().toSuiAddress()
    // });
   
    var coinTypeEnum = {
        TOKEN : "0xa8a56d70440dbabfc28784934a128273059e95b8ed3e47a5f0bf5ad88c3552ac::my_hero::Hero"
    }
    var coinType = coinTypeEnum.TOKEN;
    const client = new SuiClient({ url: "https://fullnode.mainnet.sui.io:443"});
    const objects = await client.getOwnedObjects({
      owner: keypair_ed25519.getPublicKey().toSuiAddress(),
      options: {
        showType: true,
        showContent: true,
        showDisplay: true,
      },
    });
    var nftLists = objects.data;
    nftLists = nftLists.filter(item => item.data.type === coinType);
    const objectIdList = nftLists.map(obj => obj.data.objectId);
    console.log(objectIdList);
    var tx = new Transaction();
    var recipientAddresses = ["0xe87ebc167f2ad79d09cdc4ff39437b2852b57571b09cb017432bad79cb9e084b","0xe87ebc167f2ad79d09cdc4ff39437b2852b57571b09cb017432bad79cb9e084b","0xe87ebc167f2ad79d09cdc4ff39437b2852b57571b09cb017432bad79cb9e084b"];

    const target = "0xa8a56d70440dbabfc28784934a128273059e95b8ed3e47a5f0bf5ad88c3552ac::send_nfts::transfer_nft_batch";
    if(recipientAddresses.length > objectIdList.length){
      console.log("nft 不足");
      return
    }
    const nfts = objectIdList.slice(0, recipientAddresses.length);

    // 创建可变对象引用
    const nftInputs = nfts.map(id => tx.object(id, 'Mutable'));
    console.log(nftInputs)
    // 创建 Move 向量
    const nftsVec = tx.makeMoveVec({
      type: coinType, // 请替换为您的实际类型标签
      elements: nftInputs,
    });
    const args = [
       nftsVec,
        tx.pure.vector("address",recipientAddresses), // recipients 
    ];
    const typeArguments = [coinType];
     tx.moveCall({
      target,
      typeArguments,
      arguments: args,
    });
    tx.setGasBudget(10000000)
    const result = await client.signAndExecuteTransaction({
        signer: keypair,
        transaction: tx,
        options: {
          showBalanceChanges: true,
          showObjectChanges: true,
          showEffects: true,
        },
      });
      if (result.effects && result.effects.status.status !== "success") {
        throw new Error(`Transaction failed: ${result.effects?.status.error}`);
      }
      if (result.errors) {
        throw new Error(`Transaction failed: ${result.errors.join(", ")}`);
      }
      await client.waitForTransaction({ digest: result.digest });
    


  }

  (async () => {
    try {
      await transferSuiDirect();
      console.log("Transaction completed successfully.");
    } catch (error) {
      console.error("Error during transaction:", error);
    }
  })();