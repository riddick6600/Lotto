//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.16;

contract Ticket {
    address payable owner;
    uint price;
    uint limit;
    address payable[] players;
    address winner;
    

    constructor(uint _price, uint _limit) {
        owner = payable(msg.sender);
        price = _price;
        limit = _limit;
    }
    
    function register() external payable {
        require(msg.value == price, "Price is incorrect ${price}");
        require(players.length < limit, "Too many players");
        players.push(payable(msg.sender));
        if (players.length == limit) {
            winner = players[random()];
            payout(payable(winner));
        }
    }


    function random() private view returns(uint){
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players))) % limit;
    }

    function payout(address payable _player) private {
        uint percent = address(this).balance / 100;
        _player.transfer(address(this).balance - percent);
        owner.transfer(address(this).balance);
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

}