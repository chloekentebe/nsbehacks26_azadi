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

// Generate 12 placeholder videos for the demo
const videoData = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    ...baseVideo
}));

const feed = document.getElementById('video-feed');
const impactFill = document.getElementById('impact-fill');
let goalReached = false;

// We will track unique videos watched to fill the meter
const viewedVideos = new Set();

// 2. Inject Videos into the Feed
videoData.forEach(item => {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.setAttribute('data-id', item.id); // Tag it with an ID to track views
    card.innerHTML = `
        <video loop muted playsinline src="${item.url}"></video>
        <a href="${item.sourceUrl}" target="_blank" class="creator-badge">
            <span>via Instagram</span>
            <strong>${item.creator}</strong>
        </a>
        <div class="action-overlay">
            <h4>${item.hashtag}</h4>
            <p>${item.desc}</p>
            <button class="action-btn" onclick="openMap(${item.lat}, ${item.lng})">📍 View Local Impact Map</button>
        </div>
    `;
    feed.appendChild(card);
});

// 3. Auto Play/Pause & Count 10 Videos
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        const video = entry.target.querySelector('video');
        const videoId = entry.target.getAttribute('data-id');

        if (entry.isIntersecting) {
            video.play();

            // Logic for the 10-Video Anti-Doom Scrolling Limit
            if (!viewedVideos.has(videoId)) {
                viewedVideos.add(videoId);

                // Calculate progress based on watching 10 videos (10% per video)
                let progress = (viewedVideos.size / 10) * 100;
                impactFill.style.width = Math.min(100, progress) + "%";

                // Trigger exactly when 10 unique videos are hit
                if (viewedVideos.size === 10 && !goalReached) {
                    goalReached = true;
                    // Wait half a second so they can see the video start before popping up the reward
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

document.querySelectorAll('.video-card').forEach(card => observer.observe(card));

// 4. Slide-Over Panel Logic
function openPanel(type) {
    document.getElementById('panel-title').innerText = type;
    document.getElementById('panel-body').innerHTML = `<p>Coming soon...</p>`;
    document.getElementById('content-panel').classList.add('active');
    document.getElementById('reward-modal').classList.remove('active');
}

function closePanel() {
    document.getElementById('content-panel').classList.remove('active');
}

// 5. Map Logic Placeholders
function openMap(lat, lng) {
    document.getElementById('map-overlay').classList.add('active');
    // Map code commented out previously goes here
}

function closeMap() {
    document.getElementById('map-overlay').classList.remove('active');
}