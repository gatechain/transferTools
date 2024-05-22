// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import path from "path";
import fs from "fs";
import {ethers, network,upgrades} from "hardhat";
import {factories, LsdAggregator,ProxyAdmin__factory} from "../../typechain-types";
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
    const vitalik_address = "0x04ecd640D43FDe6c8f4A1a970734e798e0FaAdBB";
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [vitalik_address],
    });

    //   make vitalik the signer
    const owner = await ethers.getSigner(vitalik_address);
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

    const LsdAggregatorLogic =  new factories.contracts.libraries.LsdAggregatorLogic__factory(owner);
    const lsdAggregatorLogic = await LsdAggregatorLogic.deploy();
        await lsdAggregatorLogic.deployed();
        console.log("lsdAggregatorLogic ContractAddress:", lsdAggregatorLogic.address);
        const LendAggregatorLogic =  new factories.contracts.libraries.LendAggregatorLogic__factory(owner);
        const lendAggregatorLogic = await LendAggregatorLogic.deploy();
            await lendAggregatorLogic.deployed();
            console.log("lendAggregatorLogic ContractAddress:", lendAggregatorLogic.address);
        const EthContract = await ethers.getContractFactory("EthContract",
        {
            libraries:{
                LsdAggregatorLogic:lsdAggregatorLogic.address,
                LendAggregatorLogic:lendAggregatorLogic.address
            }
        });
        await upgrades.upgradeProxy(
          salts.proxyAddress,
          EthContract.connect(owner),
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
