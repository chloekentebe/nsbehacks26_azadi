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
            if (videoId) viewedVideos.add(String(videoId));

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
    // Terminate any in-flight request from the other tab so we don't parse stale/partial JSON
    if (pageName === 'Articles') {
        if (charitiesAbortController) {
            charitiesAbortController.abort();
            charitiesAbortController = null;
        }
        document.getElementById('new-page-content').innerHTML = '<p class="panel-message loading">Getting article recommendations from AI…</p>';
        document.getElementById('white-page').classList.add('active');
        loadArticleRecommendations();
        return;
    }
    if (pageName === 'Charities') {
        if (articlesAbortController) {
            articlesAbortController.abort();
            articlesAbortController = null;
        }
        document.getElementById('new-page-content').innerHTML = '<p class="panel-message loading">Getting charity recommendations from AI…</p>';
        document.getElementById('white-page').classList.add('active');
        loadCharityRecommendations();
        return;
    }
    if (pageName === 'Protests') {
        if (articlesAbortController) { articlesAbortController.abort(); articlesAbortController = null; }
        if (charitiesAbortController) { charitiesAbortController.abort(); charitiesAbortController = null; }
        document.getElementById('white-page').classList.add('active');
        showProtestsPanel('Toronto');
        return;
    }
    if (pageName === 'Forums') {
        if (articlesAbortController) { articlesAbortController.abort(); articlesAbortController = null; }
        if (charitiesAbortController) { charitiesAbortController.abort(); charitiesAbortController = null; }
        document.getElementById('white-page').classList.add('active');
        loadForumPanel();
        return;
    }

    if (articlesAbortController) { articlesAbortController.abort(); articlesAbortController = null; }
    if (charitiesAbortController) { charitiesAbortController.abort(); charitiesAbortController = null; }
    document.getElementById('new-page-content').innerHTML = pageContentData[pageName] || `<p>Coming soon...</p>`;
    document.getElementById('white-page').classList.add('active');
}

// Articles: load from backend API and show in white page
const API_BASE = 'http://localhost:3001';
const CACHE_MINUTES = 5;
const articlesCache = { key: null, data: null, expires: 0 };
const charitiesCache = { key: null, data: null, expires: 0 };
let articlesAbortController = null;
let charitiesAbortController = null;

// Auth state (persist so account info survives copy/refresh)
const AUTH_USER_KEY = 'azadi_user';
let authToken = localStorage.getItem('azadi_token');
let authUser = null;
try {
  const saved = localStorage.getItem(AUTH_USER_KEY);
  if (saved) authUser = JSON.parse(saved);
} catch (_) {}

function saveAuthUser() {
  if (authUser) localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
  else localStorage.removeItem(AUTH_USER_KEY);
}

function getAuthHeader() {
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
}

function updateHeaderAuthButton() {
  const btn = document.getElementById('header-auth-btn');
  if (!btn) return;
  if (authUser) {
    btn.textContent = authUser.email;
    btn.onclick = () => { openNewPage('Forums'); };
  } else {
    btn.textContent = 'Log in';
    btn.onclick = openAuthModal;
  }
}

function openAuthModal() {
  document.getElementById('auth-modal-title').textContent = 'Log in';
  document.getElementById('auth-toggle-btn').textContent = 'Create account';
  document.getElementById('auth-message').textContent = '';
  document.getElementById('auth-email').value = '';
  document.getElementById('auth-password').value = '';
  document.getElementById('auth-modal').classList.add('active');
}

function closeAuthModal() {
  document.getElementById('auth-modal').classList.remove('active');
}

function toggleAuthMode() {
  const isLogin = document.getElementById('auth-modal-title').textContent === 'Log in';
  document.getElementById('auth-modal-title').textContent = isLogin ? 'Create account' : 'Log in';
  document.getElementById('auth-toggle-btn').textContent = isLogin ? 'Log in' : 'Create account';
  document.getElementById('auth-message').textContent = '';
}

async function submitAuth() {
  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;
  const isLogin = document.getElementById('auth-modal-title').textContent === 'Log in';
  const msgEl = document.getElementById('auth-message');
  if (!email || !password) {
    msgEl.textContent = 'Email and password required.';
    return;
  }
  if (password.length < 6) {
    msgEl.textContent = 'Password must be at least 6 characters.';
    return;
  }
  const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
  try {
    const res = await fetch(API_BASE + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const errMsg = data.error || 'Something went wrong.';
      msgEl.textContent = errMsg;
      alert(errMsg);
      return;
    }
    authToken = data.token;
    authUser = data.user;
    localStorage.setItem('azadi_token', authToken);
    saveAuthUser();
    updateHeaderAuthButton();
    closeAuthModal();
    if (document.getElementById('new-page-title').innerText === 'Forums') loadForumPanel();
  } catch (e) {
    const errMsg = 'Network error. Is the server running?';
    msgEl.textContent = errMsg;
    alert(errMsg);
  }
}

function logout() {
  authToken = null;
  authUser = null;
  localStorage.removeItem('azadi_token');
  localStorage.removeItem(AUTH_USER_KEY);
  updateHeaderAuthButton();
}

// ----- Forum + NFT reward -----
let forumPollTimer = null;

function loadForumPanel() {
  const panel = document.getElementById('new-page-content');
  const isLoggedIn = !!authUser;
  const nextNftIn = authUser && authUser.messageCount != null ? 5 - (authUser.messageCount % 5) : 5;
  panel.innerHTML = `
    <div class="forum-container">
      ${!isLoggedIn ? `<p class="forum-intro">Log in to post messages and earn participation NFTs (1 NFT per 5 messages).</p>` : ''}
      ${authUser ? `
        <div class="forum-reward-bar">
          <div class="forum-reward-stats">
            <strong>Participation reward</strong>: ${authUser.messageCount || 0} messages · Next NFT in ${nextNftIn} message${nextNftIn !== 1 ? 's' : ''}.
            ${(authUser.earnedNftCount || 0) > 0 ? ` <span class="forum-earned">You have ${authUser.earnedNftCount} NFT(s) to claim!</span>` : ''}
          </div>
          <div class="forum-reward-actions">
            ${authUser.xrpAddress ? `<button type="button" class="forum-btn forum-btn-primary" onclick="claimNft()">Claim NFT</button> <a href="#" onclick="showForumSettings(); return false;" class="forum-link">Change wallet</a>` : `<a href="#" onclick="showForumSettings(); return false;" class="forum-link forum-link-cta">Add XRP address to claim</a>`}
            <a href="#" onclick="logout(); closeNewPage(); return false;" class="forum-link forum-link-muted">Log out</a>
          </div>
        </div>
      ` : ''}
      <div class="forum-messages">
        <p class="forum-loading">Loading messages…</p>
      </div>
      ${isLoggedIn ? `
        <div class="forum-input-wrap">
          <input type="text" id="forum-message-input" class="forum-input" placeholder="Type a message…" maxlength="500">
          <button type="button" class="forum-btn forum-btn-send" onclick="sendForumMessage()">Send</button>
        </div>
      ` : `<button type="button" class="forum-btn forum-btn-join" onclick="closeNewPage(); openAuthModal();">Log in to join</button>`}
    </div>
  `;
  loadForumMessages();
  if (forumPollTimer) clearInterval(forumPollTimer);
  forumPollTimer = setInterval(loadForumMessages, 5000);
  const inputEl = document.getElementById('forum-message-input');
  if (inputEl) {
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendForumMessage();
      }
    });
  }
}

function showForumSettings() {
  const addr = prompt('Enter your XRP Ledger address (r...) to receive participation NFTs:', authUser && authUser.xrpAddress ? authUser.xrpAddress : '');
  if (addr === null) return;
  const trimmed = (addr && addr.trim()) || '';
  if (!trimmed) return;
  fetch(API_BASE + '/api/auth/me', { method: 'PATCH', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify({ xrpAddress: trimmed }) })
    .then((r) => r.json())
    .then((data) => {
      if (data.user) {
        authUser = data.user;
        saveAuthUser();
      }
      loadForumPanel();
    })
    .catch(() => {});
}

function formatMessageTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function loadForumMessages() {
  const container = document.querySelector('.forum-messages');
  if (!container) return;
  try {
    const res = await fetch(API_BASE + '/api/forum/messages');
    const data = await res.json();
    const list = data.messages || [];
    const currentEmail = authUser && authUser.email ? authUser.email : '';
    container.innerHTML = list.length === 0
      ? '<p class="forum-empty">No messages yet. Say something!</p>'
      : list.map((m) => {
          const isOwn = m.email === currentEmail;
          const time = formatMessageTime(m.createdAt);
          return `<div class="forum-chat-row forum-chat-row--${isOwn ? 'own' : 'other'}">
            <div class="forum-chat-bubble">
              <span class="forum-chat-sender">${escapeHtml(m.email)}</span>
              <p class="forum-chat-text">${escapeHtml(m.text)}</p>
              <span class="forum-chat-time">${escapeHtml(time)}</span>
            </div>
          </div>`;
        }).join('');
    container.scrollTop = container.scrollHeight;
  } catch (_) {
    if (container.innerHTML.includes('Loading')) container.innerHTML = '<p class="forum-error">Could not load messages. Is the server running?</p>';
  }
}

async function sendForumMessage() {
  const input = document.getElementById('forum-message-input');
  const text = input && input.value.trim();
  if (!text || !authToken) return;
  try {
    const res = await fetch(API_BASE + '/api/forum/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Failed to send.');
      return;
    }
    input.value = '';
    if (data.messageCount != null) authUser.messageCount = data.messageCount;
    if (data.earnedNftCount != null) authUser.earnedNftCount = data.earnedNftCount;
    saveAuthUser();
    if (data.earnedNft) alert('You earned a participation NFT! Add your XRP address and click Claim to receive it on-chain.');
    loadForumMessages();
    loadForumPanel();
  } catch (e) {
    alert('Network error.');
  }
}

async function claimNft() {
  if (!authUser || !authUser.xrpAddress || (authUser.earnedNftCount || 0) < 1) return;
  try {
    const res = await fetch(API_BASE + '/api/rewards/claim', { method: 'POST', headers: getAuthHeader() });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Claim failed.');
      return;
    }
    authUser.earnedNftCount = (authUser.earnedNftCount || 0) - 1;
    saveAuthUser();
    loadForumPanel();
    alert(data.message + '\n\n' + (data.explorer ? 'View: ' + data.explorer : ''));
  } catch (e) {
    alert('Network error.');
  }
}

function issuesKey(issues) {
    return issues.slice().sort().join('\n');
}
function getFromCache(cache, key) {
    if (cache.key === key && Date.now() < cache.expires) return cache.data;
    return null;
}

async function loadArticleRecommendations() {
    if (articlesAbortController) articlesAbortController.abort();
    articlesAbortController = new AbortController();
    const signal = articlesAbortController.signal;

    const panelBody = document.getElementById('new-page-content');
    const issues = [];
    viewedVideos.forEach((id) => {
        const video = videoData.find((v) => String(v.id) === String(id));
        if (video) issues.push(`${video.hashtag} — ${video.desc}`);
    });

    if (issues.length === 0) {
        panelBody.innerHTML = `<p class="panel-message">Watch a few videos in your feed first. We'll recommend articles based on the issues you're learning about.</p>`;
        return;
    }

    const key = issuesKey(issues);
    const cached = getFromCache(articlesCache, key);
    if (cached && cached.recommendations && cached.recommendations.length > 0) {
        renderArticleCards(panelBody, cached.recommendations);
        return;
    }

    panelBody.innerHTML = `<p class="panel-message loading">Getting article recommendations from AI…</p>`;

    try {
        const res = await fetch(`${API_BASE}/api/recommend-articles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ issues }),
            signal,
        });
        let data;
        try {
            data = await res.json();
        } catch (parseErr) {
            if (signal.aborted) return;
            panelBody.innerHTML = `<p class="panel-message error">Invalid response from server. Try again.</p>`;
            return;
        }
        if (signal.aborted) return;

        if (!res.ok) {
            panelBody.innerHTML = `<p class="panel-message error">${escapeHtml(String(data.error || 'Could not load recommendations.'))}</p>`;
            return;
        }

        const list = data.recommendations || [];
        if (list.length === 0) {
            panelBody.innerHTML = `<p class="panel-message">No recommendations right now. Try again in a bit.</p>`;
            return;
        }
        articlesCache.key = key;
        articlesCache.data = data;
        articlesCache.expires = Date.now() + CACHE_MINUTES * 60 * 1000;
        renderArticleCards(panelBody, list);
    } catch (err) {
        if (err.name === 'AbortError') return;
        if (signal.aborted) return;
        panelBody.innerHTML = `<p class="panel-message error">Cannot reach the server. Start it with: <code>npm start</code></p>`;
    }
}

function renderArticleCards(panelBody, list) {
    panelBody.innerHTML = `
        <p class="panel-message">Real articles from the web (click to open):</p>
        <div class="dashboard-grid">
            ${list.map((a) => {
                const href = (a.url && String(a.url).startsWith('http')) ? a.url : '#';
                const siteName = (a.source && String(a.source).trim()) ? escapeHtml(a.source) : 'Article';
                const summary = (a.description && String(a.description).trim()) ? escapeHtml(a.description) : '';
                return `
                <div class="dash-card">
                    <span class="dash-card-tag">${siteName}</span>
                    ${summary ? `<p>${summary}</p>` : ''}
                    <div class="dash-card-footer">
                        <a href="${escapeHtml(href)}" target="_blank" rel="noopener" class="dash-btn">Read article</a>
                    </div>
                </div>
            `;
            }).join('')}
        </div>
    `;
}

async function loadCharityRecommendations() {
    if (charitiesAbortController) charitiesAbortController.abort();
    charitiesAbortController = new AbortController();
    const signal = charitiesAbortController.signal;

    const panelBody = document.getElementById('new-page-content');
    const issues = [];
    viewedVideos.forEach((id) => {
        const video = videoData.find((v) => String(v.id) === String(id));
        if (video) issues.push(`${video.hashtag} — ${video.desc}`);
    });

    if (issues.length === 0) {
        panelBody.innerHTML = `<p class="panel-message">Watch a few videos first. We'll recommend charities based on what you're learning about.</p>`;
        return;
    }

    const key = issuesKey(issues);
    const cached = getFromCache(charitiesCache, key);
    if (cached && cached.recommendations && cached.recommendations.length > 0) {
        renderCharityCards(panelBody, cached.recommendations);
        return;
    }

    panelBody.innerHTML = `<p class="panel-message loading">Getting charity recommendations from AI…</p>`;

    try {
        const res = await fetch(`${API_BASE}/api/recommend-charities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ issues }),
            signal,
        });
        let data;
        try {
            data = await res.json();
        } catch (parseErr) {
            if (signal.aborted) return;
            panelBody.innerHTML = `<p class="panel-message error">Invalid response from server. Try again.</p>`;
            return;
        }
        if (signal.aborted) return;

        if (!res.ok) {
            panelBody.innerHTML = `<p class="panel-message error">${escapeHtml(String(data.error || 'Could not load recommendations.'))}</p>`;
            return;
        }

        const list = data.recommendations || [];
        if (list.length === 0) {
            panelBody.innerHTML = `<p class="panel-message">No charity recommendations right now. Try again in a bit.</p>`;
            return;
        }
        charitiesCache.key = key;
        charitiesCache.data = data;
        charitiesCache.expires = Date.now() + CACHE_MINUTES * 60 * 1000;
        renderCharityCards(panelBody, list);
    } catch (err) {
        if (err.name === 'AbortError') return;
        if (signal.aborted) return;
        panelBody.innerHTML = `<p class="panel-message error">Cannot reach the server. Start it with: <code>npm start</code></p>`;
    }
}

function renderCharityCards(panelBody, list) {
    panelBody.innerHTML = `
        <p class="panel-message">Based on what you've been watching:</p>
        <div class="dashboard-grid">
            ${list.map((c) => {
                const name = c.name || 'Charity';
                const desc = c.description ? escapeHtml(c.description) : '';
                const href = (c.url && String(c.url).startsWith('http')) ? c.url : '#';
                return `
                <div class="dash-card">
                    <span class="dash-card-tag">Verified Fund</span>
                    <h3>${escapeHtml(name)}</h3>
                    ${desc ? `<p>${desc}</p>` : ''}
                    <div class="dash-card-footer">
                        <a href="${escapeHtml(href)}" target="_blank" rel="noopener" class="dash-btn dash-btn-donate">Donate</a>
                    </div>
                </div>
                `;
            }).join('')}
        </div>
    `;
}

const PROTESTS_CITIES = ['Toronto', 'Montreal', 'Vancouver'];

function showProtestsPanel(selectedCity) {
    const panelBody = document.getElementById('new-page-content');
    const issues = [];
    viewedVideos.forEach((id) => {
        const video = videoData.find((v) => String(v.id) === String(id));
        if (video) issues.push(`${video.hashtag} — ${video.desc}`);
    });

    const toggleHtml = `
        <p class="panel-message">Choose a city:</p>
        <div class="protests-city-toggle" style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px;">
            ${PROTESTS_CITIES.map((city) => `
                <button type="button" class="dash-btn ${city === selectedCity ? 'dash-btn-donate' : ''}" data-city="${escapeHtml(city)}" style="min-width:100px;">
                    ${escapeHtml(city)}
                </button>
            `).join('')}
        </div>
    `;
    panelBody.innerHTML = toggleHtml + '<p class="panel-message loading">Finding protests…</p>';
    panelBody.querySelector('.protests-city-toggle').addEventListener('click', (e) => {
        const btn = e.target.closest('[data-city]');
        if (!btn) return;
        const city = btn.getAttribute('data-city');
        showProtestsPanel(city);
    });

    loadProtestsByCity(panelBody, selectedCity, issues);
}

async function loadProtestsByCity(panelBody, city, issues) {
    const toggleSection = panelBody.querySelector('.protests-city-toggle');
    const loadingEl = panelBody.querySelector('.panel-message.loading');
    if (loadingEl) loadingEl.textContent = `Finding protests in ${city}…`;

    try {
        const res = await fetch(`${API_BASE}/api/nearby-protests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ city, issues }),
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            if (loadingEl) loadingEl.remove();
            panelBody.insertAdjacentHTML('beforeend', `<p class="panel-message error">${escapeHtml(String(data.error || 'Could not load protests.'))}</p>`);
            return;
        }

        const list = data.protests || [];
        let el = toggleSection ? toggleSection.nextElementSibling : null;
        while (el) { const next = el.nextElementSibling; el.remove(); el = next; }

        if (list.length === 0) {
            panelBody.insertAdjacentHTML('beforeend', '<p class="panel-message">No protests happening soon.</p>');
            return;
        }
        const grid = document.createElement('div');
        grid.className = 'dashboard-grid';
        panelBody.appendChild(grid);
        renderProtestCards(grid, list);
    } catch (err) {
        if (loadingEl) loadingEl.remove();
        panelBody.insertAdjacentHTML('beforeend', '<p class="panel-message error">Cannot reach the server. Start it with: <code>npm start</code></p>');
    }
}

function renderProtestCards(container, list) {
    container.innerHTML = list.map((p) => {
        const title = p.title || 'Protest';
        const desc = (p.description && String(p.description).trim()) ? escapeHtml(p.description) : '';
        const when = (p.when && String(p.when).trim()) ? escapeHtml(p.when) : 'Upcoming';
        const mapUrl = (p.mapUrl && String(p.mapUrl).startsWith('http')) ? p.mapUrl : '#';
        const website = (p.website && String(p.website).startsWith('http')) ? p.website : '';
        const km = p.km != null ? ` · ${p.km} km away` : '';
        const websiteBtn = website
            ? `<a href="${escapeHtml(website)}" target="_blank" rel="noopener" class="dash-btn dash-btn-donate">Visit website</a>`
            : '';
        return `
        <div class="dash-card">
            <span class="dash-card-tag" style="color: #e74c3c;">Action Alert</span>
            <h3>${escapeHtml(title)}</h3>
            ${desc ? `<p>${desc}</p>` : ''}
            <div class="dash-card-footer" style="display:flex; flex-wrap:wrap; align-items:center; gap:8px;">
                <span style="color:#888; font-size:13px;">📍 ${when}${km}</span>
                <div style="display:flex; gap:8px; margin-left:auto;">
                    <a href="${escapeHtml(mapUrl)}" target="_blank" rel="noopener" class="dash-btn">View on map</a>
                    ${websiteBtn}
                </div>
            </div>
        </div>
        `;
    }).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function closeNewPage() {
    if (articlesAbortController) {
        articlesAbortController.abort();
        articlesAbortController = null;
    }
    if (charitiesAbortController) {
        charitiesAbortController.abort();
        charitiesAbortController = null;
    }
    if (forumPollTimer) {
        clearInterval(forumPollTimer);
        forumPollTimer = null;
    }
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

// CUSTOM VIDEO CONTROLS LOGIC (partner GUI: pause, fast-forward, rewind)
function togglePlay(btn) {
    const video = btn.closest('.video-card').querySelector('video');

    if (video.paused) {
        video.play();
        btn.innerHTML = '<i data-feather="pause"></i>';
    } else {
        video.pause();
        btn.innerHTML = '<i data-feather="play"></i>';
    }
    feather.replace();
}

function skipVideo(btn, seconds) {
    const video = btn.closest('.video-card').querySelector('video');
    video.currentTime += seconds;
}

// Restore auth on load
(function initAuth() {
  if (!authToken) {
    updateHeaderAuthButton();
    return;
  }
  fetch(API_BASE + '/api/auth/me', { headers: getAuthHeader() })
    .then((res) => {
      if (res.ok) return res.json();
      authToken = null;
      localStorage.removeItem('azadi_token');
      return null;
    })
    .then((data) => {
      if (data && data.user) {
        authUser = data.user;
        saveAuthUser();
      }
      updateHeaderAuthButton();
    })
    .catch(() => {
      updateHeaderAuthButton();
    });
})();
