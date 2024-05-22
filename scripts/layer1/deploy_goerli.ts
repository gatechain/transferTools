// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import path from "path";
import fs from "fs";
import {ethers, network,upgrades} from "hardhat";
import addrs from "../../lib/mainnet/address-goerli.json";
import {factories} from "../../typechain-types";
import salts from "../../lib/localhost/salt.json";
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
    const [deployer] = await ethers.getSigners();
    console.log(
        "Deploying the contracts with the account:",
        await deployer.getAddress()
    );
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();
    /*const tx2 = await owner.sendTransaction({
      to: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      value: ethers.constants.WeiPerEther.mul(99),
    });
    await tx2.wait();*/
    console.log("owner Address:", owner.address)
    
    global.saltTable = {
        "impl":salts.impl,
        "admin":salts.admin,
        "proxy":salts.proxy
    }
    const Random =new factories.contracts.RandomContract__factory(owner);
    const random = await Random.deploy();
    await random.deployed();

    const Soul = await ethers.getContractFactory("Soul");
    const  soul = await upgrades.deployProxy(
        Soul.connect(owner),
        [random.address,owner.address],
        { initializer: "initialize"
       }
      );
      await soul.connect(owner).deployed();
      console.log("Soul deployed to:", soul.address);
        //修改配置文件
      var impls =  {
            "88b9346c77b624be943ec47bbf8d4ecde872c83b7c5897945ebfc43d6f3a9042": {
              "address": "0x0000000000FFe8B47B3e2130213B802212439497",
              "txHash": "0xfc54ed8f4579ab77460817384a77679341e88bfbfc6c8300aba94193b99430aa",
              "layout": {
                "solcVersion": "0.8.10",
                "storage": [
                ],
                "types": {
                
                }
              }
            }};
            const contractsDir = path.join(__dirname,"..", "..", ".openzeppelin");
       var data1 =   fs.readFileSync(
                path.join(contractsDir, "goerli.json"),"utf-8");
        var data = JSON.parse(data1);
        data["impls"] = {...impls,...data["impls"]};
        fs.writeFileSync(path.join(contractsDir, "goerli.json"),JSON.stringify(data));
       var tx1 = await upgrades.upgradeProxy(
            soul.address,
            Soul.connect(owner),
              {call:{
                  fn:"initialize",
                  args:[random.address,owner.address],
                 
              }}
          )
          await tx1.wait();
  
          var tx = await soul.smashEggs(10,"0x0000000000000000000000000000000000000000",{value:ethers.utils.parseUnits("0.01","ether")});
          await tx.wait();
          var num1 = await soul.typeAmountList(0);
          var num2 = await soul.typeAmountList(1);
          var num3 = await soul.typeAmountList(2);
          var num4 = await soul.typeAmountList(3);
          console.log(num1,num2,num3,num4);
     
          var mintSupply = await soul.mintSupply();
          console.log(mintSupply);
          console.log(await owner.getBalance())
        var num5 = await soul.getBNB();
        console.log(await owner.getBalance())
  
        await soul.synthesisHandle(1);
        var num1 = await soul.typeAmountList(4);
          var num2 = await soul.typeAmountList(5);
          var num3 = await soul.typeAmountList(6);
          console.log(num1,num2,num3);
          var num1 = await soul.refferAmount(owner.address);
          var num2 = await soul.refferAmount(addr1.address);
          console.log(num1,num2);
          await soul.transferSynthesis(addr1.address,1);
          var num1 = await soul.refferAmount(owner.address);
          var num2 = await soul.refferAmount(addr1.address);
          console.log(num1,num2);
  
        var list=  await soul.getUrls(owner.address);
        console.log(list);
       var refferAmountTotal = await soul.refferAmountTotal();
       console.log(refferAmountTotal);

    // We also save the contract's artifacts and address in the frontend directory
    // saveFrontendFiles(lsdAggregator);
}



main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
