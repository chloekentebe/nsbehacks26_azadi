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
const API_BASE = 'http://localhost:3001';

function openPanel(type) {
    const title = type === 'articles' ? 'Articles' : type;
    document.getElementById('panel-title').innerText = title;
    document.getElementById('content-panel').classList.add('active');
    document.getElementById('reward-modal').classList.remove('active');

    if (type === 'articles') {
        loadArticleRecommendations();
        return;
    }

    document.getElementById('panel-body').innerHTML = `<p>Coming soon...</p>`;
}

async function loadArticleRecommendations() {
    const panelBody = document.getElementById('panel-body');
    const issues = [];
    viewedVideos.forEach((id) => {
        const video = videoData.find((v) => String(v.id) === String(id));
        if (video) {
            issues.push(`${video.hashtag} — ${video.desc}`);
        }
    });

    if (issues.length === 0) {
        panelBody.innerHTML = `
            <p class="panel-message">Watch a few videos in your feed first. We'll recommend articles based on the issues you're learning about.</p>
        `;
        return;
    }

    panelBody.innerHTML = `<p class="panel-message loading">Getting article recommendations from AI…</p>`;

    try {
        const res = await fetch(`${API_BASE}/api/recommend-articles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ issues }),
        });
        const data = await res.json();

        if (!res.ok) {
            panelBody.innerHTML = `<p class="panel-message error">${data.error || 'Could not load recommendations.'}</p>`;
            return;
        }

        const list = data.recommendations || [];
        if (list.length === 0) {
            panelBody.innerHTML = `<p class="panel-message">No recommendations right now. Try again in a bit.</p>`;
            return;
        }

        panelBody.innerHTML = `
            <p class="panel-message">Based on what you've been watching:</p>
            <ul class="article-list">
                ${list.map((a) => {
                    const title = a.title || 'Article';
                    const hasRealUrl = a.url && String(a.url).startsWith('http');
                    const url = hasRealUrl ? a.url : ('https://www.google.com/search?q=' + encodeURIComponent(title + ' article'));
                    const summary = a.description ? escapeHtml(a.description) : '';
                    return `
                    <li class="article-item">
                        <a href="${escapeHtml(url)}" target="_blank" rel="noopener" class="article-link">
                            <span class="article-name-label">Article you’re about to read</span>
                            <strong class="article-name">${escapeHtml(title)}</strong>
                            ${summary ? `<span class="article-summary">${summary}</span>` : ''}
                        </a>
                    </li>
                `;
                }).join('')}
            </ul>
        `;
    } catch (err) {
        panelBody.innerHTML = `<p class="panel-message error">Cannot reach the server. Start it with: <code>npm start</code></p>`;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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