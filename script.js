// Initialize Feather Icons
feather.replace();

// 10 distinct videos
const videoData = [
    {
        id: 1,
        url: 'assets/foodSov.mp4',
        creator: '@fortheculture',
        sourceUrl: 'https://www.instagram.com/p/DU1Wrs1kWDf/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
        desc: 'Black food sovereignty and how land is being used and controlled in Africa.',
        lat: 2.0,       // Center of Africa
        lng: 16.0,
        zoom: 3         // Zoomed out
    },
    {
        id: 2,
        url: 'assets/blackSurg.mp4',
        creator: '@blklivesmatter',
        sourceUrl: 'https://www.instagram.com/p/DU1Wrs1kWDf/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
        desc: 'Black history being written by five Black surgeons at Johns Hopkins Hospital.',
        lat: 39.2971,
        lng: -76.5922,
        zoom: 15
    },
    {
        id: 3,
        url: 'assets/yaleHist.mp4', // Reusing video2 until you download a 3rd
        creator: '@kahil.greene',
        sourceUrl: 'https://www.instagram.com/reel/DRe-cLqjgoj/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
        desc: 'An erased chapter of Black history at Yale University.',
        lat: 41.3163,
        lng: -72.9223,
        zoom: 15
    },
    {
        id: 4,
        url: 'assets/sudan.mp4',
        creator: '@wearthepeace',
        sourceUrl: 'https://www.instagram.com/reel/DRnDQqAAfYe/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
        desc: `An atrocious cruelty inflicted on Sudanese women at the frontline of Sudan's civil war from BBC News.`,
        lat: 15.5527,   // Roughly the geographic center of Sudan
        lng: 30.2176,
        zoom: 5
    },
    {
        id: 5,
        url: 'assets/somalia.mp4',
        creator: '@okuntakinte',
        sourceUrl: 'https://www.instagram.com/reel/DUYDFjjiMsu/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
        desc: 'Clip of a child marriange ceremony in Somalia.',
        lat: 5.1521,    // Roughly the geographic center of Somalia
        lng: 46.1996,
        zoom: 5         // Zoomed out to frame the Horn of Africa
    },
    {
        id: 6,
        url: 'assets/iran.mp4',
        creator: '@iamnazaninour',
        sourceUrl: 'https://www.instagram.com/reel/DUlqs0jkiso/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==',
        desc: 'True history behinnd the Anniversary of the Islamic Revolution in Iran.',
        lat: 32.4279,   // Roughly the geographic center of Iran
        lng: 53.6880,
        zoom: 5         // Zoomed out to frame the entire country
    },
    {
        id: 7,
        url: 'assets/afghan.mp4',
        creator: '@shabnamnasimi',
        sourceUrl: 'https://www.instagram.com/reel/DUquo8ukg2O/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
        desc: 'Legalization of slavery in Afghanistan under the Taliban regime.',
        lat: 33.9391,   // Geographic center of Afghanistan
        lng: 67.7100,
        zoom: 5         // Zoomed out to frame the entire country
    },
    {
        id: 8,
        url: 'assets/women.mp4',
        creator: '@marketingminutes',
        sourceUrl: 'https://www.instagram.com/reel/DSmEpdul5GS/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
        desc: `Nike's Dream Crazier campaign that showcases the harsh reality of being a women in sport.`,
        lat: 34.1026,   // Dolby Theatre, Los Angeles
        lng: -118.3404,
        zoom: 15        // Zoomed in enough to see the heart of Hollywood
    },
    {
        id: 9,
        url: 'assets/ai.mp4',
        creator: '@aiconversation',
        sourceUrl: 'https://www.instagram.com/reel/DRPLymtAf69/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
        desc: `Deutsche Telekom's AI awareness campaign that highlights the dangers of sharing personal information online.`,
        lat: 50.7078,   // Deutsche Telekom Headquarters
        lng: 7.1285,
        zoom: 15        // Zoomed in to see the campus and surrounding streets
    },
    {
        id: 10,
        url: 'assets/current.mp4',
        creator: '@andrea_mizrahi',
        sourceUrl: 'https://www.instagram.com/reel/DUjOWvEicBS/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
        desc: 'Memetic warfare and its presence on social media.',
        lat: 40.7145,   // Foley Square / Federal Courthouses in Lower Manhattan
        lng: -74.0010,
        zoom: 16        // Zoomed in tightly on the legal district
    }
];

// 3. Build the 10-Video Feed
const feed = document.getElementById('video-feed');
const impactFill = document.getElementById('impact-fill');
let goalReached = false;
const viewedVideos = new Set();

// GLOBAL AUDIO STATE (Defaults to true/muted)
let isGlobalMuted = true;

// Inject Videos & Expanding Side Column Row
videoData.forEach(item => {
    const row = document.createElement('div');
    row.className = 'feed-item-row';
    row.setAttribute('data-id', item.id);

    row.innerHTML = `
        <div class="video-card">
            
            <div class="video-container">
                <video loop muted playsinline src="${item.url}"></video>
                
                <div class="custom-video-controls">
                    <button class="control-btn sound-toggle" onclick="toggleGlobalSound()" title="Mute/Unmute">
                        <i data-feather="volume-x"></i>
                    </button>
                    <button class="control-btn play-toggle" onclick="togglePlay(this)" title="Play/Pause">
                        <i data-feather="pause"></i>
                    </button>
                    <button class="control-btn" onclick="skipVideo(this, -5)" title="Rewind 5s">
                        <i data-feather="rewind"></i>
                    </button>
                    <button class="control-btn" onclick="skipVideo(this, 5)" title="Forward 5s">
                        <i data-feather="fast-forward"></i>
                    </button>
                </div>
                
                <a href="${item.sourceUrl}" target="_blank" class="instagram-link">
                    <i data-feather="instagram"></i> Instagram
                </a>
            </div>
            
            <div class="info-section">
                <h3 class="creator-name">${item.creator}</h3>
                <p>${item.desc}</p>
                <button class="action-btn" onclick="openMap(${item.lat}, ${item.lng}, ${item.zoom})">📍 View Local Impact Map</button>
            </div>

        </div>
        
        <div class="side-column-container">
            <div class="side-menu-expanded">
                <button class="side-icon" onclick="openNewPage('Forums')" title="Forums"><i data-feather="message-square"></i></button>
                <button class="side-icon" onclick="openNewPage('Articles')" title="Articles"><i data-feather="book-open"></i></button>
                <button class="side-icon" onclick="openNewPage('Charities')" title="Charities"><i data-feather="heart"></i></button>
                <button class="side-icon" onclick="openNewPage('Protests')" title="Protests"><i data-feather="map-pin"></i></button>
                <button class="side-icon" onclick="openNewPage('Create')" title="Create"><i data-feather="plus-circle"></i></button>
            </div>
            <button class="side-icon menu-trigger" title="More Options">
                <i data-feather="plus"></i>
            </button>
        </div>
    `;
    feed.appendChild(row);
});

feather.replace();

// Play/Pause & Dynamic Progress Bar Logic
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        const video = entry.target.querySelector('video');
        // Grab the ID of the video currently on screen (1 through 10)
        const videoId = parseInt(entry.target.getAttribute('data-id'));

        if (entry.isIntersecting) {
            video.play();

            // Ensure the button shows the "Pause" icon since the video is playing
            const playBtn = entry.target.querySelector('.play-toggle');
            if (playBtn) { playBtn.innerHTML = '<i data-feather="pause"></i>'; feather.replace(); }

            // DYNAMIC IMPACT METER: Moves up AND down based on where you are
            let progress = (videoId / 5) * 100; // Changed from 7 to 5
            impactFill.style.width = Math.min(100, progress) + "%";

            // Trigger Goal Reached Modal at video 5
            if (videoId === 5 && !goalReached) { // Changed from 7 to 5
                goalReached = true;
                setTimeout(() => {
                    document.getElementById('reward-modal').classList.add('active');
                }, 800);
            }
        } else {
            video.pause();
        }
    });
}, { threshold: 0.6 });

document.querySelectorAll('.feed-item-row').forEach(row => observer.observe(row));

// GLOBAL SOUND TOGGLE 
function toggleGlobalSound() {
    isGlobalMuted = !isGlobalMuted;

    // 1. Update EVERY video tag
    document.querySelectorAll('video').forEach(video => {
        video.muted = isGlobalMuted;
    });

    // 2. Rewrite the icon HTML so Feather can redraw the correct SVG
    document.querySelectorAll('.sound-toggle').forEach(btn => {
        if (isGlobalMuted) {
            btn.innerHTML = '<i data-feather="volume-x"></i>'; // Sound Off
        } else {
            btn.innerHTML = '<i data-feather="volume-2"></i>'; // Sound On
        }
    });

    // 3. Force Feather to draw the new icons
    feather.replace();
}

// BRAND NEW PAGE LOGIC
const pageContentData = {
    'Forums': `
        <div class="dashboard-grid">
            <div class="dash-card">
                <span class="dash-card-tag">Hot Topic</span>
                <h3>Tenant Rights & Rent Control</h3>
                <p>Discussing the new housing policies and organizing neighborhood unions.</p>
                <div class="dash-card-footer">
                    <span style="color:#888; font-size:13px;">💬 42 Replies</span>
                    <button class="dash-btn">Join Chat</button>
                </div>
            </div>
            <div class="dash-card">
                <span class="dash-card-tag">Mutual Aid</span>
                <h3>Community Fridge Restock</h3>
                <p>Coordinating drop-offs for the downtown community fridge this weekend.</p>
                <div class="dash-card-footer">
                    <span style="color:#888; font-size:13px;">💬 18 Replies</span>
                    <button class="dash-btn">Join Chat</button>
                </div>
            </div>
        </div>
    `,
    'Articles': `
        <div class="dashboard-grid">
            <div class="dash-card">
                <span class="dash-card-tag">Education</span>
                <h3>The History of Grassroots Organizing</h3>
                <p>A deep dive into how small community actions lead to sweeping legislative changes.</p>
                <div class="dash-card-footer">
                    <span style="color:#888; font-size:13px;">⏱️ 5 min read</span>
                    <button class="dash-btn">Read More</button>
                </div>
            </div>
            <div class="dash-card">
                <span class="dash-card-tag">Climate</span>
                <h3>Urban Gardens are Cooling Cities</h3>
                <p>How local initiatives are combating the urban heat island effect.</p>
                <div class="dash-card-footer">
                    <span style="color:#888; font-size:13px;">⏱️ 3 min read</span>
                    <button class="dash-btn">Read More</button>
                </div>
            </div>
        </div>
    `,
    'Charities': `
        <div class="dashboard-grid">
            <div class="dash-card">
                <span class="dash-card-tag">Verified Fund</span>
                <h3>Emergency Food Relief</h3>
                <p>Providing hot meals and groceries to unhoused populations in the metro area.</p>
                <div class="dash-card-footer">
                    <span style="color:var(--blue-5); font-weight:bold;">85% Funded</span>
                    <button class="dash-btn" style="background:var(--action-orange); color:#111;">Donate</button>
                </div>
            </div>
            <div class="dash-card">
                <span class="dash-card-tag">Verified Fund</span>
                <h3>Legal Defense Fund</h3>
                <p>Ensuring representation for peaceful protesters and community organizers.</p>
                <div class="dash-card-footer">
                    <span style="color:var(--blue-5); font-weight:bold;">Goal: $10k</span>
                    <button class="dash-btn" style="background:var(--action-orange); color:#111;">Donate</button>
                </div>
            </div>
        </div>
    `,
    'Protests': `
        <div class="dashboard-grid">
            <div class="dash-card">
                <span class="dash-card-tag" style="color: #e74c3c;">Action Alert</span>
                <h3>City Hall Climate Strike</h3>
                <p>Demand action on the new emissions bill. Bring signs, water, and masks.</p>
                <div class="dash-card-footer">
                    <span style="color:#888; font-size:13px;">📍 Tomorrow, 2:00 PM</span>
                    
                    <button class="dash-btn" onclick="startRegistration(this, 'https://www.eventbrite.com/')">Register</button>
                    
                </div>
            </div>
        </div>
    `,
    'Create': `
        <div class="create-form">
            <h3 style="margin-top:0;">Share Your Impact</h3>
            <p style="color:#666; margin-top:-10px;">Upload a video or start a new community discussion.</p>
            <input type="text" placeholder="Give your post a title...">
            <textarea placeholder="What's happening in your community?"></textarea>
            <button class="action-btn">Post to azadi</button>
        </div>
    `
};

function openNewPage(pageName) {
    document.getElementById('new-page-title').innerText = pageName;

    // Injects the custom HTML from the dictionary above, or a fallback if it's missing
    document.getElementById('new-page-content').innerHTML = pageContentData[pageName] || `<p>Coming soon...</p>`;

    document.getElementById('white-page').classList.add('active');
    document.getElementById('reward-modal').classList.remove('active');
}

function closeNewPage() {
    document.getElementById('white-page').classList.remove('active');
}

function closeRewardModal() {
    document.getElementById('reward-modal').classList.remove('active');
}

// MAP LOGIC (LEAFLET + OPENSTREETMAP)
let map;
let currentMarker;

function openMap(lat, lng, zoomLevel) {
    // 1. Slide the map overlay up
    document.getElementById('map-overlay').classList.add('active');

    // 2. Wait 400ms for the CSS slide animation to finish
    setTimeout(() => {
        // If this is the first time opening the map, create it
        if (!map) {
            // Initialize the map and set the camera
            map = L.map('map').setView([lat, lng], zoomLevel);

            // Load the free OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);
        } else {
            // If the map already exists, just move the camera
            map.setView([lat, lng], zoomLevel);
        }

        // 3. Fix a common glitch where hidden maps don't load their tiles properly
        map.invalidateSize();

        // 4. Remove the old pin and drop a new one
        if (currentMarker) {
            map.removeLayer(currentMarker);
        }
        currentMarker = L.marker([lat, lng]).addTo(map);

    }, 400);
}

function closeMap() {
    // Slides the overlay back down
    document.getElementById('map-overlay').classList.remove('active');
}

// CUSTOM VIDEO CONTROLS LOGIC
function togglePlay(btn) {
    // Finds the video connected to this specific button
    const video = btn.closest('.video-card').querySelector('video');

    if (video.paused) {
        video.play();
        btn.innerHTML = '<i data-feather="pause"></i>';
    } else {
        video.pause();
        btn.innerHTML = '<i data-feather="play"></i>';
    }
    feather.replace(); // Refreshes the icon
}

function skipVideo(btn, seconds) {
    const video = btn.closest('.video-card').querySelector('video');
    // Jumps the video forward or backward by 5 seconds
    video.currentTime += seconds;
}

// ---------------- RUG THEME TOGGLE LOGIC ----------------
let isRugTheme = false;

function toggleRugTheme() {
    isRugTheme = !isRugTheme;

    // Toggles the dark rug CSS class on the body of the website
    document.body.classList.toggle('rug-theme', isRugTheme);

    // Swap the icon inside the button
    const toggleBtn = document.querySelector('.theme-toggle');
    if (isRugTheme) {
        toggleBtn.innerHTML = '<i data-feather="droplet"></i>'; // Shows a drop for the blue gradient
    } else {
        toggleBtn.innerHTML = '<i data-feather="image"></i>'; // Shows an image icon for the rug
    }

    // Tell Feather to redraw the new icon we just injected
    feather.replace();
}
// EXTERNAL REGISTRATION AND MINING FLOW
// ---------------- EXTERNAL REGISTRATION & MINTING FLOW ----------------

function startRegistration(btnElement, externalUrl) {
    // Open the external registration page in a new tab
    window.open(externalUrl, '_blank');

    // Transform the button into the "Claim" state
    btnElement.innerText = "🏅 Claim Action Badge";
    btnElement.style.background = "var(--action-orange)";
    btnElement.style.color = "#111";
    btnElement.style.border = "2px solid #111";

    // Swap the onclick function so the NEXT click triggers the XRPL mint
    btnElement.onclick = function () {
        mintBadge(this); // Calls the XRPL function we already wrote
    };
}

//  XRPL PROOF-OF-ACTION BADGE LOGIC 
async function mintBadge(btnElement) {
    // 1. Change button state to show loading
    const originalText = btnElement.innerText;
    btnElement.innerText = "Minting Badge on XRPL...";
    btnElement.style.opacity = "0.7";
    btnElement.disabled = true;

    try {
        // 2. Connect to the XRPL Testnet
        const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
        await client.connect();
        console.log("Connected to XRPL Testnet");

        // 3. For the MVP, we generate a funded test wallet automatically
        // (In a production app, the user would connect their own wallet like Crossmark or Gem)
        console.log("Funding test wallet...");
        const { wallet } = await client.fundWallet();
        console.log("Test wallet created:", wallet.address);

        // 4. Define the Badge Metadata (URI)
        // This links to a JSON file or image representing the "City Hall Climate Strike" badge
        const badgeURI = "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3dfuylqabf3oclgtqy55fbzdi";

        // 5. Construct the Mint Transaction
        const transactionBlob = {
            "TransactionType": "NFTokenMint",
            "Account": wallet.address,
            "URI": xrpl.convertStringToHex(badgeURI), // XRPL requires URIs to be in Hex format
            "Flags": 8, // Transferable flag (you can set this to 0 for soulbound/non-transferable)
            "TokenTaxon": 0, // Required field
            "NFTokenTaxon": 0
        };

        // 6. Submit the transaction to the ledger
        console.log("Submitting transaction...");
        const tx = await client.submitAndWait(transactionBlob, { wallet: wallet });

        console.log("Transaction complete!", tx);

        // 7. Update the UI to show success!
        btnElement.innerText = "✅ Badge Minted!";
        btnElement.style.background = "#27ae60"; // Turn button green
        btnElement.style.color = "white";
        btnElement.style.border = "none";
        btnElement.disabled = true; // Prevents them from minting it twice

        // Show the user their transaction hash so they know it's real
        alert(`Success! Your Proof-of-Action Badge was minted on the XRPL.\n\nTransaction Hash: ${tx.result.hash}`);

        // Disconnect
        await client.disconnect();

    } catch (error) {
        console.error("Error minting badge:", error);
        btnElement.innerText = "❌ Minting Failed";
        setTimeout(() => {
            btnElement.innerText = originalText;
            btnElement.style.opacity = "1";
            btnElement.disabled = false;
        }, 3000);
    }
}