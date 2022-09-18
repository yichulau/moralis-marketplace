import React, { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import nftMarketplaceAbi from "../constants/NftMarketplace.json";
import nftAbi from "../constants/BasicNft.json";
import Image from "next/image";
import { Card, useNotification } from "web3uikit";
import { ethers } from "ethers";
import UpdateListingModal from "./UpdateListingModal";

const truncateStr = (fullStr, strLen) => {
  if (fullStr.length <= strLen) return fullStr;

  const separator = "...";
  const seperatorLength = separator.length;
  const charsToShow = strLen - seperatorLength;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return (
    fullStr.substring(0, frontChars) +
    separator +
    fullStr.substring(fullStr.length - backChars)
  );
};

const NFTBox = ({ price, seller, tokenId, marketplaceAddress, nftAddress }) => {
  const { isWeb3Enabled, account } = useMoralis();
  const [imageURI, setImageURI] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const hideModal = () => {
    setShowModal(false);
  };
  const { runContractFunction: getTokenUri } = useWeb3Contract({
    abi: nftAbi,
    contractAddress: nftAddress,
    functionName: "tokenURI",
    params: {
      tokenId: tokenId,
    },
  });

  const { runContractFunction: buyItem } = useWeb3Contract({
    abi: nftMarketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "buyItem",
    msgValue: price,
    params: {
      nftAddress: nftAddress,
      tokenId: tokenId,
    },
  });

  async function updateUI() {
    const tokenURI = await getTokenUri();
    if (tokenURI) {
      const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      const tokenURIResponse = await (await fetch(requestURL)).json();
      const imageURI = tokenURIResponse.image;
      const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      setImageURI(imageURIURL);
      setTokenName(tokenURIResponse.name);
      setTokenDescription(tokenURIResponse.description);
    }
  }

  const handleCardClick = () => {
    isOwnedByUser
      ? setShowModal(true)
      : buyItem({
          onError: (error) => console.log(error),
          onSuccess: () => handleBuyItemSuccess(),
        });
  };

  const handleBuyItemSuccess = () => {
    dispatchEvent({
      type: "success",
      message: "Item Bought!",
      title: "Item Bought",
      position: "topR",
    });
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const isOwnedByUser = seller === account || seller === undefined;
  const formatSellerAddress = isOwnedByUser
    ? "you"
    : truncateStr(seller || "", 15);
  return (
    <>
      <div className="mx-2 my-2">
        <div className="w-full">
          {imageURI ? (
            <>
              <UpdateListingModal
                isVisible={showModal}
                tokenId={tokenId}
                marketplaceAddress={marketplaceAddress}
                nftAddress={nftAddress}
                onClose={hideModal}
              />
              <Card
                title={tokenName}
                description={tokenDescription}
                onClick={handleCardClick}
              >
                <div className="p-2">
                  <div className="flex flex-col items-center gap-2">
                    <div>#{tokenId}</div>
                    <div className="italic text-sm">
                      Owned by {formatSellerAddress}
                    </div>
                    <Image
                      loader={() => imageURI}
                      src={imageURI}
                      height="200"
                      width="200"
                    />
                    <div className="font-bold">
                      {ethers.utils.formatUnits(price, "ether")} ETH
                    </div>
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <div>...isLoading</div>
          )}
        </div>
      </div>
    </>
  );
};

export default NFTBox;
