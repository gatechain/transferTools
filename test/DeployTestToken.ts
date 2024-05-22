import {ethers,network,upgrades} from "hardhat";
import {factories} from "../typechain-types";
import {signTypedData, SignTypedDataVersion} from "@metamask/eth-sig-util";
const fs = require('fs').promises;
import {
    isMainThread,
    parentPort,
    workerData,
    threadId,
    MessageChannel,
    MessagePort,
    Worker
  } from 'worker_threads';
// TODO NOTE: watch net config
require("util").inspect.defaultOptions.depth = 10;
describe("DeployTestToken", function () {

    describe("DeployTestToken",  function () {


        // If the callback function is async, Mocha will `await` it.
        it("DeployTestToken", async function () {

          const [owner] = await ethers.getSigners();
          var chaidId = await owner.getChainId();
          if(chaidId != 1337 && chaidId != 11155111){
            console.log("非测试网不需要使用该脚本部署测试token,直接将token地址改成想要批量操作的token即可");
            return
          }
          const TestToken =new factories.contracts.testTokenSol.GATE__factory(owner);
          const transfersTools = await TestToken.deploy();
          await transfersTools.deployed();
          console.log("testToken address:",transfersTools.address);


          var json = await fs.readFile("./lib/address.json","utf-8");
          var ojson = JSON.parse(json);
          ojson["token"] = transfersTools.address;
       
           await fs.writeFile("./lib/address.json", JSON.stringify(ojson, null, 2),"utf-8")
        });
    });
});
