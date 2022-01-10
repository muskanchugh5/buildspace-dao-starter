import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

const bundleDropModule = sdk.getBundleDropModule("0xf2064dFAe37E4175220D7011F9d45ac4681E160d",);

const tokenModule = sdk.getTokenModule("0x4bBEFE295Be321274f379Cb669105Fe29a2938Af");

(async() => {
    try {
        const walletAddresses = await bundleDropModule.getAllClaimerAddresses("1");

        if(walletAddresses.length === 0){
            console.log(
                "No NFTs have been claimed yet. Get some members to PetDAO!"
            );
            process.exit(0);
        }

        const airdropTargets = walletAddresses.map((address)=> {
            const randomAmount = Math.floor(Math.random() * (10000-1000+1) + 1000);

            console.log("Going to airdrop ", randomAmount, "token to",address);

            const airdropTarget = {
                address,
                amount: ethers.utils.parseUnits(randomAmount.toString(),18),
            };
            return airdropTarget;
        });
        console.log("🌈 Starting airdrop...")
        await tokenModule.transferBatch(airdropTargets);
        console.log("✅ Successfully airdropped tokens to all the holders of the NFT!");

    }
    catch(err){
        console.error("Failed to airdrop tokens",err);
    }
}) ();