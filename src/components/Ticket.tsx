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
        <img className="slot_img" src="/slot.webp" />
        <div>Ticket: {contract && `...` + contract.address.substr(-6)}</div>
        <div>Owner: ...{owner.substr(-6)}</div>
        <div>Balance: {balance && `${balance} ETH`}</div>
        <div>Price: {price && `${price} ETH`}</div>
        <br />
        <div>
          {winner ? (
            <div>
              <div>Winner: ...{winner.winner.substr(-6)}</div>
              <div>Block.number: {winner.number.toNumber()}</div>
              <div>Link to transacrion</div>
            </div>
          ) : (
            <div>
              <button className="button button_large" onClick={sendRegister}>
                WIN {price * limit} ETH!
              </button>

              <div>
                <h2>
                  Players {players.length ?? 0} of {limit}:
                </h2>
                {players.map((player, index) => (
                  <div key={player + index}>{player}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
