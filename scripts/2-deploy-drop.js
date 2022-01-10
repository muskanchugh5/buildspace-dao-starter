import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs"

const app = sdk.getAppModule("0xdCC3AEe5e4A40d66590F0D14c268BFd5e5B009F7");

(async () => {
    try {
        const bundleDropModule = await app.deployBundleDropModule({
            name : "PetDao Membership",
            description : "Pet my Pet and get a token.",
            image: readFileSync("scripts/assets/pets.jpeg"),
            primarySaleRecipientAddress: ethers.constants.AddressZero,
        });
        console.log(
            "✅ Successfully deployed bundleDrop module, address:",
            bundleDropModule.address,
        );
        console.log(
            "✅ bundleDrop metadata:",
            await bundleDropModule.getMetadata(),
        );
    } catch (error) {
      console.log("failed to deploy bundleDrop module", error);
    }
}) ()


