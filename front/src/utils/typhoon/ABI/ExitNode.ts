export const exitABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_tokenAddress",
          "type": "address"
        },
        {
          "internalType": "bytes16",
          "name": "_appId",
          "type": "bytes16"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "enum AuthType",
          "name": "authType",
          "type": "uint8"
        }
      ],
      "name": "AuthTypeNotFoundInVerifiedResult",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "vaultId",
          "type": "uint256"
        }
      ],
      "name": "isAlreadyClaimed",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "vaultId",
          "type": "uint256"
        }
      ],
      "name": "isBeingClaimedOnOtherChains",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "callee",
          "type": "address"
        }
      ],
      "name": "isNotHyperplaneCaller",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "vaultId",
          "type": "uint256"
        }
      ],
      "name": "notInPendingList",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "zeroAddress",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "zeroVaultId",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "ADDRESSES_PROVIDER_V2",
      "outputs": [
        {
          "internalType": "contract IAddressesProvider",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "APP_ID",
      "outputs": [
        {
          "internalType": "bytes16",
          "name": "",
          "type": "bytes16"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "DEPOSIT_AMOUNT",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "IS_IMPERSONATION_MODE",
      "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [],
"name": "N_BLOCKS_DELAY",
"outputs": [
  {
    "internalType": "uint8",
    "name": "",
    "type": "uint8"
  }
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [],
"name": "SISMO_CONNECT_LIB_VERSION",
"outputs": [
  {
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [],
"name": "ZERO_ADDRESS",
"outputs": [
  {
    "internalType": "address",
    "name": "",
    "type": "address"
  }
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [],
"name": "config",
"outputs": [
  {
    "components": [
      {
        "internalType": "bytes16",
        "name": "appId",
        "type": "bytes16"
      },
      {
        "components": [
          {
            "internalType": "bool",
            "name": "isImpersonationMode",
            "type": "bool"
          }
        ],
        "internalType": "struct VaultConfig",
        "name": "vault",
        "type": "tuple"
      }
    ],
    "internalType": "struct SismoConnectConfig",
    "name": "",
    "type": "tuple"
  }
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [],
"name": "hyperBridgeAddress",
"outputs": [
  {
    "internalType": "address",
    "name": "",
    "type": "address"
  }
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [
  {
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }
],
"name": "isClaimed",
"outputs": [
  {
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [],
"name": "nullRedeemInformation",
"outputs": [
  {
    "internalType": "bytes32",
    "name": "",
    "type": "bytes32"
  }
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [],
"name": "owner",
"outputs": [
  {
    "internalType": "address",
    "name": "",
    "type": "address"
  }
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [
  {
    "internalType": "bytes",
    "name": "response",
    "type": "bytes"
  },
  {
    "internalType": "uint256",
    "name": "redeemGasFee",
    "type": "uint256"
  },
  {
    "internalType": "address",
    "name": "outputAddress",
    "type": "address"
  }
],
"name": "redeem",
"outputs": [],
"stateMutability": "nonpayable",
"type": "function"
},
{
"inputs": [
  {
    "internalType": "uint256",
    "name": "vaultId",
    "type": "uint256"
  }
],
"name": "registerRedeem",
"outputs": [],
"stateMutability": "nonpayable",
"type": "function"
},
{
"inputs": [],
"name": "tokenAddress",
"outputs": [
  {
    "internalType": "address",
    "name": "",
    "type": "address"
  }
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [
  {
    "internalType": "address",
    "name": "newOwner",
    "type": "address"
  }
],
"name": "transferOwnership",
"outputs": [],
"stateMutability": "nonpayable",
"type": "function"
},
{
"inputs": [
  {
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }
],
"name": "vaultIdToRedeemInformation",
"outputs": [
  {
    "internalType": "uint256",
    "name": "vaultId",
    "type": "uint256"
  },
  {

"internalType": "address",
    "name": "outputAddress",
    "type": "address"
  },
  {
    "internalType": "uint256",
    "name": "releaseTimestamp",
    "type": "uint256"
  },
  {
    "internalType": "uint256",
    "name": "gasFee",
    "type": "uint256"
  }
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [
  {
    "internalType": "uint256",
    "name": "withdrawGasFee",
    "type": "uint256"
  },
  {
    "internalType": "uint256",
    "name": "vaultId",
    "type": "uint256"
  }
],
"name": "withdraw",
"outputs": [],
"stateMutability": "nonpayable",
"type": "function"
}
]