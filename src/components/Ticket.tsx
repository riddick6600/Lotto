import React, { useContext } from "react";
import { TicketContext } from "@contexts/TicketContext";

export const Ticket = () => {
  const {
    contract,
    owner,
    balance,
    price,
    players,
    sendRegister,
    winner,
    limit,
  } = useContext(TicketContext);

  if (!balance) {
    return null;
  }

  return (
    <div className="ticket text-center">
      <div>
        <div>Ticket: {contract && `...` + contract.address.substr(-6)}</div>
        <div>Balance: {balance && `${balance} ETH`}</div>
        <div>Owner: {owner}</div>
        <div>
          Players {players.length ?? 0} of {limit}:
          {/* {players.map((player, index) => (
          <div key={player + index}>{player}</div>
        ))} */}
        </div>
        <div>
          {winner ? (
            <div>
              <div>Winner: ...{winner.winner.substr(-6)}</div>
              <div>Block.number: {winner.number.toNumber()}</div>
              <div>Link to transacrion</div>
            </div>
          ) : (
            <div>
              <h2>WIN ~{price * limit}&nbsp;ETH!</h2>

              <button className="button button_large" onClick={sendRegister}>
                Buy {price} ETH
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
