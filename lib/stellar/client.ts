/**
 * Stellar SDK client configuration.
 *
 * This module sets up the Horizon and Soroban RPC clients
 * for fetching contract events from the Stellar network.
 *
 * Currently uses mock data — replace the fetch functions below
 * with real Stellar SDK calls to connect to the live network.
 */

/** Stellar network configuration. */
export interface StellarNetworkConfig {
  horizonUrl: string;
  sorobanRpcUrl: string;
  networkPassphrase: string;
}

/** Default testnet configuration. */
export const TESTNET_CONFIG: StellarNetworkConfig = {
  horizonUrl:
    process.env.NEXT_PUBLIC_HORIZON_URL ?? "https://horizon-testnet.stellar.org",
  sorobanRpcUrl:
    process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ?? "https://soroban-testnet.stellar.org",
  networkPassphrase:
    process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE ?? "Test SDF Network ; September 2015",
};

/** Mainnet configuration. */
export const MAINNET_CONFIG: StellarNetworkConfig = {
  horizonUrl: "https://horizon.stellar.org",
  sorobanRpcUrl: "https://mainnet.stellar.validationcloud.io/v1/XGWbaseXCVJaRq0H2NLNR1YoqDmNjjAa",
  networkPassphrase: "Public Global Stellar Network ; September 2015",
};

/**
 * Returns the active network config based on the environment variable.
 */
export function getNetworkConfig(): StellarNetworkConfig {
  const network = process.env.NEXT_PUBLIC_NETWORK ?? "testnet";
  return network === "mainnet" ? MAINNET_CONFIG : TESTNET_CONFIG;
}

/**
 * Fetches recent contract events from Soroban RPC.
 *
 * NOTE: This is a stub. In production, use stellar-sdk's SorobanRpc.Server
 * to call getEvents() with the contract ID filter.
 *
 * Example production implementation:
 * ```typescript
 * import { SorobanRpc } from "stellar-sdk";
 *
 * const server = new SorobanRpc.Server(config.sorobanRpcUrl);
 * const result = await server.getEvents({
 *   startLedger: latestLedger - 1000,
 *   filters: [{ type: "contract", contractIds: [contractId] }],
 * });
 * return result.events;
 * ```
 */
export async function fetchContractEvents(
  contractId: string,
  config: StellarNetworkConfig = TESTNET_CONFIG
): Promise<unknown[]> {
  // Stub — returns empty array until real RPC integration is wired up.
  // The dashboard uses mock data from /lib/mock-data.ts for now.
  console.log(`[open-audit] Would fetch events for ${contractId} from ${config.sorobanRpcUrl}`);
  return [];
}
