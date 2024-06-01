import React, { useState, useEffect } from 'react';
import {
    ethers
} from 'ethers';
import AuctionContract from '../../contracts/Auction.sol/Auction.json'; // Import the compiled contract ABI

function AuctionApp() {
    const [contract, setContract] = useState(null);
    const [auctionEndTime, setAuctionEndTime] = useState(null);
    const [highestBidder, setHighestBidder] = useState(null);
    const [highestBid, setHighestBid] = useState(null);
    const [bidAmount, setBidAmount] = useState('');
    const [account, setAccount] = useState(null);

    useEffect(() => {
        connectToContract();
        loadBlockchainData();
    }, []);

    async function connectToContract() {
        try {
            if (window.ethereum) {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(
                    '0xECAfF267727a46b1c203A837eCF171C85DcCe78A', // Replace with your BSC contract address
                    AuctionContract.abi,
                    signer
                );
                setContract(contract);
                const currentAccount = await signer.getAddress();
                setAccount(currentAccount);
                loadBlockchainData(contract);
            } else {
                console.error('MetaMask not detected');
            }
        } catch (error) {
            console.error('Error connecting to BSC:', error);
        }
    }

    async function loadBlockchainData(contract) {
        if (contract) {
            try {
                console.log('Contract:', contract);
                console.log('Ethers:', ethers);
                const endTime = await contract.auctionEndTime();
                setAuctionEndTime(Number(endTime.toString()));
                const bidder = await contract.highestBidder();
                setHighestBidder(bidder);
                const bid = await contract.highestBid();
                console.log('Highest Bid (raw):', bid);
                setHighestBid(ethers.formatEther(bid.toString()));
            } catch (error) {
                console.error('Error loading blockchain data:', error);
            }
        }
    }

    async function placeBid() {
        if (contract && account && bidAmount) {
            try {
                // Check if auction has ended
                if (auctionEndTime && Date.now() < auctionEndTime * 1000) {
                    const tx = await contract.bid({ value: ethers.parseEther(bidAmount) });
                    await tx.wait();
                    loadBlockchainData(contract);
                } else {
                    console.error('Auction has already ended.');
                }
            } catch (error) {
                console.error('Error placing bid:', error);
            }
        }
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-500 flex flex-col justify-center items-center">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">Auction App</h1>
                {account && <p className="mb-4 text-center text-gray-600">Connected Account: {account}</p>}
                <p className="mb-4 text-center text-gray-600">Auction End Time: {auctionEndTime ? new Date(auctionEndTime * 1000).toLocaleString() : 'Loading...'}</p>
                <p className="mb-4 text-center text-gray-600">Highest Bidder: {highestBidder || 'Loading...'}</p>
                <p className="mb-4 text-center text-gray-600">Highest Bid: {highestBid !== null ? `${highestBid} BNB` : 'Loading...'}</p>
                <input
                    className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter Bid Amount (BNB)"
                />
                <button
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-lg transition duration-300"
                    onClick={placeBid}
                    disabled={!auctionEndTime || Date.now() >= auctionEndTime * 1000}

                >
                    Place Bid
                </button>
                {auctionEndTime && <p className="text-red-500 text-center mt-2">Auction has already ended.</p>}
            </div>
        </div>
    );
}
export default AuctionApp;