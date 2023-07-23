"use client";

import { useEffect, useState } from "react";
import Header from "./components/Header";
import { useAccount, useNetwork, useSwitchNetwork, useWalletClient } from "wagmi";
import { waitForTransaction, getPublicClient } from "@wagmi/core";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { formatEther } from "viem";
import {
  formatError,
  getAuthRequestsAndClaimRequestsFromSismoConnectRequest,
  getProofDataForAuth,
  getProofDataForClaim,
  getUserIdFromHex,
  signMessage,
  fundMyAccountOnLocalFork,
  useContract,
  getResults,
  // chains
  mumbaiFork,
  mainnet,
  goerli,
  sepolia,
  optimism,
  optimismGoerli,
  arbitrum,
  arbitrumGoerli,
  scrollTestnet,
  gnosis,
  polygon,
  polygonMumbai,
} from "@/utils";
import {
  AuthRequest,
  ClaimRequest,
  SismoConnectButton,
  VaultConfig,
  VerifiedAuth,
  VerifiedClaim, // the Sismo Connect React button displayed below
  AuthType,
  ClaimType,
  SismoConnectConfig,
  SismoConnectResponse
} from "@sismo-core/sismo-connect-react";
import {
  Chain,
  GetContractReturnType,
  PublicClient,
  TransactionReceipt,
  WalletClient,
  getContract,
} from "viem";
import { AUTHS, CLAIMS, CONFIG } from "@/app/sismo-connect-config";
import { useDepositContract } from "@/utils/typhoon/deposit";
import { useWithdrawContract } from "@/utils/typhoon/withdraw";
import { Address, encodePacked } from 'viem'
import { Hash } from "phosphor-react";
import { bridgeAmount } from "@/utils/typhoon/constants";

/* ********************  Defines the chain to use *************************** */
const CHAIN = mumbaiFork;

export default function Home() {
  const [sismoConnectVerifiedResult, setSismoConnectVerifiedResult] = useState<{
    verifiedClaims: VerifiedClaim[];
    verifiedAuths: VerifiedAuth[];
    verifiedSignedMessage: string;
    amountClaimed: string;
  } | null>(null);
  const [responseBytes, setResponseBytes] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);
  const { isConnected, address } = useAccount({
    onConnect: async ({ address }) => address && (await fundMyAccountOnLocalFork(address)),
  });
  const { chain } = useNetwork();
  const { openConnectModal, connectModalOpen } = useConnectModal();

  const { switchNetworkAsync } = useSwitchNetwork();

  /* *****************************************************  Typhoon state ******************************************************** */

  // Typhoon front

  const [pageWithdrawState, setPageWithdrawState] = useState<string>("init");

  const [bridgeState, setBridgeState] = useState<string>("withdraw")

  const [depositApproved, setDepositApproved] = useState<boolean>(false)

  const [gasFees, setGasFees] = useState<number>(0)

  const [receiveAddress, setReceiveAddress] = useState<Address>('0xAbCd...')

  const [vaultId, setVaultId] = useState<string>("")

  /* *****************************************************  Typhoon functions ******************************************************** */

  const { approveDeposit, depositAsset } = useDepositContract({
    chain: CHAIN,
    user: address
  });

  const { askRedeem, askWithdraw, waitingForTransaction } = useWithdrawContract({
    chain: CHAIN,
    bytes: responseBytes,
    receiveAddress: receiveAddress, // !!!!!!!!!!!!!!!!!!!!!
    gasFees: BigInt(gasFees),
    vaultId: vaultId
  })

  async function startRedeem() {
    try {
      let hash = await askRedeem()
      setPageWithdrawState("waitingRedeem")
      console.log("Waiting...")
      let wait = await new Promise(r => setTimeout(r, 2000));
      console.log("Wait ended")
      setPageWithdrawState("pendingWithdraw")
    } catch (e: any) {
      setClaimError(formatError(e));
      setPageWithdrawState("pendingRedeem")
    }
  }

  async function startWithdraw() {
    try {
      let hash = askWithdraw()
      setPageWithdrawState("waitingWithdraw")
      console.log("Waiting...")
      let wait = await new Promise(r => setTimeout(r, 2000));
      console.log("Wait ended")
      setPageWithdrawState("withdrawComplete")
    } catch (e: any) {
      setClaimError(formatError(e));
      setPageWithdrawState("pendingRedeem")
    }
  }

  /* ***************************************************** */

  // Get the SismoConnectConfig and Sismo Connect Request from the contract
  // Set react state accordingly to display the Sismo Connect Button

  useEffect(() => {
    const gasFeesParam = localStorage.getItem("gasFees")
    const receivingAddressParam = localStorage.getItem("receivingAddress")
    console.log(gasFeesParam)
    console.log(receivingAddressParam)
    if (gasFeesParam === null) return;
    if (receivingAddressParam === null) return;
    setGasFees(parseInt(gasFeesParam))
    setReceiveAddress(receivingAddressParam as Address)
  })

  return (
    <>
      <main className="main">
        {/* <Header /> */}
        {!isConnected && (
          <button onClick={() => openConnectModal?.()} disabled={connectModalOpen}>
            {connectModalOpen ? "Connecting wallet..." : "Connect wallet"}
          </button>
        )}
        {bridgeState == "deposit" && (
          <>
            {!depositApproved && (
              <button onClick={() => {
                approveDeposit();
                setDepositApproved(true)
              }
              }>Approve deposit on bridge</button>
            )}
            {depositApproved && (
              <button onClick={() => {
                depositAsset();
                setBridgeState("withdraw")
              }
              }>Bridge your token !</button>
            )}
          </>
        )}
        {bridgeState == "withdraw" && (
          <>
            {isConnected && (
          <>
            <>
              {" "}
              <p>
                <b>{`You are withdrawing on: ${chain?.name} [${chain?.id}]`}</b>
              </p>
            </>
            {pageWithdrawState == "init" && (
              <>
              <input
                defaultValue={"0"}
                onChange={e => {
                  let value = parseInt(e.target.value)
                  if (isNaN(value)) {
                    console.log("noooo" + " 0")
                    setGasFees(0)
                  } else {
                    localStorage.setItem("gasFees", String(value))
                    console.log(String(value))
                    setGasFees(value)
                  }
                }}
              />
              <input
                defaultValue={"0x..."}
                onChange={e => {
                  let add = e.target.value
                  if (add.startsWith("0x") && add.length == 42) {
                    localStorage.setItem("receivingAddress", add)
                    console.log(add)
                    setReceiveAddress(e.target.value as Address)
                  }
                }}
              />
              {gasFees == 0 && (
                <>
                  You need a valid gas fee !
                  <br />
                </>
              )}
              {receiveAddress.length != 42 && (
                <>
                  You need a valid receiving address !
                  <br />
                </>
              )}
              </>
            )}
            {pageWithdrawState == "pendingRedeem" && (
              <>
                Proof successfully generated !
                <br />
                Gas fees selected: {gasFees}
                <br />
                Receving address selected: {receiveAddress}
                <br />
              </>
            )}
            {!claimError && pageWithdrawState == "init" && (
              <>
                <SismoConnectButton
                  config={CONFIG}
                  // Auths = Data Source Ownership Requests
                  auths={AUTHS}
                  // Claims = prove groump membership of a Data Source in a specific Data Group.
                  // Data Groups = [{[dataSource1]: value1}, {[dataSource1]: value1}, .. {[dataSource]: value}]
                  // When doing so Data Source is not shared to the app.
                  claims={CLAIMS}
                  // Signature = user can sign a message embedded in their zk proof
                  signature={{ message: encodePacked(
                    ['address', 'uint256'],
                    [address as Address, BigInt(gasFees)]
                  )}}
                  // responseBytes = the response from Sismo Connect, will be sent onchain
                  onResponseBytes={(responseBytes: string) => {
                    console.log(responseBytes)
                    setResponseBytes(responseBytes);
                    setPageWithdrawState("pendingRedeem");
                  }}
                  onResponse={(response: SismoConnectResponse) => {
                    console.log(response)
                    let vaultId = response.proofs[0].auths![0].userId!
                    console.log(vaultId)
                    if (vaultId != undefined) {
                      setVaultId(vaultId)
                      localStorage.setItem("groupId", vaultId)
                    }
                  }}
                  // Some text to display on the button
                  text={"Prove your right to bridge with Sismo !"}
                />
              </>
            )}
            {!claimError && (
              <div className="status-wrapper">
                {pageWithdrawState == "pendingRedeem" && (
                  <button onClick={() => startRedeem() }>{"Redeem !"}</button>
                )}
                {pageWithdrawState == "waitingRedeem" && (
                  <>
                    Waiting for redeem validation...
                    <br />
                  </>
                )}
                {pageWithdrawState == "pendingWithdraw" && (
                  <>
                    You can now withdraw your tokens !
                    <button onClick={() => startWithdraw() }>{"Withdraw !"}</button>
                  </>
                )}
                {pageWithdrawState == "waitingWithdraw" && (
                  <>
                    Waiting for withdraw validation...
                    <br />
                  </>
                )}
                {pageWithdrawState == "withdrawComplete" && (
                  <>
                    Congratulations, you successfully withdrew {bridgeAmount} eth to XXXXXX !
                    <br />
                  </>
                )}
              </div>
            )}
            {isConnected && !sismoConnectVerifiedResult?.amountClaimed && claimError && (
              <>
                <p style={{ color: "#ff6347" }}>{claimError}</p>
                {claimError.slice(0, 50) ===
                  'The contract function "balanceOf" returned no data' && (
                  <p style={{ color: "#0BDA51" }}>
                    Please restart your frontend with "yarn dev" command and try again, it will
                    automatically deploy a new contract for you!
                  </p>
                )}
                {claimError.slice(0, 16) === "Please switch to" && (
                  <button onClick={() => switchNetworkAsync?.(CHAIN.id)}>Switch chain</button>
                )}
              </>
            )}
            {/* Table of the Sismo Connect requests and verified result */}
            {/* Table for Verified Auths */}
          </>
            )}
          </>
        )}
        <button onClick={() => {
          localStorage.clear()
          window.location.replace('http://localhost:3000');
          // setPageWithdrawState("init")
          // setGasFees(0)
          // setReceiveAddress("0xABCD")
          // setVaultId("")
          }}>Clear operation</button>
      </main>
    </>
  );
}
