'use strict';

// ---- State ----
let currentTab = 'home';
let currentDialogue = null;
let currentDialogueLine = 0;
let currentCategory = 'greetings';
let currentPhraseType = 'general'; // general | business
let convMode = 'general'; // general | business
let phraseMode = 'browse'; // browse | quiz | speaking
let progress = loadProgress();
let favorites = loadFavorites();
let srsData = loadSRS();
let recognition = null;

// Daily goal config
const DAILY_GOAL_PHRASES = 5;
const DAILY_GOAL_DIALOGUES = 1;

// ---- Speech Synthesis ----
function speak(text, rate = 0.85, onEnd) {
  if (!('speechSynthesis' in window)) { showToast('TTS非対応のブラウザです'); return; }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  utter.rate = rate;
  utter.pitch = 1;
  const voices = window.speechSynthesis.getVoices();
  const enVoice = voices.find(v => v.lang.startsWith('en') && !v.name.includes('Google')) || voices.find(v => v.lang.startsWith('en'));
  if (enVoice) utter.voice = enVoice;
  utter.onend = () => { if (onEnd) onEnd(); };
  window.speechSynthesis.speak(utter);
}

// ---- Speech Recognition ----
function initRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  const r = new SR();
  r.lang = 'en-US';
  r.continuous = false;
  r.interimResults = true;
  return r;
}

// ---- Toast ----
function showToast(msg, duration = 2500) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

// ---- Score pronunciation ----
function scoreMatch(target, spoken) {
  const n = s => s.toLowerCase().replace(/[^a-z\s]/g, '').trim();
  const tw = n(target).split(/\s+/);
  const sw = n(spoken).split(/\s+/);
  let m = 0;
  tw.forEach(w => { if (sw.includes(w)) m++; });
  return Math.round((m / tw.length) * 100);
}

// ========================================
// TAB NAVIGATION
// ========================================
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.tab-content').forEach(s => s.classList.toggle('active', s.id === `tab-${tab}`));
  if (tab === 'home') renderHome();
  if (tab === 'progress') renderProgress();
}

// ========================================
// HOME TAB
// ========================================
function renderHome() {
  renderStreak();
  renderStampCard();
  renderDailyGoal();
  renderSRSBanner();
  renderMilestones();
}

function renderStreak() {
  const streak = getStreak();
  document.getElementById('streak-count').textContent = streak;
  const stamps = loadStamps().sort();
  let best = 0, cur = 0;
  let prev = null;
  stamps.forEach(s => {
    if (prev) {
      const diff = (new Date(s) - new Date(prev)) / 86400000;
      cur = diff === 1 ? cur + 1 : 1;
    } else { cur = 1; }
    if (cur > best) best = cur;
    prev = s;
  });
  document.getElementById('streak-best').textContent = best;
}

function renderStampCard() {
  const stamps = loadStamps();
  const row = document.getElementById('stamp-row');
  const days = ['月', '火', '水', '木', '金', '土', '日'];
  const today = new Date();
  // Show Mon-Sun of current week
  const dow = (today.getDay() + 6) % 7; // 0=Mon
  row.innerHTML = '';
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - dow + i);
    const s = d.toISOString().slice(0, 10);
    const stamped = stamps.includes(s);
    const isToday = s === todayStr();
    const el = document.createElement('div');
    el.className = `stamp-day ${stamped ? 'stamped' : ''} ${isToday ? 'today' : ''}`;
    el.innerHTML = `<div class="stamp-label">${days[i]}</div><div class="stamp-circle">${stamped ? '★' : ''}</div>`;
    row.appendChild(el);
  }
}

function renderDailyGoal() {
  const today = todayStr();
  const practicedToday = Object.keys(progress).filter(k => {
    const v = progress[k];
    return typeof v === 'number' && new Date(v).toISOString().slice(0, 10) === today && k.startsWith('phrase_');
  }).length;
  const dialoguesToday = Object.keys(progress).filter(k => {
    const v = progress[k];
    return typeof v === 'number' && new Date(v).toISOString().slice(0, 10) === today && k.startsWith('dialogue_');
  }).length;

  const p1 = Math.min(practicedToday, DAILY_GOAL_PHRASES);
  const p2 = Math.min(dialoguesToday, DAILY_GOAL_DIALOGUES);
  const total = DAILY_GOAL_PHRASES + DAILY_GOAL_DIALOGUES;
  const done = p1 + p2;
  const pct = Math.round((done / total) * 100);

  document.getElementById('goal-pct').textContent = pct + '%';
  document.getElementById('goal-bar-fill').style.width = pct + '%';

  const el = document.getElementById('goal-items');
  el.innerHTML = `
    <div class="goal-item">
      <div class="goal-item-label">フレーズ練習</div>
      <div class="goal-dots">${Array.from({length: DAILY_GOAL_PHRASES}, (_, i) => `<span class="goal-dot ${i < p1 ? 'filled' : ''}"></span>`).join('')}</div>
      <div class="goal-num">${p1}/${DAILY_GOAL_PHRASES}</div>
    </div>
    <div class="goal-item">
      <div class="goal-item-label">会話練習</div>
      <div class="goal-dots">${Array.from({length: DAILY_GOAL_DIALOGUES}, (_, i) => `<span class="goal-dot ${i < p2 ? 'filled' : ''}"></span>`).join('')}</div>
      <div class="goal-num">${p2}/${DAILY_GOAL_DIALOGUES}</div>
    </div>`;

  if (pct === 100) {
    stampToday();
    renderStampCard();
    renderStreak();
  }
}

function renderSRSBanner() {
  const due = getDueCards();
  document.getElementById('srs-due-count').textContent = due.length;
  document.getElementById('srs-banner').classList.toggle('no-due', due.length === 0);
}

const MILESTONES = [
  { days: 3, label: '3日連続！', icon: '🌱', msg: '習慣の芽が出てきました！' },
  { days: 7, label: '1週間！', icon: '🔥', msg: '1週間続けました！素晴らしい！' },
  { days: 14, label: '2週間！', icon: '⭐', msg: '2週間の継続！本当にすごい！' },
  { days: 30, label: '1ヶ月！', icon: '🏆', msg: '1ヶ月達成！あなたは本物の学習者です！' },
  { days: 60, label: '2ヶ月！', icon: '💎', msg: '2ヶ月！英語力が確実に伸びています！' },
];

function renderMilestones() {
  const streak = getStreak();
  const el = document.getElementById('milestone-list');
  el.innerHTML = MILESTONES.map(m => {
    const unlocked = streak >= m.days;
    return `
      <div class="milestone-item ${unlocked ? 'unlocked' : 'locked'}">
        <div class="milestone-icon">${unlocked ? m.icon : '🔒'}</div>
        <div class="milestone-info">
          <div class="milestone-label">${m.label}</div>
          <div class="milestone-msg">${unlocked ? m.msg : `あと${m.days - streak}日`}</div>
        </div>
        ${unlocked ? '<div class="milestone-badge">達成</div>' : ''}
      </div>`;
  }).join('');
}

// ========================================
// SRS OVERLAY
// ========================================
let srsQueue = [];
let srsIdx = 0;
let srsCorrect = 0;

function openSRSOverlay() {
  srsQueue = getDueCards();
  if (srsQueue.length === 0) { showToast('今日の復習はありません！'); return; }
  srsIdx = 0;
  srsCorrect = 0;
  document.getElementById('srs-overlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  renderSRSCard();
}

function closeSRSOverlay() {
  document.getElementById('srs-overlay').classList.add('hidden');
  document.body.style.overflow = '';
  renderHome();
}

function renderSRSCard() {
  const card = srsQueue[srsIdx];
  const total = srsQueue.length;
  document.getElementById('srs-overlay-counter').textContent = `${srsIdx + 1} / ${total}`;
  document.getElementById('srs-progress-fill').style.width = `${(srsIdx / total) * 100}%`;
  document.getElementById('srs-card-ja').textContent = card.phrase.ja;
  document.getElementById('srs-card-en').textContent = card.phrase.en;
  document.getElementById('srs-card-example').textContent = card.phrase.example || '';
  document.getElementById('srs-card-answer').classList.add('hidden');
  document.getElementById('srs-reveal-btn').classList.remove('hidden');
  document.getElementById('srs-rating').classList.add('hidden');
  document.getElementById('srs-complete').classList.add('hidden');
}

function revealSRSAnswer() {
  document.getElementById('srs-card-answer').classList.remove('hidden');
  document.getElementById('srs-reveal-btn').classList.add('hidden');
  document.getElementById('srs-rating').classList.remove('hidden');
  speak(srsQueue[srsIdx].phrase.en);
}

function rateSRSCard(score) {
  const card = srsQueue[srsIdx];
  const correct = score >= 2;
  if (correct) srsCorrect++;
  updateSRSCard(card.key, correct);
  stampToday();

  // Track phrase practice
  progress[`phrase_${card.key}`] = Date.now();
  saveProgress(progress);

  srsIdx++;
  if (srsIdx >= srsQueue.length) {
    showSRSComplete();
  } else {
    renderSRSCard();
  }
}

function showSRSComplete() {
  document.getElementById('srs-card-ja').textContent = '';
  document.getElementById('srs-card-answer').classList.add('hidden');
  document.getElementById('srs-rating').classList.add('hidden');
  document.getElementById('srs-reveal-btn').classList.add('hidden');
  document.getElementById('srs-progress-fill').style.width = '100%';
  const total = srsQueue.length;
  document.getElementById('srs-complete-msg').textContent = `${total}件中${srsCorrect}件正解！ 🎯`;
  document.getElementById('srs-complete').classList.remove('hidden');
}

// ========================================
// CONVERSATION TAB
// ========================================
function initConversationTab() {
  document.getElementById('conv-mode-tabs').addEventListener('click', e => {
    const btn = e.target.closest('.mode-btn');
    if (!btn) return;
    convMode = btn.dataset.mode;
    document.querySelectorAll('#conv-mode-tabs .mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === convMode));
    renderDialogueList();
  });
  renderDialogueList();
}

function renderDialogueList() {
  const isBiz = convMode === 'business';
  const list = isBiz
    ? DIALOGUES.filter(d => d.isBusiness).concat(BIZ_DIALOGUES)
    : DIALOGUES.filter(d => !d.isBusiness);
  const container = document.getElementById('dialogue-list');

  if (list.length === 0) {
    container.innerHTML = '<p class="empty-msg">会話シナリオを準備中です</p>';
    return;
  }

  container.innerHTML = list.map((d, i) => {
    const done = progress[`dialogue_${d.id}`] ? 'done' : '';
    return `
      <div class="dialogue-card ${done}" data-id="${d.id}" role="button" tabindex="0">
        <div class="dialogue-icon">${d.icon}</div>
        <div class="dialogue-info">
          <div class="dialogue-title">${d.title}</div>
          <div class="dialogue-meta">
            <span class="level-badge ${d.isBusiness ? 'biz' : ''}">${d.level}</span>
            <span class="line-count">${d.lines.length}行</span>
          </div>
        </div>
        ${done ? '<div class="done-badge">✓</div>' : ''}
      </div>`;
  }).join('');

  container.querySelectorAll('.dialogue-card').forEach(card => {
    const open = () => {
      const all = [...DIALOGUES, ...BIZ_DIALOGUES];
      const d = all.find(x => x.id === card.dataset.id);
      if (d) openDialogue(d);
    };
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });
  });
}

function openDialogue(d) {
  currentDialogue = d;
  currentDialogueLine = 0;
  document.getElementById('dialogue-list-view').classList.add('hidden');
  document.getElementById('dialogue-detail-view').classList.remove('hidden');
  renderDialogueDetail();
}

function closeDialogue() {
  window.speechSynthesis.cancel();
  document.getElementById('dialogue-list-view').classList.remove('hidden');
  document.getElementById('dialogue-detail-view').classList.add('hidden');
  renderDialogueList();
}

function renderDialogueDetail() {
  const d = currentDialogue;
  document.getElementById('dialogue-detail-title').textContent = `${d.icon} ${d.title}`;
  document.getElementById('pronunciation-result').classList.add('hidden');

  const linesEl = document.getElementById('dialogue-lines');
  linesEl.innerHTML = d.lines.map((line, i) => `
    <div class="dialogue-line ${i === currentDialogueLine ? 'active' : ''} ${i < currentDialogueLine ? 'past' : ''}" id="dline-${i}">
      <div class="line-speaker">${line.speaker}</div>
      <div class="line-en">${line.en}</div>
      <div class="line-ja">${line.ja}</div>
      <button class="line-speak-btn" data-text="${line.en.replace(/"/g, '&quot;')}" aria-label="発音">🔊</button>
    </div>`).join('');

  linesEl.querySelectorAll('.line-speak-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); speak(btn.dataset.text); });
  });

  document.getElementById('dl-prev-btn').disabled = currentDialogueLine === 0;
  const isLast = currentDialogueLine >= d.lines.length - 1;
  document.getElementById('dl-next-btn').textContent = isLast ? '完了 ✓' : '次へ →';
  document.getElementById('dl-progress').textContent = `${currentDialogueLine + 1} / ${d.lines.length}`;

  setTimeout(() => {
    document.getElementById(`dline-${currentDialogueLine}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);
}

function nextDialogueLine() {
  const d = currentDialogue;
  if (currentDialogueLine < d.lines.length - 1) {
    currentDialogueLine++;
    renderDialogueDetail();
    speak(d.lines[currentDialogueLine].en);
  } else {
    progress[`dialogue_${d.id}`] = Date.now();
    saveProgress(progress);
    stampToday();
    showToast('会話練習完了！ 🎉');
    closeDialogue();
    renderDailyGoal();
  }
}

function startShadowing() {
  const line = currentDialogue.lines[currentDialogueLine];
  speak(line.en, 0.85, () => startDialogueRecording(line.en));
}

function startDialogueRecording(target) {
  recognition = initRecognition();
  if (!recognition) { showToast('音声認識非対応のブラウザです'); return; }
  const btn = document.getElementById('dl-shadow-btn');
  btn.textContent = '🎙️ 聞いています...';
  btn.classList.add('recording');
  let final = '';
  recognition.onresult = e => {
    final = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) final += e.results[i][0].transcript;
    }
  };
  recognition.onend = () => {
    btn.textContent = '🗣️ シャドーイング';
    btn.classList.remove('recording');
    if (final) {
      const score = scoreMatch(target, final);
      const el = document.getElementById('pronunciation-result');
      const cls = score >= 80 ? 'good' : score >= 50 ? 'ok' : 'retry';
      el.className = `pronunciation-result ${cls}`;
      el.innerHTML = `${score >= 80 ? '🌟' : score >= 50 ? '👍' : '🔄'} ${score}%<br><small>「${final}」</small>`;
      el.classList.remove('hidden');
    }
  };
  recognition.onerror = () => { btn.textContent = '🗣️ シャドーイング'; btn.classList.remove('recording'); };
  recognition.start();
}

// ========================================
// PHRASES TAB
// ========================================
let speakingCatId = 'greetings';
let speakingIdx = 0;

function initPhrasesTab() {
  // Mode tabs
  document.getElementById('phrase-mode-tabs').addEventListener('click', e => {
    const btn = e.target.closest('.mode-btn');
    if (!btn) return;
    phraseMode = btn.dataset.mode;
    document.querySelectorAll('#phrase-mode-tabs .mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === phraseMode));
    document.getElementById('phrase-browse-view').classList.toggle('hidden', phraseMode !== 'browse');
    document.getElementById('phrase-quiz-view').classList.toggle('hidden', phraseMode !== 'quiz');
    document.getElementById('phrase-speaking-view').classList.toggle('hidden', phraseMode !== 'speaking');
    if (phraseMode === 'quiz') startQuiz();
  });

  // Type tabs (general / business)
  document.getElementById('phrase-type-tabs').addEventListener('click', e => {
    const btn = e.target.closest('.mode-btn');
    if (!btn) return;
    currentPhraseType = btn.dataset.type;
    document.querySelectorAll('#phrase-type-tabs .mode-btn').forEach(b => b.classList.toggle('active', b.dataset.type === currentPhraseType));
    renderCategoryList();
    currentCategory = currentPhraseType === 'business' ? 'biz_meeting' : 'greetings';
    renderPhraseList();
  });

  // Category tabs
  document.getElementById('category-tabs').addEventListener('click', e => {
    const btn = e.target.closest('.cat-btn');
    if (!btn) return;
    currentCategory = btn.dataset.cat;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderPhraseList();
  });

  renderCategoryList();
  renderPhraseList();
  initSpeakingMode();
}

function renderCategoryList() {
  const cats = currentPhraseType === 'business' ? BIZ_CATEGORIES : CATEGORIES;
  const el = document.getElementById('category-tabs');
  el.innerHTML = cats.map(c => `
    <button class="cat-btn ${c.id === currentCategory ? 'active' : ''}" data-cat="${c.id}" style="--cat-color:${c.color}">
      <span>${c.icon}</span><span>${c.label}</span>
    </button>`).join('');
}

function renderPhraseList() {
  const allPhrases = currentPhraseType === 'business' ? BIZ_PHRASES : PHRASES;
  const phrases = allPhrases[currentCategory] || [];
  const container = document.getElementById('phrase-list');
  container.innerHTML = phrases.map((p, i) => {
    const favKey = `${currentCategory}_${i}`;
    const isFav = favorites.includes(favKey);
    const srsCard = getSRSCard(favKey);
    const levelLabel = ['NEW', '学習中', '若い', '成熟', '習得'][srsCard.level] || 'NEW';
    const levelClass = ['srs-new', 'srs-learning', 'srs-young', 'srs-mature', 'srs-mastered'][srsCard.level] || 'srs-new';
    return `
      <div class="phrase-card">
        <div class="phrase-main">
          <div class="phrase-header">
            <div class="phrase-en">${p.en}</div>
            <span class="srs-level-badge ${levelClass}">${levelLabel}</span>
          </div>
          <div class="phrase-ja">${p.ja}</div>
          <div class="phrase-example">${p.example}</div>
        </div>
        <div class="phrase-actions">
          <button class="icon-btn speak-btn" data-text="${p.en.replace(/"/g, '&quot;')}" aria-label="発音">🔊</button>
          <button class="icon-btn speak-slow-btn" data-text="${p.en.replace(/"/g, '&quot;')}" aria-label="ゆっくり">🐢</button>
          <button class="icon-btn fav-btn ${isFav ? 'active' : ''}" data-key="${favKey}" aria-label="お気に入り">${isFav ? '♥' : '♡'}</button>
        </div>
      </div>`;
  }).join('');

  container.querySelectorAll('.speak-btn').forEach(btn => btn.addEventListener('click', () => speak(btn.dataset.text)));
  container.querySelectorAll('.speak-slow-btn').forEach(btn => btn.addEventListener('click', () => speak(btn.dataset.text, 0.6)));
  container.querySelectorAll('.fav-btn').forEach(btn => btn.addEventListener('click', () => toggleFavorite(btn.dataset.key, btn)));
}

function toggleFavorite(key, btn) {
  const idx = favorites.indexOf(key);
  if (idx >= 0) { favorites.splice(idx, 1); btn.classList.remove('active'); btn.textContent = '♡'; }
  else { favorites.push(key); btn.classList.add('active'); btn.textContent = '♥'; }
  saveFavorites(favorites);
}

// ========================================
// QUIZ MODE
// ========================================
let quizQueue = [];
let quizIdx = 0;

function startQuiz() {
  // Build queue from all phrases, prioritize SRS due
  const due = getDueCards();
  const all = [];
  [...CATEGORIES, ...BIZ_CATEGORIES].forEach(cat => {
    const phrases = (PHRASES[cat.id] || BIZ_PHRASES[cat.id] || []);
    phrases.forEach((p, i) => all.push({ key: `${cat.id}_${i}`, phrase: p }));
  });
  // Mix: due first, then shuffle rest
  const dueKeys = new Set(due.map(d => d.key));
  const rest = all.filter(x => !dueKeys.has(x.key)).sort(() => Math.random() - 0.5);
  quizQueue = [...due.map(d => ({ key: d.key, phrase: d.phrase })), ...rest].slice(0, 10);
  quizIdx = 0;
  renderQuizCard();
}

function renderQuizCard() {
  if (quizIdx >= quizQueue.length) {
    showToast('クイズ完了！ 🎉');
    document.getElementById('phrase-mode-tabs').querySelector('[data-mode="browse"]').click();
    return;
  }
  const item = quizQueue[quizIdx];
  document.getElementById('quiz-counter').textContent = `${quizIdx + 1} / ${quizQueue.length}`;
  document.getElementById('quiz-ja').textContent = item.phrase.ja;
  document.getElementById('quiz-answer').textContent = item.phrase.en;
  document.getElementById('quiz-example').textContent = item.phrase.example || '';
  document.getElementById('quiz-answer').classList.add('hidden');
  document.getElementById('quiz-example').classList.add('hidden');
  document.getElementById('quiz-reveal-btn').classList.remove('hidden');
  document.getElementById('quiz-rating').classList.add('hidden');
}

function revealQuizAnswer() {
  const item = quizQueue[quizIdx];
  document.getElementById('quiz-answer').classList.remove('hidden');
  document.getElementById('quiz-example').classList.remove('hidden');
  document.getElementById('quiz-reveal-btn').classList.add('hidden');
  document.getElementById('quiz-rating').classList.remove('hidden');
  speak(item.phrase.en);
}

function rateQuizCard(score) {
  const item = quizQueue[quizIdx];
  updateSRSCard(item.key, score >= 2);
  progress[`phrase_${item.key}`] = Date.now();
  saveProgress(progress);
  stampToday();
  quizIdx++;
  renderDailyGoal();
  renderQuizCard();
}

// ========================================
// SPEAKING MODE
// ========================================
function initSpeakingMode() {
  const allCats = [...CATEGORIES, ...BIZ_CATEGORIES];
  const sel = document.getElementById('sp-category-select');
  sel.innerHTML = allCats.map(c => `<option value="${c.id}">${c.icon} ${c.label}</option>`).join('');
  sel.addEventListener('change', () => { speakingCatId = sel.value; speakingIdx = 0; loadSpeakingPhrase(); });

  document.getElementById('sp-listen-btn').addEventListener('click', () => {
    const p = getCurrentSpeakingPhrase();
    if (p) speak(p.en);
  });
  document.getElementById('sp-listen-slow-btn').addEventListener('click', () => {
    const p = getCurrentSpeakingPhrase();
    if (p) speak(p.en, 0.6);
  });
  document.getElementById('sp-record-btn').addEventListener('click', () => {
    const p = getCurrentSpeakingPhrase();
    if (p) startSpeakingRecording(p.en);
  });
  document.getElementById('sp-next-btn').addEventListener('click', () => {
    const phrases = getSpeakingPhrases();
    speakingIdx = (speakingIdx + 1) % phrases.length;
    loadSpeakingPhrase();
  });
  document.getElementById('sp-prev-btn').addEventListener('click', () => {
    const phrases = getSpeakingPhrases();
    speakingIdx = (speakingIdx - 1 + phrases.length) % phrases.length;
    loadSpeakingPhrase();
  });
  loadSpeakingPhrase();
}

function getSpeakingPhrases() {
  return PHRASES[speakingCatId] || BIZ_PHRASES[speakingCatId] || [];
}

function getCurrentSpeakingPhrase() {
  return getSpeakingPhrases()[speakingIdx];
}

function loadSpeakingPhrase() {
  const phrases = getSpeakingPhrases();
  const p = phrases[speakingIdx];
  if (!p) return;
  document.getElementById('sp-phrase-en').textContent = p.en;
  document.getElementById('sp-phrase-ja').textContent = p.ja;
  document.getElementById('sp-phrase-example').textContent = p.example || '';
  document.getElementById('sp-counter').textContent = `${speakingIdx + 1} / ${phrases.length}`;
  document.getElementById('sp-result').classList.add('hidden');
}

function startSpeakingRecording(target) {
  recognition = initRecognition();
  if (!recognition) { showToast('音声認識非対応のブラウザです'); return; }
  const btn = document.getElementById('sp-record-btn');
  btn.textContent = '🎙️ 録音中...';
  btn.classList.add('recording');
  let final = '';
  recognition.onresult = e => {
    final = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) final += e.results[i][0].transcript;
    }
  };
  recognition.onend = () => {
    btn.textContent = '🎙️ 発音';
    btn.classList.remove('recording');
    if (final) {
      const score = scoreMatch(target, final);
      const el = document.getElementById('sp-result');
      const cls = score >= 80 ? 'good' : score >= 50 ? 'ok' : 'retry';
      el.innerHTML = `${score >= 80 ? '🌟' : score >= 50 ? '👍' : '🔄'} ${score}%<br><small>「${final}」</small>`;
      el.className = `sp-result-box ${cls}`;
      el.classList.remove('hidden');
      if (score >= 50) {
        const key = `phrase_${speakingCatId}_${speakingIdx}`;
        progress[key] = Date.now();
        saveProgress(progress);
        updateSRSCard(`${speakingCatId}_${speakingIdx}`, score >= 80);
        stampToday();
        renderDailyGoal();
      }
    }
  };
  recognition.onerror = () => { btn.textContent = '🎙️ 発音'; btn.classList.remove('recording'); };
  recognition.start();
}

// ========================================
// PROGRESS TAB
// ========================================
function renderProgress() {
  const allDialogues = [...DIALOGUES, ...BIZ_DIALOGUES];
  const doneD = allDialogues.filter(d => progress[`dialogue_${d.id}`]).length;
  document.getElementById('prog-dialogues').textContent = `${doneD}/${allDialogues.length}`;
  document.getElementById('prog-streak').textContent = getStreak();

  const srs = loadSRS();
  const mastered = Object.values(srs).filter(c => c.level >= 4).length;
  document.getElementById('prog-mastered').textContent = mastered;

  const pct = allDialogues.length > 0 ? Math.round((doneD / allDialogues.length) * 100) : 0;
  document.getElementById('prog-bar-fill').style.width = pct + '%';
  document.getElementById('prog-bar-label').textContent = pct + '%';

  // SRS breakdown
  const counts = [0, 0, 0, 0, 0];
  Object.values(srs).forEach(c => { if (c.level >= 0 && c.level <= 4) counts[c.level]++; });
  const labels = ['NEW', '学習中', '若い', '成熟', '習得'];
  const colors = ['#64748b', '#f59e0b', '#10b981', '#00d4ff', '#7c3aed'];
  const total = Object.keys(srs).length || 1;
  document.getElementById('srs-breakdown-bars').innerHTML = labels.map((l, i) => `
    <div class="srs-bar-row">
      <div class="srs-bar-label ${['srs-new','srs-learning','srs-young','srs-mature','srs-mastered'][i]}">${l}</div>
      <div class="srs-bar-track"><div class="srs-bar-fill" style="width:${Math.round(counts[i]/total*100)}%;background:${colors[i]}"></div></div>
      <div class="srs-bar-count">${counts[i]}</div>
    </div>`).join('');

  const completedEl = document.getElementById('prog-completed-list');
  const completed = allDialogues.filter(d => progress[`dialogue_${d.id}`]);
  completedEl.innerHTML = completed.length === 0
    ? '<p class="empty-msg">まだ完了した会話はありません</p>'
    : completed.map(d => `
        <div class="completed-item">
          <span>${d.icon} ${d.title}</span>
          <div class="done-badge">✓</div>
        </div>`).join('');

  const favEl = document.getElementById('prog-fav-list');
  favEl.innerHTML = favorites.length === 0
    ? '<p class="empty-msg">お気に入りフレーズはまだありません</p>'
    : favorites.slice(0, 10).map(key => {
        const [cat, idx] = key.split('_');
        const allP = { ...PHRASES, ...BIZ_PHRASES };
        const p = allP[cat]?.[parseInt(idx)];
        return p ? `
          <div class="fav-item">
            <div class="fav-en">${p.en}</div>
            <div class="fav-ja">${p.ja}</div>
            <button class="icon-btn" onclick="speak('${p.en.replace(/'/g, "\\'")}')">🔊</button>
          </div>` : '';
      }).join('');
}

// ========================================
// INIT
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  window.speechSynthesis.getVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }

  initTabs();
  initConversationTab();
  initPhrasesTab();
  renderHome();

  // Dialogue controls
  document.getElementById('dl-back-btn').addEventListener('click', closeDialogue);
  document.getElementById('dl-prev-btn').addEventListener('click', () => {
    if (currentDialogueLine > 0) { currentDialogueLine--; renderDialogueDetail(); }
  });
  document.getElementById('dl-next-btn').addEventListener('click', nextDialogueLine);
  document.getElementById('dl-speak-current-btn').addEventListener('click', () => {
    if (currentDialogue) speak(currentDialogue.lines[currentDialogueLine].en);
  });
  document.getElementById('dl-shadow-btn').addEventListener('click', startShadowing);

  // Quiz controls
  document.getElementById('quiz-reveal-btn').addEventListener('click', revealQuizAnswer);
  document.getElementById('quiz-exit-btn').addEventListener('click', () => {
    document.getElementById('phrase-mode-tabs').querySelector('[data-mode="browse"]').click();
  });
  document.getElementById('quiz-rating').addEventListener('click', e => {
    const btn = e.target.closest('.rating-btn');
    if (btn) rateQuizCard(parseInt(btn.dataset.score));
  });

  // SRS overlay
  document.getElementById('srs-start-btn').addEventListener('click', openSRSOverlay);
  document.getElementById('srs-close-btn').addEventListener('click', closeSRSOverlay);
  document.getElementById('srs-done-btn').addEventListener('click', closeSRSOverlay);
  document.getElementById('srs-reveal-btn').addEventListener('click', revealSRSAnswer);
  document.getElementById('srs-rating').addEventListener('click', e => {
    const btn = e.target.closest('.rating-btn');
    if (btn) rateSRSCard(parseInt(btn.dataset.score));
  });

  // Progress reset
  document.getElementById('prog-reset-btn').addEventListener('click', () => {
    if (!confirm('学習データをリセットしますか？')) return;
    progress = {}; favorites = []; saveProgress(progress); saveFavorites(favorites);
    localStorage.removeItem(SRS_KEY); localStorage.removeItem(STAMPS_KEY);
    renderProgress(); renderHome();
    showToast('リセットしました');
  });

  // PWA install
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault(); deferredPrompt = e;
    document.getElementById('install-banner').classList.remove('hidden');
  });
  document.getElementById('install-btn')?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    document.getElementById('install-banner').classList.add('hidden');
  });
  document.getElementById('install-dismiss-btn')?.addEventListener('click', () => {
    document.getElementById('install-banner').classList.add('hidden');
  });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
