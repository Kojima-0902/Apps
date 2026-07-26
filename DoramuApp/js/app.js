'use strict';

// ---- Speech settings ----
// 元記事の Flutter 版は flutter_tts で ja-JP / pitch 1.0 / speechRate 0.55。
// flutter_tts の速度は 0.0（最遅）〜1.0（最速）で、3.2.0 以降は Android も
// iOS/web と同じ「0.5 = 標準」に揃えられている。つまり 0.55 は標準の約1.1倍。
// Web Speech API は rate 1.0 が標準なので、対応値として 1.1 を既定にする。
const TTS_LANG = 'ja-JP';
const DEFAULT_RATE = 1.1;
const DEFAULT_PITCH = 1.0;

const STORE_KEY = 'doramu.tts';

// ---- State ----
let voices = [];
let settings = loadSettings();

function loadSettings() {
    const fallback = { voiceURI: '', rate: DEFAULT_RATE, pitch: DEFAULT_PITCH };
    try {
        const saved = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
        return {
            voiceURI: typeof saved.voiceURI === 'string' ? saved.voiceURI : fallback.voiceURI,
            rate: Number.isFinite(saved.rate) ? saved.rate : fallback.rate,
            pitch: Number.isFinite(saved.pitch) ? saved.pitch : fallback.pitch,
        };
    } catch (e) {
        return fallback;
    }
}

function saveSettings() {
    try {
        localStorage.setItem(STORE_KEY, JSON.stringify(settings));
    } catch (e) {
        // プライベートブラウズなどで保存できなくても動作は続ける
    }
}

// ---- Voice selection ----
function japaneseVoices() {
    return voices.filter(v => v.lang.replace('_', '-').toLowerCase().startsWith('ja'));
}

/**
 * 自動選択の優先順位。
 * iOS 16+ の Premium / Enhanced は同じ ja-JP のまま名前だけが違うので、
 * lang だけで選ぶと標準品質の Kyoko が当たってしまう。
 */
function autoPickVoice() {
    const ja = japaneseVoices();
    if (!ja.length) return null;
    return ja.find(v => /premium|プレミアム/i.test(v.name))
        || ja.find(v => /enhanced|拡張/i.test(v.name))
        || ja.find(v => /kyoko|otoya|o-ren|hattori/i.test(v.name))
        || ja.find(v => v.lang.replace('_', '-') === 'ja-JP')
        || ja[0];
}

function currentVoice() {
    if (settings.voiceURI) {
        const chosen = voices.find(v => v.voiceURI === settings.voiceURI);
        if (chosen) return chosen;
    }
    return autoPickVoice();
}

function refreshVoices() {
    voices = window.speechSynthesis.getVoices();
    renderVoiceOptions();
}

// ---- Speech Synthesis ----
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

    const synth = window.speechSynthesis;
    const start = () => {
        const utter = new SpeechSynthesisUtterance(body);
        utter.lang = TTS_LANG;
        utter.rate = settings.rate;
        utter.pitch = settings.pitch;

        const voice = currentVoice();
        if (voice) utter.voice = voice;

        utter.onstart = () => setSpeaking(true);
        utter.onend = () => setSpeaking(false);
        utter.onerror = () => {
            setSpeaking(false);
            showToast('読み上げに失敗しました');
        };

        // iOS Safari は onstart が遅れることがあるので先に UI を切り替える
        setSpeaking(true);
        synth.speak(utter);
    };

    // iOS Safari は cancel() の直後に speak() すると先頭が欠けたり無音になる。
    // 発話中でなければ cancel() を呼ばず、ユーザー操作と同じ実行内で speak() する
    // （初回の speak() がジェスチャ内でないと iOS では音が出ない）。
    if (synth.speaking || synth.pending) {
        synth.cancel();
        setTimeout(start, 80);
    } else {
        start();
    }
}

function stopSpeaking() {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
}

function setSpeaking(state) {
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
        btn.addEventListener('click', () => speak(serif.reading || serif.text));
        grid.appendChild(btn);
    });
}

// ---- Settings panel ----
function renderVoiceOptions() {
    const select = document.getElementById('voice-select');
    const ja = japaneseVoices();
    select.innerHTML = '';

    const auto = document.createElement('option');
    auto.value = '';
    const picked = autoPickVoice();
    auto.textContent = picked ? `自動（${picked.name}）` : '自動';
    select.appendChild(auto);

    ja.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v.voiceURI;
        opt.textContent = `${v.name}（${v.lang}）`;
        select.appendChild(opt);
    });

    select.value = ja.some(v => v.voiceURI === settings.voiceURI) ? settings.voiceURI : '';
    select.disabled = ja.length === 0;

    const hint = document.getElementById('voice-hint');
    if (!ja.length) {
        hint.textContent = 'この端末に日本語音声が見つかりません。端末の設定で日本語の音声データを追加してください。';
    } else {
        hint.textContent = `日本語音声 ${ja.length} 件。iPhone は「設定 → アクセシビリティ → 読み上げコンテンツ → 声 → 日本語」で高品質な音声を追加できます。`;
    }
}

function renderSliders() {
    const rate = document.getElementById('rate-range');
    const pitch = document.getElementById('pitch-range');
    rate.value = settings.rate;
    pitch.value = settings.pitch;
    document.getElementById('rate-value').textContent = Number(settings.rate).toFixed(2);
    document.getElementById('pitch-value').textContent = Number(settings.pitch).toFixed(2);
}

function initSettings() {
    const panel = document.getElementById('settings-panel');
    const toggle = document.getElementById('settings-toggle');

    toggle.addEventListener('click', () => {
        const open = panel.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
    });

    document.getElementById('voice-select').addEventListener('change', e => {
        settings.voiceURI = e.target.value;
        saveSettings();
        renderVoiceOptions();
    });

    document.getElementById('rate-range').addEventListener('input', e => {
        settings.rate = Number(e.target.value);
        document.getElementById('rate-value').textContent = settings.rate.toFixed(2);
        saveSettings();
    });

    document.getElementById('pitch-range').addEventListener('input', e => {
        settings.pitch = Number(e.target.value);
        document.getElementById('pitch-value').textContent = settings.pitch.toFixed(2);
        saveSettings();
    });

    document.getElementById('test-btn').addEventListener('click', () => {
        speak('私はドラムです。よろしくね。');
    });

    document.getElementById('reset-btn').addEventListener('click', () => {
        settings = { voiceURI: '', rate: DEFAULT_RATE, pitch: DEFAULT_PITCH };
        saveSettings();
        renderSliders();
        renderVoiceOptions();
        showToast('音声設定を既定値に戻しました');
    });

    renderSliders();
}

// ---- Init ----
function init() {
    renderSerifs();
    initSettings();

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
        refreshVoices();
        // 一部ブラウザは getVoices() が非同期で埋まる
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = refreshVoices;
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
