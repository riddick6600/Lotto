import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AccountContext } from "@contexts";
import { getHash } from "@utils";
import { TAccount } from "@types";
import { SvgLogo } from "@components";

const { ethereum } = window;

export const Header = () => {
  const { account, balance, requestAccounts } =
    useContext<TAccount>(AccountContext);

  return (
    <nav className="nav">
      <div className="nav_balance">
        {balance ? (
          <div>
            <div>ChainId: {ethereum?.chainId}</div>
            <div>{getHash(account)}</div>
            <div>{balance} ETH</div>
          </div>
        ) : (
          <button className="button" onClick={requestAccounts}>
            Connect MetaMask
          </button>
        )}
      </div>
      <div className="nav_left">
        <Link to="/">
          <SvgLogo />
        </Link>
        <Link to="/">ETHEREUM LOTTERY</Link>
      </div>
      {account && (
        <div className="nav_menu">
          <Link to="/" className="nav_link">Home</Link>
          <Link to="/my-tickets" className="nav_link">My Tickets</Link>
        </div>
      )}
    </nav>
  );
};
