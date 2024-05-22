import * as dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-foundry";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-contract-sizer";
import 'hardhat-storage-layout';
// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
import "./tasks/faucet";
const accounts = [process.env.PRIVATE_KEY];

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      chainId: 1337// We set 1337 to make interacting with MetaMask simpler
    },
    eth: {
      url: "https://rpc.ankr.com/eth",
      chainId: 1,
      accounts,
      
    },
    bsc: {
      url: "https://bsc-dataseed3.ninicoin.io",
      chainId: 56,
      accounts,
     
    },
    polygon: {
      url: "https://polygon-rpc.com",
      chainId: 137,
      accounts,
     
    },
    op: {
      url: "https://1rpc.io/op",
      chainId: 10,
      accounts,
      
    },
    arb: {
      url: "https://arb-mainnet-public.unifra.io",
      chainId: 42161,
      accounts,
     
    },
    avax: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      chainId: 43114,
      accounts,
     
    },
    ftm: {
      //url: "https://rpc.fantom.network",
      url: "https://rpc.ftm.tools",
      chainId: 250,
      accounts,
      
    },
    sepolia:{
      url:"https://eth-sepolia.public.blastapi.io",
      chainId: 11155111,
      accounts:[process.env.PRIVATE_KEY]
    },

    
  },
  contractSizer: {
    alphaSort: false,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: false
  },
  solidity: {
    compilers: [
       {
          version: '0.8.18',
          settings: {
             optimizer: {
                enabled: true,
                runs: 200,
             },
            viaIR: false, // for the reason of :CompilerError: Stack too deep. Try compiling with `--via-ir` (cli) or the equivalent `viaIR: true`
          },
       },
       {
          version: '0.8.10',
          settings: {
             optimizer: {
                enabled: true,
                runs: 200,
             },
             viaIR: false, // for the reason of :CompilerError: Stack too deep. Try compiling with `--via-ir` (cli) or the equivalent `viaIR: true`
          },
       },
       {
        version: '0.6.12',
        settings: {
           optimizer: {
              enabled: true,
              runs: 200,
           },
         //or the reason of :CompilerError: Stack too deep. Try compiling with `--via-ir` (cli) or the equivalent `viaIR: true`
        },
     }
    ],
 },
  mocha:{
    timeout:2000000000000
  }
};

export default config;

