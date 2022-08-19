import React, { useContext } from "react";

import { AccountContext } from "@contexts";
import { Home, Storage } from "@pages";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { METAMASK_LINK } from "@constants";

export const Auth = () => {
  const { account, requestAccounts } = useContext(AccountContext);
  return (
    <div>
      {!account ? (
        <div className="container">
          <button onClick={requestAccounts} className="button button_big">
            Connect MetaMask
          </button>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<div>---</div>} />
          {/* <Route path="/" element={<Home />} /> */}
          {/* <Route path="/storage" element={<Storage />} /> */}
        </Routes>
      )}
    </div>
  );
};
