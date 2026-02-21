require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Client, Wallet, getNFTokenID } = require('xrpl');

const app = express();
const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const JWT_SECRET = process.env.JWT_SECRET || 'azadi-dev-secret-change-in-production';
const MESSAGES_PER_NFT = 5;

// In-memory stores (use a DB in production)
const users = new Map(); // email -> { email, passwordHash, xrpAddress?, messageCount, earnedNftCount }
const forumMessages = []; // { id, email, text, createdAt }
let messageIdCounter = 1;
// Gemini 2.5 Flash Lite has much higher/unlimited quota — fewer "too many requests" errors. Good for analyzing topics + search grounding.
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';

app.use(cors({ origin: true }));
app.use(express.json());

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Login required.' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userEmail = payload.email;
    next();
  } catch (_) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

// ----- Auth -----
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body || {};
  const e = (email && String(email).trim().toLowerCase()) || '';
  const p = password && String(password);
  if (!e || !p || p.length < 6) return res.status(400).json({ error: 'Email and password (min 6 characters) required.' });
  if (users.has(e)) return res.status(400).json({ error: 'Email already registered.' });
  const passwordHash = await bcrypt.hash(p, 10);
  users.set(e, { email: e, passwordHash, xrpAddress: null, messageCount: 0, earnedNftCount: 0 });
  const token = jwt.sign({ email: e }, JWT_SECRET, { expiresIn: '7d' });
  return res.json({ token, user: { email: e, messageCount: 0, earnedNftCount: 0, xrpAddress: null } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  const e = (email && String(email).trim().toLowerCase()) || '';
  const u = users.get(e);
  if (!u || !(await bcrypt.compare(String(password || ''), u.passwordHash)))
    return res.status(401).json({ error: 'Invalid email or password.' });
  const token = jwt.sign({ email: e }, JWT_SECRET, { expiresIn: '7d' });
  return res.json({
    token,
    user: {
      email: u.email,
      messageCount: u.messageCount || 0,
      earnedNftCount: u.earnedNftCount || 0,
      xrpAddress: u.xrpAddress || null,
    },
  });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const u = users.get(req.userEmail);
  if (!u) return res.status(401).json({ error: 'User not found.' });
  return res.json({
    user: {
      email: u.email,
      messageCount: u.messageCount || 0,
      earnedNftCount: u.earnedNftCount || 0,
      xrpAddress: u.xrpAddress || null,
    },
  });
});

app.patch('/api/auth/me', authMiddleware, (req, res) => {
  const { xrpAddress } = req.body || {};
  const u = users.get(req.userEmail);
  if (!u) return res.status(401).json({ error: 'User not found.' });
  const addr = (xrpAddress && String(xrpAddress).trim()) || null;
  if (addr && !/^r[1-9A-HJ-NP-Za-km-z]{24,34}$/.test(addr))
    return res.status(400).json({ error: 'Invalid XRP classic address.' });
  u.xrpAddress = addr;
  return res.json({ user: { email: u.email, messageCount: u.messageCount, earnedNftCount: u.earnedNftCount, xrpAddress: u.xrpAddress } });
});

// ----- Forum -----
app.get('/api/forum/messages', (req, res) => {
  const last = Math.min(100, forumMessages.length);
  const list = forumMessages.slice(-last).map((m) => ({ id: m.id, email: m.email, text: m.text, createdAt: m.createdAt }));
  return res.json({ messages: list });
});

app.post('/api/forum/messages', authMiddleware, (req, res) => {
  const { text } = req.body || {};
  const trimmed = (text && String(text).trim()) || '';
  if (!trimmed) return res.status(400).json({ error: 'Message text required.' });
  const u = users.get(req.userEmail);
  if (!u) return res.status(401).json({ error: 'User not found.' });
  const id = messageIdCounter++;
  const createdAt = new Date().toISOString();
  forumMessages.push({ id, email: req.userEmail, text: trimmed, createdAt });
  u.messageCount = (u.messageCount || 0) + 1;
  let earnedThisTime = false;
  if (u.messageCount > 0 && u.messageCount % MESSAGES_PER_NFT === 0) {
    u.earnedNftCount = (u.earnedNftCount || 0) + 1;
    earnedThisTime = true;
  }
  return res.status(201).json({
    message: { id, email: req.userEmail, text: trimmed, createdAt },
    messageCount: u.messageCount,
    earnedNft: earnedThisTime,
    earnedNftCount: u.earnedNftCount,
  });
});

// ----- NFT reward (XRPL Testnet) -----
const XRPL_NETWORK = process.env.XRPL_NETWORK || 'wss://s.altnet.rippletest.net:51233';
const REWARD_NFT_URI = process.env.REWARD_NFT_URI || 'https://static.thenounproject.com/png/achievement-badge-icon-8087381-512.png';

async function getNftWallet() {
  const seed = process.env.XRPL_REWARD_WALLET_SEED;
  if (!seed) return null;
  return Wallet.fromSeed(seed);
}

app.post('/api/rewards/claim', authMiddleware, async (req, res) => {
  const u = users.get(req.userEmail);
  if (!u) return res.status(401).json({ error: 'User not found.' });
  if (!u.xrpAddress) return res.status(400).json({ error: 'Add your XRP address in Settings to claim NFTs.' });
  if ((u.earnedNftCount || 0) < 1) return res.status(400).json({ error: 'No NFT earned yet. Send 5 messages in the forum to earn one.' });
  const wallet = await getNftWallet();
  if (!wallet) return res.status(503).json({ error: 'NFT reward not configured. Set XRPL_REWARD_WALLET_SEED in .env for Testnet.' });
  let client;
  try {
    client = new Client(XRPL_NETWORK);
    await client.connect();
    const taxon = 0;
    const mintTx = {
      TransactionType: 'NFTokenMint',
      Account: wallet.address,
      NFTokenTaxon: taxon,
      URI: Buffer.from(REWARD_NFT_URI, 'utf8').toString('hex'),
      Flags: 8,
    };
    const mintPrepared = await client.autofill(mintTx);
    const mintSigned = wallet.sign(mintPrepared);
    const mintResult = await client.submitAndWait(mintSigned.tx_blob);
    const nftId = getNFTokenID(mintResult.result.meta);
    if (!nftId) {
      return res.status(502).json({ error: 'NFT minted but could not read ID. Check XRPL Explorer.' });
    }
    const offerTx = {
      TransactionType: 'NFTokenCreateOffer',
      Account: wallet.address,
      NFTokenID: nftId,
      Amount: '0',
      Destination: u.xrpAddress,
      Flags: 1,
    };
    const offerPrepared = await client.autofill(offerTx);
    const offerSigned = wallet.sign(offerPrepared);
    const offerResult = await client.submitAndWait(offerSigned.tx_blob);
    u.earnedNftCount = Math.max(0, (u.earnedNftCount || 0) - 1);
    return res.json({
      success: true,
      message: 'Accept this offer in your XRP wallet (e.g. Xumm) to receive the NFT.',
      hash: offerResult.result.hash,
      explorer: `https://testnet.xrpl.org/transactions/${offerResult.result.hash}`,
    });
  } catch (err) {
    console.error('NFT claim error', err);
    return res.status(502).json({ error: err.message || 'XRPL error. Try again.' });
  } finally {
    if (client) await client.disconnect();
  }
});

const CACHE_TTL_MS = 5 * 60 * 1000;
const articlesCache = new Map();
const charitiesCache = new Map();
function cacheKey(issues) {
  return Array.isArray(issues) ? issues.slice().sort().join('\n') : '';
}
function getCached(cache) {
  return (key) => {
    const entry = cache.get(key);
    if (!entry || Date.now() > entry.expires) return null;
    return entry.data;
  };
}
function setCached(cache) {
  return (key, data) => {
    cache.set(key, { data, expires: Date.now() + CACHE_TTL_MS });
  };
}

function toSiteName(hostname) {
  if (!hostname || typeof hostname !== 'string') return 'Article';
  const base = hostname.split('.')[0] || hostname;
  if (!base) return 'Article';
  const cleaned = base.replace(/-/g, ' ');
  const titleCase = cleaned.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  if (titleCase.length <= 4) return titleCase.toUpperCase();
  return titleCase;
}

function geminiError(status, errText) {
  if (status === 404) return 'Model not found. Use a key from aistudio.google.com/apikey.';
  if (status === 429) return 'Too many requests. Wait a minute and try again.';
  try {
    const j = JSON.parse(errText);
    const msg = j?.error?.message || j?.message;
    if (msg) return msg;
  } catch (_) {}
  return errText && errText.length < 300 ? errText : 'AI service error. Check API key and quota.';
}

function parseCharitiesJson(cleaned) {
  if (!cleaned || typeof cleaned !== 'string') return null;
  const trim = cleaned.trim();
  if (!trim) return null;
  try {
    const out = JSON.parse(trim);
    return Array.isArray(out) ? out : null;
  } catch (e) {
    const closed = trim.replace(/,(\s*)$/, '$1');
    for (const suffix of ['"]', '"}', '}]', ']']) {
      try {
        const fixed = (closed + suffix).replace(/,(\s*[}\]])/g, '$1');
        const out = JSON.parse(fixed);
        if (Array.isArray(out)) return out;
      } catch (_) {}
    }
    const objects = [];
    let depth = 0;
    let start = -1;
    for (let i = 0; i < trim.length; i++) {
      if (trim[i] === '{') {
        if (depth === 0) start = i;
        depth++;
      } else if (trim[i] === '}') {
        depth--;
        if (depth === 0 && start >= 0) {
          try {
            const obj = JSON.parse(trim.slice(start, i + 1));
            if (obj && (obj.name || obj.url)) objects.push(obj);
          } catch (_) {}
        }
      }
    }
    if (objects.length > 0) return objects;
  }
  return null;
}

app.post('/api/recommend-articles', async (req, res) => {
  const { issues } = req.body;
  const key = cacheKey(issues);
  const cached = getCached(articlesCache)(key);
  if (cached) return res.json(cached);

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Server missing GEMINI_API_KEY. Add it to .env' });
  }
  if (!issues || !Array.isArray(issues) || issues.length === 0) {
    return res.status(400).json({ error: 'Please provide an array of issues (topics from the videos).' });
  }

  const issuesText = issues.join('\n• ');
  const prompt = `Use web search to find 3 or 4 real, published news or feature articles from the web about these topics:

• ${issuesText}

List only articles you actually find via search — each must have a real URL. Do not make up titles or URLs.

For each article, in your response provide one short sentence summarizing what the article is about. Use a confident, direct tone — no hedging (no "likely", "may", "might", or "could"). State what the article covers.

Respond with a JSON array only, in the same order as your search results. Format:
[{"description":"..."}, {"description":"..."}, ...]`;

  try {
    const model = GEMINI_MODEL;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        tools: [{ google_search: {} }],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error', response.status, errText);
      return res.status(502).json({ error: geminiError(response.status, errText) });
    }

    const data = await response.json();
    const candidate = data?.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;
    const chunks = groundingMetadata?.groundingChunks || groundingMetadata?.grounding_chunks || [];
    const modelText = candidate?.content?.parts?.[0]?.text || '';

    const seen = new Set();
    const recommendations = [];
    for (const chunk of chunks) {
      const web = chunk?.web || chunk;
      const uri = web?.uri || web?.url || chunk?.uri || chunk?.url || chunk?.retrievedContext?.uri;
      if (!uri || typeof uri !== 'string' || !uri.startsWith('http')) continue;
      if (seen.has(uri)) continue;
      seen.add(uri);
      let hostname = '';
      try { hostname = new URL(uri).hostname.replace(/^www\./, ''); } catch (_) {}
      const siteName = toSiteName(hostname || 'Article');
      recommendations.push({ url: uri, source: siteName, description: '' });
      if (recommendations.length >= 4) break;
    }

    if (recommendations.length === 0 && modelText) {
      const urlRegex = /https?:\/\/[^\s"')\]}>]+/g;
      const urls = [...new Set((modelText.match(urlRegex) || []).map((u) => u.replace(/[.,;:!?)\]\s]+$/, '')))].filter((u) => u.startsWith('http'));
      for (const uri of urls) {
        if (seen.has(uri) || !uri.startsWith('http')) continue;
        seen.add(uri);
        let hostname = '';
        try { hostname = new URL(uri).hostname.replace(/^www\./, ''); } catch (_) {}
        if (/vertexai|google\.com|googleapis/i.test(hostname)) continue;
        recommendations.push({ url: uri, source: toSiteName(hostname || 'Article'), description: '' });
        if (recommendations.length >= 4) break;
      }
    }

    if (modelText && recommendations.length > 0) {
      try {
        const cleaned = modelText.replace(/^```json?\s*|\s*```$/g, '').trim();
        const parsed = JSON.parse(cleaned);
        const list = Array.isArray(parsed) ? parsed : [];
        list.forEach((item, i) => {
          if (recommendations[i] && (item.description || item.desc)) {
            let d = (item.description || item.desc || '').trim();
            if (d) recommendations[i].description = d;
          }
        });
      } catch (_) {}
    }

    recommendations.forEach((r) => {
      if (!r.description || !String(r.description).trim()) {
        r.description = `Article from ${r.source}.`;
      }
    });

    if (recommendations.length === 0) {
      return res.status(502).json({ error: 'No articles found for these topics. Try again or try different topics.' });
    }
    const payload = { recommendations };
    setCached(articlesCache)(key, payload);
    return res.json(payload);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message || 'Server error' });
  }
});

app.post('/api/recommend-charities', async (req, res) => {
  const { issues } = req.body;
  const key = cacheKey(issues);
  const cached = getCached(charitiesCache)(key);
  if (cached) return res.json(cached);

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Server missing GEMINI_API_KEY. Add it to .env' });
  }
  if (!issues || !Array.isArray(issues) || issues.length === 0) {
    return res.status(400).json({ error: 'Please provide an array of issues (topics from the videos).' });
  }

  const issuesText = issues.join('\n• ');
  const prompt = `The user has been watching short videos (reels) about these topics:
• ${issuesText}

Recommend exactly 5 to 7 real, existing charities or nonprofit organizations that align with these issues (e.g. food sovereignty, racial justice, climate, housing, mutual aid).

Rules: Only list organizations that actually exist. Use each organization's exact official name (as on their real website). Use their real, working official website URL (https://). Do not make up or guess names or URLs.

For each charity provide:
1. name - Exact official charity name (as shown on their website)
2. description - One short sentence (what they do / who they help). Be concrete.
3. url - Real official website URL (https://) where the user can go to donate or learn more.

Return only valid JSON, no markdown or extra text:
[
  { "name": "...", "description": "...", "url": "https://..." },
  { "name": "...", "description": "...", "url": "https://..." }
]`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini charities error', response.status, errText);
      return res.status(502).json({ error: geminiError(response.status, errText) });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return res.status(502).json({ error: 'No response from AI.' });
    }

    const cleaned = text.replace(/^```json?\s*|\s*```$/g, '').trim();
    let raw = parseCharitiesJson(cleaned);
    if (!raw || !Array.isArray(raw)) {
      return res.status(502).json({ error: 'Invalid AI response. Try again.' });
    }
    const recommendations = raw
      .filter((c) => c && (c.name || c.url))
      .map((c) => ({
        name: String(c.name || c.title || '').trim() || 'Charity',
        description: String(c.description || c.desc || '').trim(),
        url: (c.url && String(c.url).startsWith('http')) ? c.url : (c.link || '#'),
      }))
      .slice(0, 10);

    const payload = { recommendations };
    setCached(charitiesCache)(key, payload);
    return res.json(payload);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message || 'Server error' });
  }
});

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const protestsCache = new Map();
const PROTESTS_CACHE_TTL_MS = 10 * 60 * 1000;

const CITY_COORDS = {
  Toronto: { lat: 43.6532, lng: -79.3832 },
  Montreal: { lat: 45.5017, lng: -73.5673 },
  Vancouver: { lat: 49.2827, lng: -123.1207 },
};

app.post('/api/nearby-protests', async (req, res) => {
  const { city, issues } = req.body;
  const validCities = ['Toronto', 'Montreal', 'Vancouver'];
  const cityName = validCities.includes(city) ? city : 'Toronto';
  const topics = Array.isArray(issues) ? issues : [];

  const protestsCacheKey = `${cityName}_${cacheKey(topics)}`;
  const cached = protestsCache.get(protestsCacheKey);
  if (cached && Date.now() < cached.expires) {
    return res.json(cached.data);
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Server missing GEMINI_API_KEY.' });
  }

  const topicLine = topics.length
    ? `Focus on events related to: ${topics.join('; ')}.`
    : 'Focus on social justice, climate, or community action.';

  const today = new Date().toISOString().slice(0, 10);

  const prompt = `Use web search to find real protests, rallies, marches, or demonstrations in ${cityName}, Canada that are happening SOON (future dates only). Today's date is ${today}. ${topicLine}

CRITICAL: Only include events whose date is in the FUTURE (after ${today}). Exclude any past events. Do NOT make up events; only list events you actually find via search. Each event MUST have a real website URL from your search results. If you find no real upcoming events, return [].

For each future event you find, provide:
- title: short name
- description: one sentence
- when: the actual future date/time (e.g. "March 15 2026 2:00 PM" or "Saturday March 22") — must be a date after ${today}
- address: place or address in ${cityName}
- lat: latitude (number)
- lng: longitude (number)
- website: the exact real URL you found (https:// or http://)

Return only a JSON array. Include only events that are happening soon (future dates) with real URLs. Exclude past events. If none found, return [].
[{"title":"...", "description":"...", "when":"...", "address":"...", "lat": 0.0, "lng": 0.0, "website": "https://..."}, ...]`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        tools: [{ google_search: {} }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini protests error', response.status, errText);
      return res.status(502).json({ error: geminiError(response.status, errText) });
    }

    const data = await response.json();
    const candidate = data?.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;
    const chunks = groundingMetadata?.groundingChunks || groundingMetadata?.grounding_chunks || [];
    const modelText = candidate?.content?.parts?.[0]?.text || '';

    const searchUrls = new Set();
    for (const chunk of chunks) {
      const web = chunk?.web || chunk;
      const uri = web?.uri || web?.url || chunk?.uri || chunk?.url || chunk?.retrievedContext?.uri;
      if (uri && typeof uri === 'string' && uri.startsWith('http')) searchUrls.add(uri);
    }
    const urlRegex = /https?:\/\/[^\s"')\]}>]+/g;
    const fromText = (modelText.match(urlRegex) || []).map((u) => u.replace(/[.,;:!?)\]\s]+$/, ''));
    fromText.forEach((u) => { if (u.startsWith('http')) searchUrls.add(u); });

    const cleaned = modelText.replace(/^```json?\s*|\s*```$/g, '').trim();
    let list = [];
    try {
      const parsed = JSON.parse(cleaned);
      list = Array.isArray(parsed) ? parsed : [];
    } catch (_) {}

    const coords = CITY_COORDS[cityName];
    const userLat = coords.lat;
    const userLng = coords.lng;

    const protests = list
      .filter((p) => {
        if (!p || !(p.title || p.address)) return false;
        const w = p.website && String(p.website).trim();
        if (!w || !w.startsWith('http')) return false;
        const normalized = w.replace(/[.,;:!?)\]\s]+$/, '');
        return searchUrls.has(normalized) || searchUrls.has(w) || [...searchUrls].some((u) => u.startsWith(normalized) || normalized.startsWith(u));
      })
      .map((p) => {
        const plat = typeof p.lat === 'number' ? p.lat : parseFloat(p.lat);
        const plng = typeof p.lng === 'number' ? p.lng : parseFloat(p.lng);
        const km = (Number.isFinite(plat) && Number.isFinite(plng)) ? haversineKm(userLat, userLng, plat, plng) : null;
        const mapUrl = (Number.isFinite(plat) && Number.isFinite(plng))
          ? `https://www.google.com/maps?q=${plat},${plng}`
          : (p.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.address)}` : null);
        return {
          title: String(p.title || p.name || 'Event').trim() || 'Protest',
          description: String(p.description || p.desc || '').trim(),
          when: String(p.when || p.time || p.date || 'Upcoming').trim(),
          address: String(p.address || p.place || '').trim(),
          lat: Number.isFinite(plat) ? plat : null,
          lng: Number.isFinite(plng) ? plng : null,
          km: Number.isFinite(km) ? Math.round(km) : null,
          mapUrl: mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.address || p.title)}`,
          website: String(p.website || '').trim(),
        };
      })
      .slice(0, 5);

    const payload = { protests };
    protestsCache.set(protestsCacheKey, { data: payload, expires: Date.now() + PROTESTS_CACHE_TTL_MS });
    return res.json(payload);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message || 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Azadi API running at http://localhost:${PORT}`);
});
