//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Ticket {
    address private owner;
    uint price;
    uint limit;
    uint balance;
    uint commission = 3;
    address[] players;
    address winner;
    

    constructor(address _address, uint _price, uint _limit) payable {
        console.log("constructor");
        console.log("msg.sender:", msg.sender);
        console.log("owner1", owner);
        owner = _address;
        price = _price;
        limit = _limit;
        balance += msg.value;
        console.log("owner2", owner);
    }
    
    function register() public payable {
        require(msg.value == price, "Price is incorrect");
        require(players.length < limit, "Too many players");
        players.push(msg.sender);
        balance += msg.value;
        if (players.length == limit) {
            uint rand = random();
            winner = players[rand];
            payout(winner);
        }
    }


    function random() private view returns(uint){
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players))) % limit;
    }

    function payout(address _player) private {
        uint percent = getBalance() / 100;
        console.log("Pay winner _player:", _player);
        console.log("getBalance()", getBalance());
        console.log("getBalance() - percent * commission", getBalance() - percent * commission);
        payable(_player).transfer(getBalance() - percent * commission);
        console.log("Pay comission to owner:", owner);
        payable(owner).transfer(getBalance());
        console.log("Payed comission, balance:", getBalance());
    }

    function getPrice() public view returns(uint) {
        return price;
    }

    function getLimit() public view returns(uint) {
        return limit;
    }

    function getPlayers() public view returns(address[] memory) {
        return players;
    }

    function getWinner() public view returns(address) {
        return winner;
    }

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }

    function withdrow() public {
        payable(owner).transfer(address(this).balance);
    }

    function getOwner() public view returns(address) {
        return owner;
    }

}