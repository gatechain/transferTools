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
import addrs from "../lib/address.json";
require("util").inspect.defaultOptions.depth = 10;
describe("ETHTransfers", function () {

    describe("ETHTransfers",  function () {


        // If the callback function is async, Mocha will `await` it.
        it("ETHTransfers", async function () {
          
          const [owner] = await ethers.getSigners();
          const TransfersTools =new factories.contracts.transfersToolsSol.TransfersTools__factory(owner);
          const transfersTools =  TransfersTools.attach(addrs.TransfersTools);
          var data = await fs.readFile("./test/address.csv","utf-8");
          var list = data.split("\n");
          console.log(list);
          var addressList = [];
          var amountList = [];
          var totalAmount = ethers.BigNumber.from(0);
          for(var i = 0;i<list.length;i++){
            var unit = list[i].split(",");
            addressList.push(unit[0]);
            amountList.push(unit[1]);
            totalAmount = totalAmount.add(ethers.BigNumber.from(unit[1]));
          }
          //eth batch
          var tx = await transfersTools.EthBatchTransfer(addressList,amountList,{value:totalAmount});
          await tx.wait();
          console.log("批量转主币成功");
        });
    });
});
