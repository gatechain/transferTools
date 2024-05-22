import React from "react";

export function Deposit({ lidoDeposit,
   tokenSymbol,
   rocketDeposit,
    tokenSymbol1,
    fraxDeposit,
    tokenSymbol2,
    tokenSymbol3 }:{ lidoDeposit:any,
       tokenSymbol:any,
       rocketDeposit:any,
        tokenSymbol1:any,
        fraxDeposit:any,
        tokenSymbol2:any,
        tokenSymbol3:any}) {
  return (
    <div>
     <div>
     <h4>Lido Deposit</h4>
      <form
        onSubmit={(event:any) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();

          const formData = new FormData(event.target);
          const amount = formData.get("amount");

          if (amount) {
            lidoDeposit(amount);
          }
        }}
      >
        <div className="form-group">
          <label>Amount of {tokenSymbol}</label>
          <input
            className="form-control"
            name="amount"
            placeholder="1"
            required
          />
        </div>
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="Deposit" />
        </div>
      </form>
     </div>
     <div>
     <h4>Rocket Deposit</h4>
      <form
        onSubmit={(event:any) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();

          const formData = new FormData(event.target);
          const amount = formData.get("amount");

          if (amount) {
            rocketDeposit(amount);
          }
        }}
      >
        <div className="form-group">
          <label>Amount of {tokenSymbol1}</label>
          <input
            className="form-control"
            name="amount"
            placeholder="1"
            required
          />
        </div>
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="Deposit" />
        </div>
      </form>
     </div>
     <div>
     <h4>frax Deposit</h4>
      <form
        onSubmit={(event:any) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();

          const formData = new FormData(event.target);
          const amount = formData.get("amount");
          const type = formData.get("eth");
          if (amount&&type) {
            fraxDeposit(type,amount);
          }
        }}
      >
        <div className="form-group">
          <label>Amount of {tokenSymbol2} or {tokenSymbol3}</label>
          <input
            className="form-control"
            name="amount"
            placeholder="1"
            required
          />
           <input
           type="radio"
           value={1}
            name="eth"
            required
          /> <label htmlFor="id1" >frxEth</label>
            <input
           type="radio"
           value={0}
            name="eth"
            required
          /> <label htmlFor="id2" >sfrxEth</label>
        </div>
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="Deposit" />
        </div>
      </form>
     </div>
    </div>
  );
}
