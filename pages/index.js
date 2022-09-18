import Head from "next/head";
import Image from "next/image";
import { useMoralisQuery, useMoralis } from "react-moralis";
import NFTBox from "../components/NFTBox";

export default function Home() {
  const { isWeb3Enabled } = useMoralis();
  const { data: listedNfts, isFetching: fetchingListedNfts } = useMoralisQuery(
    // tableName
    // Function for the query
    "ActiveItem",
    (query) => query.limit(10).descending("tokenId")
  );
  console.log(listedNfts);

  return (
    <>
      <div className="w-full p-4">
        <h1 className="py-4 px-4 font-bold text-2xl"> Recently Listed</h1>
        <div className="flex flex-wrap">
          {isWeb3Enabled ? (
            fetchingListedNfts ? (
              <div>...isLoading</div>
            ) : (
              listedNfts.map((nft) => {
                console.log(nft.attributes);
                const {
                  price,
                  seller,
                  tokenId,
                  marketplaceAddress,
                  nftAddress,
                } = nft.attributes;

                return (
                  <>
                    <NFTBox
                      price={price}
                      tokenId={tokenId}
                      seller={seller}
                      marketplaceAddress={marketplaceAddress}
                      nftAddress={nftAddress}
                      key={`${nftAddress}${tokenId}`}
                    />
                  </>
                );
              })
            )
          ) : (
            <div>Web3 is not availabe</div>
          )}
        </div>
      </div>
    </>
  );
}
