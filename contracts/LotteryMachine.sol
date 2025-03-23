//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Ticket.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LotteryMachine is Ownable {
    address private machineOwner;
    address private casinoAddress;
    uint256 public commission = 1;
    Ticket[] public tickets;
    
    // Chainlink VRF configuration
    address public vrfCoordinator;
    address public linkToken;
    bytes32 public keyHash;
    uint256 public fee;
    
    // Events
    event TicketCreated(address ticketAddress, uint256 price, uint256 limit);
    
    constructor(
        address _owner,
        address _vrfCoordinator,
        address _linkToken,
        bytes32 _keyHash,
        uint256 _fee
    ) {
        casinoAddress = msg.sender;
        machineOwner = _owner;
        
        // Set Chainlink VRF configuration
        vrfCoordinator = _vrfCoordinator;
        linkToken = _linkToken;
        keyHash = _keyHash;
        fee = _fee;
        
        // Transfer ownership
        transferOwnership(_owner);
        
        // Create initial tickets
        createStartTickets();
    }

    function createStartTickets() private {
        // Create initial ticket with 1 ETH price and 2 players limit
        tickets.push(new Ticket(
            address(this),
            1 ether,
            2,
            commission,
            vrfCoordinator,
            linkToken,
            keyHash,
            fee
        ));
    }

    receive() external payable {
        uint256 balance = getBalance();
        uint256 percent = balance / 100;
        uint256 commissionAmount = percent * commission;
        
        // Send commission to casino
        (bool casinoSuccess,) = payable(casinoAddress).call{value: commissionAmount}("");
        require(casinoSuccess, "Casino commission transfer failed");
        
        // Send remaining to owner
        (bool ownerSuccess,) = payable(machineOwner).call{value: address(this).balance}("");
        require(ownerSuccess, "Owner transfer failed");
    }

    fallback() external payable {}
    
    function createTicket(uint256 _price, uint256 _limit) public returns(Ticket) {
        require(_limit > 1, "Limit must be from 2 to 1000");
        require(_limit < 1001, "Limit must be from 2 to 1000");
        
        Ticket ticket = new Ticket(
            address(this),
            _price,
            _limit,
            commission,
            vrfCoordinator,
            linkToken,
            keyHash,
            fee
        );
        
        tickets.push(ticket);
        emit TicketCreated(address(ticket), _price, _limit);
        return ticket;
    }

    function getTickets() public view returns(Ticket[] memory) {
        return tickets;
    }
    
    function getTicketCount() public view returns(uint256) {
        return tickets.length;
    }
    
    function getTicketAt(uint256 index) public view returns(Ticket) {
        require(index < tickets.length, "Invalid ticket index");
        return tickets[index];
    }

    function getBalance() public view returns(uint256) {
        return address(this).balance;
    }

    function getMachineOwner() public view returns(address) {
        return machineOwner;
    }
    
    function getCasinoAddress() public view returns(address) {
        return casinoAddress;
    }

    function getCommision() public view returns(uint256) {
        return commission;
    }
    
    function setCommission(uint256 _commission) public onlyOwner {
        require(_commission > 0, "Commission must be greater than 0");
        require(_commission < 100, "Commission must be less than 100");
        commission = _commission;
    }

    function withdraw() public onlyOwner {
        payable(machineOwner).transfer(address(this).balance);
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
    
    // Function to get player's tickets across all games
    function getPlayerTickets(address player) public view returns(address[] memory) {
        // Count how many tickets the player has
        uint256 count = 0;
        for (uint256 i = 0; i < tickets.length; i++) {
            Ticket ticket = tickets[i];
            address[] memory players = ticket.getPlayers();
            for (uint256 j = 0; j < players.length; j++) {
                if (players[j] == player) {
                    count++;
                    break;
                }
            }
        }
        
        // Get all tickets
        address[] memory playerTickets = new address[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < tickets.length; i++) {
            Ticket ticket = tickets[i];
            address[] memory players = ticket.getPlayers();
            for (uint256 j = 0; j < players.length; j++) {
                if (players[j] == player) {
                    playerTickets[index] = address(ticket);
                    index++;
                    break;
                }
            }
        }
        
        return playerTickets;
    }
}