import { useEffect, useMemo, useState } from "react";

import { useWeb3 } from "@3rdweb/hooks";

import { ThirdwebSDK, TokenModule } from "@3rdweb/sdk";
import { ethers } from "ethers";
import { UnsupportedChainIdError } from "@web3-react/core";

const  sdk = new ThirdwebSDK("rinkeby");

const bundleDropModule = sdk.getBundleDropModule(
  "0xf2064dFAe37E4175220D7011F9d45ac4681E160d",
);

const tokenModule = sdk.getTokenModule("0x4bBEFE295Be321274f379Cb669105Fe29a2938Af");
const voteModule = sdk.getVoteModule("0x374D9962c9a37957530C7d9506A8ED2CDf00FAa1");

const App = () => {

  const { connectWallet, address, error, provider } = useWeb3();
  console.log("Address :",address);
  console.log("Provider: ",provider);
  const signer = provider ? provider.getSigner() : undefined;
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
  const [memberAddress, setMemberAddress] = useState([]);

  const [proposals,setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [activeProposal, setActiveProposal] = useState([]);

  useEffect(() => {
    if(!hasClaimedNFT){
      return;
    }

    voteModule.getAll()
              .then((proposals) => {
                setProposals(proposals);
                console.log("🌈 Proposals:", proposals);
              })
              .catch((err) => {
                console.error("Failed to fetch proposals",err);
              })
  }, [hasClaimedNFT]);

  useEffect(() => {
    if(!hasClaimedNFT){
      return;
    }
    if (!proposals.length) {
      return;
    }
    if(activeProposal.length>0){
      setActiveProposal([]);
    }

    proposals.map((proposal)=>{
      voteModule.hasVoted(proposal.proposalId,address)
                .then((hasVoted) => {
                  setHasVoted(hasVoted);
                  if(hasVoted){
                    console.log("User has already voted.");
                  }
                  else{
                    let tempArray = [...activeProposal];
                    tempArray.push(proposal);
                    setActiveProposal(tempArray);
                  }
                })
                .catch((err) => {
                  console.error("Failed too check if user has voted or not.",err);
                })
      })

    
  }, [hasClaimedNFT, proposals, address]);

  const shortenAddress = (str) => {
    return str.substring(0,6) + "...." + str.substring(str.length - 4);
  }

  useEffect(() => {
    if(!hasClaimedNFT) {
      return;
    }

    bundleDropModule.getAllClaimerAddresses("1")
    .then((addresses) => {
      console.log("🚀 Members addresses", addresses);
      setMemberAddress(addresses);
    })
    .catch((err) => {
      console.error("Failed to get member list",err);
    })
  } , [hasClaimedNFT]);

  useEffect(() => {
    if(!hasClaimedNFT){
      return;
    }

    tokenModule.getAllHolderBalances()
    .then((amounts) => {
      console.log("Amount",amounts);
      setMemberTokenAmounts(amounts);
    })
    .catch(err => {
      console.error("Failed to get token amount",err);
    })
  }, [hasClaimedNFT]);

  const memberList = useMemo(() => {
    return memberAddress.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          memberTokenAmounts[address] || 0,
          18
        )
      }
    })
  }, [memberAddress, memberTokenAmounts]);

  useEffect(() => {
    // We pass the signer to the sdk, which enables us to interact with
    // our deployed contract!
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  
  useEffect(() => {
    if (!address) {
      return;
    }

    return bundleDropModule
           .balanceOf(address,"1")
           .then((balance) => {
             if(balance.gt(0)){
               setHasClaimedNFT(true);
               console.log("this user has a membership NFT.")
             }
             else{
              setHasClaimedNFT(false);
              console.log("😭 this user doesn't have a membership NFT.")
             }
           })
           .catch((error) => {
             setHasClaimedNFT(false);
             console.error("failed to nft balance", error);
           });

  }, [address]);

  if (error instanceof UnsupportedChainIdError ) {
    return (
      <div className="unsupported-network">
        <h2>Please connect to Rinkeby</h2>
        <p>
          This dapp only works on the Rinkeby network, please switch networks
          in your connected wallet.
        </p>
      </div>
    );
  }
  if(!address){
    return(
      <div className="landing">
        <h1>Welcome to PetDAO</h1>
        <button onClick={() => connectWallet("injected")} className="btn-hero">Connect your wallet.</button>
      </div>
    )
  }

  const mintNFT = () => {
    setIsClaiming(true);
    bundleDropModule
    .claim("1",1)
    .then(() => {
      setHasClaimedNFT(true);
      console.log("Successfully minted NFT Token id 1.Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/1");
    })
    .catch(err => {
      console.error("Failed to mint NFT.");
    })
    .finally(() => {
      setIsClaiming(false);
    })
  }

  if(hasClaimedNFT){
    return (
      <div className="member-page">
        <h1>🐶DAO Member Home</h1>
        <h2>🌻 Congratulations on being a Member !!</h2>
        <div>
          <div>
            <h2>MEMBER</h2>
            <table className = "card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Total Ammount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map(member => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );  
                })}
              </tbody>
            </table>
          </div>
          <div>
          <h2>ACTIVE PROPOSALS</h2>
          <form 
            onSubmit={
              async (e)=> {
                e.preventDefault();
                e.stopPropagation();
                setIsVoting(true);
                
                const votes = proposals.map((proposal) => {
                    let voteResult = {
                      proposalId: proposal.proposalId,
                      vote: 2,
                    };
                    console.log("😟Debug",proposal.votes);
                    proposal.votes.forEach((vote) => {
                      const elem = document.getElementById(
                        proposal.proposalId + "-" + vote.type
                      )

                      if(elem.checked){
                        voteResult.vote = vote.type;
                        return;
                      }
                    });
                    return voteResult;
                  }
                );

                try {
                  const delegation = await tokenModule.getDelegationOf(address);
                  if(delegation === ethers.constants.AddressZero){
                    await tokenModule.delegateTo(address);
                  }

                  try{
                    await Promise.all(
                      votes.map(async (vote)=> {
                        const proposal = await voteModule.get(vote.proposalId);
                        console.log("🤩Debug",vote);
                        if(proposal.state === 1){
                          return voteModule.vote(vote.proposalId, vote.vote);
                        }
                        return;
                      })
                    );
                    
                    try{
                      await Promise.all(
                        votes.map(async (vote) => {
                          const proposal = await voteModule.get(vote.proposalId);
                          // console.log("🥵Debug",vote);
                          if(proposal.state === 4){
                            return voteModule.execute(vote.proposalId);
                          }
                        })
                      );
                      setHasVoted(true);
                      console.log("Successfully voted");
                    }
                    catch(err){
                      console.error("Failed to execute votes.",err);
                    }
                  }
                  catch(err){
                    console.error("Failed to vote",err);
                  }
                 
                }
                catch(err){
                  console.error("Failed to delegate tokens",err);
                }
                finally {
                  // in *either* case we need to set the isVoting state to false to enable the button again
                  setIsVoting(false);
                }
                
              }
            }
          >
        
            {activeProposal.map((proposal,index) => (  
                  <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map((vote) => (
                      <div key={vote.type}>
                        <input 
                        type="radio"
                        id = {proposal.proposalId + "-" + vote.type}
                        name = {proposal.proposalId}
                        value = {vote.type}
                        defaultChecked={vote.type === 2}
                        />
                        <label htmlFor={proposal.proposalId + "-" + vote.type}>
                            {vote.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>           
            ))}
            <button disabled = {isVoting || hasVoted} type ="submit">
              { isVoting ? "Voting ..." : activeProposal.length===0 ? "Already Voted" : "Submit Votes"}
            </button>
            <small>
                This will trigger multiple transactions that you will need to
                sign.
              </small>
          </form>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="mint-nft">
      <h1>Mint your free 🐶DAO Membership NFT</h1>
      <button 
        disabled={isClaiming} 
        onClick={() => mintNFT()}
      >
        {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
      </button>
    </div>
  )
  


  return (
    <div className="landing">
      <h1>Welcome to My PetDAO. Wallet Connected!</h1>
    </div>
  );
};

export default App;
