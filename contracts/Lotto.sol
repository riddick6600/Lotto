//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Lotto {
    uint playersLength = 2;
    uint price = 1 ether;
    address payable[] players;
    address winner;
    address payable owner;

    constructor(uint _price, uint _playersLength) {
        owner = payable(msg.sender);
        _price = _price;
        playersLength = _playersLength;
    }
    
    function register() external payable {
        require(msg.value == price, "Price is incorrect ${price}");
        console.log('players.length');
        console.log(players.length);
        console.log(playersLength);
        console.log(players.length < playersLength);
        require(players.length < playersLength, "Too many players");
        players.push(payable(msg.sender));
        if (players.length == playersLength) {
            winner = players[random()];
            payout(payable(winner));
        }
    }


    function random() private view returns(uint){
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players))) % playersLength;
    }

    function payout(address payable _player) private {
        uint percent = address(this).balance / 100;
        _player.transfer(address(this).balance - percent);
        owner.transfer(address(this).balance);
    }

    function getPrice() public view returns(uint) {
        return price;
    }

    function setPrice(uint _price) public {
        price = _price;
    }

    function getPlayers() public view returns(address payable[] memory) {
        return players;
    }

    function getPlayersLength() public view returns(uint) {
        return playersLength;
    }

    function getWinner() public view returns(address) {
        return winner;
    }

}