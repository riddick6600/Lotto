//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Ticket.sol";

contract LotteryMachine {
    address private owner;
    uint commission = 1;
    Ticket[] tickets;

    function createStartTickets()  private {
        tickets.push(new Ticket(msg.sender, 0.1 ether, 2, commission));
        tickets.push(new Ticket(address(this), 1 ether, 2, commission));
        tickets.push(new Ticket(address(this), 10 ether, 2, commission));

        // tickets.push(new Ticket(address(this), 0.1 ether, 10, commission));

        // tickets.push(new Ticket(address(this), 1 ether, 100, commission));
        // tickets.push(new Ticket(address(this), 10 ether, 100, commission));

        // tickets.push(new Ticket(address(this), 0.01 ether, 1000, commission));
        // tickets.push(new Ticket(address(this), 1 ether, 1000, commission));
    }

    constructor() {
        owner = msg.sender;
        createStartTickets();
    }

    receive() external payable {
    }

    fallback() external payable {
        // payable(owner).transfer(msg.value);
    }
    
    function createTicket(uint _price, uint _limit) public returns(Ticket) {
        require(_limit > 1, "Limit must be from 2 to 255");
        require(_limit < 256, "Limit must be from 2 to 255");
        Ticket ticket = new Ticket(address(this), _price, _limit, commission);
        tickets.push(ticket);
        return ticket;
    }

    function getTickets() public view returns(Ticket[] memory) {
        return tickets;
    }

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }

    function getOwner() public view returns(address) {
        return owner;
    }

    function getCommision() public view returns(uint) {
        return commission;
    }

    function withdrow() public {
        payable(owner).transfer(getBalance());
    }

}