// Initialize Feather Icons
feather.replace();

// 1. Video Data Array (Duplicated 12 times so you can test the 10-video limit)
// In a real app, these would be 12 distinct videos.
const baseVideo = {
    url: 'assets/foodSov.mp4',
    creator: '@fortheculture',
    sourceUrl: 'https://www.instagram.com/reel/DS-VfLmE8Q1/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    hashtag: '#foodsovereignty #blackfarmer',
    desc: 'Learn more about black food sovereignty and how land is being used and controlled in Africa.',
    lat: 43.651070,  // Coordinates for Map
    lng: -79.347015
};

// 10 Videos
const videoData = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    ...baseVideo
}));

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
            <video loop muted playsinline src="${item.url}"></video>
            
            <button class="sound-toggle" onclick="toggleGlobalSound()">
                <i data-feather="volume-x"></i>
            </button>
            
            <a href="${item.sourceUrl}" target="_blank" class="creator-badge">
                <span>via Instagram</span>
                <strong>${item.creator}</strong>
            </a>
            
            <div class="action-overlay">
                <h4>${item.hashtag}</h4>
                <p>${item.desc}</p>
                <button class="action-btn" onclick="openMap(${item.lat}, ${item.lng})">📍 View Local Impact Map</button>
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

            // DYNAMIC IMPACT METER: Moves up AND down based on where you are
            let progress = (videoId / 7) * 100;
            impactFill.style.width = Math.min(100, progress) + "%";

            // Trigger Goal Reached Modal at video 7 (only triggers once)
            if (videoId === 7 && !goalReached) {
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
// BRAND NEW PAGE LOGIC & MOCK DATA
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
                    <button class="dash-btn">RSVP</button>
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

// MAP Logic (Placeholders)
function openMap(lat, lng) {
    document.getElementById('map-overlay').classList.add('active');
}
function closeMap() {
    document.getElementById('map-overlay').classList.remove('active');
}