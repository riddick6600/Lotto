import React, { useContext } from "react";
import { TicketContext } from "../context/TicketContext";

export const Ticket = () => {
  const {
    contract,
    balance,
    price,
    players,
    sendRegister,
    winner,
    playersLength,
  } = useContext(TicketContext);

  return (
    <div className="grid2">
      <div>
        <div>Ticket: {contract}</div>
        <div>Balance: {balance} ETH</div>
        {winner ? (
          <h4>Winner: {winner}</h4>
        ) : (
          <div>
            <h4>WIN: ~ {price * playersLength} ETH</h4>

            <button type="button" onClick={sendRegister} className="">
              Buy {price} ETH
            </button>
          </div>
        )}
      </div>
      <div>
        Players of {playersLength}:
        {players.map((player, index) => (
          <div key={player + index}>{player}</div>
        ))}
      </div>
    </div>
  );
};
