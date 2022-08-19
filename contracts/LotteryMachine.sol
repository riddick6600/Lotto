//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Ticket.sol";

contract LotteryMachine {
    address private owner;
    uint commission = 1;
    Ticket[] tickets;

    uint[] defaultPrices = [0.01 ether, 0.1 ether, 1 ether, 10 ether, 100 ether];
    uint[] defaultLimits = [2, 10, 100, 1000];

    function createStartTickets()  private {
        for (uint i = 0; i <= defaultPrices.length; i++) {
            for (uint j = 0; j <= defaultLimits.length; j++) {
                tickets.push(new Ticket(address(this), defaultPrices[i] * (1 ether), defaultLimits[j], commission));
            }
        }
    }

    constructor() {
        owner = msg.sender;
        createStartTickets();
    }
    
    receive() external payable {}
    
    function createTicket(uint _price, uint _limit) public payable returns(Ticket) {
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

}