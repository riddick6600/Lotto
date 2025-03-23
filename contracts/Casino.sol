//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./LotteryMachine.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Casino is Ownable {
    uint256 public commission = 1;
    LotteryMachine[] public machines;
    
    // Chainlink VRF configuration
    address public vrfCoordinator;
    address public linkToken;
    bytes32 public keyHash;
    uint256 public fee;
    
    // Events
    event MachineCreated(address machineAddress, address owner);
    event CommissionUpdated(uint256 newCommission);
    event Withdrawal(address owner, uint256 amount);
    
    constructor(
        address _vrfCoordinator,
        address _linkToken,
        bytes32 _keyHash,
        uint256 _fee
    ) {
        // Set Chainlink VRF configuration
        vrfCoordinator = _vrfCoordinator;
        linkToken = _linkToken;
        keyHash = _keyHash;
        fee = _fee;
        
        // Create initial machine
        createMachine();
    }
    
    receive() external payable {}
    
    fallback() external payable {}
    
    function createMachine() public returns(LotteryMachine) {
        LotteryMachine machine = new LotteryMachine(
            msg.sender,
            vrfCoordinator,
            linkToken,
            keyHash,
            fee
        );
        
        machines.push(machine);
        emit MachineCreated(address(machine), msg.sender);
        return machine;
    }

    function getMachines() public view returns(LotteryMachine[] memory) {
        return machines;
    }
    
    function getMachineCount() public view returns(uint256) {
        return machines.length;
    }
    
    function getMachineAt(uint256 index) public view returns(LotteryMachine) {
        require(index < machines.length, "Invalid machine index");
        return machines[index];
    }

    function getBalance() public view returns(uint256) {
        return address(this).balance;
    }

    function getCommision() public view returns(uint256) {
        return commission;
    }
    
    function setCommission(uint256 _commission) public onlyOwner {
        require(_commission > 0, "Commission must be greater than 0");
        require(_commission < 100, "Commission must be less than 100");
        commission = _commission;
        emit CommissionUpdated(_commission);
    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        payable(owner()).transfer(amount);
        emit Withdrawal(owner(), amount);
    }
    
    // Function to update Chainlink VRF configuration
    function updateVRFConfig(
        address _vrfCoordinator,
        address _linkToken,
        bytes32 _keyHash,
        uint256 _fee
    ) public onlyOwner {
        vrfCoordinator = _vrfCoordinator;
        linkToken = _linkToken;
        keyHash = _keyHash;
        fee = _fee;
    }
    
    // Function to get all tickets belonging to a player across all machines
    function getPlayerTickets(address player) public view returns(address[][] memory) {
        address[][] memory allTickets = new address[][](machines.length);
        
        for (uint256 i = 0; i < machines.length; i++) {
            allTickets[i] = machines[i].getPlayerTickets(player);
        }
        
        return allTickets;
    }
}