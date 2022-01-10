import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

const voteModule = sdk.getVoteModule("0x374D9962c9a37957530C7d9506A8ED2CDf00FAa1");
const tokenModule = sdk.getTokenModule("0x4bBEFE295Be321274f379Cb669105Fe29a2938Af");

(async () => {
    try{
        await tokenModule.grantRole("minter","0x374D9962c9a37957530C7d9506A8ED2CDf00FAa1");

        console.log("Successfully gave vote module permissions to mint tokens.");

    } catch(err){
        console.error("Failed to give minitng permissions to vote module",err);
        process.exit(1);
    }

    try{
        const ownedTokenBalance = await tokenModule.balanceOf(process.env.WALLET_ADDRESS);

        const ownedAmount = ethers.BigNumber.from(ownedTokenBalance.value);
        const perc90 = ownedAmount.div(100).mul(90);

        await tokenModule.transfer(
            voteModule.address,
            perc90,
        );
        console.log("✅ Successfully transferred tokens to vote module");
    } catch (err) {
      console.error("failed to transfer tokens to vote module", err);
    }
}) ();