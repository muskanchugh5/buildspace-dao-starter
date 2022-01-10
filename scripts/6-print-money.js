import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

const tokenModule = sdk.getTokenModule("0x4bBEFE295Be321274f379Cb669105Fe29a2938Af");

( async () => {
    try{
         // What's the max supply you want to set? 1,000,000 is a nice number!
        const amount = 1_000_000;
        const amount_with_18_decimals = ethers.utils.parseUnits(amount.toString(), 18);
        await tokenModule.mint(amount_with_18_decimals);
        const totalSupply = await tokenModule.totalSupply();

        console.log("✅ There now is",ethers.utils.formatUnits(totalSupply,18),"$PET in circulation");
    }
    catch(err){
        console.error("Failed to print money", err);
    }
})();