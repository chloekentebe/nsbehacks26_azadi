# azadi ✊🏽 | knowledge is power

**azadi** is a decentralized, grassroots organizing platform that bridges the gap between digital education and real-world impact. Built for the NSBE Hacks 2026, azadi empowers individuals and communities through a scrollable educational video feed, free interactive impact maps, and immutable **Proof-of-Action badges** powered by the XRP Ledger.

---

## 🌱 The Inspiration
The name **azadi** is inspired by the *"Zan, Zendegi, Azadi"* (Woman, Life, Freedom) protest movement originating in Iran. "Azadi" translates to freedom. This platform is built on the foundational belief that true strength and freedom are established through knowledge—and as our tagline states, *knowledge is power*. By equipping individuals with education, unfiltered realities, and tools for grassroots action, we aim to empower individuals and communities to reclaim their agency.

---

## 🚨 The Problem
Modern social media feeds blur the lines between fleeting meme content and serious global issues, leading to empathy fatigue and endless **doom scrolling**. There are no clear boundaries, making it incredibly difficult to meaningfully engage with serious content (humanitarian crises and human rights) that showcases underrepresented populations and BIPOC communities. 

Instead of just scrolling past trauma, people need a dedicated platform where they can actively *learn* through curated articles and discussions, connect with their local community via protests, and contribute their own stories through video. Finally, there is a lack of verifiable tracking for this real-world engagement, which is why we integrated the XRP Ledger to reward community participation with immutable **Proof-of-Action badges**.

---

## 💡 The Solution
**azadi** solves this by combining a highly engaging Web2 user experience with seamless Web3 infrastructure:
* **Educate:** Users scroll through a curated feed of a maximum of 10 educational short-form videos focusing on mutual aid, human rights, and community organizing.
* **Localize:** Users can pull up an interactive, free map to find the location of the place mentioned in the video.
* **Act & Verify:** When users RSVP to a local action, they mint an immutable **Proof-of-Action Badge** directly on the XRPL.

---

## ✨ Key Features
* **Learn-to-Earn Progress:** A dynamic impact bar tracks user engagement, unlocking local action dashboards after watching 5 educational videos.
* **Comprehensive Knowledge Base:** Dedicated hubs for articles and community forums to facilitate deeper learning and discussion beyond the video feed.
* **Action-Oriented Dashboards:** Integrated directories for local charities and protests, seamlessly bridging the gap between digital awareness and physical organizing.
* **Immersive Full-Screen Feed:** Custom-built CSS snap-scrolling ensures a focused, one-video-at-a-time viewing experience with custom aesthetic media controls.
* **Interactive Local Impact Maps:** Integrated Leaflet.js and OpenStreetMap to dynamically drop pins on global coordinates without requiring paid API keys.
* **Persian Rug Dark Mode:** A hidden UI toggle that switches the app's aesthetic to a custom, dark-tinted Persian rug background, paying homage to the source of inspiration for the platform's name.

---

## ⛓️ How We Use the XRP Ledger (XRPL)
azadi utilizes the XRP Ledger's speed, low fees, and native token standards to create a permanent record of community action.

We focused on programmability and tokenization: turning real-world engagement and civic intent into on-chain assets that users own and can later reuse in DeFi or other XRPL flows. This MVP meets the track's success criteria by tackling a real-world problem with XRPL at the core.

**1. XLS-20 NFTokens**
Two kinds of badges are minted as NFTs on the XRPL Testnet and sent to the user’s XRP Ledger address:
* **Participation NFT:** Earned for forum activity (e.g., 1 NFT per 5 messages). Minted and offered for 0 XRP to the user’s address; they accept it in their wallet (e.g., Xumm) to receive it.
* **Protest RSVP Badge:** For the hardcoded Toronto solidarity protest (Reel 6, Iran), users can RSVP. The app mints a badge NFT and sends it to their XRP address as proof of intent to participate.

**2. Server-Side Minting**
The Node.js backend holds a funded Testnet wallet (via `XRPL_REWARD_WALLET_SEED`). It mints NFTs and creates an `NFTokenCreateOffer` (amount 0) directly to the user’s address so they can accept it securely in any XRPL-compatible wallet.

**3. Testnet Deployment**
All XRPL activity runs on the XRPL Testnet (`wss://s.altnet.rippletest.net:51233`). No mainnet funds are required; the project is fully testable on Testnet with real, on-chain assets.

---

## 🛠️ Tech Stack
* **Frontend:** HTML, CSS, vanilla JavaScript (no React). Feather Icons, Leaflet.js & OpenStreetMap for mapping.
* **Backend:** Node.js, Express. JWT auth, in-memory user and forum storage. Optional Gemini API integration for AI-driven article, charity, and protest suggestions.
* **XRPL:** `xrpl` npm package. The server mints XLS-20 NFTs and creates sell-offers for 0 XRP to the user’s address on Testnet.
* **Other:** `bcrypt` for passwords; `dotenv` for environment configuration.

---

## 🚀 How to Run and Test the MVP
Because azadi is built with pure, native web technologies, getting it running takes less than 10 seconds. No complex package installations required.

1. **Clone the Repo:**
   Clone the repository from GitHub to your machine and open a terminal in the project root.
   ```bash
   git clone [https://github.com/yourusername/azadi.git](https://github.com/yourusername/azadi.git)
   cd azadi
**2. Install Dependencies:**
Run `npm install` in the project root.

**3. Configure Environment:**
* Copy `.env.example` to `.env`.
* Set `GEMINI_API_KEY` (from Google AI Studio) if you want the app to generate Articles, Charities, or AI-driven Protests; otherwise, those features may error or be skipped.
* Set `XRPL_REWARD_WALLET_SEED` to a Testnet wallet seed. Use the XRPL Testnet faucet to fund this wallet; it is used by the server to mint and send all participation and RSVP badge NFTs.

**4. Start the App:**
Run `npm start` and open the URL shown (e.g., `http://localhost:3001`) in a modern browser.

**5. Test the XRPL Features:**
* **Account and XRP address:** Sign up or log in, then add your XRP Ledger address (Testnet, starting with `r...`) via profile → “Change XRP address” (or during signup).
* **Participation NFT:** Open *Forums* from any reel, and send 5 messages. The app will mint a participation NFT and create an offer to your address. Accept the offer in your XRPL wallet (e.g., Xumm) to receive the NFT.
* **Protest RSVP badge:** Open Reel 6 (Iran), go to *Protests*, and select Toronto. You’ll see the hardcoded “Solidarity with Iran” protest. Click RSVP; the app mints a badge NFT and sends it to your XRP address. Accept the offer in your wallet and confirm the NFT on the Testnet explorer!
---
## 🔮 Future Roadmap (V2)
While this MVP demonstrates the speed and utility of the XRPL, our production architecture will include:

* **Secure Wallet Integration:** Integrating Crossmark or Xaman so users can sign transactions with their own self-custodial wallets natively in the app.
* **Webhook Verification:** Integrating with Eventbrite/Action Network APIs to automatically trigger badge mints only after real-world attendance is verified by organizers.
* **Enhanced AI Fact-Checking:** Upgrading our Gemini API integration to include a rigorous, automated fact-checking layer. To ensure the highest standard of accuracy and combat misinformation, we plan to implement a mathematical confidence threshold.
* **User-Generated Content (Create):** A dynamic 'Create' portal empowering community members to upload and amplify their own educational videos and grassroots stories.
---
## 📚 Resources
* **XRPL Dev Resources:** [https://linktr.ee/rippledevrel](https://linktr.ee/rippledevrel)
* **XRPL Testnet:** `wss://s.altnet.rippletest.net:51233`
* **Testnet Explorer:** [https://testnet.xrpl.org](https://testnet.xrpl.org)
* **Testnet Faucet / Wallets:** See the Linktree above or XRPL docs for funding a Testnet wallet.
---
## 🤝 Team and Acknowledgments  
**Members:** Chloe Kentebe & Viktar Hiryn

*A special thank you to the NSBE Hacks 2026 organizers, mentors, and the incredible XRPL documentation that made building this integration possible.*

Built with ❤️ for NSBE Hacks 2026.
