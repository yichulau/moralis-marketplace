import React from "react";
import { ConnectButton } from "web3uikit";
import Link from "next/link";

const Header = () => {
  return (
    <>
      <div className="flex flex-row p-4 justify-between">
        <div className="flex ">
          <h2 className="font-bold text-3xl">NFT Marketplace</h2>
        </div>
        <div className="flex flex-row">
          <div className="mr-2 mt-2">
            <Link href="/">
              <a className="bg-sky-500 hover:bg-sky-700 p-2 rounded-lg text-white">
                NFT Marketplace
              </a>
            </Link>
          </div>
          <div className="mr-2 mt-2">
            <Link href="/sell-page">
              <a className="bg-sky-500 hover:bg-sky-700 p-2 rounded-lg text-white">
                Sell Page
              </a>
            </Link>
          </div>
          <div className="mr-2">
            <ConnectButton moralisAuth={false} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
