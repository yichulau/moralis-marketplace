const Moralis = require("moralis/node");
require("dotenv").config();
const contractAddresses = require("./constants/networkMapping.json");
let chainId = process.env.chainId || 31337;
let moralisChainId = chainId - "31337" ? "1337" : chainId;
const contractAddress = contractAddresses[chainId]["NftMarketplace"][0];
const serverUrl = process.env.NEXT_PUBLIC_MORALIS_SERVER;
const appId = process.env.NEXT_PUBLIC_APPID;
const masterKey = process.env.masterKey;

async function main() {
  await Moralis.start({ serverUrl, appId, masterKey });
  console.log(contractAddress);
  let itemListedOptions = {
    // Moralis understands a local chain is 1337
    chainId: moralisChainId,
    sync_historical: true,
    topic: "ItemListed(address,address,uint256,uint256)",
    address: contractAddress,
    abi: {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "seller",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "nftAddress",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "price",
                type: "uint256",
            },
        ],
        name: "ItemListed",
        type: "event",
    },
    tableName: "ItemListed",
}

let itemBoughtOptions = {
    chainId: moralisChainId,
    address: contractAddress,
    sync_historical: true,
    topic: "ItemBought(address,address,uint256,uint256)",
    abi: {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "seller",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "nftAddress",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "ItemBought",
      "type": "event"
    },
    tableName: "ItemBought",
}

let itemCanceledOptions = {
    chainId: moralisChainId,
    address: contractAddress,
    topic: "ItemCanceled(address,address,uint256)",
    sync_historical: true,
    abi: {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "seller",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "nftAddress",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ItemCanceled",
      "type": "event"
    },
    tableName: "ItemCanceled",
}

  // const listedResponse = await Moralis.Cloud.run(
  //   "watchContractEvent",
  //   itemListedOptions,
  //   {
  //     useMasterKey: true,
  //   }
  // ).then((result) => console.log(result));
  const boughtResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    itemBoughtOptions,
    {
      useMasterKey: true,
    }
  );
  const canceledResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    itemCanceledOptions,
    {
      useMasterKey: true,
    }
  );
    console.log(canceledResponse)
  if (
    listedResponse.success &&
    canceledResponse.success &&
    boughtResponse.success
  ) {
    console.log("Success! Database Updated with watching events");
  } else {
    console.log("Something went wrong...");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    process.exit(1);
  });
