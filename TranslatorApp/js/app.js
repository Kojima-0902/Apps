// ============================
// AI Translator App
// ============================

(function () {
    'use strict';

    // --- Version ---
    const APP_VERSION = '1.4.0';

    // --- State ---
    let sourceLang = 'ja';
    let targetLang = 'en';
    let isRecording = false;
    let recognition = null;
    let history = JSON.parse(localStorage.getItem('translator_history') || '[]');
    let activeConvRecording = null;
    let apiEmail = localStorage.getItem('translator_api_email') || '';

    // Voice profile state
    let voiceProfile = JSON.parse(localStorage.getItem('translator_voice_profile') || 'null');
    let audioCtx = null;
    let audioAnalyser = null;
    let audioStream = null;
    let pitchDetectInterval = null;
    let currentPitchSamples = [];
    let isPitchCollecting = false;
    let expectedSpeaker = 'user'; // predict who speaks next

    // --- DOM Elements ---
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    // Tabs
    const tabBtns = $$('.tab-btn');
    const tabContents = $$('.tab-content');

    // Translate tab
    const sourceText = $('#source-text');
    const translateBtn = $('#translate-btn');
    const resultArea = $('#result-area');
    const resultText = $('#result-text');
    const swapBtn = $('#swap-lang-btn');
    const micBtn = $('#mic-btn');
    const clearBtn = $('#clear-btn');
    const copyBtn = $('#copy-btn');
    const speakBtn = $('#speak-btn');
    const saveBtn = $('#save-btn');
    const sourceLangLabel = $('#source-lang-label');
    const targetLangLabel = $('#target-lang-label');
    const sourceLangBtn = $('#source-lang-btn');
    const targetLangBtn = $('#target-lang-btn');

    // Conversation tab
    const convMessages = $('#conversation-messages');
    const autoMicBtn = $('#auto-mic-btn');
    const convClearBtn = $('#conv-clear-btn');
    const convLivePreview = $('#conv-live-preview');
    const convLiveText = $('#conv-live-text');

    // History tab
    const historyList = $('#history-list');
    const clearHistoryBtn = $('#clear-history-btn');

    // Phrasebook
    const phraseCategories = $('#phrase-categories');
    const phraseList = $('#phrase-list');

    // Others
    const toast = $('#toast');
    const recordingIndicator = $('#recording-indicator');
    const versionLabel = $('#version-label');

    // Settings
    const settingsBtn = $('#settings-btn');
    const settingsOverlay = $('#settings-overlay');
    const settingsCloseBtn = $('#settings-close-btn');
    const settingsSaveBtn = $('#settings-save-btn');
    const apiEmailInput = $('#api-email-input');
    const settingsQuota = $('#settings-quota');

    // Voice enrollment
    const voiceEnrollBtn = $('#voice-enroll-btn');
    const voiceDeleteBtn = $('#voice-delete-btn');
    const voiceEnrollStatus = $('#voice-enroll-status');
    const voiceEnrollProgress = $('#voice-enroll-progress');
    const voiceEnrollFill = $('#voice-enroll-fill');
    const voiceEnrollMsg = $('#voice-enroll-msg');

    // Speaker indicator
    const speakerIndicator = $('#conv-speaker-indicator');
    const speakerIcon = $('#speaker-icon');
    const speakerLabel = $('#speaker-label');

    // Show version
    versionLabel.textContent = `v${APP_VERSION}`;

    // --- Settings ---
    function updateQuotaDisplay() {
        settingsQuota.textContent = apiEmail
            ? `現在の上限: 50,000文字/日（${apiEmail}）`
            : '現在の上限: 5,000文字/日（未登録）';
    }

    settingsBtn.addEventListener('click', () => {
        apiEmailInput.value = apiEmail;
        updateQuotaDisplay();
        settingsOverlay.classList.add('show');
    });

    settingsCloseBtn.addEventListener('click', () => {
        settingsOverlay.classList.remove('show');
    });

    settingsOverlay.addEventListener('click', (e) => {
        if (e.target === settingsOverlay) {
            settingsOverlay.classList.remove('show');
        }
    });

    settingsSaveBtn.addEventListener('click', () => {
        const email = apiEmailInput.value.trim().replace(/\uff20/g, '@');
        if (email && !email.includes('@')) {
            showToast('有効なメールアドレスを入力してください');
            return;
        }
        apiEmail = email;
        if (email) {
            localStorage.setItem('translator_api_email', email);
            showToast('保存しました（上限: 50,000文字/日）');
        } else {
            localStorage.removeItem('translator_api_email');
            showToast('メールを削除しました（上限: 5,000文字/日）');
        }
        updateQuotaDisplay();
        settingsOverlay.classList.remove('show');
    });

    // --- Phrasebook Data ---
    const phrasebook = {
        'greetings': {
            label: '挨拶',
            phrases: [
                { ja: 'おはようございます', en: 'Good morning' },
                { ja: 'お疲れ様です', en: 'Thank you for your hard work' },
                { ja: 'お世話になっております', en: 'Thank you for your continued support' },
                { ja: 'はじめまして、よろしくお願いします', en: 'Nice to meet you, I look forward to working with you' },
                { ja: 'ご無沙汰しております', en: 'It\'s been a while since we last met' },
                { ja: '本日はお時間いただきありがとうございます', en: 'Thank you for your time today' },
            ]
        },
        'business': {
            label: 'ビジネス',
            phrases: [
                { ja: '会議室はどこですか？', en: 'Where is the meeting room?' },
                { ja: '資料を共有していただけますか？', en: 'Could you share the materials?' },
                { ja: 'スケジュールを確認させてください', en: 'Let me check the schedule' },
                { ja: '進捗を報告します', en: 'I will report the progress' },
                { ja: 'この件について相談したいです', en: 'I would like to discuss this matter' },
                { ja: '次のステップを確認しましょう', en: 'Let\'s confirm the next steps' },
                { ja: '締め切りはいつですか？', en: 'When is the deadline?' },
                { ja: '承知しました', en: 'Understood / Got it' },
            ]
        },
        'travel': {
            label: '移動・交通',
            phrases: [
                { ja: '空港までどのくらいかかりますか？', en: 'How long does it take to get to the airport?' },
                { ja: 'タクシーを呼んでもらえますか？', en: 'Could you call a taxi for me?' },
                { ja: 'この住所まで行きたいです', en: 'I would like to go to this address' },
                { ja: 'Wi-Fiのパスワードは何ですか？', en: 'What is the Wi-Fi password?' },
                { ja: 'チェックインをお願いします', en: 'I would like to check in, please' },
                { ja: '近くにレストランはありますか？', en: 'Is there a restaurant nearby?' },
            ]
        },
        'dining': {
            label: '食事',
            phrases: [
                { ja: 'おすすめは何ですか？', en: 'What do you recommend?' },
                { ja: 'アレルギーがあります', en: 'I have allergies' },
                { ja: 'お会計をお願いします', en: 'Check, please' },
                { ja: '予約をしています。名前は...です', en: 'I have a reservation. The name is...' },
                { ja: 'メニューを見せてください', en: 'May I see the menu, please?' },
                { ja: '水をいただけますか？', en: 'Can I have some water?' },
            ]
        },
        'emergency': {
            label: '緊急',
            phrases: [
                { ja: '助けてください', en: 'Please help me' },
                { ja: '病院に行きたいです', en: 'I need to go to the hospital' },
                { ja: '体調が悪いです', en: 'I\'m not feeling well' },
                { ja: '日本語を話せる人はいますか？', en: 'Is there anyone who speaks Japanese?' },
                { ja: 'パスポートをなくしました', en: 'I lost my passport' },
                { ja: '大使館に連絡したいです', en: 'I want to contact the embassy' },
            ]
        }
    };

    // --- Pitch Detection (Autocorrelation) ---
    function detectPitchFromBuffer(buffer, sampleRate) {
        const SIZE = buffer.length;

        // RMS check — is there enough signal?
        let rms = 0;
        for (let i = 0; i < SIZE; i++) rms += buffer[i] * buffer[i];
        rms = Math.sqrt(rms / SIZE);
        if (rms < 0.01) return { pitch: -1, rms };

        // Autocorrelation to find fundamental frequency
        // Search range: 80 Hz – 400 Hz (covers male & female voices)
        const minPeriod = Math.floor(sampleRate / 400);
        const maxPeriod = Math.floor(sampleRate / 80);
        const halfSize = Math.floor(SIZE / 2);

        let bestPeriod = -1;
        let bestCorrelation = 0;

        for (let tau = minPeriod; tau <= Math.min(maxPeriod, halfSize); tau++) {
            let correlation = 0;
            for (let i = 0; i < halfSize; i++) {
                correlation += buffer[i] * buffer[i + tau];
            }
            correlation /= halfSize;
            if (correlation > bestCorrelation) {
                bestCorrelation = correlation;
                bestPeriod = tau;
            }
        }

        return {
            pitch: bestPeriod > 0 ? sampleRate / bestPeriod : -1,
            rms
        };
    }

    // --- Voice Enrollment ---
    function updateVoiceProfileUI() {
        if (voiceProfile) {
            voiceEnrollStatus.textContent = `登録済み（平均ピッチ: ${Math.round(voiceProfile.avgPitch)} Hz）`;
            voiceEnrollStatus.className = 'voice-enroll-status enrolled';
            voiceDeleteBtn.style.display = '';
            voiceEnrollBtn.textContent = '再登録する';
        } else {
            voiceEnrollStatus.textContent = '未登録';
            voiceEnrollStatus.className = 'voice-enroll-status';
            voiceDeleteBtn.style.display = 'none';
            voiceEnrollBtn.textContent = '声を登録する';
        }
    }

    async function enrollVoice() {
        let stream, ctx, interval;
        try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            ctx = new (window.AudioContext || window.webkitAudioContext)();
            const source = ctx.createMediaStreamSource(stream);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 2048;
            source.connect(analyser);

            const buffer = new Float32Array(analyser.fftSize);
            const pitchSamples = [];
            const duration = 3000;
            const startTime = Date.now();

            voiceEnrollProgress.style.display = '';
            voiceEnrollMsg.textContent = '何か話してください…（3秒間）';
            voiceEnrollBtn.disabled = true;

            return new Promise((resolve) => {
                interval = setInterval(() => {
                    const elapsed = Date.now() - startTime;
                    voiceEnrollFill.style.width = (Math.min(elapsed / duration, 1) * 100) + '%';

                    analyser.getFloatTimeDomainData(buffer);
                    const { pitch, rms } = detectPitchFromBuffer(buffer, ctx.sampleRate);
                    if (pitch > 0 && rms > 0.01) pitchSamples.push(pitch);

                    if (elapsed >= duration) {
                        clearInterval(interval);
                        stream.getTracks().forEach(t => t.stop());
                        ctx.close();

                        if (pitchSamples.length < 5) {
                            voiceEnrollMsg.textContent = '声が検出できませんでした。もう一度お試しください。';
                            voiceEnrollBtn.disabled = false;
                            setTimeout(() => { voiceEnrollProgress.style.display = 'none'; }, 2000);
                            resolve(false);
                            return;
                        }

                        // Remove outliers (trim 10%)
                        const sorted = [...pitchSamples].sort((a, b) => a - b);
                        const lo = Math.floor(sorted.length * 0.1);
                        const hi = Math.ceil(sorted.length * 0.9);
                        const trimmed = sorted.slice(lo, hi);
                        const avg = trimmed.reduce((a, b) => a + b, 0) / trimmed.length;
                        const std = Math.sqrt(trimmed.reduce((s, p) => s + (p - avg) ** 2, 0) / trimmed.length);

                        voiceProfile = { avgPitch: avg, pitchStd: std, sampleCount: pitchSamples.length, enrolledAt: Date.now() };
                        localStorage.setItem('translator_voice_profile', JSON.stringify(voiceProfile));

                        voiceEnrollMsg.textContent = `登録完了！（平均: ${Math.round(avg)} Hz）`;
                        voiceEnrollBtn.disabled = false;
                        updateVoiceProfileUI();
                        setTimeout(() => { voiceEnrollProgress.style.display = 'none'; }, 2500);
                        resolve(true);
                    }
                }, 1000 / 30);
            });
        } catch (err) {
            console.error('Enrollment error:', err);
            showToast('マイクへのアクセスを許可してください');
            voiceEnrollBtn.disabled = false;
            if (stream) stream.getTracks().forEach(t => t.stop());
            if (ctx) ctx.close();
            return false;
        }
    }

    voiceEnrollBtn.addEventListener('click', () => enrollVoice());

    voiceDeleteBtn.addEventListener('click', () => {
        voiceProfile = null;
        localStorage.removeItem('translator_voice_profile');
        updateVoiceProfileUI();
        showToast('声の登録を削除しました');
    });

    updateVoiceProfileUI();

    // --- Audio Analysis for Speaker Detection ---
    async function startAudioAnalysis() {
        if (audioCtx) return;
        try {
            audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioCtx.createMediaStreamSource(audioStream);
            audioAnalyser = audioCtx.createAnalyser();
            audioAnalyser.fftSize = 2048;
            source.connect(audioAnalyser);

            const buffer = new Float32Array(audioAnalyser.fftSize);

            pitchDetectInterval = setInterval(() => {
                if (!isPitchCollecting) return;
                audioAnalyser.getFloatTimeDomainData(buffer);
                const { pitch, rms } = detectPitchFromBuffer(buffer, audioCtx.sampleRate);
                if (pitch > 0 && rms > 0.01) currentPitchSamples.push(pitch);
            }, 50); // 20fps
        } catch (err) {
            console.error('Audio analysis error:', err);
        }
    }

    function stopAudioAnalysis() {
        if (pitchDetectInterval) { clearInterval(pitchDetectInterval); pitchDetectInterval = null; }
        if (audioStream) { audioStream.getTracks().forEach(t => t.stop()); audioStream = null; }
        if (audioCtx) { audioCtx.close(); audioCtx = null; }
        audioAnalyser = null;
        isPitchCollecting = false;
        currentPitchSamples = [];
    }

    function isSpeakerUser(samples) {
        if (!voiceProfile || samples.length < 3) return null; // can't determine

        const sorted = [...samples].sort((a, b) => a - b);
        const lo = Math.floor(sorted.length * 0.1);
        const hi = Math.max(Math.ceil(sorted.length * 0.9), lo + 1);
        const trimmed = sorted.slice(lo, hi);
        const avg = trimmed.reduce((a, b) => a + b, 0) / trimmed.length;

        // Match if within 2.5 std deviations or 25% of enrolled pitch
        const threshold = Math.max(voiceProfile.pitchStd * 2.5, voiceProfile.avgPitch * 0.25);
        return Math.abs(avg - voiceProfile.avgPitch) <= threshold;
    }

    function showSpeakerIndicator(lang) {
        if (!speakerIndicator) return;
        speakerIndicator.style.display = '';
        if (lang === 'ja') {
            speakerIcon.textContent = '🇯🇵';
            speakerLabel.textContent = 'あなた（日本語）';
            speakerIndicator.className = 'conv-speaker-indicator speaker-ja';
        } else {
            speakerIcon.textContent = '🇺🇸';
            speakerLabel.textContent = '相手（English）';
            speakerIndicator.className = 'conv-speaker-indicator speaker-en';
        }
    }

    function hideSpeakerIndicator() {
        if (speakerIndicator) speakerIndicator.style.display = 'none';
    }

    // --- Translation API ---
    async function translate(text, from, to) {
        if (!text.trim()) return '';

        const langPair = `${from}|${to}`;
        let url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langPair)}`;
        if (apiEmail) {
            url += `&de=${encodeURIComponent(apiEmail)}`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Translation API error');
            const data = await response.json();

            if (data.responseStatus === 200 && data.responseData) {
                return data.responseData.translatedText;
            }

            // Fallback to matches if available
            if (data.matches && data.matches.length > 0) {
                const best = data.matches.reduce((a, b) =>
                    (b.quality * b.match) > (a.quality * a.match) ? b : a
                );
                return best.translation;
            }

            throw new Error('No translation found');
        } catch (err) {
            console.error('Translation error:', err);
            throw err;
        }
    }

    // --- Speech Recognition ---
    function getSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return null;
        return new SpeechRecognition();
    }

    function startRecognition(lang, onResult, onEnd) {
        if (recognition) {
            recognition.abort();
            recognition = null;
        }

        recognition = getSpeechRecognition();
        if (!recognition) {
            showToast('音声認識に対応していません');
            return false;
        }

        recognition.lang = lang === 'ja' ? 'ja-JP' : 'en-US';
        recognition.interimResults = true;
        recognition.continuous = false;
        recognition.maxAlternatives = 1;

        // Guard: onerror + onend both fire on errors, so prevent double onEnd calls
        let ended = false;
        function callOnEnd() {
            if (ended) return;
            ended = true;
            onEnd();
        }

        recognition.onresult = (event) => {
            let interim = '';
            let final = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    final += transcript;
                } else {
                    interim += transcript;
                }
            }
            onResult(final || interim, !!final);
        };

        recognition.onerror = (event) => {
            if (event.error !== 'aborted') {
                console.error('Speech recognition error:', event.error);
                if (event.error === 'not-allowed') {
                    showToast('マイクへのアクセスを許可してください');
                }
            }
            callOnEnd();
        };

        recognition.onend = () => {
            callOnEnd();
        };

        recognition.start();
        return true;
    }

    function stopRecognition() {
        if (recognition) {
            recognition.stop();
            recognition = null;
        }
    }

    // --- Text-to-Speech ---
    // Unlock speech synthesis on mobile (must be called during user gesture)
    function unlockSpeech() {
        if (!window.speechSynthesis) return;
        const utterance = new SpeechSynthesisUtterance('');
        utterance.volume = 0;
        window.speechSynthesis.speak(utterance);
    }

    function speak(text, lang, onEnd) {
        if (!window.speechSynthesis) {
            showToast('音声読み上げに対応していません');
            if (onEnd) onEnd();
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'ja' ? 'ja-JP' : 'en-US';
        utterance.rate = 0.9;
        if (onEnd) {
            utterance.onend = onEnd;
            utterance.onerror = onEnd;
        }
        window.speechSynthesis.speak(utterance);
    }

    // --- Tab Navigation ---
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            $(`#tab-${tab}`).classList.add('active');
        });
    });

    // --- Language Swap ---
    swapBtn.addEventListener('click', () => {
        [sourceLang, targetLang] = [targetLang, sourceLang];
        updateLangDisplay();
        // Swap text and result if both exist
        const currentSource = sourceText.value;
        const currentResult = resultText.textContent;
        if (currentResult && resultArea.style.display !== 'none') {
            sourceText.value = currentResult;
            resultText.textContent = currentSource;
        }
    });

    function updateLangDisplay() {
        if (sourceLang === 'ja') {
            sourceLangBtn.querySelector('.lang-flag').textContent = '🇯🇵';
            sourceLangLabel.textContent = '日本語';
            targetLangBtn.querySelector('.lang-flag').textContent = '🇺🇸';
            targetLangLabel.textContent = 'English';
            sourceText.placeholder = '翻訳したいテキストを入力...';
        } else {
            sourceLangBtn.querySelector('.lang-flag').textContent = '🇺🇸';
            sourceLangLabel.textContent = 'English';
            targetLangBtn.querySelector('.lang-flag').textContent = '🇯🇵';
            targetLangLabel.textContent = '日本語';
            sourceText.placeholder = 'Enter text to translate...';
        }
    }

    // --- Translate Button ---
    translateBtn.addEventListener('click', async () => {
        const text = sourceText.value.trim();
        if (!text) {
            showToast('テキストを入力してください');
            return;
        }

        // Unlock speech on user gesture so auto-speak works after async translate
        unlockSpeech();

        translateBtn.disabled = true;
        translateBtn.classList.add('loading');

        try {
            const result = await translate(text, sourceLang, targetLang);
            resultText.textContent = result;
            resultArea.style.display = 'block';

            // Auto speak the translated result
            speak(result, targetLang);

            // Add to history
            addToHistory(text, result, sourceLang, targetLang);
        } catch (err) {
            showToast('翻訳に失敗しました。もう一度お試しください');
        } finally {
            translateBtn.disabled = false;
            translateBtn.classList.remove('loading');
        }
    });

    // Allow Enter key to translate (Shift+Enter for newline)
    sourceText.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            translateBtn.click();
        }
    });

    // --- Mic Button (Translate Tab) ---
    micBtn.addEventListener('click', () => {
        if (isRecording) {
            stopRecognition();
            micBtn.classList.remove('recording');
            recordingIndicator.classList.remove('show');
            isRecording = false;
            return;
        }

        isRecording = true;
        micBtn.classList.add('recording');
        recordingIndicator.classList.add('show');

        const started = startRecognition(
            sourceLang,
            (text, isFinal) => {
                sourceText.value = text;
                if (isFinal) {
                    micBtn.classList.remove('recording');
                    recordingIndicator.classList.remove('show');
                    isRecording = false;
                }
            },
            () => {
                micBtn.classList.remove('recording');
                recordingIndicator.classList.remove('show');
                isRecording = false;
            }
        );

        if (!started) {
            isRecording = false;
            micBtn.classList.remove('recording');
            recordingIndicator.classList.remove('show');
        }
    });

    // --- Clear Button ---
    clearBtn.addEventListener('click', () => {
        sourceText.value = '';
        resultArea.style.display = 'none';
        resultText.textContent = '';
        sourceText.focus();
    });

    // --- Copy Button ---
    copyBtn.addEventListener('click', () => {
        const text = resultText.textContent;
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            showToast('コピーしました');
        }).catch(() => {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast('コピーしました');
        });
    });

    // --- Speak Button ---
    speakBtn.addEventListener('click', () => {
        const text = resultText.textContent;
        if (!text) return;
        speak(text, targetLang);
    });

    // --- Save Button ---
    saveBtn.addEventListener('click', () => {
        showToast('履歴に保存済みです');
    });

    // --- Conversation Mode ---
    function addConversationBubble(originalText, translatedText, lang) {
        // Remove empty state
        const empty = convMessages.querySelector('.conversation-empty');
        if (empty) empty.remove();

        const bubble = document.createElement('div');
        bubble.className = `conv-bubble ${lang}`;

        const speakLang = lang === 'ja' ? 'en' : 'ja';

        bubble.innerHTML = `
            <div class="original">${escapeHtml(originalText)}</div>
            <div class="translated">${escapeHtml(translatedText)}</div>
            <div class="bubble-actions">
                <button class="bubble-action-btn" data-action="speak" data-text="${escapeAttr(translatedText)}" data-lang="${speakLang}">
                    🔊 読み上げ
                </button>
                <button class="bubble-action-btn" data-action="copy" data-text="${escapeAttr(translatedText)}">
                    📋 コピー
                </button>
            </div>
        `;

        convMessages.appendChild(bubble);
        convMessages.scrollTop = convMessages.scrollHeight;

        // Add to history
        addToHistory(originalText, translatedText, lang, lang === 'ja' ? 'en' : 'ja');
    }

    // Event delegation for conversation bubble actions
    convMessages.addEventListener('click', (e) => {
        const btn = e.target.closest('.bubble-action-btn');
        if (!btn) return;

        const action = btn.dataset.action;
        const text = btn.dataset.text;

        if (action === 'speak') {
            speak(text, btn.dataset.lang);
        } else if (action === 'copy') {
            navigator.clipboard.writeText(text).then(() => {
                showToast('コピーしました');
            });
        }
    });

    // --- Conversation Clear Button ---
    convClearBtn.addEventListener('click', () => {
        convMessages.innerHTML = `
            <div class="conversation-empty">
                <p>会話モードへようこそ</p>
                <p class="sub">下のボタンを押して話しかけてください</p>
                <p class="sub">設定で声を登録すると話者を自動判別します</p>
            </div>
        `;
        showToast('会話をクリアしました');
    });

    // --- Auto Language Detection ---
    function detectLanguage(text) {
        // Japanese characters: hiragana, katakana, CJK unified ideographs
        const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/;
        return japaneseRegex.test(text) ? 'ja' : 'en';
    }

    // --- Live Preview Helpers ---
    function showLivePreview(text) {
        convLiveText.textContent = text;
        convLivePreview.style.display = '';
    }

    function hideLivePreview() {
        convLivePreview.style.display = 'none';
        convLiveText.textContent = '';
    }

    // --- Auto-detect Conversation Mic (Continuous) ---
    let convContinuous = false;
    const RESTART_DELAY = 300; // ms delay before restarting recognition

    function stopConversation() {
        convContinuous = false;
        stopRecognition();
        hideLivePreview();
        hideSpeakerIndicator();
        autoMicBtn.classList.remove('recording');
        recordingIndicator.classList.remove('show');
        activeConvRecording = null;
        expectedSpeaker = 'user';
    }

    function scheduleRestart() {
        if (!convContinuous) return;
        setTimeout(() => {
            if (convContinuous) startConvListening();
        }, RESTART_DELAY);
    }

    // Auto language detection using ja-JP recognition + final result analysis.
    // Japanese speech → hiragana/kanji-rich → translate ja→en directly.
    // English speech → katakana-heavy from ja-JP → recover English via ja→en,
    // then translate en→ja to produce the real Japanese translation.

    function isLikelyJapanese(text) {
        // Count hiragana + kanji (NOT katakana — English→ja-JP produces katakana)
        const hiraKanji = (text.match(/[\u3040-\u309F\u4E00-\u9FFF]/g) || []).length;
        // Count total non-space, non-punctuation characters
        const meaningful = text.replace(/[\s\p{P}]/gu, '').length || 1;
        return hiraKanji / meaningful > 0.15;
    }

    function startConvListening() {
        if (!convContinuous) return;

        autoMicBtn.classList.add('recording');
        recordingIndicator.classList.add('show');
        activeConvRecording = autoMicBtn;

        // Choose recognition language:
        // - With voice profile: alternate based on predicted speaker
        //   user → ja-JP, other → en-US
        // - Without voice profile: always ja-JP + text analysis (existing)
        const recogLang = (voiceProfile && expectedSpeaker === 'other') ? 'en' : 'ja';

        if (voiceProfile) {
            showSpeakerIndicator(recogLang === 'ja' ? 'ja' : 'en');
        }

        let resultHandled = false;

        const started = startRecognition(
            recogLang,
            (text, isFinal) => {
                if (!isFinal) {
                    showLivePreview(text);
                } else if (text.trim()) {
                    resultHandled = true;
                    showLivePreview(text);

                    if (voiceProfile) {
                        // Voice enrolled → use alternation + text analysis safety
                        if (recogLang === 'ja') {
                            // Expected user (Japanese)
                            if (isLikelyJapanese(text)) {
                                // Confirmed: user spoke Japanese
                                handleConvTranslate(text, 'ja');
                                expectedSpeaker = 'other';
                                showSpeakerIndicator('ja');
                            } else {
                                // Katakana detected → other person spoke English
                                // (prediction was wrong, or same person spoke twice)
                                handleEnglishRecovery(text);
                                expectedSpeaker = 'user';
                                showSpeakerIndicator('en');
                            }
                        } else {
                            // Expected other (English), used en-US
                            // en-US result is proper English text
                            handleConvTranslate(text, 'en');
                            expectedSpeaker = 'user';
                            showSpeakerIndicator('en');
                        }
                    } else {
                        // No voice profile — text-based detection (existing)
                        if (isLikelyJapanese(text)) {
                            handleConvTranslate(text, 'ja');
                        } else {
                            handleEnglishRecovery(text);
                        }
                    }
                }
            },
            () => {
                if (!resultHandled) {
                    hideLivePreview();
                    scheduleRestart();
                }
            }
        );

        if (!started) {
            stopConversation();
        }
    }

    // English was spoken but recognized as katakana by ja-JP.
    // Step 1: translate katakana ja→en to recover English text.
    // Step 2: translate recovered English en→ja for the Japanese listener.
    function handleEnglishRecovery(katakanaText) {
        stopRecognition();
        hideLivePreview();
        autoMicBtn.classList.remove('recording');
        recordingIndicator.classList.remove('show');

        // Step 1: recover English from katakana
        translate(katakanaText, 'ja', 'en')
            .then(recoveredEnglish => {
                // Step 2: translate recovered English to proper Japanese
                translate(recoveredEnglish, 'en', 'ja')
                    .then(japaneseTranslation => {
                        addConversationBubble(recoveredEnglish, japaneseTranslation, 'en');
                        speak(japaneseTranslation, 'ja', () => {
                            scheduleRestart();
                        });
                    })
                    .catch(() => {
                        // Fallback: show recovered English with katakana
                        addConversationBubble(recoveredEnglish, katakanaText, 'en');
                        scheduleRestart();
                    });
            })
            .catch(() => {
                showToast('翻訳に失敗しました');
                scheduleRestart();
            });
    }

    function handleConvTranslate(text, fromLang) {
        stopRecognition();
        hideLivePreview();
        autoMicBtn.classList.remove('recording');
        recordingIndicator.classList.remove('show');

        const toLang = fromLang === 'ja' ? 'en' : 'ja';

        translate(text, fromLang, toLang)
            .then(translated => {
                addConversationBubble(text, translated, fromLang);
                speak(translated, toLang, () => {
                    scheduleRestart();
                });
            })
            .catch(() => {
                showToast('翻訳に失敗しました');
                scheduleRestart();
            });
    }

    autoMicBtn.addEventListener('click', () => {
        if (convContinuous) {
            stopConversation();
            return;
        }

        unlockSpeech();
        convContinuous = true;
        expectedSpeaker = 'user';
        startConvListening();
    });

    // --- Phrasebook ---
    function renderPhrasebook() {
        const categories = Object.keys(phrasebook);
        let activeCategory = categories[0];

        function renderCategories() {
            phraseCategories.innerHTML = categories.map(key =>
                `<button class="phrase-cat-btn ${key === activeCategory ? 'active' : ''}" data-cat="${key}">${phrasebook[key].label}</button>`
            ).join('');
        }

        function renderPhrases() {
            const phrases = phrasebook[activeCategory].phrases;
            phraseList.innerHTML = phrases.map((p, i) => `
                <div class="phrase-item" data-cat="${activeCategory}" data-idx="${i}">
                    <div class="phrase-ja">${escapeHtml(p.ja)}</div>
                    <div class="phrase-en">${escapeHtml(p.en)}</div>
                    <button class="phrase-speak-btn" data-text="${escapeAttr(p.en)}" data-lang="en">🔊 English</button>
                    <button class="phrase-speak-btn" data-text="${escapeAttr(p.ja)}" data-lang="ja">🔊 日本語</button>
                </div>
            `).join('');
        }

        renderCategories();
        renderPhrases();

        phraseCategories.addEventListener('click', (e) => {
            const btn = e.target.closest('.phrase-cat-btn');
            if (!btn) return;
            activeCategory = btn.dataset.cat;
            renderCategories();
            renderPhrases();
        });

        phraseList.addEventListener('click', (e) => {
            const speakBtn = e.target.closest('.phrase-speak-btn');
            if (speakBtn) {
                e.stopPropagation();
                speak(speakBtn.dataset.text, speakBtn.dataset.lang);
                return;
            }

            const item = e.target.closest('.phrase-item');
            if (item) {
                const cat = item.dataset.cat;
                const idx = item.dataset.idx;
                const phrase = phrasebook[cat].phrases[idx];
                // Copy English to clipboard
                navigator.clipboard.writeText(phrase.en).then(() => {
                    showToast('英語をコピーしました');
                });
            }
        });
    }

    renderPhrasebook();

    // --- History ---
    function addToHistory(source, result, fromLang, toLang) {
        const entry = {
            source,
            result,
            fromLang,
            toLang,
            timestamp: Date.now()
        };
        history.unshift(entry);
        if (history.length > 100) history.pop();
        localStorage.setItem('translator_history', JSON.stringify(history));
        renderHistory();
    }

    function renderHistory() {
        if (history.length === 0) {
            historyList.innerHTML = '<div class="history-empty"><p>翻訳履歴はまだありません</p></div>';
            return;
        }

        historyList.innerHTML = history.map((item, i) => {
            const time = new Date(item.timestamp);
            const timeStr = `${time.getMonth() + 1}/${time.getDate()} ${time.getHours()}:${String(time.getMinutes()).padStart(2, '0')}`;
            const dirLabel = item.fromLang === 'ja' ? '🇯🇵→🇺🇸' : '🇺🇸→🇯🇵';

            return `
                <div class="history-item" data-idx="${i}">
                    <div class="history-source">${dirLabel} ${escapeHtml(item.source)}</div>
                    <div class="history-result">${escapeHtml(item.result)}</div>
                    <div class="history-meta">
                        <span>${timeStr}</span>
                        <div class="history-action-btns">
                            <button class="history-action-btn" data-action="copy" data-idx="${i}">📋 コピー</button>
                            <button class="history-action-btn" data-action="reuse" data-idx="${i}">🔄 再利用</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    historyList.addEventListener('click', (e) => {
        const btn = e.target.closest('.history-action-btn');
        if (!btn) return;

        const idx = parseInt(btn.dataset.idx);
        const item = history[idx];
        if (!item) return;

        if (btn.dataset.action === 'copy') {
            navigator.clipboard.writeText(item.result).then(() => {
                showToast('コピーしました');
            });
        } else if (btn.dataset.action === 'reuse') {
            sourceText.value = item.source;
            sourceLang = item.fromLang;
            targetLang = item.toLang;
            updateLangDisplay();
            // Switch to translate tab
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            tabBtns[0].classList.add('active');
            $('#tab-translate').classList.add('active');
        }
    });

    clearHistoryBtn.addEventListener('click', () => {
        if (confirm('翻訳履歴をすべて削除しますか？')) {
            history = [];
            localStorage.removeItem('translator_history');
            renderHistory();
            showToast('履歴を削除しました');
        }
    });

    renderHistory();

    // --- Toast ---
    let toastTimer;
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    // --- Utility ---
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function escapeAttr(str) {
        return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // --- PWA Registration & Update Detection ---
    const updateBanner = $('#update-banner');
    const updateBtn = $('#update-btn');

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').then(reg => {
            // Check for updates on page load
            reg.update();

            // Detect waiting service worker (new version ready)
            function showUpdateBanner() {
                updateBanner.classList.add('show');
            }

            if (reg.waiting) {
                showUpdateBanner();
            }

            reg.addEventListener('updatefound', () => {
                const newWorker = reg.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showUpdateBanner();
                    }
                });
            });

            // Update button click: activate new SW and reload
            updateBtn.addEventListener('click', () => {
                if (reg.waiting) {
                    reg.waiting.postMessage({ type: 'SKIP_WAITING' });
                }
                window.location.reload();
            });
        }).catch(err => {
            console.log('SW registration failed:', err);
        });

        // Reload when new SW takes control
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
        });
    }
})();
