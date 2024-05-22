// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import path from "path";
import fs from "fs";
import {ethers, network,upgrades} from "hardhat";
import {factories,ProxyAdmin__factory, BaseContract} from "../../typechain-types";
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
    const initData = {
      aavePool :addrs.POOL,
      radiantPool:addrs.RPOOL
   }
    const baseInitData = {
      depositFee:0,
      withdrawFee:0,
     feesRecipient:owner.address,
     owner:owner.address
 };
    global.saltTable = {
        "impl":salts.impl,
        "admin":salts.admin,
        "proxy":salts.proxy
    }
    const LendAggregatorLogic =  new factories.contracts.libraries.LendAggregatorLogic__factory(owner);
    const lendAggregatorLogic = await LendAggregatorLogic.deploy();
        await lendAggregatorLogic.deployed();
        console.log("lendAggregatorLogic ContractAddress:", lendAggregatorLogic.address);
    const ArbiContract:any = await ethers.getContractFactory("ArbiContract",  {
        libraries:{
            LendAggregatorLogic:lendAggregatorLogic.address
        }
    }
    );
    
        const  lendContract = await upgrades.deployProxy(
          ArbiContract.connect(owner),
          [initData,baseInitData],
          { initializer: "initialize",
          unsafeAllowLinkedLibraries:true }
        );
        await lendContract.connect(owner).deployed();
        console.log("lendContract deployed to:", lendContract.address);
        //const  arbiContract = await ethers.getContractAt("ArbiContract","0x0000000023C4dA92603e0FD730aDab975ce995b7");
        //修改配置文件
        var impls =  {
          "88b9346c77b624be943ec47bbf8d4ecde872c83b7c5897945ebfc43d6f3a9042": {
            "address": "0x0000000000FFe8B47B3e2130213B802212439497",
            "txHash": "0xfc54ed8f4579ab77460817384a77679341e88bfbfc6c8300aba94193b99430aa",
            "layout": {
              "solcVersion": "0.8.18",
              "storage": [
              ],
              "types": {
              }
            }
          }};
            const contractsDir = path.join(__dirname,"..", "..", ".openzeppelin");
       var data1 =   fs.readFileSync(
                path.join(contractsDir, "unknown-42161.json"),"utf-8");
        var data = JSON.parse(data1);
        data["impls"] = {...impls,...data["impls"]};
        fs.writeFileSync(path.join(contractsDir, "unknown-42161.json"),JSON.stringify(data));
        await upgrades.upgradeProxy(
          lendContract.address,
          ArbiContract.connect(owner),
            {call:{
                fn:"initialize",
                args:[initData,baseInitData]
            },
            unsafeAllowLinkedLibraries:true}
        )

        const router = "0xc873fEcbd354f5A56E00E710B90EF4201db2448d";
        const abi = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token1","type":"address"},{"internalType":"address","name":"token2","type":"address"}],"name":"getPair","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETHSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"address","name":"referrer","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"address","name":"referrer","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"address","name":"referrer","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
        var routerContract = new ethers.Contract(router, abi, owner);
        const USDC = addrs.USDC;
        const POOL = addrs.POOL;
        const RPOOL = addrs.RPOOL;
        const aUSDC = addrs.aUSDC;
        const rAUSDC = addrs.raUSDC;
        const DAI = addrs.DAI;
        const aDAI = addrs.aDAI;
        const USDT = addrs.USDT;
        const aUSDT = addrs.aUSDT;
        const WSTETH = addrs.WSTETH;
        const aWSTETH = addrs.aWSTETH;
        const WETHAddr = addrs.WETHAddr;
        // await lendContract.setAavePoolAddress(POOL);
        // await lendContract.setRadiantPoolAddress(RPOOL);
        //setTokens
        const tokenList= [
            {
               token:USDC,
               aToken:aUSDC,
               projectId:0
          },
            {
              token:DAI,
              aToken:aDAI,
              projectId:0
         },
            {
             token:USDT,
             aToken:aUSDT,
             projectId:0
        },
            {
            token:WSTETH,
            aToken:aWSTETH,
            projectId:0
       },
            {
           token:USDC,
           aToken:rAUSDC,
           projectId:1
      },
            {
          token: addrs.EURS,
          aToken: addrs.aArbEURS,
          projectId: 0
        },
            {
          token: addrs.MAI,
          aToken: addrs.aArbMAI,
          projectId: 0
        },
            {
          token: addrs.AAVE,
          aToken: addrs.aArbAAVE,
          projectId: 0
        },
            {
          token: addrs.LINK,
          aToken: addrs.aArbLINK,
          projectId: 0
        },
            {
          token: addrs.WBTC,
          aToken: addrs.aArbWBTC,
          projectId: 0
        },
            {
          token: addrs.WETH,
          aToken: addrs.aArbWETH,
          projectId: 0
        },
            {
          token: addrs.WBTC,
          aToken: addrs.rWBTC,
          projectId: 1
        },
            {
          token: addrs.USDT,
          aToken: addrs.rUSDT,
          projectId: 1
        },
            {
          token: addrs.DAI,
          aToken: addrs.rDAI,
          projectId: 1
        },
            {
          token: addrs.WETH,
          aToken: addrs.rWETH,
          projectId: 1
        },
            {
          token: addrs.WSTETH,
          aToken: addrs.rwstETH,
          projectId: 1
        },
            {
          token: addrs.ARB,
          aToken: addrs.rArb,
          projectId: 1
        },
        
            {
          token: addrs.USDC,
          aToken: addrs.tUSDC,
          projectId: 2
        },
            {
          token: addrs.UNI,
          aToken: addrs.tUNI,
          projectId: 2
        },
        {
          token: addrs.LINK,
          aToken: addrs.tLINK,
          projectId: 2
        },
            {
          token: addrs.DAI,
          aToken: addrs.tDAI,
          projectId: 2
        },
            {
          token: addrs.USDT,
          aToken: addrs.tUSDT,
          projectId: 2
        },
            {
          token: addrs.FRAX,
          aToken: addrs.tFRAX,
          projectId: 2
        },
            {
          token: addrs.WBTC,
          aToken: addrs.tWBTC,
          projectId: 2
        },
        {
          token: addrs.WETH,
          aToken: addrs.tWETH,
          projectId: 2
        },
       
            {
                token: addrs.WETH, // take care of it before use.
                aToken: addrs.tETH,
                projectId: 2
            },
            {
                token: addrs.ARB,
                aToken: addrs.tArb,
                projectId: 2
            },
            {
                token: addrs.MAGIC,
                aToken: addrs.tMAGIC,
                projectId: 2
            }
      ]
        await lendContract.setTokenList(tokenList);
        // await lendContract.setAaveFeesRecipient(owner.address);
        // const fee = 0;
        // await lendContract.updateLendDepositFee(fee);
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
