import sdk from "./1-initialize-sdk.js";

const tokenModule = sdk.getTokenModule("0x4bBEFE295Be321274f379Cb669105Fe29a2938Af");

(async () => {
    try {
        console.log("Existing roles",await tokenModule.getAllRoleMembers());
        await tokenModule.revokeAllRolesFromAddress(process.env.WALLET_ADDRESS);
        console.log(
            "🎉 Roles after revoking ourselves",
            await tokenModule.getAllRoleMembers()
          );
          console.log("✅ Successfully revoked our superpowers from the ERC-20 contract");
    }catch (error) {
        console.error("Failed to revoke ourselves from the DAO treasury", error);
      }

}) ();