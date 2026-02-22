# azadi ✊🏽 | knowledge is power

**azadi** is a decentralized, grassroots organizing platform that bridges the gap between digital education and real-world impact. Built for the NSBE Hacks 2026, azadi empowers communities through a scrollable educational video feed, free interactive impact maps, and immutable **Proof-of-Action badges** powered by the XRP Ledger.

---

## 🌱 The Inspiration
The name **azadi** is inspired by the *"Zan, Zendegi, Azadi"* (Woman, Life, Freedom) protest movement originating in Iran. "Azadi" translates to freedom. This platform is built on the foundational belief that true strength and freedom are established through knowledge—and as our tagline states, *knowledge is power*. By equipping individuals with education, unfiltered realities, and tools for grassroots action, we aim to empower communities to reclaim their agency.

---

## 🚨 The Problem
Modern social media feeds blur the lines between fleeting meme content and serious global issues, leading to empathy fatigue and endless **doom scrolling**. There are no clear boundaries, making it incredibly difficult to meaningfully engage with serious content (humanitarian crises and human rights) that showcases underrepresented populations and BIPOC communities. 

Instead of just scrolling past trauma, people need a dedicated platform where they can actively *learn* through curated articles and discussions, connect with their local community via protests, and contribute their own stories through video. Finally, there is a lack of verifiable tracking for this real-world engagement, which is why we integrated the XRP Ledger to reward community participation with immutable **Proof-of-Action badges**.

---

## 💡 The Solution
**azadi** solves this by combining a highly engaging Web2 user experience with seamless Web3 infrastructure:
* **Educate:** Users scroll through a curated feed of educational short-form videos focusing on mutual aid, human rights, and community organizing.
* **Localize:** Users can pull up an interactive, free map to find mutual aid networks and protests exactly where the video is talking about.
* **Act & Verify:** When users RSVP to a local action, they mint an immutable **Proof-of-Action Badge** directly on the XRPL.

---

## ✨ Key Features
* **Learn-to-Earn Progress:** A dynamic impact bar tracks user engagement, unlocking local action dashboards after watching 5 educational videos.
* **Comprehensive Knowledge Base:** Dedicated hubs for articles and community forums to facilitate deeper learning and discussion beyond the video feed.
* **Action-Oriented Dashboards:** Integrated directories for local charities and protests, seamlessly bridging the gap between digital awareness and physical organizing.
* **User-Generated Content (Create):** A dynamic 'Create' portal empowering community members to upload and amplify their own educational videos and grassroots stories.
* **Immersive Full-Screen Feed:** Custom-built CSS snap-scrolling ensures a focused, one-video-at-a-time viewing experience with custom aesthetic media controls.
* **Interactive Local Impact Maps:** Integrated Leaflet.js and OpenStreetMap to dynamically drop pins on global coordinates without requiring paid API keys.
* **Persian Rug Dark Mode:** A hidden UI toggle that switches the app's aesthetic to a custom, dark-tinted Persian rug background.

---

## ⛓️ How We Used the XRP Ledger (XRPL)
azadi utilizes the XRP Ledger's speed, low fees, and native token standards to create a permanent record of community action.

* **Standard Used:** XLS-20 (NFTokens)
* **Network:** XRPL Testnet
* **Implementation:** When a user registers for an event via the app's Protests dashboard, the app seamlessly connects to the XRPL Testnet via the `xrpl.js` SDK. It generates a localized wallet and mints a unique NFT (Proof-of-Action Badge) representing their attendance. 
* **The Result:** The user receives a cryptographically secure transaction hash (receipt) proving their participation, creating an immutable credential for grassroots organizing.

---

## 🛠️ Tech Stack
* **Frontend:** Vanilla HTML5, CSS3, JavaScript (No heavy frameworks, lightning-fast rendering)
* **Mapping:** Leaflet.js & OpenStreetMap 
* **Web3/Blockchain:** XRP Ledger JavaScript SDK (`xrpl.js`)
* **Icons:** Feather Icons

---

## 🚀 How to Run Locally
Because azadi is built with pure, native web technologies, getting it running takes less than 10 seconds. No complex package installations required.

1. Clone the repository:
   ```bash
   git clone https://github.com/chloekentebe/nsbehacks_azadi.git
   
2. Open your terminal or file explorer and navigate directly into the newly downloaded azadi folder on your computer.

3. Simply double-click the index.html file to open it in any modern web browser (like Chrome or Safari). For the best developer experience, you can also open the folder in an editor like VS Code and use the "Live Server" extension.

## 🔮 Future Roadmap (V2)
While this MVP demonstrates the speed and utility of the XRPL, our production architecture will include:

* Secure Wallet Integration: Integrating Crossmark or Xaman so users can sign transactions with their own self-custodial wallets.
* Webhook Verification: Integrating with Eventbrite/Action Network APIs to automatically trigger badge mints only after real-world attendance is verified by organizers.
* DAO Governance: Allowing community funds to be distributed based on the weight of a user's Proof-of-Action badges.

Built with ❤️ for the NSBE Hacks 2026
