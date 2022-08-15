//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.16;

import "./Ticket.sol";

contract LotteryMachine {
    address owner;
    Ticket[] tickets;

    constructor() {
        owner = payable(msg.sender);
    }

    function getTickets() public view returns(Ticket[] memory) {
        return tickets;
    }
    
    function createTicket(uint _price, uint _limit) external returns(Ticket) {
        Ticket ticket = new Ticket(_price, _limit);
        tickets.push(ticket);
        return ticket;
    }

}