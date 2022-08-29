import React, { useContext } from "react";
import { TicketContext, LotteryMachineContext } from "@contexts";
import { getHash } from "@utils";

export const Ticket = () => {
  const { contract, owner, balance, price, players, sendRegister, limit } =
    useContext(TicketContext);
  const { address } = useContext(LotteryMachineContext);

  const winner = owner !== address ? owner : null;

  if (!balance) {
    return null;
  }

  return (
    <div className="ticket text-center">
      <div>
        <img className="ticket_img" src="/ticket.png" />
        <div>Ticket: {contract && `...` + contract.address.substr(-6)}</div>
        <div>Owner: ...{owner.substr(-6)}</div>
        <div>Balance: {balance && `${balance} ETH`}</div>
        <div>Price: {price && `${price} ETH`}</div>
        <br />
        <div>
          {winner ? (
            <div>
              <div>
                {price * limit} ETH Winner: {getHash(winner)}
              </div>
              {/* <div>Block.number: {winner.number.toNumber()}</div> */}
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
                  <div key={player + index}>{getHash(player)}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
