import sdk from "./1-initialize-sdk.js";

const bundleDrop = sdk.getBundleDropModule(
    "0xf2064dFAe37E4175220D7011F9d45ac4681E160d",
);

( async () => {
    try {
        const claimConditionFactory = bundleDrop.getClaimConditionFactory();
        claimConditionFactory.newClaimPhase({
            startTime: new Date(),
            maxQuantity: 50_000,
            maxQuantityPerTransaction: 1,
        });

        await bundleDrop.setClaimCondition(1, claimConditionFactory);
        console.log("Successfully set claim condition to bundle drop.");
    } catch(err){
        console.error("Failed to set claim condition.",err);
    }
}) ()