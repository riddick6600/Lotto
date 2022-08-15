import React from "react";
import { LottoProvider } from "../context/LottoContext";
import { Lotto } from "./Lotto";

const contracts = [
  "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
  "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
  "0x0165878A594ca255338adfa4d48449f69242Eb8F",
  "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
];

export const Lottery = () => (
  <div>
    {contracts.map((contract) => (
      <LottoProvider contract={contract} key={contract}>
        <Lotto />
        <hr />
      </LottoProvider>
    ))}
  </div>
);
