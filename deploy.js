import hardhat from 'hardhat';
import dotenv from 'dotenv';

dotenv.config();

const { ethers } = hardhat;

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // Fetch balance using ethers.provider
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", balance.toString());

    const biddingTime = 3600; // 1 hour in seconds
    const beneficiary = "0x7311b4C8167159d023329C775AACEDd113F5B564";


    const Auction = await ethers.getContractFactory("Auction");
    const auction = await Auction.deploy(biddingTime, beneficiary);

    // Wait for the contract to be deployed
    await auction.waitForDeployment();

    console.log("Auction address:", auction.target);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
