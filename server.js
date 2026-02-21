require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.use(cors({ origin: true }));
app.use(express.json());

app.post('/api/recommend-articles', async (req, res) => {
  const { issues } = req.body;
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Server missing GEMINI_API_KEY. Add it to .env' });
  }
  if (!issues || !Array.isArray(issues) || issues.length === 0) {
    return res.status(400).json({ error: 'Please provide an array of issues (topics from the videos).' });
  }

  const issuesText = issues.join('\n• ');
  const prompt = `Find 5 to 7 recent, high-quality news or feature articles from reputable sources (e.g. BBC, The Guardian, NPR, Al Jazeera, Reuters) about these topics the user is learning about:

• ${issuesText}

Search the web and list real articles with their real URLs. Focus on social justice, activism, and education.`;

  try {
    const model = 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        tools: [{ google_search: {} }],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error', response.status, errText);
      let message = 'AI service error. Check API key and quota.';
      if (response.status === 404) message = 'Model not found. Make sure your API key is from aistudio.google.com/apikey';
      if (response.status === 429) message = 'Too many requests. Wait about a minute and try again.';
      return res.status(502).json({ error: message });
    }

    const data = await response.json();
    const candidate = data?.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;
    const chunks = groundingMetadata?.groundingChunks || [];

    // Extract real article URLs from Google Search grounding
    const seen = new Set();
    const recommendations = [];
    for (const chunk of chunks) {
      const web = chunk?.web;
      if (!web?.uri) continue;
      if (seen.has(web.uri)) continue;
      seen.add(web.uri);
      let title = (web.title && web.title.trim()) ? web.title.trim() : (web.domain || '');
      if (!title) try { title = new URL(web.uri).hostname; } catch (_) {}
      if (!title) title = 'Article';
      let source = (web.domain && web.domain.trim()) ? web.domain.trim() : '';
      if (!source) try { source = new URL(web.uri).hostname.replace(/^www\./, ''); } catch (_) {}
      recommendations.push({
        title,
        description: '',
        url: web.uri,
        source,
      });
      if (recommendations.length >= 7) break;
    }

    // Fallback: no grounding results, use text + search link
    if (recommendations.length === 0) {
      const text = candidate?.content?.parts?.[0]?.text || '';
      const fallbackPrompt = `Based on these topics: ${issuesText}. Respond with exactly 5 article recommendations as JSON only: [{"title":"...","description":"..."}]. No URLs.`;
      const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const fallbackRes = await fetch(fallbackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fallbackPrompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024, responseMimeType: 'application/json' },
        }),
      });
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        const fallbackText = fallbackData?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (fallbackText) {
          const cleaned = fallbackText.replace(/^```json?\s*|\s*```$/g, '').trim();
          const parsed = JSON.parse(cleaned);
          const list = Array.isArray(parsed) ? parsed : [];
          list.forEach((a) => {
            recommendations.push({
              title: a.title || 'Article',
              description: a.description || '',
              url: null,
              source: '',
            });
          });
        }
      }
    }

    if (recommendations.length === 0) {
      return res.status(502).json({ error: 'No article recommendations right now. Try again in a bit.' });
    }

    // Ask AI to add a one-sentence description for each article (same order)
    const titlesList = recommendations.map((r) => r.title).join('\n');
    const descPrompt = `Topics: ${issuesText}\n\nArticle titles (one per line):\n${titlesList}\n\nFor each title above, write exactly one short, concrete summary sentence. State directly what the article does or what the reader learns—no hedging (no "likely", "may", "might", "could", "probably"). Same order. Return only valid JSON: [{"title":"...","description":"..."}, ...]`;
    try {
      const descRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: descPrompt }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 1024, responseMimeType: 'application/json' },
        }),
      });
      if (descRes.ok) {
        const descData = await descRes.json();
        const descText = descData?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (descText) {
          const cleaned = descText.replace(/^```json?\s*|\s*```$/g, '').trim();
          const parsed = JSON.parse(cleaned);
          const descList = Array.isArray(parsed) ? parsed : [];
          descList.forEach((item, i) => {
            if (recommendations[i]) recommendations[i].description = item.description || item.desc || '';
          });
        }
      }
    } catch (_) { /* keep existing descriptions */ }

    return res.json({ recommendations });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message || 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Azadi API running at http://localhost:${PORT}`);
});
