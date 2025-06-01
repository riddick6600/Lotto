import { CasinoContext, LotteryMachineProvider } from "@contexts";
import { getHash } from "@utils";
import React, { useContext } from "react";
import { LotteryMachine } from "./LotteryMachine";

export const Casino = () => {
  const { contract, owner, balance, machines, deployCasino, createMachine } =
    useContext(CasinoContext);

  console.log('[Casino] render', {
    contract: contract?.address,
    owner,
    balance,
    machines,
    hasDeploy: !!deployCasino,
    hasCreate: !!createMachine
  });

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
