# Login, Forum & NFT Reward – Setup

## Libraries to install

From the project root run:

```bash
npm install
```

New dependencies (already in `package.json`):

- **bcryptjs** – password hashing for email/password auth  
- **jsonwebtoken** – JWT for sessions  
- **xrpl** – XRP Ledger SDK (mint NFT, create offer for participation reward)

No frontend libraries: auth and forum use the existing vanilla JS setup.

---

## What was built

1. **Login system (email + password)**  
   - Register: `POST /api/auth/register` { email, password }  
   - Login: `POST /api/auth/login` { email, password }  
   - Session: JWT in `Authorization: Bearer <token>`, optional persistence in `localStorage`.  
   - Header: “Log in” opens the auth modal; when logged in it shows your email and links to Forums.

2. **Forum (chat)**  
   - One global room: everyone sees the same thread.  
   - **Forums** in the side menu opens the forum panel.  
   - Logged-in users can post; messages are stored in memory on the server.  
   - Messages refresh every 5 seconds (polling).

3. **Participation NFT reward**  
   - Every **5 messages** (per user), the user earns **1 participation NFT**.  
   - User adds their **XRP address** (Settings / “Add XRP address to claim” in the forum panel).  
   - **Claim NFT** triggers: mint NFT on XRPL Testnet → create a **sell offer for 0** to that address → user accepts the offer in their wallet (e.g. Xumm) to receive the NFT.  
   - The **picture** for the NFT is set by the server env var `REWARD_NFT_URI` (URL to your image). You can change it later.

---

## Environment variables (optional)

In `.env`:

```env
# Optional: stronger secret for JWT (defaults to a dev value)
JWT_SECRET=your-random-secret

# Required only for NFT claim (Testnet)
XRPL_NETWORK=wss://s.altnet.rippletest.net:51233
XRPL_REWARD_WALLET_SEED=your_testnet_wallet_seed

# URL of the image for the participation NFT (replace with your image later)
REWARD_NFT_URI=https://your-site.com/participation-badge.png
```

**Getting a Testnet wallet and seed**

1. Open [XRP Faucet (Testnet)](https://xrpl.org/resources/dev-tools/xrp-faucets).  
2. Generate credentials and fund the wallet with test XRP.  
3. Put the **secret/seed** in `XRPL_REWARD_WALLET_SEED`.  
   - Never use a mainnet seed or real funds for this.

If `XRPL_REWARD_WALLET_SEED` is not set, the app still works; only the **Claim NFT** button will return “NFT reward not configured”.

---

## How to run

1. `npm install`  
2. `npm start`  
3. Open the app (e.g. the HTML file or your dev server).  
4. Click **Log in** → Create account (email + password).  
5. Open **Forums** (chat icon) → send 5 messages → earn 1 NFT → add XRP address → **Claim NFT** (once the seed is in `.env`).

---

## NFT image

The NFT’s metadata stores the URL in `REWARD_NFT_URI`. Replace that URL with your own image (e.g. a participation badge) when ready; no code change needed, only `.env` (or server config).
