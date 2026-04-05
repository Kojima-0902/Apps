// A1-A2 English Learning Data

const CATEGORIES = [
  { id: 'greetings', label: '挨拶', icon: '👋', color: '#00d4ff' },
  { id: 'introductions', label: '自己紹介', icon: '🙋', color: '#7c3aed' },
  { id: 'shopping', label: 'ショッピング', icon: '🛒', color: '#10b981' },
  { id: 'restaurant', label: 'レストラン', icon: '🍽️', color: '#f59e0b' },
  { id: 'directions', label: '道案内', icon: '🗺️', color: '#ef4444' },
  { id: 'travel', label: '旅行', icon: '✈️', color: '#8b5cf6' },
];

const PHRASES = {
  greetings: [
    { en: 'Hello!', ja: 'こんにちは！', example: 'Hello! How are you?' },
    { en: 'Good morning!', ja: 'おはようございます！', example: 'Good morning! Have a great day.' },
    { en: 'Good afternoon!', ja: 'こんにちは！(昼)', example: 'Good afternoon, everyone.' },
    { en: 'Good evening!', ja: 'こんばんは！', example: 'Good evening! Nice to meet you.' },
    { en: 'How are you?', ja: 'お元気ですか？', example: 'Hi! How are you today?' },
    { en: 'I\'m fine, thank you.', ja: '元気です、ありがとう。', example: 'I\'m fine, thank you. And you?' },
    { en: 'Nice to meet you.', ja: 'はじめまして。', example: 'Hi, I\'m Tom. Nice to meet you.' },
    { en: 'Goodbye!', ja: 'さようなら！', example: 'It was great talking to you. Goodbye!' },
    { en: 'See you later!', ja: 'またね！', example: 'I have to go now. See you later!' },
    { en: 'Take care!', ja: '気をつけて！', example: 'Have a safe trip! Take care!' },
  ],
  introductions: [
    { en: 'My name is...', ja: '私の名前は…です。', example: 'My name is Yuki. What\'s yours?' },
    { en: 'I\'m from Japan.', ja: '日本出身です。', example: 'I\'m from Japan. Where are you from?' },
    { en: 'I live in Tokyo.', ja: '東京に住んでいます。', example: 'I live in Tokyo. It\'s a great city.' },
    { en: 'I\'m a student.', ja: '私は学生です。', example: 'I\'m a student at university.' },
    { en: 'I work as...', ja: '…として働いています。', example: 'I work as an engineer.' },
    { en: 'I like...', ja: '…が好きです。', example: 'I like playing tennis and reading books.' },
    { en: 'How old are you?', ja: '何歳ですか？', example: 'How old are you? I\'m 25.' },
    { en: 'Do you speak English?', ja: '英語を話しますか？', example: 'Excuse me, do you speak English?' },
    { en: 'A little bit.', ja: '少しだけ。', example: 'Yes, a little bit. I\'m still learning.' },
    { en: 'Please speak slowly.', ja: 'ゆっくり話してください。', example: 'Could you please speak slowly?' },
  ],
  shopping: [
    { en: 'How much is this?', ja: 'これはいくらですか？', example: 'Excuse me, how much is this?' },
    { en: 'Do you have this in...?', ja: '…色/サイズはありますか？', example: 'Do you have this in blue?' },
    { en: 'Can I try this on?', ja: '試着できますか？', example: 'Can I try this on, please?' },
    { en: 'I\'ll take it.', ja: 'これにします。', example: 'It fits perfectly. I\'ll take it.' },
    { en: 'Do you accept credit cards?', ja: 'クレジットカードは使えますか？', example: 'Do you accept credit cards here?' },
    { en: 'Can I have a receipt?', ja: 'レシートをもらえますか？', example: 'Can I have a receipt, please?' },
    { en: 'This is too expensive.', ja: 'これは高すぎます。', example: 'This is too expensive. Do you have something cheaper?' },
    { en: 'I\'m just looking.', ja: '見ているだけです。', example: 'No, thank you. I\'m just looking.' },
  ],
  restaurant: [
    { en: 'A table for two, please.', ja: '2名でお願いします。', example: 'Good evening. A table for two, please.' },
    { en: 'Can I see the menu?', ja: 'メニューを見せてください。', example: 'Excuse me, can I see the menu?' },
    { en: 'I\'d like to order...', ja: '…を注文したいです。', example: 'I\'d like to order the pasta, please.' },
    { en: 'What do you recommend?', ja: 'お勧めは何ですか？', example: 'This is my first time here. What do you recommend?' },
    { en: 'I\'m allergic to...', ja: '…アレルギーがあります。', example: 'I\'m allergic to nuts. Is there any in this dish?' },
    { en: 'The bill, please.', ja: 'お会計をお願いします。', example: 'We\'re done. The bill, please.' },
    { en: 'This is delicious!', ja: 'とても美味しい！', example: 'Wow, this is delicious! I love it.' },
    { en: 'Could I have some water?', ja: 'お水をいただけますか？', example: 'Excuse me, could I have some water?' },
  ],
  directions: [
    { en: 'Excuse me, where is...?', ja: 'すみません、…はどこですか？', example: 'Excuse me, where is the nearest station?' },
    { en: 'Go straight.', ja: 'まっすぐ行ってください。', example: 'Go straight for two blocks.' },
    { en: 'Turn left/right.', ja: '左/右に曲がってください。', example: 'Turn left at the traffic light.' },
    { en: 'It\'s on the left/right.', ja: '左/右側にあります。', example: 'The hotel is on the left, next to the bank.' },
    { en: 'How far is it?', ja: 'どのくらい遠いですか？', example: 'How far is it from here?' },
    { en: 'Is it walkable?', ja: '歩いて行けますか？', example: 'Is it walkable from here?' },
    { en: 'Take the train to...', ja: '…行きの電車に乗ってください。', example: 'Take the train to Shinjuku station.' },
    { en: 'I\'m lost.', ja: '迷子になりました。', example: 'I\'m lost. Can you help me?' },
  ],
  travel: [
    { en: 'I\'d like to book a room.', ja: '部屋を予約したいです。', example: 'I\'d like to book a room for two nights.' },
    { en: 'Check-in/Check-out', ja: 'チェックイン/チェックアウト', example: 'What time is check-out?' },
    { en: 'Where is the airport?', ja: '空港はどこですか？', example: 'Excuse me, where is the nearest airport?' },
    { en: 'I have a reservation.', ja: '予約があります。', example: 'Hi, I have a reservation under Yamada.' },
    { en: 'My flight is delayed.', ja: '私のフライトが遅延しています。', example: 'My flight is delayed by two hours.' },
    { en: 'I lost my passport.', ja: 'パスポートをなくしました。', example: 'Help! I lost my passport.' },
    { en: 'Is there Wi-Fi?', ja: 'Wi-Fiはありますか？', example: 'Excuse me, is there Wi-Fi in the room?' },
    { en: 'Can you call a taxi?', ja: 'タクシーを呼んでもらえますか？', example: 'Can you call a taxi for me, please?' },
  ],
};

const DIALOGUES = [
  {
    id: 'meeting_someone',
    title: '初対面の挨拶',
    level: 'A1',
    icon: '👋',
    lines: [
      { speaker: 'A', en: 'Hello! My name is Alex. Nice to meet you.', ja: 'こんにちは！私の名前はアレックスです。はじめまして。' },
      { speaker: 'B', en: 'Hi Alex! I\'m Yuki. Nice to meet you too!', ja: 'こんにちは、アレックス！私はユキです。こちらこそ、はじめまして！' },
      { speaker: 'A', en: 'Where are you from, Yuki?', ja: 'ユキ、どこの出身ですか？' },
      { speaker: 'B', en: 'I\'m from Japan. And you?', ja: '日本出身です。あなたは？' },
      { speaker: 'A', en: 'I\'m from the United States. Do you live in Japan?', ja: 'アメリカ出身です。日本に住んでいるのですか？' },
      { speaker: 'B', en: 'Yes, I live in Tokyo. It\'s a wonderful city!', ja: 'はい、東京に住んでいます。素晴らしい街ですよ！' },
    ],
  },
  {
    id: 'at_cafe',
    title: 'カフェで注文',
    level: 'A1',
    icon: '☕',
    lines: [
      { speaker: 'Staff', en: 'Hello! Welcome. What can I get for you?', ja: 'こんにちは！いらっしゃいませ。ご注文は何にしますか？' },
      { speaker: 'You', en: 'Hi! Can I have a coffee, please?', ja: 'こんにちは！コーヒーをいただけますか？' },
      { speaker: 'Staff', en: 'Of course! Hot or iced?', ja: 'もちろんです！ホットとアイス、どちらにしますか？' },
      { speaker: 'You', en: 'Hot, please. And a chocolate cake.', ja: 'ホットでお願いします。それとチョコレートケーキも。' },
      { speaker: 'Staff', en: 'Sure! That will be 8 dollars.', ja: 'かしこまりました！8ドルになります。' },
      { speaker: 'You', en: 'Here you go. Thank you!', ja: 'はい、どうぞ。ありがとうございます！' },
    ],
  },
  {
    id: 'asking_directions',
    title: '道を聞く',
    level: 'A2',
    icon: '🗺️',
    lines: [
      { speaker: 'You', en: 'Excuse me! Do you know where the museum is?', ja: 'すみません！美術館がどこにあるか知っていますか？' },
      { speaker: 'Local', en: 'Yes! Go straight and turn left at the next street.', ja: 'はい！まっすぐ行って、次の通りを左に曲がってください。' },
      { speaker: 'You', en: 'How far is it from here?', ja: 'ここからどのくらい遠いですか？' },
      { speaker: 'Local', en: 'It\'s about a 10-minute walk.', ja: '歩いて約10分ほどです。' },
      { speaker: 'You', en: 'Thank you so much! You\'re very helpful.', ja: 'どうもありがとうございます！とても助かりました。' },
      { speaker: 'Local', en: 'No problem! Enjoy the museum!', ja: 'いいえ！美術館を楽しんでください！' },
    ],
  },
  {
    id: 'at_hotel',
    title: 'ホテルのチェックイン',
    level: 'A2',
    icon: '🏨',
    lines: [
      { speaker: 'You', en: 'Hi, I have a reservation. My name is Tanaka.', ja: 'こんにちは、予約があります。田中と申します。' },
      { speaker: 'Staff', en: 'Welcome, Mr. Tanaka! Let me check your reservation.', ja: 'ようこそ、田中様！ご予約を確認します。' },
      { speaker: 'Staff', en: 'I have a double room for two nights. Is that correct?', ja: '2泊のダブルルームですね。よろしいでしょうか？' },
      { speaker: 'You', en: 'Yes, that\'s right. Is there Wi-Fi in the room?', ja: 'はい、そうです。部屋にWi-Fiはありますか？' },
      { speaker: 'Staff', en: 'Yes, free Wi-Fi is available throughout the hotel.', ja: 'はい、ホテル全体で無料Wi-Fiをご利用いただけます。' },
      { speaker: 'You', en: 'Great! What time is breakfast?', ja: 'それは良かった！朝食は何時ですか？' },
      { speaker: 'Staff', en: 'Breakfast is from 7 to 10 in the morning. Enjoy your stay!', ja: '朝食は朝7時から10時までです。ごゆっくりどうぞ！' },
    ],
  },
  {
    id: 'shopping',
    title: 'ショッピング',
    level: 'A2',
    icon: '🛍️',
    lines: [
      { speaker: 'You', en: 'Excuse me. How much is this jacket?', ja: 'すみません。このジャケットはいくらですか？' },
      { speaker: 'Staff', en: 'It\'s 59 dollars. It\'s on sale today!', ja: '59ドルです。今日はセール中ですよ！' },
      { speaker: 'You', en: 'Do you have this in medium size?', ja: 'Mサイズはありますか？' },
      { speaker: 'Staff', en: 'Let me check... Yes, we have one left!', ja: '確認します…はい、1枚だけ残っています！' },
      { speaker: 'You', en: 'Can I try it on?', ja: '試着できますか？' },
      { speaker: 'Staff', en: 'Of course! The fitting room is over there.', ja: 'もちろんです！試着室はあちらです。' },
      { speaker: 'You', en: 'It fits perfectly. I\'ll take it!', ja: 'ぴったりです。これにします！' },
    ],
  },
];

// Progress tracking keys
const PROGRESS_KEY = 'english_app_progress';
const FAVORITES_KEY = 'english_app_favorites';

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
  } catch { return {}; }
}

function saveProgress(data) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
}

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch { return []; }
}

function saveFavorites(data) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(data));
}
