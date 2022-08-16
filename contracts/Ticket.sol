//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Ticket {
    address private owner;
    uint price;
    uint limit;
    uint balance;
    uint commission = 3;
    address payable[] players;
    address winner;
    

    constructor(address _address, uint _price, uint _limit) payable {
        owner = _address;
        price = _price;
        limit = _limit;
        balance += msg.value;
    }
    
    function register() public payable {
        require(msg.value == price, "Price is incorrect");
        require(players.length < limit, "Too many players");
        players.push(payable(msg.sender));
        balance += msg.value;
        if (players.length == limit) {
            uint rand = random();
            winner = players[rand];
            payout(payable(winner));
        }
    }


    function random() private view returns(uint){
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players))) % limit;
    }

    function payout(address payable _player) private {
        uint percent = address(this).balance / 100;
        _player.transfer(address(this).balance - percent * commission);
        payable(owner).transfer(address(this).balance);
    }

    function getPrice() public view returns(uint) {
        return price;
    }

    function getLimit() public view returns(uint) {
        return limit;
    }

    function getPlayers() public view returns(address payable[] memory) {
        return players;
    }

    function getWinner() public view returns(address) {
        return winner;
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