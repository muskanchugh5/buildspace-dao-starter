import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const bundleDrop = sdk.getBundleDropModule(
    "0xf2064dFAe37E4175220D7011F9d45ac4681E160d",
);

( async () => {
    try {
        await bundleDrop.createBatch(
            [
                {
                    "name":"Pet Belt",
                    "description":"This gives you access to PetDAO.",
                    "image":readFileSync("scripts/assets/MemberNFT.png")

                }
            ]
        );
        console.log("Successfully deployed Member NFT.")
    } catch(error){
        console.error("Failed to deploy NFT", error);
    }
}) ()