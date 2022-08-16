//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Ticket.sol";

contract LotteryMachine {
    address private owner;
    uint balance;
    Ticket[] tickets;

    constructor() payable {
        owner = msg.sender;
        balance += msg.value;
        Ticket ticket = new Ticket(owner, 1 ether, 2);
        tickets.push(ticket);
    }

    function getTickets() public view returns(Ticket[] memory) {
        return tickets;
    }
    
    function createTicket(uint _price, uint _limit) public payable returns(Ticket) {
        require(_limit > 1, "Limit must be from 2 to 255");
        require(_limit < 256, "Limit must be from 2 to 255");
        Ticket ticket = new Ticket(msg.sender, _price, _limit);
        tickets.push(ticket);
        return ticket;
    }

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }

    function withdrow() public payable {
        payable(owner).transfer(address(this).balance);
    }

    function getOwner() public view returns(address) {
        return owner;
    }

}