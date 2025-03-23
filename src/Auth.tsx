import React, { useContext } from "react";

import { AccountContext } from "@contexts";
import { Home, MyTickets } from "@pages";

import { Routes, Route } from "react-router-dom";
import { METAMASK_LINK } from "@constants";

export const Auth = () => {
  const { account, requestAccounts } = useContext(AccountContext);
  return (
    <>
      {!account ? (
        <div className="container">
          <button onClick={requestAccounts} className="button button_large">
            Connect MetaMask
          </button>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-tickets" element={<MyTickets />} />
        </Routes>
      )}
    </>
  );
};
