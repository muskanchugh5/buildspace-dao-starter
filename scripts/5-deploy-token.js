import sdk from "./1-initialize-sdk.js";

const app = sdk.getAppModule("0xdCC3AEe5e4A40d66590F0D14c268BFd5e5B009F7");

(async () => {
    try {
        const tokenModule = await app.deployTokenModule({
            name:"PetDAO Governance token.",
            symbol:"PET"
        });
        console.log("✅ Successfully Deployed token module, address: ",tokenModule.address)
    }
    catch(err){
        console.error("Failed to deploy token module.");
    }
}) ();