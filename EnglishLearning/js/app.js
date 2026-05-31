'use strict';

// ====== State ======
let currentTab = 'talk';
let progress = loadProgress();
let favorites = loadFavorites();
let currentPhraseType = 'general';
let currentCategory = 'greetings';
let recognition = null;
let todaysRoleplay = null;

// ====== Speech Synthesis (TTS) ======
let audioUnlocked = false;
let ttsKeepAlive = null;

function unlockAudio() {
  if (audioUnlocked || !('speechSynthesis' in window)) return;
  audioUnlocked = true;
  // iOS requires TTS to be triggered within a user gesture at least once
  const u = new SpeechSynthesisUtterance('');
  u.volume = 0;
  window.speechSynthesis.speak(u);
  window.speechSynthesis.cancel();
}

function startTTSKeepAlive() {
  stopTTSKeepAlive();
  // iOS Safari pauses speechSynthesis after ~15s; pause+resume prevents it
  ttsKeepAlive = setInterval(() => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }
  }, 5000);
}

function stopTTSKeepAlive() {
  if (ttsKeepAlive) { clearInterval(ttsKeepAlive); ttsKeepAlive = null; }
}

function pickVoice() {
  const voices = window.speechSynthesis.getVoices();
  return voices.find(x => x.lang.startsWith('en') && /female|samantha|karen|moira|tessa|zira/i.test(x.name))
      || voices.find(x => x.lang === 'en-US')
      || voices.find(x => x.lang.startsWith('en'));
}

function speak(text, rate = 0.9, onEnd) {
  if (!('speechSynthesis' in window)) { if (onEnd) onEnd(); return; }
  window.speechSynthesis.cancel();

  const doSpeak = () => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = rate;
    u.pitch = 1;
    u.volume = 1;
    const v = pickVoice();
    if (v) u.voice = v;
    u.onend = () => { stopTTSKeepAlive(); if (onEnd) onEnd(); };
    u.onerror = () => { stopTTSKeepAlive(); if (onEnd) onEnd(); };
    startTTSKeepAlive();
    window.speechSynthesis.speak(u);
  };

  // Wait for voices if not yet loaded (async on mobile)
  if (window.speechSynthesis.getVoices().length > 0) {
    setTimeout(doSpeak, 50); // small delay ensures cancel() settles
  } else {
    const onReady = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', onReady);
      setTimeout(doSpeak, 50);
    };
    window.speechSynthesis.addEventListener('voiceschanged', onReady);
    setTimeout(doSpeak, 500); // fallback if event never fires
  }
}

// ====== Speech Recognition (STT) ======
function initRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  const r = new SR();
  r.lang = 'en-US';
  r.continuous = false;
  r.interimResults = true;
  r.maxAlternatives = 3;
  return r;
}

// ====== Matching ======
function normalize(s) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}
function bestScore(spoken, targets) {
  const sw = normalize(spoken).split(' ').filter(Boolean);
  let best = 0;
  targets.forEach(t => {
    const tw = normalize(t).split(' ').filter(Boolean);
    if (tw.length === 0) return;
    let m = 0;
    const pool = [...sw];
    tw.forEach(w => {
      const idx = pool.indexOf(w);
      if (idx >= 0) { m++; pool.splice(idx, 1); }
    });
    const score = Math.round((m / tw.length) * 100);
    if (score > best) best = score;
  });
  return best;
}
function highlightWords(spoken, target) {
  const sw = normalize(spoken).split(' ').filter(Boolean);
  const tw = target.split(' ');
  const swPool = [...sw];
  return tw.map(word => {
    const n = normalize(word);
    const idx = swPool.indexOf(n);
    if (n && idx >= 0) { swPool.splice(idx, 1); return `<span class="w-ok">${word}</span>`; }
    return `<span class="w-miss">${word}</span>`;
  }).join(' ');
}

// ====== Toast ======
function showToast(msg, dur = 2400) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), dur);
}

// ====== Tabs ======
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.addEventListener('click', () => switchTab(b.dataset.tab));
  });
}
function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.tab-content').forEach(s => s.classList.toggle('active', s.id === `tab-${tab}`));
  if (tab === 'talk') renderTalk();
  if (tab === 'progress') renderProgress();
  if (tab === 'phrases') renderPhrasesTab();
}

// ====== TALK TAB ======
function renderTalk() {
  const h = new Date().getHours();
  const greet = h < 11 ? 'おはよう、話そう' : h < 17 ? 'さあ、話そう' : 'お疲れさま、話そう';
  document.getElementById('hero-greeting').textContent = greet;

  const cando = loadCanDo();
  const next = ROLEPLAYS.find(r => !cando[r.id]) || ROLEPLAYS[Math.floor(Math.random() * ROLEPLAYS.length)];
  todaysRoleplay = next;
  document.getElementById('hero-sub').textContent = `${next.icon} ${next.title} · 約3分`;

  const scenes = getScenesCount();
  const streak = getStreak();
  document.getElementById('hero-mini-stat').textContent =
    scenes > 0 ? `これまで ${scenes} 回の会話を達成${streak > 1 ? ` · ${streak}日連続` : ''}` : '最初の一歩を踏み出そう！';

  const list = document.getElementById('roleplay-list');
  list.innerHTML = ROLEPLAYS.map(r => {
    const done = cando[r.id];
    return `
      <button class="rp-card ${done ? 'done' : ''}" data-id="${r.id}">
        <span class="rp-card-icon">${r.icon}</span>
        <span class="rp-card-info">
          <span class="rp-card-title">${r.title}</span>
          <span class="rp-card-cando">${r.canDo}</span>
        </span>
        <span class="rp-card-badge">${done ? '✓' : r.level}</span>
      </button>`;
  }).join('');
  list.querySelectorAll('.rp-card').forEach(c => {
    c.addEventListener('click', () => startRoleplay(c.dataset.id));
  });
}

// ====== ROLEPLAY ENGINE ======
let rp = null; // { data, turnIdx, spoke, total }

function startRoleplay(id) {
  const data = ROLEPLAYS.find(r => r.id === id);
  if (!data) return;
  rp = { data, turnIdx: 0, spoke: 0, total: 0 };
  document.getElementById('rp-overlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  document.getElementById('rp-title').textContent = data.title;
  document.getElementById('rp-intro-icon').textContent = data.icon;
  document.getElementById('rp-intro-title').textContent = data.title;
  document.getElementById('rp-intro-scene').textContent = data.scene;
  document.getElementById('rp-intro').classList.remove('hidden');
  document.getElementById('rp-flow').classList.add('hidden');
  document.getElementById('rp-complete').classList.add('hidden');
  document.getElementById('rp-chat').innerHTML = '';
  updateRpProgress();
}

function closeRoleplay() {
  window.speechSynthesis.cancel();
  if (recognition) { try { recognition.stop(); } catch (_) {} }
  document.getElementById('rp-overlay').classList.add('hidden');
  document.body.style.overflow = '';
  rp = null;
  renderTalk();
}

function beginRoleplayFlow() {
  document.getElementById('rp-intro').classList.add('hidden');
  document.getElementById('rp-flow').classList.remove('hidden');
  rp.turnIdx = 0;
  rp.total = rp.data.turns.filter(t => t.role === 'you').length;
  rp.spoke = 0;
  nextTurn();
}

function updateRpProgress() {
  if (!rp) return;
  const total = rp.data.turns.length;
  const pct = Math.round((rp.turnIdx / total) * 100);
  document.getElementById('rp-progress-fill').style.width = pct + '%';
  document.getElementById('rp-progress-text').textContent = `${Math.min(rp.turnIdx + 1, total)} / ${total}`;
}

function addChatBubble(role, en, ja, extraClass = '') {
  const chat = document.getElementById('rp-chat');
  const isYou = role === 'you';
  const name = isYou ? 'あなた' : (rp.data.npcName || '相手');
  const bubble = document.createElement('div');
  bubble.className = `chat-row ${isYou ? 'you' : 'npc'} ${extraClass}`;
  bubble.innerHTML = `
    <div class="chat-bubble">
      <div class="chat-name">${name}</div>
      <div class="chat-en">${en}</div>
      <div class="chat-ja">${ja}</div>
    </div>`;
  chat.appendChild(bubble);
  chat.scrollTop = chat.scrollHeight;
  return bubble;
}

function nextTurn() {
  const turns = rp.data.turns;
  updateRpProgress();
  if (rp.turnIdx >= turns.length) { finishRoleplay(); return; }

  const turn = turns[rp.turnIdx];
  document.getElementById('rp-your-turn').classList.add('hidden');
  document.getElementById('rp-npc-turn').classList.add('hidden');

  if (turn.role === 'npc') {
    const bubble = addChatBubble('npc', turn.en, turn.ja);
    bubble.classList.add('speaking');
    speak(turn.en, 0.9, () => {
      bubble.classList.remove('speaking');
      const nextT = turns[rp.turnIdx + 1];
      rp.turnIdx++;
      if (nextT && nextT.role === 'you') {
        nextTurn();
      } else {
        document.getElementById('rp-npc-turn').classList.remove('hidden');
      }
    });
  } else {
    presentYourTurn(turn);
  }
}

function presentYourTurn(turn) {
  const panel = document.getElementById('rp-your-turn');
  panel.classList.remove('hidden');
  document.getElementById('rp-prompt-ja').textContent = turn.ja;
  document.getElementById('rp-hint').textContent = turn.en;
  document.getElementById('rp-hint').classList.add('hidden');
  document.getElementById('rp-recog-result').classList.add('hidden');
  document.getElementById('rp-recog-result').innerHTML = '';
  const btn = document.getElementById('rp-mic-btn');
  btn.classList.remove('recording', 'success');
  document.getElementById('rp-mic-label').textContent = 'タップして話す';
  document.getElementById('rp-mic-icon').textContent = '🎙️';
  const chat = document.getElementById('rp-chat');
  chat.scrollTop = chat.scrollHeight;
}

function recordYourTurn() {
  const turn = rp.data.turns[rp.turnIdx];
  recognition = initRecognition();
  if (!recognition) {
    showToast('音声認識が使えません。お手本を聞いてリピートしましょう。');
    speak(turn.en);
    document.getElementById('rp-hint').classList.remove('hidden');
    return;
  }
  const btn = document.getElementById('rp-mic-btn');
  btn.classList.add('recording');
  document.getElementById('rp-mic-label').textContent = '聞いています...';
  document.getElementById('rp-mic-icon').textContent = '🔴';

  let finalText = '';
  recognition.onresult = e => {
    finalText = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      finalText += e.results[i][0].transcript;
    }
  };
  recognition.onend = () => {
    btn.classList.remove('recording');
    document.getElementById('rp-mic-label').textContent = 'タップして話す';
    document.getElementById('rp-mic-icon').textContent = '🎙️';
    if (finalText.trim()) {
      evaluateYourTurn(turn, finalText.trim());
    } else {
      showToast('うまく聞き取れませんでした。もう一度どうぞ');
    }
  };
  recognition.onerror = (ev) => {
    btn.classList.remove('recording');
    document.getElementById('rp-mic-label').textContent = 'タップして話す';
    document.getElementById('rp-mic-icon').textContent = '🎙️';
    if (ev.error === 'not-allowed') showToast('マイクの許可が必要です');
  };
  try { recognition.start(); } catch (_) {}
}

function evaluateYourTurn(turn, spoken) {
  const targets = [turn.en, ...(turn.accept || [])];
  const score = bestScore(spoken, targets);
  const resultEl = document.getElementById('rp-recog-result');
  resultEl.classList.remove('hidden');

  if (score >= 60) {
    rp.spoke++;
    const hl = highlightWords(spoken, turn.en);
    resultEl.className = 'rp-recog-result success';
    resultEl.innerHTML = `<div class="recog-badge">🎉 ${score >= 85 ? 'Perfect!' : 'Good!'} ${score}%</div><div class="recog-said">${hl}</div>`;
    progress[`spoke_${rp.data.id}_${rp.turnIdx}`] = Date.now();
    saveProgress(progress);
    document.getElementById('rp-mic-btn').classList.add('success');
    if (navigator.vibrate) { try { navigator.vibrate(40); } catch (_) {} }
    addChatBubble('you', turn.en, turn.ja);
    setTimeout(() => { rp.turnIdx++; nextTurn(); }, 1200);
  } else {
    resultEl.className = 'rp-recog-result retry';
    resultEl.innerHTML = `<div class="recog-badge">もう少し！ ${score}%</div>
      <div class="recog-said">あなた: 「${spoken}」</div>
      <div class="recog-model">お手本: ${turn.en}</div>
      <div class="recog-hint-row">
        <button class="btn-ghost" id="retry-listen">🔊 お手本を聞く</button>
        <button class="btn-ghost" id="retry-pass">これで進む →</button>
      </div>`;
    document.getElementById('rp-hint').textContent = turn.en;
    document.getElementById('rp-hint').classList.remove('hidden');
    document.getElementById('retry-listen').addEventListener('click', () => speak(turn.en, 0.8));
    document.getElementById('retry-pass').addEventListener('click', () => {
      addChatBubble('you', turn.en, turn.ja);
      rp.turnIdx++;
      nextTurn();
    });
    speak(turn.en, 0.8);
  }
}

function finishRoleplay() {
  document.getElementById('rp-your-turn').classList.add('hidden');
  document.getElementById('rp-npc-turn').classList.add('hidden');
  document.getElementById('rp-flow').classList.add('hidden');
  document.getElementById('rp-complete').classList.remove('hidden');
  document.getElementById('rp-progress-fill').style.width = '100%';

  const isNewCanDo = unlockCanDo(rp.data.id);
  progress[`dialogue_${rp.data.id}`] = Date.now();
  saveProgress(progress);
  stampToday();
  const scenes = addSceneCount();
  const streak = getStreak();

  document.getElementById('rp-complete-msg').textContent = randomCelebration();
  document.getElementById('rp-cando-unlock').innerHTML = isNewCanDo
    ? `<div class="cando-unlock-badge">🏅 新しくできるようになった！</div>
       <div class="cando-unlock-text">${rp.data.icon} ${rp.data.canDo}</div>`
    : `<div class="cando-unlock-text">${rp.data.icon} ${rp.data.canDo}</div>`;
  document.getElementById('rp-complete-stats').innerHTML =
    `<div>🗣️ ${rp.spoke} / ${rp.total} フレーズを自分で発話</div>
     <div>🎯 通算 ${scenes} 回の会話達成${streak > 1 ? ` · ${streak}日連続` : ''}</div>`;

  fireConfetti();
  if (navigator.vibrate) { try { navigator.vibrate([60, 40, 80]); } catch (_) {} }
}

function fireConfetti() {
  const c = document.getElementById('confetti');
  c.innerHTML = '';
  const colors = ['#00d4ff', '#7c3aed', '#10b981', '#f59e0b', '#ef4444'];
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left = Math.random() * 100 + '%';
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = (Math.random() * 0.5) + 's';
    p.style.animationDuration = (1 + Math.random() * 1) + 's';
    c.appendChild(p);
  }
  setTimeout(() => { c.innerHTML = ''; }, 2500);
}

// ====== PHRASES (CHUNKS) TAB ======
function renderPhrasesTab() {
  renderCategoryList();
  renderPhraseList();
}

function initPhrasesTab() {
  document.getElementById('phrase-type-tabs').addEventListener('click', e => {
    const btn = e.target.closest('.mode-btn');
    if (!btn) return;
    currentPhraseType = btn.dataset.type;
    document.querySelectorAll('#phrase-type-tabs .mode-btn').forEach(b => b.classList.toggle('active', b.dataset.type === currentPhraseType));
    currentCategory = currentPhraseType === 'business' ? 'biz_meeting' : 'greetings';
    renderCategoryList();
    renderPhraseList();
  });
  document.getElementById('category-tabs').addEventListener('click', e => {
    const btn = e.target.closest('.cat-btn');
    if (!btn) return;
    currentCategory = btn.dataset.cat;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderPhraseList();
  });
}

function renderCategoryList() {
  const cats = currentPhraseType === 'business' ? BIZ_CATEGORIES : CATEGORIES;
  document.getElementById('category-tabs').innerHTML = cats.map(c => `
    <button class="cat-btn ${c.id === currentCategory ? 'active' : ''}" data-cat="${c.id}" style="--cat-color:${c.color}">
      <span>${c.icon}</span><span>${c.label}</span>
    </button>`).join('');
}

function renderPhraseList() {
  const all = currentPhraseType === 'business' ? BIZ_PHRASES : PHRASES;
  const phrases = all[currentCategory] || [];
  const container = document.getElementById('phrase-list');
  container.innerHTML = phrases.map((p, i) => {
    const favKey = `${currentCategory}_${i}`;
    const isFav = favorites.includes(favKey);
    return `
      <div class="phrase-card">
        <div class="phrase-main">
          <div class="phrase-en">${p.en}</div>
          <div class="phrase-ja">${p.ja}</div>
          <div class="phrase-example">${p.example}</div>
        </div>
        <div class="phrase-actions">
          <button class="icon-btn speak-btn" data-text="${p.en.replace(/"/g, '&quot;')}">🔊</button>
          <button class="icon-btn slow-btn" data-text="${p.en.replace(/"/g, '&quot;')}">🐢</button>
          <button class="icon-btn fav-btn ${isFav ? 'active' : ''}" data-key="${favKey}">${isFav ? '♥' : '♡'}</button>
        </div>
      </div>`;
  }).join('');
  container.querySelectorAll('.speak-btn').forEach(b => b.addEventListener('click', () => speak(b.dataset.text)));
  container.querySelectorAll('.slow-btn').forEach(b => b.addEventListener('click', () => speak(b.dataset.text, 0.6)));
  container.querySelectorAll('.fav-btn').forEach(b => b.addEventListener('click', () => toggleFav(b.dataset.key, b)));
}

function toggleFav(key, btn) {
  const i = favorites.indexOf(key);
  if (i >= 0) { favorites.splice(i, 1); btn.classList.remove('active'); btn.textContent = '♡'; }
  else { favorites.push(key); btn.classList.add('active'); btn.textContent = '♥'; }
  saveFavorites(favorites);
}

// ====== PROGRESS TAB ======
function renderProgress() {
  document.getElementById('scenes-num').textContent = getScenesCount();

  const cando = loadCanDo();
  const list = document.getElementById('cando-list');
  list.innerHTML = ROLEPLAYS.map(r => {
    const done = cando[r.id];
    return `
      <div class="cando-item ${done ? 'done' : ''}">
        <span class="cando-check">${done ? '✅' : '⬜'}</span>
        <span class="cando-icon">${r.icon}</span>
        <span class="cando-label">${r.canDo}</span>
      </div>`;
  }).join('');

  const streak = getStreak();
  const gs = document.getElementById('gs-text');
  if (streak <= 0) gs.textContent = 'さあ、今日から始めよう！';
  else if (streak === 1) gs.textContent = '今日が初日！この調子！';
  else gs.textContent = `${streak}日連続で話せています！`;
}

// ====== INIT ======
document.addEventListener('DOMContentLoaded', () => {
  // Preload voices list
  if ('speechSynthesis' in window) window.speechSynthesis.getVoices();

  // Unlock audio on first user interaction (required by iOS)
  document.addEventListener('touchstart', unlockAudio, { once: true });
  document.addEventListener('click', unlockAudio, { once: true });

  initTabs();
  initPhrasesTab();
  renderTalk();

  document.getElementById('hero-start-btn').addEventListener('click', () => {
    if (todaysRoleplay) startRoleplay(todaysRoleplay.id);
  });

  document.getElementById('rp-close-btn').addEventListener('click', closeRoleplay);
  document.getElementById('rp-intro-start').addEventListener('click', beginRoleplayFlow);
  document.getElementById('rp-mic-btn').addEventListener('click', recordYourTurn);
  document.getElementById('rp-hint-btn').addEventListener('click', () => {
    document.getElementById('rp-hint').classList.toggle('hidden');
  });
  document.getElementById('rp-listen-btn').addEventListener('click', () => {
    if (rp) speak(rp.data.turns[rp.turnIdx].en, 0.85);
  });
  document.getElementById('rp-skip-btn').addEventListener('click', () => {
    const turn = rp.data.turns[rp.turnIdx];
    addChatBubble('you', turn.en, turn.ja);
    rp.turnIdx++;
    nextTurn();
  });
  document.getElementById('rp-npc-replay').addEventListener('click', () => {
    const prev = rp.data.turns[rp.turnIdx - 1];
    if (prev) speak(prev.en, 0.9);
  });
  document.getElementById('rp-npc-next').addEventListener('click', () => {
    document.getElementById('rp-npc-turn').classList.add('hidden');
    nextTurn();
  });
  document.getElementById('rp-again-btn').addEventListener('click', () => { if (rp) startRoleplay(rp.data.id); });
  document.getElementById('rp-done-btn').addEventListener('click', closeRoleplay);

  document.getElementById('prog-reset-btn').addEventListener('click', () => {
    if (!confirm('学習データをすべてリセットしますか？')) return;
    [PROGRESS_KEY, FAVORITES_KEY, SRS_KEY, STAMPS_KEY, CANDO_KEY, SCENES_KEY].forEach(k => localStorage.removeItem(k));
    progress = {}; favorites = [];
    renderProgress(); renderTalk();
    showToast('リセットしました');
  });

  let deferred = null;
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault(); deferred = e;
    document.getElementById('install-banner').classList.remove('hidden');
  });
  document.getElementById('install-btn')?.addEventListener('click', async () => {
    if (!deferred) return;
    deferred.prompt(); await deferred.userChoice; deferred = null;
    document.getElementById('install-banner').classList.add('hidden');
  });
  document.getElementById('install-dismiss-btn')?.addEventListener('click', () => {
    document.getElementById('install-banner').classList.add('hidden');
  });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
