import { useEffect, useState } from "react";
import {
  Address,
  Chain,
  WalletClient,
  getContract,
} from "viem";
import { useAccount, useNetwork, useWalletClient } from "wagmi";
import { getPublicClient } from "@wagmi/core";
import { fundMyAccountOnLocalFork } from ".././fundMyAccountOnLocalFork";

import { erc20Address, enterContractAddress, bridgeAmount } from "./constants"

import { erc20ABI } from "./ABI/ERC20";
import { entryNodeABI } from "./ABI/EntryNode"

export function useDepositContract({
    chain,
    user
  }: {
    chain: Chain;
    user: Address | undefined
  }) : {
    approveDeposit: () => Promise<void>,
    depositAsset: () => Promise<void>,
  } {
    
  const [error, setError] = useState<string>("");
  const { chain: currentChain } = useNetwork();
  const publicClient = getPublicClient();
  const { data: walletClient } = useWalletClient();
  const { isConnected, address } = useAccount({
    onConnect: async ({ address }) => address && (await fundMyAccountOnLocalFork(address)),
  });

  const erc20Contract = getContract({
    address: erc20Address as `0x${string}`,
    abi: [...erc20ABI],
    publicClient,
    walletClient: walletClient as WalletClient,
  });

  const depositContract = getContract({
    address: enterContractAddress as `0x${string}`,
    abi: [...entryNodeABI],
    publicClient,
    walletClient: walletClient as WalletClient,
  });

  useEffect(() => {
    if (currentChain?.id !== chain.id) return setError(`Please switch to ${chain.name} network`);
    setError("");
  }, [currentChain]);

  let approve = async function () {
    await erc20Contract.write.approve([user, bridgeAmount]);
  }

  let deposit = async function () {
    await depositContract.write.deposit();
  }

  return {
    approveDeposit: approve,
    depositAsset: deposit
  }
}
