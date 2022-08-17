//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "hardhat/console.sol";
import "./Ticket.sol";

contract LotteryMachine is PaymentSplitter {
    address private owner;
    address private myAddress;
    Ticket[] tickets;

    constructor() {
        console.log("constructor");
        console.log("owner1", owner);
        owner = msg.sender;
        myAddress = address(this);
        console.log("owner2", owner);
        console.log("myAddress", myAddress);
    }

    function getTickets() public view returns(Ticket[] memory) {
        return tickets;
    }
    
    function createTicket(uint _price, uint _limit) public payable returns(Ticket) {
        require(_limit > 1, "Limit must be from 2 to 255");
        require(_limit < 256, "Limit must be from 2 to 255");
        Ticket ticket = new Ticket(owner, _price, _limit);
        tickets.push(ticket);
        return ticket;
    }

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }

    function withdrow() public {
        payable(owner).transfer(getBalance());
    }

    function getOwner() public view returns(address) {
        return owner;
    }

}