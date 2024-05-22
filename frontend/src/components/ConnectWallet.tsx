import React from "react";
import { Radio } from "antd";
import { NetworkErrorMessage } from "./NetworkErrorMessage";

export function ConnectWallet({ connectWallet, networkError, dismiss,addNetwork }:{ connectWallet:any, networkError:any, dismiss:any,addNetwork:any}) {



  return (
    <div className="container">
      <div className="row justify-content-md-center">
        <div className="col-12 text-center">
          {/* Metamask network should be set to Localhost:8545. */}
          {networkError && (
            <NetworkErrorMessage 
              message={networkError} 
              dismiss={dismiss} 
            />
          )}
        </div>
        <div className="col-6 p-4 text-center">
          <p>Please connect to your wallet.</p>
          <button
            className="btn btn-warning"
            type="button"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
          <p>Please change network.</p>
          <Radio.Group onChange={(event:any) => {
            addNetwork(event.target.value)
        }}>
            <Radio.Button value={1} >Ethereum Mainnet</Radio.Button>
            <Radio.Button value={5}>Goerli testNet</Radio.Button>
            <Radio.Button value={7}>Tenderly Fork</Radio.Button>
            </Radio.Group>
        </div>
      </div>
    </div>
  );
}
