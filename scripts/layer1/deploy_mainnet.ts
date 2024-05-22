// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import path from "path";
import fs from "fs";
import {ethers, network,upgrades} from "hardhat";
import {factories} from "../../typechain-types";
import addrs from "../../lib/mainnet/address.json";
import salts from "../../lib/mainnet/salt.json";
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
    const [owner] = await ethers.getSigners();
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
  console.log("random deployed to:", random.address);
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
                path.join(contractsDir, "mainnet.json"),"utf-8");
        var data = JSON.parse(data1);
        data["impls"] = {...impls,...data["impls"]};
        fs.writeFileSync(path.join(contractsDir, "mainnet.json"),JSON.stringify(data));
        var tx1 = await upgrades.upgradeProxy(
          soul.address,
          Soul.connect(owner),
            {call:{
                fn:"initialize",
                args:[random.address,owner.address],
               
            }}
        )
        await tx1.wait();

  //   const contractInterface = LsdAggregator.interface;
  //   const fragment = contractInterface.getFunction("initialize");
  //   var data =  contractInterface.encodeFunctionData(fragment, [initData]);
  //  const admin =  ProxyAdmin__factory.connect("0x00000000b9617D27FCa976e091f6f8697D6A4421",owner);
  //  await admin.upgradeAndCall("0x0000000000E1a557866aFcd0FB267154610ed354","0x00000000EeA1063109439F6C35863338b956D68E",data);



      
}





main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
