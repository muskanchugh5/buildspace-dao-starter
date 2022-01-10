import sdk from "./1-initialize-sdk.js";
const app = sdk.getAppModule("0xdCC3AEe5e4A40d66590F0D14c268BFd5e5B009F7");

(async () => {
    try {
        const voteModule = await app.deployVoteModule({
            name: "PetDAO exclusive praposals.",

            votingTokenAddress: "0x4bBEFE295Be321274f379Cb669105Fe29a2938Af",
            proposalStartWaitTimeInSeconds: 0,
            proposalVotingTimeInSeconds: 24*60*60,
            votingQuorumFraction: 0,
            minimumNumberOfTokensNeededToPropose: "0",
        });
        console.log("Successfully deployed vote module.",voteModule.address);
    }
    catch(err){
        console.error("Failed to deploy vote module",err);
    }
}) ();