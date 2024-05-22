// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import path from "path";
import fs from "fs";
import {ethers, network,upgrades} from "hardhat";
import {ArbiContract__factory, factories, LsdAggregator,LsdAggregator__factory} from "../../typechain-types";
import addrs from "../../lib/arbitrum/address.json";
import salts from "../../lib/arbitrum/salt.json";
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
    const [owner] = await ethers.getSigners();
    console.log(
        "Deploying the contracts with the account:",
        await owner.getAddress()
    );
    // const vitalik_address = "0x04ecd640D43FDe6c8f4A1a970734e798e0FaAdBB";
    // await network.provider.request({
    //   method: "hardhat_impersonateAccount",
    //   params: [vitalik_address],
    // });

    //   make vitalik the signer
    // const owner = await ethers.getSigner(vitalik_address);

   const arbiContract =  ArbiContract__factory.connect("0x000000006d8d71b40a4213021c9761E873a57dAE",owner);
    //read option
    const readResult = await operateRead("getTokenInfo",...[]);
    console.log("readResult",readResult);     
    //write option
    const writeResult = await operateWirte("setRadiantPoolAddress",false,0,...["0x889edc2edab5f40e902b864ad4d7ade8e412f9b2"]);
    const radiantPool = await operateRead("radiantPool",...[]);
    console.log("radiantPool",radiantPool);  


  async function operateRead(option:string,...args:any[]) {
    const result = await arbiContract.connect(owner)[option](...args);
    return result;
   }

  async  function operateWirte(option:string,isEtherValue:boolean,etherValue:any,...args:any[]){
    if(!isEtherValue){
        const tx = await arbiContract.connect(owner)[option](...args);
        await tx.wait();
    }else{
        const tx = await arbiContract.connect(owner)[option](...args,{value:etherValue});
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
