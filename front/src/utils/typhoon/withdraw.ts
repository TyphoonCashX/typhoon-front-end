import { useEffect, useState } from "react";
import {
  Address,
  Chain,
  Hash,
  WalletClient,
  getContract,
  TransactionReceipt
} from "viem";
import { useAccount, useNetwork, useWalletClient } from "wagmi";
import { waitForTransaction, getPublicClient } from "@wagmi/core";
import { fundMyAccountOnLocalFork } from ".././fundMyAccountOnLocalFork";

import { exitContractAddressGnosis, exitContractAddressMunbai } from "./constants"

import { exitABI } from "./ABI/ExitNode"
import { time } from "console";

function getExitContractAddress(chainName: string): Address {
  if (chainName == "gnosis") {
    return exitContractAddressGnosis as Address;
  } else if (chainName == "mumbai") {
    return exitContractAddressMunbai as Address;
  }
  return exitContractAddressGnosis as Address;
}

export function useWithdrawContract({
    chainName,
    chain,
    bytes,
    receiveAddress,
    gasFees,
    vaultId,
  }: {
    chainName: string;
    chain: Chain;
    bytes: string | null;
    receiveAddress: Address | undefined;
    gasFees: BigInt;
    vaultId: string;
  }) : {
    askRedeem: () => Promise<`0x${string}`>,
    askWithdraw: () => Promise<Address>,
    waitingForTransaction: (hash: Address) => Promise<TransactionReceipt | undefined>
  } {
    
  const [error, setError] = useState<string>("");
  const { chain: currentChain } = useNetwork();
  const publicClient = getPublicClient();
  const { data: walletClient } = useWalletClient();
  const { isConnected, address } = useAccount({
    onConnect: async ({ address }) => address && (await fundMyAccountOnLocalFork(address)),
  });

  const exitContract = getContract({
    address: getExitContractAddress(chainName),
    abi: [...exitABI],
    publicClient,
    walletClient: walletClient as WalletClient,
  });

  useEffect(() => {
    if (currentChain?.id !== chain.id) return setError(`Please switch to ${chain.name} network`);
    setError("");
  }, [currentChain]);

  let redeem = async function () {
    return await exitContract.write.redeem([bytes, gasFees, receiveAddress])
  }

  let withdraw = async function () {
    return await exitContract.write.withdraw([gasFees, vaultId])
  }

  async function waitingForTransaction(
    hash: `0x${string}`
  ): Promise<TransactionReceipt | undefined> {
    let txReceipt: TransactionReceipt | undefined;
    if (chain.id === 5151111) {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => {
          setError(
            "Transaction timed-out: If you are running a local fork on Anvil please make sure to reset your wallet nonce. In metamask:  Go to settings > advanced > clear activity and nonce data"
          );
        }, 10000)
      );
      const txReceiptPromise = hash && waitForTransaction({ hash: hash });
      const race = await Promise.race([txReceiptPromise, timeout]);
      txReceipt = race as TransactionReceipt;
    } else {
      txReceipt = hash && (await waitForTransaction({ hash: hash }));
    }
    return txReceipt;
  }

  return {
    askRedeem: redeem,
    askWithdraw: withdraw,
    waitingForTransaction: waitingForTransaction
  }
}
