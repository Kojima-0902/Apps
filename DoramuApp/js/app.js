'use strict';

// ---- State ----
let jaVoice = null;
let isSpeaking = false;

// ---- Speech Synthesis ----
// 元記事の Flutter 版は flutter_tts で ja-JP / pitch 1.0 / speechRate 0.55。
// flutter_tts の 0.55 は Android の標準速度あたりなので、Web Speech API では
// rate 1.0（標準）を対応値として使う。
const TTS_LANG = 'ja-JP';
const TTS_PITCH = 1.0;
const TTS_RATE = 1.0;

function pickJapaneseVoice() {
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;
    return voices.find(v => v.lang === 'ja-JP')
        || voices.find(v => v.lang.replace('_', '-').startsWith('ja'))
        || null;
}

function speak(text) {
    if (!('speechSynthesis' in window)) {
        showToast('このブラウザは音声読み上げに非対応です');
        return;
    }
    const body = text.trim();
    if (!body) {
        showToast('読み上げる文章を入力してください');
        return;
    }

    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(body);
    utter.lang = TTS_LANG;
    utter.pitch = TTS_PITCH;
    utter.rate = TTS_RATE;
    if (jaVoice) utter.voice = jaVoice;

    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => {
        setSpeaking(false);
        showToast('読み上げに失敗しました');
    };

    // iOS Safari は onstart が遅れることがあるので先に UI を切り替える
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
}

function stopSpeaking() {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
}

function setSpeaking(state) {
    isSpeaking = state;
    document.getElementById('stop-btn').disabled = !state;
    document.getElementById('app').classList.toggle('speaking', state);
}

// ---- Toast ----
let toastTimer = null;
function showToast(msg, duration = 2500) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

// ---- Serif Grid ----
function renderSerifs() {
    const grid = document.getElementById('serif-grid');
    grid.innerHTML = '';

    SERIFS.forEach(serif => {
        const btn = document.createElement('button');
        btn.className = 'serif-btn';
        btn.textContent = serif.label;
        btn.title = serif.text;
        btn.setAttribute('aria-label', `${serif.label}：${serif.text}`);
        btn.addEventListener('click', () => speak(serif.text));
        grid.appendChild(btn);
    });
}

// ---- Init ----
function init() {
    renderSerifs();

    document.getElementById('speak-btn').addEventListener('click', () => {
        speak(document.getElementById('text-input').value);
    });

    document.getElementById('stop-btn').addEventListener('click', stopSpeaking);

    document.getElementById('clear-btn').addEventListener('click', () => {
        const input = document.getElementById('text-input');
        input.value = '';
        input.focus();
    });

    if ('speechSynthesis' in window) {
        jaVoice = pickJapaneseVoice();
        // 一部ブラウザは getVoices() が非同期で埋まる
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = () => {
                jaVoice = pickJapaneseVoice() || jaVoice;
            };
        }
    } else {
        showToast('このブラウザは音声読み上げに非対応です');
    }
}

document.addEventListener('DOMContentLoaded', init);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
}
