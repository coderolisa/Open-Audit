# Open-Audit

> **The Google Translate for Soroban** — an open-source transparency tool for the Stellar/Soroban ecosystem.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Built on Stellar](https://img.shields.io/badge/Built%20on-Stellar-7B2FBE)](https://stellar.org)

---

## What is Open-Audit?

Smart contracts on Stellar/Soroban emit events as cryptic, hex-encoded binary data. To the average user — or even most developers — these events are completely unreadable. Open-Audit solves this by:

1. **Fetching** raw contract events from the Stellar network via Horizon/RPC.
2. **Translating** them into plain English sentences using a community-maintained **Translation Registry**.
3. **Displaying** the results in a clean, searchable dashboard anyone can use.

**Example:**

| Before (Raw) | After (Translated) |
|---|---|
| `0x000000000000000000000000...` | `Public Key [GABC...1234] transferred 100 USDC to [GXYZ...5678]` |

---

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Design System:** Tailwind CSS + shadcn/ui
- **Stellar Integration:** `stellar-sdk`
- **State Management:** React Context + Server Components

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
git clone https://github.com/your-org/open-audit.git
cd open-audit
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_HORIZON_URL` | Stellar Horizon endpoint | `https://horizon-testnet.stellar.org` |
| `NEXT_PUBLIC_SOROBAN_RPC_URL` | Soroban RPC endpoint | `https://soroban-testnet.stellar.org` |
| `NEXT_PUBLIC_NETWORK_PASSPHRASE` | Network passphrase | Testnet passphrase |

---

## Project Structure

```
open-audit/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Main dashboard page
│   ├── layout.tsx          # Root layout with theme provider
│   └── page.tsx            # Landing / redirect
├── components/             # Reusable UI components
│   ├── ui/                 # shadcn/ui primitives
│   ├── dashboard/          # Dashboard-specific components
│   └── theme/              # Dark mode toggle
├── lib/
│   ├── translator/         # 🔑 The Translation Registry core logic
│   │   ├── types.ts        # RawEvent / TranslatedEvent interfaces
│   │   ├── registry.ts     # Registry lookup function
│   │   └── blueprints/     # Per-contract translation blueprints
│   ├── stellar/            # Stellar SDK helpers
│   └── utils.ts            # Shared utilities
├── docs/
│   └── good-first-issues.json
└── public/
```

---

## The Translation Registry

The heart of Open-Audit is the **Translation Registry** in `/lib/translator/`. Each contract gets a **blueprint** — a mapping from raw event topics/data to a human-readable template.

To add support for a new contract, create a file in `/lib/translator/blueprints/` and register it in `registry.ts`. See [CONTRIBUTING.md](CONTRIBUTING.md) for a step-by-step guide.

---

## Contributing

We welcome contributions of all sizes! See [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

Good first issues are listed in [`/docs/good-first-issues.json`](docs/good-first-issues.json).

---

## License

MIT © Open-Audit Contributors
