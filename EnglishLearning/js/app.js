'use strict';

// ---- State ----
let currentTab = 'conversation';
let currentDialogue = null;
let currentDialogueLine = 0;
let currentCategory = 'greetings';
let currentPhraseIndex = 0;
let progress = loadProgress();
let favorites = loadFavorites();
let isSpeaking = false;
let recognition = null;
let isRecognizing = false;
let practiceMode = false; // true = shadowing mode

// ---- Speech Synthesis ----
function speak(text, onEnd) {
  if (!('speechSynthesis' in window)) {
    showToast('このブラウザはTTS非対応です');
    return;
  }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  utter.rate = 0.85;
  utter.pitch = 1;

  // Prefer an English voice
  const voices = window.speechSynthesis.getVoices();
  const enVoice = voices.find(v => v.lang.startsWith('en') && !v.name.includes('Google'));
  if (enVoice) utter.voice = enVoice;

  utter.onend = () => {
    isSpeaking = false;
    if (onEnd) onEnd();
  };
  utter.onerror = () => { isSpeaking = false; };
  isSpeaking = true;
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
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ---- Tab Navigation ----
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      switchTab(tab);
    });
  });
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.tab-content').forEach(s => s.classList.toggle('active', s.id === `tab-${tab}`));
  if (tab === 'progress') renderProgress();
}

// ========================================
// CONVERSATION TAB
// ========================================
function initConversationTab() {
  renderDialogueList();
}

function renderDialogueList() {
  const container = document.getElementById('dialogue-list');
  container.innerHTML = DIALOGUES.map((d, i) => {
    const done = progress[`dialogue_${d.id}`] ? 'done' : '';
    return `
      <div class="dialogue-card ${done}" data-index="${i}" role="button" tabindex="0">
        <div class="dialogue-icon">${d.icon}</div>
        <div class="dialogue-info">
          <div class="dialogue-title">${d.title}</div>
          <div class="dialogue-meta">
            <span class="level-badge">${d.level}</span>
            <span class="line-count">${d.lines.length}行</span>
          </div>
        </div>
        ${done ? '<div class="done-badge">✓</div>' : ''}
      </div>`;
  }).join('');

  container.querySelectorAll('.dialogue-card').forEach(card => {
    const open = () => openDialogue(parseInt(card.dataset.index));
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });
  });
}

function openDialogue(index) {
  currentDialogue = DIALOGUES[index];
  currentDialogueLine = 0;
  practiceMode = false;
  document.getElementById('dialogue-list-view').classList.add('hidden');
  document.getElementById('dialogue-detail-view').classList.remove('hidden');
  renderDialogueDetail();
}

function closeDialogue() {
  window.speechSynthesis.cancel();
  if (recognition) { try { recognition.stop(); } catch(_) {} }
  document.getElementById('dialogue-list-view').classList.remove('hidden');
  document.getElementById('dialogue-detail-view').classList.add('hidden');
  renderDialogueList();
}

function renderDialogueDetail() {
  const d = currentDialogue;
  document.getElementById('dialogue-detail-title').textContent = `${d.icon} ${d.title}`;

  const linesEl = document.getElementById('dialogue-lines');
  linesEl.innerHTML = d.lines.map((line, i) => `
    <div class="dialogue-line ${i === currentDialogueLine ? 'active' : ''} ${i < currentDialogueLine ? 'past' : ''}" id="dline-${i}">
      <div class="line-speaker">${line.speaker}</div>
      <div class="line-en">${line.en}</div>
      <div class="line-ja">${line.ja}</div>
      <button class="line-speak-btn" data-text="${line.en.replace(/"/g, '&quot;')}" aria-label="発音を聞く">🔊</button>
    </div>
  `).join('');

  linesEl.querySelectorAll('.line-speak-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      speak(btn.dataset.text);
    });
  });

  updateDialogueNav();
  // Auto-scroll to current line
  setTimeout(() => {
    const el = document.getElementById(`dline-${currentDialogueLine}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);
}

function updateDialogueNav() {
  const d = currentDialogue;
  const isLast = currentDialogueLine >= d.lines.length - 1;
  const isFirst = currentDialogueLine === 0;

  document.getElementById('dl-prev-btn').disabled = isFirst;
  document.getElementById('dl-next-btn').textContent = isLast ? '完了 ✓' : '次へ →';
  document.getElementById('dl-progress').textContent = `${currentDialogueLine + 1} / ${d.lines.length}`;
}

function nextDialogueLine() {
  const d = currentDialogue;
  if (currentDialogueLine < d.lines.length - 1) {
    currentDialogueLine++;
    renderDialogueDetail();
    speak(d.lines[currentDialogueLine].en);
  } else {
    // Complete
    progress[`dialogue_${d.id}`] = Date.now();
    saveProgress(progress);
    showToast('会話練習完了！ 🎉');
    closeDialogue();
  }
}

function prevDialogueLine() {
  if (currentDialogueLine > 0) {
    currentDialogueLine--;
    renderDialogueDetail();
  }
}

function startShadowing() {
  const line = currentDialogue.lines[currentDialogueLine];
  speak(line.en, () => {
    startRecording(line.en);
  });
}

function startRecording(targetText) {
  recognition = initRecognition();
  if (!recognition) {
    showToast('音声認識非対応のブラウザです');
    return;
  }

  const btn = document.getElementById('dl-shadow-btn');
  btn.textContent = '🎙️ 聞いています...';
  btn.classList.add('recording');
  isRecognizing = true;

  let finalTranscript = '';
  recognition.onresult = (e) => {
    finalTranscript = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) finalTranscript += e.results[i][0].transcript;
    }
  };

  recognition.onend = () => {
    isRecognizing = false;
    btn.textContent = '🗣️ シャドーイング';
    btn.classList.remove('recording');
    if (finalTranscript) {
      evaluatePronunciation(targetText, finalTranscript);
    }
  };

  recognition.onerror = () => {
    isRecognizing = false;
    btn.textContent = '🗣️ シャドーイング';
    btn.classList.remove('recording');
    showToast('音声認識に失敗しました');
  };

  recognition.start();
}

function evaluatePronunciation(target, spoken) {
  const normalize = s => s.toLowerCase().replace(/[^a-z\s]/g, '').trim();
  const targetWords = normalize(target).split(/\s+/);
  const spokenWords = normalize(spoken).split(/\s+/);

  let matches = 0;
  targetWords.forEach(tw => {
    if (spokenWords.includes(tw)) matches++;
  });
  const score = Math.round((matches / targetWords.length) * 100);

  const el = document.getElementById('pronunciation-result');
  let msg = '';
  let cls = '';
  if (score >= 80) { msg = `素晴らしい！ ${score}% 一致 🎉`; cls = 'good'; }
  else if (score >= 50) { msg = `良い感じ！ ${score}% 一致 👍`; cls = 'ok'; }
  else { msg = `もう一度試してみましょう ${score}% 一致`; cls = 'retry'; }

  el.className = `pronunciation-result ${cls}`;
  el.innerHTML = `<div>${msg}</div><div class="spoken-text">「${spoken}」</div>`;
  el.classList.remove('hidden');
}

// ========================================
// PHRASES TAB
// ========================================
function initPhrasesTab() {
  renderCategoryList();
  renderPhraseList();

  document.getElementById('category-tabs').addEventListener('click', (e) => {
    const btn = e.target.closest('.cat-btn');
    if (!btn) return;
    currentCategory = btn.dataset.cat;
    currentPhraseIndex = 0;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderPhraseList();
  });
}

function renderCategoryList() {
  const el = document.getElementById('category-tabs');
  el.innerHTML = CATEGORIES.map(c => `
    <button class="cat-btn ${c.id === currentCategory ? 'active' : ''}" data-cat="${c.id}" style="--cat-color:${c.color}">
      <span>${c.icon}</span>
      <span>${c.label}</span>
    </button>
  `).join('');
}

function renderPhraseList() {
  const phrases = PHRASES[currentCategory] || [];
  const container = document.getElementById('phrase-list');
  container.innerHTML = phrases.map((p, i) => {
    const favKey = `${currentCategory}_${i}`;
    const isFav = favorites.includes(favKey);
    const practiced = progress[`phrase_${favKey}`] ? 'practiced' : '';
    return `
      <div class="phrase-card ${practiced}">
        <div class="phrase-main">
          <div class="phrase-en">${p.en}</div>
          <div class="phrase-ja">${p.ja}</div>
          <div class="phrase-example">${p.example}</div>
        </div>
        <div class="phrase-actions">
          <button class="icon-btn speak-btn" data-text="${p.en.replace(/"/g, '&quot;')}" aria-label="発音">🔊</button>
          <button class="icon-btn speak-slow-btn" data-text="${p.en.replace(/"/g, '&quot;')}" aria-label="ゆっくり発音">🐢</button>
          <button class="icon-btn fav-btn ${isFav ? 'active' : ''}" data-key="${favKey}" aria-label="お気に入り">♡</button>
        </div>
      </div>`;
  }).join('');

  container.querySelectorAll('.speak-btn').forEach(btn => {
    btn.addEventListener('click', () => speak(btn.dataset.text));
  });
  container.querySelectorAll('.speak-slow-btn').forEach(btn => {
    btn.addEventListener('click', () => speakSlow(btn.dataset.text, btn));
  });
  container.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', () => toggleFavorite(btn.dataset.key, btn));
  });
}

function speakSlow(text, btn) {
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  utter.rate = 0.6;
  utter.pitch = 1;
  const voices = window.speechSynthesis.getVoices();
  const enVoice = voices.find(v => v.lang.startsWith('en'));
  if (enVoice) utter.voice = enVoice;
  window.speechSynthesis.speak(utter);
  btn.classList.add('pulse');
  utter.onend = () => btn.classList.remove('pulse');
}

function toggleFavorite(key, btn) {
  const idx = favorites.indexOf(key);
  if (idx >= 0) {
    favorites.splice(idx, 1);
    btn.classList.remove('active');
    btn.textContent = '♡';
  } else {
    favorites.push(key);
    btn.classList.add('active');
    btn.textContent = '♥';
  }
  saveFavorites(favorites);
}

// ========================================
// SPEAKING PRACTICE TAB
// ========================================
let speakingPhraseIndex = 0;
let speakingCategory = 'greetings';
let speakingPhrases = [];

function initSpeakingTab() {
  loadSpeakingPhrase();

  document.getElementById('sp-listen-btn').addEventListener('click', () => {
    const phrase = speakingPhrases[speakingPhraseIndex];
    if (phrase) speak(phrase.en);
  });

  document.getElementById('sp-record-btn').addEventListener('click', () => {
    const phrase = speakingPhrases[speakingPhraseIndex];
    if (phrase) startSpeakingRecording(phrase.en);
  });

  document.getElementById('sp-next-btn').addEventListener('click', () => {
    speakingPhraseIndex = (speakingPhraseIndex + 1) % speakingPhrases.length;
    loadSpeakingPhrase();
  });

  document.getElementById('sp-prev-btn').addEventListener('click', () => {
    speakingPhraseIndex = (speakingPhraseIndex - 1 + speakingPhrases.length) % speakingPhrases.length;
    loadSpeakingPhrase();
  });

  document.getElementById('sp-category-select').addEventListener('change', (e) => {
    speakingCategory = e.target.value;
    speakingPhrases = PHRASES[speakingCategory] || [];
    speakingPhraseIndex = 0;
    loadSpeakingPhrase();
  });

  // Populate select
  const sel = document.getElementById('sp-category-select');
  sel.innerHTML = CATEGORIES.map(c => `<option value="${c.id}">${c.icon} ${c.label}</option>`).join('');
  speakingPhrases = PHRASES[speakingCategory];
}

function loadSpeakingPhrase() {
  const phrase = speakingPhrases[speakingPhraseIndex];
  if (!phrase) return;
  document.getElementById('sp-phrase-en').textContent = phrase.en;
  document.getElementById('sp-phrase-ja').textContent = phrase.ja;
  document.getElementById('sp-phrase-example').textContent = phrase.example;
  document.getElementById('sp-counter').textContent = `${speakingPhraseIndex + 1} / ${speakingPhrases.length}`;
  document.getElementById('sp-result').classList.add('hidden');
  document.getElementById('sp-result').textContent = '';
}

function startSpeakingRecording(targetText) {
  recognition = initRecognition();
  if (!recognition) {
    showToast('音声認識非対応のブラウザです');
    return;
  }

  const btn = document.getElementById('sp-record-btn');
  btn.textContent = '🎙️ 録音中...';
  btn.classList.add('recording');

  let finalTranscript = '';
  recognition.onresult = (e) => {
    finalTranscript = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) finalTranscript += e.results[i][0].transcript;
    }
  };

  recognition.onend = () => {
    btn.textContent = '🎙️ 発音してみる';
    btn.classList.remove('recording');
    if (finalTranscript) {
      showSpeakingResult(targetText, finalTranscript);
    }
  };

  recognition.onerror = () => {
    btn.textContent = '🎙️ 発音してみる';
    btn.classList.remove('recording');
    showToast('音声認識に失敗しました');
  };

  recognition.start();
}

function showSpeakingResult(target, spoken) {
  const normalize = s => s.toLowerCase().replace(/[^a-z\s]/g, '').trim();
  const targetWords = normalize(target).split(/\s+/);
  const spokenWords = normalize(spoken).split(/\s+/);

  let matches = 0;
  targetWords.forEach(tw => { if (spokenWords.includes(tw)) matches++; });
  const score = Math.round((matches / targetWords.length) * 100);

  const el = document.getElementById('sp-result');
  let icon = score >= 80 ? '🌟' : score >= 50 ? '👍' : '🔄';
  el.innerHTML = `${icon} ${score}%<br><small>「${spoken}」</small>`;
  el.className = `sp-result-box ${score >= 80 ? 'good' : score >= 50 ? 'ok' : 'retry'}`;
  el.classList.remove('hidden');

  // Mark as practiced
  const key = `phrase_${speakingCategory}_${speakingPhraseIndex}`;
  if (score >= 50) {
    progress[key] = Date.now();
    saveProgress(progress);
  }
}

// ========================================
// PROGRESS TAB
// ========================================
function renderProgress() {
  const totalDialogues = DIALOGUES.length;
  const doneDialogues = DIALOGUES.filter(d => progress[`dialogue_${d.id}`]).length;

  const totalPhrases = Object.values(PHRASES).flat().length;
  const practicedPhrases = Object.keys(progress).filter(k => k.startsWith('phrase_')).length;

  document.getElementById('prog-dialogues').textContent = `${doneDialogues} / ${totalDialogues}`;
  document.getElementById('prog-phrases').textContent = `${practicedPhrases} / ${totalPhrases}`;
  document.getElementById('prog-favorites').textContent = favorites.length;

  const pct = totalDialogues > 0 ? Math.round((doneDialogues / totalDialogues) * 100) : 0;
  document.getElementById('prog-bar-fill').style.width = `${pct}%`;
  document.getElementById('prog-bar-label').textContent = `${pct}%`;

  // Render completed dialogues
  const completedEl = document.getElementById('prog-completed-list');
  const completed = DIALOGUES.filter(d => progress[`dialogue_${d.id}`]);
  if (completed.length === 0) {
    completedEl.innerHTML = '<p class="empty-msg">まだ会話練習を完了していません</p>';
  } else {
    completedEl.innerHTML = completed.map(d => `
      <div class="completed-item">
        <span>${d.icon} ${d.title}</span>
        <span class="done-badge">✓</span>
      </div>`).join('');
  }

  // Favorite phrases
  const favEl = document.getElementById('prog-fav-list');
  if (favorites.length === 0) {
    favEl.innerHTML = '<p class="empty-msg">お気に入りのフレーズはまだありません</p>';
  } else {
    favEl.innerHTML = favorites.slice(0, 10).map(key => {
      const [cat, idx] = key.split('_');
      const phrase = PHRASES[cat]?.[parseInt(idx)];
      return phrase ? `
        <div class="fav-item">
          <div class="fav-en">${phrase.en}</div>
          <div class="fav-ja">${phrase.ja}</div>
          <button class="icon-btn" onclick="speak('${phrase.en.replace(/'/g, "\\'")}')">🔊</button>
        </div>` : '';
    }).join('');
  }
}

function resetProgress() {
  if (!confirm('学習データをリセットしますか？')) return;
  progress = {};
  favorites = [];
  saveProgress(progress);
  saveFavorites(favorites);
  renderProgress();
  showToast('リセットしました');
}

// ========================================
// INIT
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  // Load voices async
  window.speechSynthesis.getVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }

  initTabs();
  initConversationTab();
  initPhrasesTab();
  initSpeakingTab();

  // Dialogue nav buttons
  document.getElementById('dl-back-btn').addEventListener('click', closeDialogue);
  document.getElementById('dl-prev-btn').addEventListener('click', prevDialogueLine);
  document.getElementById('dl-next-btn').addEventListener('click', nextDialogueLine);
  document.getElementById('dl-shadow-btn').addEventListener('click', startShadowing);
  document.getElementById('dl-speak-current-btn').addEventListener('click', () => {
    if (currentDialogue) speak(currentDialogue.lines[currentDialogueLine].en);
  });

  document.getElementById('prog-reset-btn').addEventListener('click', resetProgress);

  // PWA install
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('install-banner').classList.remove('hidden');
  });
  document.getElementById('install-btn')?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') showToast('アプリをインストールしました！');
    deferredPrompt = null;
    document.getElementById('install-banner').classList.add('hidden');
  });
  document.getElementById('install-dismiss-btn')?.addEventListener('click', () => {
    document.getElementById('install-banner').classList.add('hidden');
  });
});

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
