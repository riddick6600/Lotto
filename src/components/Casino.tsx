import React, { useContext } from "react";
import { CasinoContext, LotteryMachineProvider } from "@contexts";
import { LotteryMachine } from "./LotteryMachine";
import { getHash } from "@utils";

export const Casino = () => {
  const { contract, owner, balance, machines, deployCasino, createMachine } =
    useContext(CasinoContext);

  return (
    <div className="casino">
      <button onClick={deployCasino}>Deploy New Casino</button>
      {contract && (
        <>
          <div>Casino: {getHash(contract?.address)}</div>
          <div>Owner: {getHash(owner)}</div>
          <div>Balance: {balance}</div>
          <button onClick={createMachine}>Create new Machine</button>
          <div className="grid2">
            {machines.map((address) => (
              <LotteryMachineProvider address={address} key={address}>
                <LotteryMachine />
              </LotteryMachineProvider>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
