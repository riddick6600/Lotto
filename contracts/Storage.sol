//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.16;

contract Storage {
    mapping (address => string[]) data;


    function getData() public view returns (string[] memory) {
        return data[msg.sender];
    }

    function setData(string memory _data) public {
        data[msg.sender].push(_data);
    }
}
