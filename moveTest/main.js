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

    var coinTypeEnum = {
        SUI : "0x2::sui::SUI",
        TOKEN : "0x9e7fdfa642bb62797512099626a03159fb4b349f07e7fab371312ad5d7320e14::mycoin::MYCOIN"
    }
    console.log(1111)
    //sui coinType 0x2::sui::SUI
    //token coinType 0x9e7fdfa642bb62797512099626a03159fb4b349f07e7fab371312ad5d7320e14::mycoin::MYCOIN
    var coinType = coinTypeEnum.TOKEN;
    const client = new SuiClient({ url: "https://fullnode.mainnet.sui.io:443"});

    const coins = await client.getAllCoins({
        owner: keypair_ed25519.getPublicKey().toSuiAddress()
      });

    var coinsList = coins.data;
    coinsList = coinsList.filter(item => item.coinType === coinType);
    coinsList.sort((a, b) => (b.balance|0) - (a.balance|0));
    if(coinType == "0x2::sui::SUI"){
        if((coinsList[0].balance|0) < 500000000)
            {
                console.log(coinsList[0])
                console.log("gas不足")      
                return
            }
            if(!(coinsList.length>1&&(coinsList[1].balance|0)>100000000)){
                //拆分gas
                var tx1 = new Transaction();
                const [gasCoin] = tx1.splitCoins(tx1.gas, [200000000]);
                tx1.transferObjects([gasCoin], keypair_ed25519.getPublicKey().toSuiAddress());
                tx1.setGasBudget(10000000)
                const result = await client.signAndExecuteTransaction({
                signer: keypair,
                transaction: tx1,
                options: {
                  showBalanceChanges: true,
                  showObjectChanges: true,
                  showEffects: true
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
    }
    var tx = new Transaction();
    var coinId = coinsList[0].coinObjectId;
    var recipientAddresses = ["0xe87ebc167f2ad79d09cdc4ff39437b2852b57571b09cb017432bad79cb9e084b","0xe87ebc167f2ad79d09cdc4ff39437b2852b57571b09cb017432bad79cb9e084b"];
    var amounts = [20,20];

    const target = "0x9e7fdfa642bb62797512099626a03159fb4b349f07e7fab371312ad5d7320e14::send_tokens::transfer_sui_batch";

    const args = [
        // coins
        tx.pure.vector("address",recipientAddresses), // recipients
        tx.object(coinId), 
        tx.pure.vector("u64",amounts)  
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