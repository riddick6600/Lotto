import React, { useContext, useEffect, useState } from "react";
import { AccountContext } from "@contexts";
import { CasinoContext } from "@contexts";
import { shortenAddress } from "@utils";
import { ethers } from "ethers";
import { ticketAbi } from "@abi";
import { getSigner } from "@utils";
import { toast } from "react-toastify";

// Types
type TicketInfo = {
  address: string;
  price: string;
  limit: number;
  players: string[];
  balance: string;
  isFinished: boolean;
};

export const MyTickets = () => {
  const { account } = useContext(AccountContext);
  const { contract: casinoContract } = useContext(CasinoContext);
  const [ticketAddresses, setTicketAddresses] = useState<string[][]>([]);
  const [ticketInfo, setTicketInfo] = useState<Record<string, TicketInfo>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [transferForm, setTransferForm] = useState({
    ticketAddress: "",
    tokenId: "",
    recipient: "",
  });

  useEffect(() => {
    const fetchTickets = async () => {
      if (!casinoContract || !account) return;

      try {
        setIsLoading(true);
        // Get all tickets owned by the user from all machines
        const tickets = await casinoContract.getPlayerTickets(account);
        setTicketAddresses(tickets);

        // Get info for each ticket
        const ticketInfoMap: Record<string, TicketInfo> = {};
        
        for (const machineTickets of tickets) {
          for (const ticketAddress of machineTickets) {
            if (!ticketAddress) continue; // Skip empty addresses
            
            const ticket = new ethers.Contract(ticketAddress, ticketAbi, getSigner());
            
            const [price, limit, players, balance, isFinished] = await Promise.all([
              ticket.getPrice().then((p: any) => ethers.utils.formatEther(p)),
              ticket.getLimit().then((l: any) => l.toNumber()),
              ticket.getPlayers(),
              ticket.getBalance().then((b: any) => ethers.utils.formatEther(b)),
              ticket.gameFinished ? ticket.gameFinished() : false, // Handle older contract versions
            ]);
            
            ticketInfoMap[ticketAddress] = {
              address: ticketAddress,
              price,
              limit,
              players,
              balance,
              isFinished: isFinished || false,
            };
          }
        }
        
        setTicketInfo(ticketInfoMap);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        toast("Error fetching tickets", { type: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [casinoContract, account]);

  const handleTransferChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTransferForm({
      ...transferForm,
      [e.target.name]: e.target.value,
    });
  };

  const transferTicket = async () => {
    try {
      if (!transferForm.ticketAddress || !transferForm.tokenId || !transferForm.recipient) {
        toast("Please fill all fields", { type: "error" });
        return;
      }

      const ticket = new ethers.Contract(
        transferForm.ticketAddress,
        ticketAbi,
        getSigner()
      );

      // Check if we're using the new ERC-721 contract
      if (ticket.transfer) {
        const tx = await ticket.transfer(
          transferForm.recipient,
          transferForm.tokenId
        );
        await tx.wait();
        toast("Ticket transferred successfully", { type: "success" });
      } else {
        toast("This ticket does not support transfers", { type: "error" });
      }
    } catch (error) {
      console.error("Error transferring ticket:", error);
      toast("Error transferring ticket", { type: "error" });
    }
  };

  return (
    <div className="my-tickets">
      <h1>My Tickets</h1>
      
      {isLoading ? (
        <p>Loading your tickets...</p>
      ) : (
        <>
          {ticketAddresses.flat().filter(Boolean).length === 0 ? (
            <p>You don't have any tickets yet.</p>
          ) : (
            <div className="tickets-grid">
              {ticketAddresses.flat().filter(Boolean).map((address) => {
                const ticket = ticketInfo[address];
                if (!ticket) return null;
                
                return (
                  <div key={address} className="ticket-card">
                    <div className="ticket-header">
                      <img className="ticket_img" src="/ticket.png" />
                      <h3>Ticket: {shortenAddress(address)}</h3>
                    </div>
                    <div className="ticket-details">
                      <p>Price: {ticket.price} ETH</p>
                      <p>Players: {ticket.players.length} / {ticket.limit}</p>
                      <p>Balance: {ticket.balance} ETH</p>
                      <p>Status: {ticket.isFinished ? "Completed" : "Active"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          <div className="transfer-section">
            <h2>Transfer Ticket</h2>
            <div className="transfer-form">
              <input
                type="text"
                name="ticketAddress"
                placeholder="Ticket Address"
                value={transferForm.ticketAddress}
                onChange={handleTransferChange}
              />
              <input
                type="text"
                name="tokenId"
                placeholder="Token ID"
                value={transferForm.tokenId}
                onChange={handleTransferChange}
              />
              <input
                type="text"
                name="recipient"
                placeholder="Recipient Address"
                value={transferForm.recipient}
                onChange={handleTransferChange}
              />
              <button onClick={transferTicket}>Transfer Ticket</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};