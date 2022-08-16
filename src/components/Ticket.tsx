import React, { useContext } from "react";
import { TicketContext } from "../context/TicketContext";

export const Ticket = () => {
  const {
    address,
    contract,
    balance,
    price,
    players,
    sendRegister,
    winner,
    limit,
    withdrow,
    owner,
  } = useContext(TicketContext);

  return (
    <div className="grid2">
      <div>
        <div>Ticket: {contract && contract.address}</div>
        <div>Owner: {owner}</div>
        <br />
        <div>Balance: {balance} ETH</div>
        <br />
        {winner ? (
          <h4>Winner: {winner}</h4>
        ) : (
          <div>
            <h4>WIN: ~ {price * limit} ETH</h4>

            <button type="button" onClick={sendRegister}>
              Buy {price} ETH
            </button>
          </div>
        )}
        <button type="button" onClick={withdrow}>
          Withdrow
        </button>
      </div>
      <div>
        Players of {limit}:
        {players.map((player, index) => (
          <div key={player + index}>{player}</div>
        ))}
      </div>
    </div>
  );
};
