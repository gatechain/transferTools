// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import path from "path";
import fs from "fs";
import {ethers, network,upgrades} from "hardhat";
import {factories} from "../../typechain-types";
import addrs from "../../lib/mainnet/address.json";
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
    const [owner] = await ethers.getSigners();
    /*const tx2 = await owner.sendTransaction({
      to: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      value: ethers.constants.WeiPerEther.mul(99),
    });
    await tx2.wait();*/
    console.log("owner Address:", owner.address);
    global.saltTable = {
        "impl":salts.impl,
        "admin":salts.admin,
        "proxy":salts.proxy
    }
    const Random =new factories.contracts.RandomContract__factory(owner);
    const random = await Random.deploy();
    await random.deployed();

    const Soul = await ethers.getContractFactory("Soul");
  
        await upgrades.upgradeProxy(
          salts.proxyAddress,
          Soul.connect(owner),
          {
            unsafeAllowLinkedLibraries:true
          }
        )
      
}





main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
