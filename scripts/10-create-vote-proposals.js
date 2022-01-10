import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

const voteModule = sdk.getVoteModule("0x374D9962c9a37957530C7d9506A8ED2CDf00FAa1");
const tokenModule = sdk.getTokenModule("0x4bBEFE295Be321274f379Cb669105Fe29a2938Af");

( async ()=> {
    // try{
    //     const amount =420_000;

    //     await voteModule.propose(
    //         "Should the DAO mint an additional"+ amount+ "tokens to the treasury?",
    //         [
    //             {
    //                 nativeTokenValue:0,
    //                 transactionData: tokenModule.contract.interface.encodeFunctionData(
    //                     "mint",
    //                     [
    //                         voteModule.address,
    //                         ethers.utils.parseUnits(amount.toString(),18)
    //                     ]
    //                 ),
    //                 toAddress: tokenModule.address,
    //             },
    //         ]
    //         );
    //     console.log("Successfully created proposal to mint tokens.");

    // }
    // catch(err){
    //     console.error("Failed to create praposal to mint tokens",err);
    //     process.exit(1);
    // }

    try{
        const amount=6_900;

        await voteModule.propose(
            "Should we transfer" + amount + "Tokens to " + "0x806****cABAa" + "for being awesome?",
            [
                {
                    nativeTokenValue:0,
                    transactionData: tokenModule.contract.interface.encodeFunctionData(
                    "transfer",
                    [
                        "0x8063442A05b8DF82181A4EFB9D4881B3449cABAa",
                        ethers.utils.parseUnits(amount.toString(),18)
                    ]
                    ),
                    toAddress:tokenModule.address,

                },
            ]
        );
        console.log("Sucessfully created praposal to transer token to ",process.env.WALLET_ADDRESS);
    }
    catch(err){
        console.error("Failed to create praposal to transfer tokens",err);
        process.exit(1);
    }
}) ();