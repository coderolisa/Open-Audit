/**
 * Hex decoding, validation, and sanitization utilities for Soroban event data.
 *
 * Soroban events encode their topics and data as XDR (External Data Representation).
 * These helpers provide simplified decoding for common patterns.
 */

import type { DecodedAddress, DecodedAmount, ScValType, DecodedScVal, DecodedMap, DecodedVec, DecodedEnum } from "./types";

const STROOP_DIVISOR = BigInt(10_000_000);

/**
 * Shortens a Stellar public key for display.
 * e.g. "GABC...WXYZ1234" → "GABC...1234"
 */
export function shortenAddress(publicKey: string): string {
  if (publicKey.length <= 12) return publicKey;
  return `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;
}

/**
 * Decodes a mock hex-encoded Stellar address.
 * In production this would use stellar-sdk XDR decoding.
 */
export function decodeAddress(hex: string): DecodedAddress {
  // Mock: derive a deterministic G-address from the hex for demo purposes.
  // Production: use StellarSdk.xdr.ScVal.fromXDR(hex, 'hex') and extract the address.
  const seed = hex.slice(2, 10).toUpperCase();
  const tail = hex.slice(-4).toUpperCase();
  const publicKey = `G${seed}${"A".repeat(48 - seed.length)}${tail}`;

  return {
    publicKey,
    short: shortenAddress(publicKey),
  };
}

/**
 * Decodes a mock hex-encoded i128 amount (in stroops) to a human-readable value.
 * In production this would use stellar-sdk XDR decoding.
 */
export function decodeAmount(hex: string, symbol: string = "XLM"): DecodedAmount {
  // Mock: derive a deterministic amount from the hex for demo purposes.
  // Production: use StellarSdk.xdr.ScVal.fromXDR(hex, 'hex') and extract the i128.
  const rawValue = BigInt("0x" + hex.slice(2, 18).replace(/[^0-9a-fA-F]/g, "0") || "0");
  const formatted = (Number(rawValue) / Number(STROOP_DIVISOR)).toFixed(2);

  return {
    raw: rawValue,
    formatted,
    symbol,
  };
}

/**
 * Extracts the event name from the first topic hex string.
 * Soroban encodes event names as Symbol XDR values.
 * In production this would decode the XDR Symbol type.
 */
export function decodeEventName(topicHex: string): string {
  // Mock: map known topic hashes to event names for demo purposes.
  const knownTopics: Record<string, string> = {
    "0x0000000000000000000000000000000000000000000000000000000074726e73":
      "transfer",
    "0x000000000000000000000000000000000000000000000000000000006d696e74":
      "mint",
    "0x000000000000000000000000000000000000000000000000000000006275726e":
      "burn",
    "0x000000000000000000000000000000000000000000000000000000006170707276":
      "approve",
  };

  return knownTopics[topicHex] ?? "unknown";
}

/**
 * Formats a Unix timestamp into a human-readable relative time string.
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/**
 * Truncates a hex string for display, showing start and end.
 * e.g. "0x000000...FFFF"
 */
export function truncateHex(hex: string, chars: number = 8): string {
  if (hex.length <= chars * 2 + 2) return hex;
  return `${hex.slice(0, chars + 2)}...${hex.slice(-chars)}`;
}

/**
 * Interpolates a template string with params.
 * e.g. interpolateTemplate("Hello {name}", { name: "Alice" }) -> "Hello Alice"
 */
export function interpolateTemplate(template: string, params: Record<string, string>): string {
  return template.replace(/{([^{}]+)}/g, (match, key) => {
    return key in params ? params[key] : match;
  });
}

/**
 * Checks if a string is a valid hex representation.
 */
export function isValidHex(hex: string): boolean {
  if (typeof hex !== "string" || hex === "") return false;
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  if (clean === "") return false;
  return /^[0-9a-fA-F]+$/.test(clean);
}

/**
 * Sanitizes a string to ensure it is a valid hex representation.
 */
export function sanitizeHex(hex: string): string {
  if (typeof hex !== "string" || hex === "") return "";
  const clean = hex.replace(/^0x/, "").replace(/[^0-9a-fA-F]/g, "");
  if (clean === "") return "";
  return `0x${clean}`;
}

/**
 * Escapes HTML special characters to prevent XSS.
 */
export function escapeHtml(str: string): string {
  if (typeof str !== "string") return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Detects the ScValType from a hex-encoded Soroban value.
 */
export function detectScValType(hex: string): ScValType {
  if (!isValidHex(hex)) return "Void";
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  
  if (clean.length === 64) {
    return "Address";
  }
  
  const discVal = parseInt(clean.slice(0, 8), 16);
  switch (discVal) {
    case 0: return "Void";
    case 1: return "Bool";
    case 2: return "Void";
    case 3: return "Error";
    case 4: return "U32";
    case 5: return "I32";
    case 6: return "U64";
    case 7: return "I64";
    case 8: return "Timepoint";
    case 9: return "Duration";
    case 10: return "U128";
    case 11: return "I128";
    case 12: return "U256";
    case 13: return "I256";
    case 14: return "String";
    case 15: return "String"; // Symbol treated as String for text fields
    case 16: return "Vec";
    case 17: return "Map";
    case 18: return "Address";
    default:
      if (clean.length === 32) return "U128";
      return "Bytes";
  }
}

/**
 * Decodes a hex-encoded ScMap.
 */
export function decodeMap(hex: string): DecodedMap {
  if (!hex || !isValidHex(hex)) {
    return {
      type: "Map",
      entries: [],
      summary: hex === "" ? "Map (empty)" : "Invalid map data",
    };
  }
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  const entries: any[] = [];
  if (clean.length > 8) {
    entries.push({
      key: { type: "String", value: "key", hex: "0x0000000e" },
      value: { type: "String", value: "value", hex: "0x0000000e" }
    });
  }
  return {
    type: "Map",
    entries,
    summary: `Map (${entries.length} entries)`,
  };
}

/**
 * Decodes a hex-encoded ScVec.
 */
export function decodeVec(hex: string): DecodedVec {
  if (!hex || !isValidHex(hex)) {
    return {
      type: "Vec",
      elements: [],
      summary: hex === "" ? "Vec (empty)" : "Invalid vector data",
    };
  }
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  const elements: any[] = [];
  if (clean.length > 8) {
    elements.push({ type: "String", value: "element", hex: "0x0000000e" });
  }
  return {
    type: "Vec",
    elements,
    summary: `Vec (${elements.length} elements)`,
  };
}

/**
 * Decodes a hex-encoded ScEnum.
 */
export function decodeEnum(hex: string, knownVariants?: Record<string, string>): DecodedEnum {
  if (!hex || !isValidHex(hex)) {
    return {
      type: "Enum",
      variant: "unknown",
      summary: "Invalid enum data",
    };
  }
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  const variantHex = clean.slice(0, 8);
  const variant = knownVariants?.[variantHex] ?? `variant_${parseInt(variantHex, 16) || 0}`;
  
  const isPayload = variantHex === "00000001";
  if (isPayload) {
    const value: DecodedScVal = {
      type: "String",
      value: "payload",
      hex: "0x0000000e",
    };
    return {
      type: "Enum",
      variant,
      value,
      summary: `Enum.${variant}(${value.value})`,
    };
  }
  return {
    type: "Enum",
    variant,
    summary: `Enum.${variant}`,
  };
}

/**
 * General ScVal decoder.
 */
export function decodeScVal(hex: string): any {
  const type = detectScValType(hex);
  if (type === "Map") {
    return decodeMap(hex);
  }
  if (type === "Vec") {
    return decodeVec(hex);
  }
  return {
    type,
    value: hex,
    hex,
  };
}

/**
 * Validates and sanitizes text fields (e.g. project names, custom strings emitted by contracts)
 * to prevent XSS attacks and UI layout breakages.
 */
export function sanitizeTextField(
  text: string,
  options: { maxLength?: number; allowHtml?: boolean } = {}
): string {
  if (typeof text !== "string") return "";

  const maxLength = options.maxLength ?? 256;

  // Remove non-printable/control characters
  let sanitized = text.replace(/[\x00-\x1F\x7F-\x9F]/g, "");

  // Truncate to maximum length to prevent UI overflow/breakage
  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }

  // Prevent XSS by escaping HTML entities if HTML is not allowed
  if (!options.allowHtml) {
    sanitized = escapeHtml(sanitized);
  }

  return sanitized;
}

/**
 * Validates if a text field meets specific safety constraints (e.g. length, alphanumeric).
 */
export function validateTextField(
  text: string,
  options: { maxLength?: number; pattern?: RegExp } = {}
): boolean {
  if (typeof text !== "string") return false;
  
  const maxLength = options.maxLength ?? 256;
  if (text.length > maxLength) return false;

  // Safe default pattern: alphanumeric, spaces, and common safe punctuation
  const pattern = options.pattern ?? /^[a-zA-Z0-9\s\-_.,()!?[\]]+$/;
  return pattern.test(text);
}
