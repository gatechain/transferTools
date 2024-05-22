// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import path from "path";
import fs from "fs";
import {ethers, network,upgrades} from "hardhat";
import addrs from "../../lib/arbitrum/address.json";
import {BaseContract, LendAggregatorLogic, factories} from "../../typechain-types";
import salts from "../../lib/arbitrum/salt.json";
import { ERC20__factory } from "../../typechain-types/factories/ERC20__factory";
async function main() {
    // This is just a convenience check
    if (network.name === "hardhat") {
        console.warn(
            "You are trying to deploy a contract to the Hardhat Network, which" +
            "gets automatically created and destroyed every time. Use the Hardhat" +
            " option '--network localhost'"
        );
    }

    const [owner1] = await ethers.getSigners();
    const tx2 = await owner1.sendTransaction({
      to: "0x0CeDF62232aC8Bea6Ba8083696A6CA0e33Edb2AF",
      value: ethers.constants.WeiPerEther.mul(500),
    });
    await tx2.wait();

     //  impersonating vitalik's account
     const vitalik_address = "0x0CeDF62232aC8Bea6Ba8083696A6CA0e33Edb2AF";
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
                path.join(contractsDir, "unknown-1337.json"),"utf-8");
        var data = JSON.parse(data1);
        data["impls"] = {...impls,...data["impls"]};
        fs.writeFileSync(path.join(contractsDir, "unknown-1337.json"),JSON.stringify(data));
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
          aToken: addrs.tETH,
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

        // await lendContract.updateLendDepositFee(fee);
    // console.log("Account balance:", (await deployer.getBalance()).toString());

       // //deposit USDC
       await routerContract.swapExactETHForTokensSupportingFeeOnTransferTokens(ethers.utils.parseUnits("10","gwei"),[WETHAddr,USDC], owner.address,"0x0000000000000000000000000000000000000000","1828966317",{value:ethers.utils.parseUnits("6","ether")});
       const uSDC = ERC20__factory.connect(USDC,owner);
       const balance1 = await uSDC.balanceOf(owner.address);
       console.log("balancce1",balance1);
       await uSDC.approve(lendContract.address,ethers.utils.parseUnits("10","gwei"));
       await lendContract.lendDeposit(0,ethers.utils.parseUnits("10","gwei"));
       const balance2 = await uSDC.balanceOf(owner.address);
       console.log("balancce2",balance2);
       const auSDC = ERC20__factory.connect(aUSDC,owner);
       const aUSDCbalance = await auSDC.balanceOf(owner.address); 
       const addr1USDC = await uSDC.balanceOf(owner.address);
       console.log("aUSDCbalance",aUSDCbalance);
       console.log("addr1USDC",addr1USDC);
       //deposit DAI
       await routerContract.swapExactETHForTokensSupportingFeeOnTransferTokens(ethers.utils.parseUnits("1","ether"),[WETHAddr,DAI], owner.address,"0x0000000000000000000000000000000000000000","1828966317",{value:ethers.utils.parseUnits("0.1","ether")});
       const dAI = ERC20__factory.connect(DAI,owner);
       const daiBalance1 = await dAI.balanceOf(owner.address);
       console.log("daiBalance1",daiBalance1);
       await dAI.approve(lendContract.address,ethers.utils.parseUnits("1","ether"));
       await lendContract.lendDeposit(1,ethers.utils.parseUnits("1","ether"));
       const daiBalance2 = await dAI.balanceOf(owner.address);
       console.log("daiBalance2",daiBalance2);
       const adAI = ERC20__factory.connect(aDAI,owner);
       const aDAIbalance = await adAI.balanceOf(owner.address); 
       console.log("aDAIbalance",aDAIbalance);
       //depist USDT
       await routerContract.swapExactETHForTokensSupportingFeeOnTransferTokens(ethers.utils.parseUnits("1","gwei"),[WETHAddr,USDT], owner.address,"0x0000000000000000000000000000000000000000","1828966317",{value:ethers.utils.parseUnits("1","ether")});
       const uSDT = ERC20__factory.connect(USDT,owner);
       const usdtBalance1 = await uSDT.balanceOf(owner.address);
       console.log("usdtBalance1",usdtBalance1);
       await uSDT.approve(lendContract.address,ethers.utils.parseUnits("1","gwei"));
       await lendContract.lendDeposit(2,ethers.utils.parseUnits("1","gwei"));
       const usdtBalance2 = await uSDT.balanceOf(owner.address);
       console.log("usdtBalance2",usdtBalance2);
       const auSDT = ERC20__factory.connect(aUSDT,owner);
       const aUSDTbalance = await auSDT.balanceOf(owner.address); 
       console.log("aUSDTbalance",aUSDTbalance);

    

       //withdraw USDC
       await auSDC.approve(lendContract.address,ethers.utils.parseUnits("10","gwei").mul(100000-baseInitData.depositFee).div(100000));
       await lendContract.lendWithdraw(0,ethers.utils.parseUnits("10","gwei").mul(100000-baseInitData.depositFee).div(100000));
       const balance3 = await uSDC.balanceOf(owner.address);
       console.log("balance3",balance3);
       const aUSDCbalance1 = await auSDC.balanceOf(owner.address); 
       console.log("aUSDCbalance1",aUSDCbalance1);
       //withdraw DAI
       await adAI.approve(lendContract.address,ethers.utils.parseUnits("1","ether").mul(100000-baseInitData.depositFee).div(100000));
       await lendContract.lendWithdraw(1,ethers.utils.parseUnits("1","ether").mul(100000-baseInitData.depositFee).div(100000));
       const daiBalance3 = await dAI.balanceOf(owner.address);
       console.log("daiBalance3",daiBalance3);
       const aDAIbalance1 = await adAI.balanceOf(owner.address); 
       console.log("aDAIbalance1",aDAIbalance1);
       //withdraw USDT
       await auSDT.approve(lendContract.address,ethers.utils.parseUnits("1","gwei").mul(100000-baseInitData.depositFee).div(100000));
       await lendContract.lendWithdraw(2,ethers.utils.parseUnits("1","gwei").mul(100000-baseInitData.depositFee).div(100000));
       const usdtBalance3 = await uSDT.balanceOf(owner.address);
       console.log("usdtBalance3",usdtBalance3);
       const aUSDTbalance1 = await auSDT.balanceOf(owner.address); 
       console.log("aUSDTbalance1",aUSDTbalance1);


          //radiant withdraw USDT 
          const radiantbalance1 = await uSDC.balanceOf(owner.address);
          console.log("radiantbalance1",radiantbalance1);
          await uSDC.approve(lendContract.address,ethers.utils.parseUnits("10","gwei"));
          await lendContract.lendDeposit(4,ethers.utils.parseUnits("10","gwei"));
          const radiantbalance2 = await uSDC.balanceOf(owner.address);
          console.log("radiantbalance2",radiantbalance2);
          const rauSDC = ERC20__factory.connect(rAUSDC,owner);
          const raUSDCbalance = await rauSDC.balanceOf(owner.address); 
          const raddr1USDC = await uSDC.balanceOf(owner.address);
          console.log("raUSDCbalance",raUSDCbalance);
          console.log("raddr1USDC",raddr1USDC);

           //radiant deposit USDT 
           await rauSDC.approve(lendContract.address,ethers.utils.parseUnits("10","gwei").mul(100000-baseInitData.depositFee).div(100000));
           await lendContract.lendWithdraw(4,ethers.utils.parseUnits("10","gwei").mul(100000-baseInitData.depositFee).div(100000));
           const rbalance3 = await uSDC.balanceOf(owner.address);
           console.log("rbalance3",rbalance3);
           const raUSDCbalance1 = await rauSDC.balanceOf(owner.address); 
           console.log("raUSDCbalance1",raUSDCbalance1);

    // We also save the contract's artifacts and address in the frontend directory
    // saveFrontendFiles(lsdAggregator);
}

function delDirectory(dir: any) {
    let files = [];
    if (fs.existsSync(dir)) {
        files = fs.readdirSync(dir);
        files.forEach((file, index) => {
            let curPath = path.join(dir, file);
            var stat = fs.statSync(curPath);
            if (stat.isDirectory()) {
                delDirectory(curPath); //递归删除文件夹
            } else if (stat.isFile()) {
                fs.unlinkSync(curPath); //删除文件
            }
        });
        fs.rmdirSync(dir);
    }
}

function copyDirectory(src: any, dest: any) {
    var files = fs.readdirSync(src);
    files.forEach((item, index) => {
        var itemPath = path.join(src, item);
        var itemStat = fs.statSync(itemPath);// 获取文件信息
        var savedPath = path.join(dest, itemPath.replace(src, ''));
        var savedDir = savedPath.substring(0, savedPath.lastIndexOf('/'));

        if (itemStat.isFile()) {
            // 如果目录不存在则进行创建
            if (!fs.existsSync(savedDir)) {
                fs.mkdirSync(savedDir,{ recursive: true });
            }
            // 写入到新目录下
            var data = fs.readFileSync(itemPath);
            fs.writeFileSync(savedPath, data);
        } else if (itemStat.isDirectory()) {
            copyDirectory(itemPath, path.join(savedDir, item));
        }
    });
}


function saveFrontendFiles(hardhatLido: any) {
    // const fs = require("fs");
    const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");
    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    // fs.writeFileSync(
    //     path.join(contractsDir, "contract-address.json"),
    //     JSON.stringify({
    //         stEth: addrs.stEth,
    //         Lido: addrs.Lido,
    //         LsdAggregator: hardhatLido.address,
    //         rEth: addrs.rETH,
    //         frxEth: addrs.frxETH,
    //         sfrxEth: addrs.sfrxETH,
    //         wstEth: addrs.wstEth
    //     }, undefined, 2)
    // );
    // //delete
    // var dir = path.join(contractsDir, "typechain-types");
    // delDirectory(dir);
    // //copy
    // if (!fs.existsSync(dir)) {
    //     fs.mkdirSync(dir);
    // }
    // const contractsDir1 = path.join(__dirname, "..", "typechain-types");
    // copyDirectory(contractsDir1, dir);

    // const TokenArtifact = artifacts.readArtifactSync("ERC20");
    // const LidoDemoArtifact = artifacts.readArtifactSync("LsdAggregator");
    // fs.writeFileSync(
    //   path.join(contractsDir, "Token.json"),
    //   JSON.stringify(TokenArtifact, null, 2)
    // );
    // fs.writeFileSync(
    //   path.join(contractsDir, "LsdAggregator.json"),
    //   JSON.stringify(LidoDemoArtifact, null, 2)
    // );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
