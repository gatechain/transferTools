import React, { useCallback, useState } from "react";

export function Exchange({exchangeAmountHandle,
  exchangeHandle,
  lidoApproveHandle,
  exchangeAmountHandle1,
  exchangeHandle1,
  fraxApproveHandle}:
  {exchangeAmountHandle:any,
    exchangeHandle:any,
    lidoApproveHandle:any,
    exchangeAmountHandle1:any,
    exchangeHandle1:any,
    fraxApproveHandle:any}) {

  const [token1,setToken1] = useState<string>("stETH");
  const [token2,setToken2] = useState<string>("wstETH");
  const [tokenAmount1,setTokenAmount1] = useState<string>("");
  const [tokenAmount2,setTokenAmount2] = useState<string>("");

  const [token3,setToken3] = useState<string>("frxETH");
  const [token4,setToken4] = useState<string>("sfrxETH");
  const [tokenAmount3,setTokenAmount3] = useState<string>("");
  const [tokenAmount4,setTokenAmount4] = useState<string>("");
  //lido
  const inputHandle = useCallback(
    async (e:any)=>{
      setTokenAmount1(e.target.value)
      var type;
      if(token1 == "stETH"){
        type = 0;
      }else{
        type = 1;
      }
  var num =  await  exchangeAmountHandle(type,e.target.value);
      setTokenAmount2(num)
    },[tokenAmount1,tokenAmount2]
  )

  const outputHandle = useCallback(
    async (e:any)=>{
      setTokenAmount2(e.target.value)
      var type;
      if(token2 == "wstETH"){
        type = 1;
      }else{
        type = 0;
      }
  var num =  await  exchangeAmountHandle(type,e.target.value);
      setTokenAmount1(num)
    },[tokenAmount1,tokenAmount2]
  )

  const clickHandle = useCallback(
    async (e:any)=>{
      var name1 = token1;
      var name2 = token2;
      var amount1 = tokenAmount1;
      var amount2 = tokenAmount2;
      setToken1(name2);
      setToken2(name1);
      setTokenAmount1(amount2);
      setTokenAmount2(amount1);
    },[token1,token2,tokenAmount1,tokenAmount2]
  )
  const approveHandle = useCallback(
    async (e:any)=>{
      lidoApproveHandle(0);
    },[]
  )
  const approveHandle1 = useCallback(
    async (e:any)=>{
      lidoApproveHandle(1);
    },[]
  )

  //farx
  const inputHandle1 = useCallback(
    async (e:any)=>{
      setTokenAmount3(e.target.value)
      var type;
      if(token3 == "frxETH"){
        type = 0;
      }else{
        type = 1;
      }
  var num =  await  exchangeAmountHandle1(type,e.target.value);
      setTokenAmount4(num)
    },[tokenAmount3,tokenAmount4]
  )

  const outputHandle1 = useCallback(
    async (e:any)=>{
      setTokenAmount4(e.target.value)
      var type;
      if(token2 == "sfrxETH"){
        type = 1;
      }else{
        type = 0;
      }
  var num =  await  exchangeAmountHandle1(type,e.target.value);
      setTokenAmount3(num)
    },[tokenAmount3,tokenAmount4]
  )

  const clickHandle1 = useCallback(
    async (e:any)=>{
      var name1 = token3;
      var name2 = token4;
      var amount1 = tokenAmount3;
      var amount2 = tokenAmount4;
      setToken3(name2);
      setToken4(name1);
      setTokenAmount3(amount2);
      setTokenAmount4(amount1);
    },[token3,token4,tokenAmount3,tokenAmount4]
  )
  const approveHandle2 = useCallback(
    async (e:any)=>{
      fraxApproveHandle(0);
    },[]
  )
  const approveHandle3 = useCallback(
    async (e:any)=>{
      fraxApproveHandle(1);
    },[]
  )
  return (
    <div> 
  <div>
  <hr />
     <h4>Lido Exchange</h4>
      <form
        onSubmit={(event:any) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();

          const formData = new FormData(event.target);
          const amount = formData.get("amount");
          var type;
          if(token1 == "stETH"){
            type = 0;
          }else{
            type = 1;
          }
          if (amount) {
            // lidoDeposit(amount);
            exchangeHandle(type,amount);
          }
        }}
      >
        <div className="form-group">
     
          {/* <label>Amount of {tokenSymbol}</label> */}
          <div>
          <label style={{display:"inline-block",width: "70px"}}>{token1+"   :"}</label>
          <input
            className="form-control"
            name="amount"
            placeholder="0.0"
            required
            value={tokenAmount1}
            onChange={inputHandle}
            style={{width:"35%",display: "initial"}}
          />
          </div>
         <div style={{textAlign: "center",
    width: "35%",
    cursor: "pointer",
    fontSize: "25px"
}} onClick={clickHandle}>
          ↓
         </div>
          <div>
          <label style={{display:"inline-block",width: "70px"}}>{token2+"   :"}</label>
          <input
            className="form-control"
            name="amount1"
            placeholder="0.0"
            required
            onChange={outputHandle}
            value={tokenAmount2}
            style={{width:"35%",display: "initial"}}
          />
          </div>
         
        </div>
        <div className="form-group">
        <input className="btn btn-primary" style={{marginRight:"9px"}} onClick={approveHandle} value="stETHApprove" />
        <input className="btn btn-primary" style={{marginRight:"9px"}} onClick={approveHandle1} value="wstETHApprove" />
          <input className="btn btn-primary" type="submit" value="Exchange" />
        </div>
      </form>
     </div>

     <div>
  <hr />
     <h4>frax Exchange</h4>
      <form
        onSubmit={(event:any) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();

          const formData = new FormData(event.target);
          const amount = formData.get("amount");
          var type;
          if(token3 == "frxETH"){
            type = 0;
          }else{
            type = 1;
          }
          if (amount) {
            // lidoDeposit(amount);
            exchangeHandle1(type,amount);
          }
        }}
      >
        <div className="form-group">
     
          {/* <label>Amount of {tokenSymbol}</label> */}
          <div>
          <label style={{display:"inline-block",width: "70px"}}>{token3+"   :"}</label>
          <input
            className="form-control"
            name="amount"
            placeholder="0.0"
            required
            value={tokenAmount3}
            onChange={inputHandle1}
            style={{width:"35%",display: "initial"}}
          />
          </div>
         <div style={{textAlign: "center",
    width: "35%",
    cursor: "pointer",
    fontSize: "25px"
}} onClick={clickHandle1}>
          ↓
         </div>
          <div>
          <label style={{display:"inline-block",width: "70px"}}>{token4+"   :"}</label>
          <input
            className="form-control"
            name="amount1"
            placeholder="0.0"
            required
            onChange={outputHandle1}
            value={tokenAmount4}
            style={{width:"35%",display: "initial"}}
          />
          </div>
         
        </div>
        <div className="form-group">
        <input className="btn btn-primary" style={{marginRight:"9px"}} onClick={approveHandle2} value="frxETHApprove" />
        <input className="btn btn-primary" style={{marginRight:"9px"}} onClick={approveHandle3} value="sfrxETHApprove" />
          <input className="btn btn-primary" type="submit" value="Exchange" />
        </div>
      </form>
     </div>
    </div>
  );
}
