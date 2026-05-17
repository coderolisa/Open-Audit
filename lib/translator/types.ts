/**
 * Core TypeScript interfaces for the Open-Audit Translation Registry.
 *
 * RawEvent  — the raw, hex-encoded event as it comes from the Stellar network.
 * TranslatedEvent — the enriched event with a human-readable description.
 * TranslationBlueprint — the contract-specific translation logic.
 */

/** A raw Soroban contract event as fetched from Horizon/RPC. */
export interface RawEvent {
  /** Unique event identifier (ledger sequence + index). */
  id: string;
  /** The Soroban contract address that emitted this event. */
  contractId: string;
  /**
   * Ordered list of event topics encoded as hex strings.
   * Topic[0] is typically the event name/discriminant.
   */
  topics: string[];
  /** The event payload encoded as a hex string. */
  data: string;
  /** The ledger sequence number this event was emitted in. */
  ledger: number;
  /** Unix timestamp (seconds) of the ledger close time. */
  timestamp: number;
  /** The transaction hash that produced this event. */
  txHash: string;
}

/** The translation status of an event. */
export type TranslationStatus = "translated" | "cryptic" | "pending";

/** A fully processed event ready for display in the UI. */
export interface TranslatedEvent {
  /** The original raw event. */
  raw: RawEvent;
  /** Human-readable translation, or null if no blueprint matched. */
  description: string | null;
  /** Whether the event was successfully translated. */
  status: TranslationStatus;
  /**
   * The name of the blueprint that translated this event,
   * e.g. "Stellar Asset Contract (SAC)" or "Soroswap Router".
   */
  blueprintName: string | null;
  /** Short label for the event type, e.g. "Transfer", "Swap". */
  eventType: string | null;
}

/**
 * A translation blueprint for a specific contract.
 * Each blueprint knows how to translate events from one contract.
 */
export interface TranslationBlueprint {
  /** The Soroban contract address this blueprint handles. */
  contractId: string;
  /** Human-readable name for this contract. */
  contractName: string;
  /**
   * Attempts to translate a raw event into a human-readable string.
   * Returns null if this blueprint cannot handle the given event.
   */
  translate: (event: RawEvent) => TranslationResult | null;
}

/** The result returned by a blueprint's translate function. */
export interface TranslationResult {
  /** The human-readable description of the event. */
  description: string;
  /** Short label for the event type. */
  eventType: string;
}

/** Decoded XDR address (simplified representation). */
export interface DecodedAddress {
  /** The full Stellar public key (G... address). */
  publicKey: string;
  /** A shortened display version, e.g. "GABC...1234". */
  short: string;
}

/** Decoded token amount with symbol. */
export interface DecodedAmount {
  /** Raw integer value (in stroops or smallest unit). */
  raw: bigint;
  /** Human-readable decimal value. */
  formatted: string;
  /** Token symbol if known. */
  symbol: string;
}
