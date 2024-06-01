// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Auction {
    address payable public beneficiary;
    uint public auctionEndTime;
    
    address public highestBidder;
    uint public highestBid;

    mapping(address => uint) pendingReturns;

    bool ended;

    event HighestBidIncreased(address indexed bidder, uint amount);
    event AuctionEnded(address winner, uint amount);
    event AuctionStarted(uint endTime);
    event BidWithdrawn(address indexed bidder, uint amount);

    modifier onlyBeforeEnd() {
        require(block.timestamp <= auctionEndTime, "Auction already ended.");
        _;
    }

    modifier onlyAfterEnd() {
        require(block.timestamp >= auctionEndTime, "Auction not yet ended.");
        _;
    }

    modifier onlyNotEnded() {
        require(!ended, "Auction has already ended.");
        _;
    }

    constructor(
        uint _biddingTime,
        address payable _beneficiary
    ) {
        beneficiary = _beneficiary;
        auctionEndTime = block.timestamp + _biddingTime;
        emit AuctionStarted(auctionEndTime);
    }

    function bid() external payable onlyBeforeEnd onlyNotEnded {
        require(msg.value > highestBid, "There already is a higher bid.");

        if (highestBid != 0) {
            pendingReturns[highestBidder] += highestBid;
        }

        highestBidder = msg.sender;
        highestBid = msg.value;
        emit HighestBidIncreased(msg.sender, msg.value);
    }

    function withdraw() external returns (bool) {
        uint amount = pendingReturns[msg.sender];
        require(amount > 0, "No funds to withdraw.");

        pendingReturns[msg.sender] = 0;

        if (!payable(msg.sender).send(amount)) {
            pendingReturns[msg.sender] = amount;
            return false;
        }

        emit BidWithdrawn(msg.sender, amount);
        return true;
    }

    function endAuction() external onlyAfterEnd onlyNotEnded {
        ended = true;
        emit AuctionEnded(highestBidder, highestBid);

        beneficiary.transfer(highestBid);
    }

    function getPendingReturn(address bidder) external view returns (uint) {
        return pendingReturns[bidder];
    }
}