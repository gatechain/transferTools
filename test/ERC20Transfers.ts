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
describe("ERC20Transfers", function () {

    describe("ERC20Transfers",  function () {


        // If the callback function is async, Mocha will `await` it.
        it("ERC20Transfers", async function () {
          
          const [owner] = await ethers.getSigners();
          const TransfersTools =new factories.contracts.transfersToolsSol.TransfersTools__factory(owner);
          const transfersTools =  TransfersTools.attach(addrs.TransfersTools);
          var data = await fs.readFile("./test/address.csv","utf-8");
          var list = data.split("\n");
          var addressList = [];
          var amountList = [];
          var totalAmount = ethers.BigNumber.from(0);
          for(var i = 0;i<list.length;i++){
            var unit = list[i].split(",");
            addressList.push(unit[0]);
            amountList.push(unit[1]);
            totalAmount = totalAmount.add(ethers.BigNumber.from(unit[1]));
          }
          //ERC20 batch
          var tx;
          const TOKEN = new factories.contracts.testTokenSol.GATE__factory(owner);

          const token =  TOKEN.attach(addrs.token);
          tx = await token.approve(transfersTools.address,totalAmount);
          await tx.wait();
          console.log("授权成功");
          tx = await transfersTools.ERC20BatchTransfer(token.address,addressList,amountList);
          await tx.wait()
          console.log("批量转ERC20成功");
        });
    });
});
