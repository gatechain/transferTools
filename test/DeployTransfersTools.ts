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
describe("DeployTransfersTools", function () {

    describe("DeployTransfersTools",  function () {


        // If the callback function is async, Mocha will `await` it.
        it("DeployTransfersTools", async function () {
          
          const [owner] = await ethers.getSigners();
          const TransfersTools =new factories.contracts.transfersToolsSol.TransfersTools__factory(owner);
          const transfersTools = await TransfersTools.deploy();
          await transfersTools.deployed();
          console.log("transfersTools address:",transfersTools.address);


          var json = await fs.readFile("./lib/address.json","utf-8");
          var ojson = JSON.parse(json);
          ojson["TransfersTools"] = transfersTools.address;
       
           await fs.writeFile("./lib/address.json", JSON.stringify(ojson, null, 2),"utf-8")
        });
    });
});
