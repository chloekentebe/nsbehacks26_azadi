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

// Play/Pause & Scroll Logic
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        const video = entry.target.querySelector('video');
        const videoId = entry.target.getAttribute('data-id');

        if (entry.isIntersecting) {
            video.play();

            if (!viewedVideos.has(videoId)) {
                viewedVideos.add(videoId);
                const viewCount = viewedVideos.size;

                let progress = (viewCount / 7) * 100;
                impactFill.style.width = Math.min(100, progress) + "%";

                if (viewCount === 7 && !goalReached) {
                    goalReached = true;
                    setTimeout(() => {
                        document.getElementById('reward-modal').classList.add('active');
                    }, 800);
                }
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
function openNewPage(pageName) {
    document.getElementById('new-page-title').innerText = pageName;
    document.getElementById('new-page-content').innerHTML = `<h2>Welcome to the ${pageName} section.</h2><p>Data loading...</p>`;

    // Shows the pure white full-screen layer
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