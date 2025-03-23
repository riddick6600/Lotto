//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract Ticket is ERC721Enumerable, Ownable, VRFConsumerBase {
    using Counters for Counters.Counter;
    
    // Chainlink VRF variables
    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public randomResult;
    bytes32 public requestId;
    
    // Ticket properties
    address private machineOwner;
    uint256 public price;
    uint256 public limit;
    uint256 public commission;
    address[] public players;
    bool public gameInProgress = false;
    bool public gameFinished = false;
    Counters.Counter private _tokenIds;
    
    // Mapping from token ID to player address
    mapping(uint256 => address) public tokenToPlayer;
    
    // Events
    event TicketPurchased(address player, uint256 tokenId);
    event RandomnessRequested(bytes32 requestId);
    event WinnerSelected(address winner, uint256 amount);
    event CommissionPaid(address owner, uint256 amount);
    
    constructor(
        address _machineOwner,
        uint256 _price,
        uint256 _limit,
        uint256 _commission,
        address _vrfCoordinator,
        address _linkToken,
        bytes32 _keyHash,
        uint256 _fee
    ) 
        ERC721("LottoTicket", "LTICKET")
        VRFConsumerBase(_vrfCoordinator, _linkToken)
        payable 
    {
        machineOwner = _machineOwner;
        price = _price;
        require(_limit > 1, "Limit must be 2 to 1000");
        require(_limit < 1001, "Limit must be 2 to 1000");
        limit = _limit;
        require(_commission > 0, "Commission must be 0 to 99");
        require(_commission < 100, "Commission must be 0 to 99");
        commission = _commission;
        
        // Chainlink VRF setup
        keyHash = _keyHash;
        fee = _fee;
        
        // Transfer ownership to machine owner
        transferOwnership(_machineOwner);
    }
    
    function register() public payable {
        require(!gameFinished, "Game already finished");
        require(msg.value >= price, "Insufficient payment");
        require(players.length < limit, "Too many players");
        
        // Mint new token for the player
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        
        // Update mappings and arrays
        tokenToPlayer[newItemId] = msg.sender;
        players.push(msg.sender);
        
        emit TicketPurchased(msg.sender, newItemId);
        
        // If limit reached, start the random winner selection
        if (players.length == limit) {
            selectWinner();
        }
    }
    
    function selectWinner() private {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK to pay fee");
        gameInProgress = true;
        requestId = requestRandomness(keyHash, fee);
        emit RandomnessRequested(requestId);
    }
    
    // Callback function used by VRF Coordinator
    function fulfillRandomness(bytes32 _requestId, uint256 _randomness) internal override {
        require(gameInProgress, "Game not in progress");
        require(_requestId == requestId, "Wrong requestId");
        
        randomResult = _randomness;
        uint256 winnerIndex = randomResult % limit;
        address winner = players[winnerIndex];
        
        payout(winner);
    }
    
    // Fallback to pseudo-random when Chainlink VRF is not available
    function fallbackRandom() public onlyOwner {
        require(gameInProgress, "Game not in progress");
        require(players.length == limit, "Not enough players");
        
        uint256 pseudoRandomResult = uint256(keccak256(abi.encodePacked(
            block.difficulty, 
            block.timestamp, 
            blockhash(block.number - 1),
            players
        )));
        
        uint256 winnerIndex = pseudoRandomResult % limit;
        address winner = players[winnerIndex];
        
        payout(winner);
    }

    function payout(address _winner) private {
        require(!gameFinished, "Game already finished");
        
        uint256 balance = getBalance();
        uint256 percent = balance / 100;
        uint256 commissionAmount = percent * commission;
        uint256 winSize = balance - commissionAmount;
        
        // Send commission to machine owner
        (bool commissionSuccess,) = payable(machineOwner).call{value: commissionAmount}("");
        require(commissionSuccess, "Commission transfer failed");
        emit CommissionPaid(machineOwner, commissionAmount);
        
        // Send winnings to winner
        (bool winnerSuccess,) = payable(_winner).call{value: winSize}("");
        require(winnerSuccess, "Winner transfer failed");
        emit WinnerSelected(_winner, winSize);
        
        gameFinished = true;
        gameInProgress = false;
    }
    
    function transfer(address to, uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not the token owner");
        require(!gameFinished, "Game already finished");
        
        // Update player address for this token
        tokenToPlayer[tokenId] = to;
        
        // Update players array
        for (uint i = 0; i < players.length; i++) {
            if (players[i] == msg.sender) {
                players[i] = to;
                break;
            }
        }
        
        // Transfer the token
        _transfer(msg.sender, to, tokenId);
    }
    
    function getPrice() public view returns(uint256) {
        return price;
    }

    function getLimit() public view returns(uint256) {
        return limit;
    }

    function getPlayers() public view returns(address[] memory) {
        return players;
    }

    function getBalance() public view returns(uint256) {
        return address(this).balance;
    }

    function getMachineOwner() public view returns(address) {
        return machineOwner;
    }
    
    function getPlayerTickets(address player) public view returns(uint256[] memory) {
        uint256 ownerTokenCount = balanceOf(player);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        
        for (uint256 i = 0; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(player, i);
        }
        
        return tokenIds;
    }
    
    // Fallback function
    receive() external payable {}
}