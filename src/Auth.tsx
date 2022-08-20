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
          <button onClick={requestAccounts} className="button button_large">
            Connect MetaMask
          </button>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/" element={} /> */}
          {/* <Route path="/storage" element={<Storage />} /> */}
        </Routes>
      )}
    </div>
  );
};
