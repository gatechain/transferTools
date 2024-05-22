// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import path from "path";
import fs from "fs";
import {ethers, network,upgrades} from "hardhat";
import {factories,Soul__factory} from "../../typechain-types";
import addrs from "../../lib/mainnet/address.json";
import tokens from "../../lib/mainnet/aaveToken.json";
async function main() {
    // This is just a convenience check
    if (network.name === "hardhat") {
        console.warn(
            "You are trying to deploy a contract to the Hardhat Network, which" +
            "gets automatically created and destroyed every time. Use the Hardhat" +
            " option '--network localhost'"
        );
    }

    // ethers is available in the global scope
    // const [deployer] = await ethers.getSigners();
    // console.log(
    //     "Deploying the contracts with the account:",
    //     await deployer.getAddress()
    // );
    // const vitalik_address = "0x04ecd640D43FDe6c8f4A1a970734e798e0FaAdBB";
    // await network.provider.request({
    //   method: "hardhat_impersonateAccount",
    //   params: [vitalik_address],
    // });

    //   make vitalik the signer
    // const owner = await ethers.getSigner(vitalik_address);
    const [owner] = await ethers.getSigners();
   const soul =  Soul__factory.connect("0x000000003Ef267F9F977D1Ed564B9EC2378e4156",owner);
   var tx = await soul.smashEggs(10,"0x0000000000000000000000000000000000000000",{value:ethers.utils.parseUnits("0.01","ether"),gasPrice:"1000000"});
   await tx.wait();
   var num1 = await soul.typeAmountList(0);
   var num2 = await soul.typeAmountList(1);
   var num3 = await soul.typeAmountList(2);
   var num4 = await soul.typeAmountList(3);
   console.log(num1,num2,num3,num4);

   var mintSupply = await soul.mintSupply();
   console.log(mintSupply);
//    console.log(await owner.getBalance())
 var num5 = await soul.getBNB();
//  console.log(await owner.getBalance())

 tx =await soul.synthesisHandle(1,{gasPrice:"1000000"});
await tx.wait();
 var num1 = await soul.typeAmountList(4);
   var num2 = await soul.typeAmountList(5);
   var num3 = await soul.typeAmountList(6);
   console.log(num1,num2,num3);
   var num1 = await soul.refferAmount(owner.address);
   var num2 = await soul.refferAmount(soul.address);
   console.log(num1,num2);
  tx = await soul.transferSynthesis(soul.address,1);
  await tx.wait();
   var num1 = await soul.refferAmount(owner.address);
   var num2 = await soul.refferAmount(soul.address);
   console.log(num1,num2);

 var list=  await soul.getUrls(owner.address);
 console.log(list);
var refferAmountTotal = await soul.refferAmountTotal();
console.log(refferAmountTotal);
    //read option
    // const readResult = await operateRead("getTokenInfoLength",...[]);
    // console.log("readResult",readResult);       
    // var tokenList = [];
    // var tokenName = [];
    // for(var a = 0;a<tokens.length;a++){
    //     var obj = {
    //     };
    //     obj["token"] = tokens[a].tokenAddress;
    //     obj["aToken"] = tokens[a].aTokenAddress;
    //     obj["projectId"] = 0;
    //     tokenList.push(obj);
    //     tokenName.push(tokens[a].tokenName)
    // }
    // console.log(tokenList,tokenList.length);
    // console.log(tokenName,tokenName.length)
   // write option

//    var newList = [
//     {
//         "token":"0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
//         "aToken":"0xF6D2224916DDFbbab6e6bd0D1B7034f4Ae0CaB18",
//         "projectId":0
//     }
//    ]
    // const writeResult = await operateWirte("setTokenList",false,0,...[ newList
    // ]);
    //  const getTokenInfoLength = await operateRead("getTokenInfoLength",...[]);
    //  console.log("getTokenInfoLength",getTokenInfoLength);  

    // //deposit
    // const lidoDeposit = await operateWirte("lidoDeposit",true,10000,...[]);

  async function operateRead(option:string,...args:any[]) {
    const result = await ethContract.connect(owner)[option](...args);
    return result;
   }

  async  function operateWirte(option:string,isEtherValue:boolean,etherValue:any,...args:any[]){
    if(!isEtherValue){
        const tx = await ethContract.connect(owner)[option](...args);
        await tx.wait();
    }else{
        const tx = await ethContract.connect(owner)[option](...args,{value:etherValue});
        await tx.wait();
    }
  
   }


   
}





main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
