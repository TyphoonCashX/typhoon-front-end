import {
  ClaimType,
  AuthType,
  SignatureRequest,
  AuthRequest,
  ClaimRequest,
  SismoConnectConfig,
} from "@sismo-core/sismo-connect-client";

import {
  gnosisApp,
  mumbaiApp
} from "@/utils/typhoon/constants"

export { ClaimType, AuthType };

const impersonate = [
  // EVM Data Sources
  "dhadrien.sismo.eth",
  "0xA4C94A6091545e40fc9c3E0982AEc8942E282F38",
  "0x1b9424ed517f7700e7368e34a9743295a225d889",
  "0x82fbed074f62386ed43bb816f748e8817bf46ff7",
  "0xc281bd4db5bf94f02a8525dca954db3895685700",
  // Github Data Source
  "github:dhadrien",
  // Twitter Data Source
  "twitter:dhadrien_",
  // Telegram Data Source
  "telegram:dhadrien",
];

// For development purposes insert the Data Sources that you want to impersonate
// Never use this in production
// the appId is not referenced here as it is set directly in the contract
export const CONFIG_GNOSIS: SismoConnectConfig = {
  appId: gnosisApp,
  vault: {impersonate: impersonate},
};

export const CONFIG_MUMBAI: SismoConnectConfig = {
  appId: mumbaiApp,
  vault: {impersonate: impersonate},
};

export const AUTHS: AuthRequest[] = [
  // Anonymous identifier of the vault for this app
  // vaultId = hash(vaultSecret, appId).
  // full docs: https://docs.sismo.io/sismo-docs/build-with-sismo-connect/technical-documentation/vault-and-proof-identifiers
];

export const CLAIMS: ClaimRequest[] = [
  {
    // claim on Sismo Hub GitHub Contributors Data Group membership: https://factory.sismo.io/groups-explorer?search=0xda1c3726426d5639f4c6352c2c976b87
    // Data Group members          = contributors to sismo-core/sismo-hub
    // value for each group member = number of contributions
    // request user to prove membership in the group
    groupId: "0xda1c3726426d5639f4c6352c2c976b87", // impersonated github:dhadrien has 1 contribution, eligible
  },

];
