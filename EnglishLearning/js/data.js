// A1-A2 English Learning Data

const CATEGORIES = [
  { id: 'greetings', label: '挨拶', icon: '👋', color: '#00d4ff' },
  { id: 'introductions', label: '自己紹介', icon: '🙋', color: '#7c3aed' },
  { id: 'shopping', label: 'ショッピング', icon: '🛒', color: '#10b981' },
  { id: 'restaurant', label: 'レストラン', icon: '🍽️', color: '#f59e0b' },
  { id: 'directions', label: '道案内', icon: '🗺️', color: '#ef4444' },
  { id: 'travel', label: '旅行', icon: '✈️', color: '#8b5cf6' },
];

const BIZ_CATEGORIES = [
  { id: 'biz_meeting', label: '会議', icon: '🤝', color: '#00d4ff' },
  { id: 'biz_presentation', label: 'プレゼン', icon: '📊', color: '#7c3aed' },
  { id: 'biz_email', label: 'メール', icon: '📧', color: '#10b981' },
  { id: 'biz_negotiation', label: '交渉', icon: '💼', color: '#f59e0b' },
  { id: 'biz_smalltalk', label: '雑談', icon: '☕', color: '#ef4444' },
  { id: 'biz_call', label: '電話・Web会議', icon: '💻', color: '#8b5cf6' },
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

const BIZ_PHRASES = {
  biz_meeting: [
    { en: "Shall we get started?", ja: "始めましょうか？", example: "It's 2 o'clock. Shall we get started?" },
    { en: "Let's go over the agenda.", ja: "議題を確認しましょう。", example: "Before we begin, let's go over the agenda." },
    { en: "Could you elaborate on that?", ja: "もう少し詳しく説明していただけますか？", example: "That's interesting. Could you elaborate on that?" },
    { en: "I'd like to add to that point.", ja: "その点について補足したいのですが。", example: "I'd like to add to that point — we also need to consider the budget." },
    { en: "Let's table that for now.", ja: "それはひとまず保留にしましょう。", example: "We're running out of time. Let's table that for now." },
    { en: "Can we take a five-minute break?", ja: "5分休憩してもいいですか？", example: "We've been at this for an hour. Can we take a five-minute break?" },
    { en: "To summarize what we've discussed...", ja: "これまで話し合ったことをまとめると…", example: "To summarize what we've discussed, we agreed on three key points." },
    { en: "Who's responsible for this action item?", ja: "このアクションアイテムの担当者は誰ですか？", example: "Who's responsible for this action item? I'll note it in the minutes." },
    { en: "Let's schedule a follow-up meeting.", ja: "フォローアップの会議を設定しましょう。", example: "Good progress today. Let's schedule a follow-up meeting for next week." },
    { en: "Does anyone have any objections?", ja: "反対意見はありますか？", example: "Before we finalize, does anyone have any objections?" },
  ],
  biz_presentation: [
    { en: "Thank you for having me today.", ja: "本日はお招きいただきありがとうございます。", example: "Good morning everyone. Thank you for having me today." },
    { en: "I'd like to walk you through...", ja: "…についてご説明したいと思います。", example: "I'd like to walk you through our Q3 results." },
    { en: "As you can see from this slide...", ja: "このスライドをご覧のとおり…", example: "As you can see from this slide, sales grew by 20%." },
    { en: "Let me highlight the key takeaways.", ja: "重要なポイントを強調させていただきます。", example: "Before I finish, let me highlight the key takeaways." },
    { en: "I'll take questions at the end.", ja: "質問は最後に受け付けます。", example: "Please hold your questions — I'll take questions at the end." },
    { en: "That's a great question.", ja: "素晴らしい質問ですね。", example: "That's a great question. Let me address that directly." },
    { en: "To put it simply...", ja: "簡単に言うと…", example: "To put it simply, our goal is to double revenue in two years." },
    { en: "The data clearly shows that...", ja: "データは明確に…を示しています。", example: "The data clearly shows that customer satisfaction is improving." },
    { en: "In conclusion...", ja: "結論として…", example: "In conclusion, I'd like to recommend we move forward with option B." },
    { en: "Please feel free to reach out.", ja: "お気軽にご連絡ください。", example: "If you have further questions, please feel free to reach out." },
  ],
  biz_email: [
    { en: "I hope this email finds you well.", ja: "お元気のこととお慶び申し上げます。", example: "Dear Mr. Smith, I hope this email finds you well." },
    { en: "I'm writing to follow up on...", ja: "…についてフォローアップのためご連絡しています。", example: "I'm writing to follow up on our meeting last Tuesday." },
    { en: "Please find the attached document.", ja: "添付書類をご確認ください。", example: "Please find the attached document for your review." },
    { en: "Could you please get back to me by...?", ja: "…までにご返信いただけますか？", example: "Could you please get back to me by Friday?" },
    { en: "I apologize for the late reply.", ja: "返信が遅くなり申し訳ございません。", example: "I apologize for the late reply — I was traveling last week." },
    { en: "Thank you for your prompt response.", ja: "迅速なご返信ありがとうございます。", example: "Thank you for your prompt response to my inquiry." },
    { en: "Let me know if you have any questions.", ja: "ご不明な点があればお知らせください。", example: "Let me know if you have any questions about the proposal." },
    { en: "I look forward to hearing from you.", ja: "ご連絡をお待ちしております。", example: "Best regards, and I look forward to hearing from you." },
    { en: "As per our previous discussion...", ja: "先日のご議論の通り…", example: "As per our previous discussion, I've revised the timeline." },
    { en: "Please advise at your earliest convenience.", ja: "お手すきの際にご指示いただけますか。", example: "We need a decision by end of week. Please advise at your earliest convenience." },
  ],
  biz_negotiation: [
    { en: "We'd like to propose...", ja: "…を提案したいと思います。", example: "We'd like to propose a 10% discount for bulk orders." },
    { en: "That's beyond our budget.", ja: "それは予算を超えています。", example: "I appreciate the offer, but that's beyond our budget." },
    { en: "Is there any flexibility on the price?", ja: "価格について融通はありますか？", example: "Is there any flexibility on the price if we commit to a long-term contract?" },
    { en: "Can we meet somewhere in the middle?", ja: "お互いに歩み寄れませんか？", example: "Both sides have valid points. Can we meet somewhere in the middle?" },
    { en: "That sounds reasonable.", ja: "それは理にかなっていると思います。", example: "A 5% reduction — that sounds reasonable to me." },
    { en: "I need to consult with my team.", ja: "チームと相談する必要があります。", example: "This is a significant decision. I need to consult with my team first." },
    { en: "What are your terms?", ja: "条件はどのようなものですか？", example: "We're interested in moving forward. What are your terms?" },
    { en: "We can offer a volume discount.", ja: "数量割引を提供できます。", example: "For orders over 100 units, we can offer a volume discount." },
    { en: "Let's draw up a formal agreement.", ja: "正式な契約書を作成しましょう。", example: "I'm glad we reached an agreement. Let's draw up a formal agreement." },
    { en: "We have a deal.", ja: "合意しました。", example: "After reviewing the terms — we have a deal!" },
  ],
  biz_smalltalk: [
    { en: "How was your weekend?", ja: "週末はいかがでしたか？", example: "Good Monday morning! How was your weekend?" },
    { en: "Did you catch the game last night?", ja: "昨夜の試合見ましたか？", example: "Did you catch the game last night? It was incredible!" },
    { en: "How are things going on your end?", ja: "そちらの状況はいかがですか？", example: "Hi Sarah! How are things going on your end?" },
    { en: "I've been swamped lately.", ja: "最近とても忙しくしていました。", example: "Sorry I haven't been in touch — I've been swamped lately." },
    { en: "Any plans for the holidays?", ja: "連休の予定はありますか？", example: "The Golden Week is coming up. Any plans for the holidays?" },
    { en: "That went better than expected.", ja: "予想より上手くいきました。", example: "That went better than expected! The client seemed really happy." },
    { en: "Between you and me...", ja: "ここだけの話ですが…", example: "Between you and me, I think the new strategy will really work." },
    { en: "I couldn't agree more.", ja: "まったくその通りですね。", example: "Remote work really boosts productivity — I couldn't agree more." },
  ],
  biz_call: [
    { en: "Can you hear me clearly?", ja: "はっきり聞こえますか？", example: "Before we start, can you hear me clearly?" },
    { en: "I think you're on mute.", ja: "ミュートになっていると思います。", example: "We can't hear you — I think you're on mute." },
    { en: "Could you repeat that, please?", ja: "もう一度おっしゃっていただけますか？", example: "Sorry, the line was breaking up. Could you repeat that, please?" },
    { en: "Let me share my screen.", ja: "画面を共有します。", example: "To show you the data, let me share my screen." },
    { en: "We're experiencing some technical difficulties.", ja: "技術的な問題が発生しています。", example: "We're experiencing some technical difficulties. Please bear with us." },
    { en: "Let's get everyone on the call.", ja: "全員を通話に参加させましょう。", example: "I'll send the link now. Let's get everyone on the call." },
    { en: "I'll send the recording afterward.", ja: "後で録画を送ります。", example: "For those who can't attend, I'll send the recording afterward." },
    { en: "Are there any questions before we wrap up?", ja: "終わる前に質問はありますか？", example: "We're almost out of time. Are there any questions before we wrap up?" },
  ],
};

const BIZ_DIALOGUES = [
  {
    id: 'biz_kickoff',
    title: 'プロジェクト会議',
    level: 'B1',
    icon: '🤝',
    isBusiness: true,
    lines: [
      { speaker: 'Manager', en: "Good morning everyone. Shall we get started?", ja: "おはようございます。始めましょうか？" },
      { speaker: 'You', en: "Good morning. Yes, I'm ready.", ja: "おはようございます。はい、準備できています。" },
      { speaker: 'Manager', en: "Great. Let's go over the agenda for today's kickoff meeting.", ja: "では、本日のキックオフ会議の議題を確認しましょう。" },
      { speaker: 'You', en: "I'd like to walk you through the project timeline first.", ja: "まずプロジェクトのスケジュールをご説明したいと思います。" },
      { speaker: 'Manager', en: "That sounds good. Could you elaborate on the delivery dates?", ja: "良いですね。納期についてもう少し詳しく教えていただけますか？" },
      { speaker: 'You', en: "Of course. The data clearly shows that we can deliver Phase 1 by end of March.", ja: "もちろんです。データによると、3月末までにフェーズ1を納品できます。" },
      { speaker: 'Manager', en: "Does anyone have any objections?", ja: "反対意見はありますか？" },
      { speaker: 'You', en: "No objections from my side. Let's schedule a follow-up meeting next week.", ja: "私の方からは異論ありません。来週フォローアップ会議を設定しましょう。" },
    ],
  },
  {
    id: 'biz_negotiation',
    title: '価格交渉',
    level: 'B1',
    icon: '💼',
    isBusiness: true,
    lines: [
      { speaker: 'Client', en: "Thank you for the proposal. However, that's beyond our budget.", ja: "提案書をありがとうございます。しかし、それは予算を超えています。" },
      { speaker: 'You', en: "I understand. Is there any flexibility on the scope?", ja: "承知しました。スコープについて融通はありますか？" },
      { speaker: 'Client', en: "We could reduce Phase 3 features. Can we meet somewhere in the middle?", ja: "フェーズ3の機能を削減することはできます。お互いに歩み寄れませんか？" },
      { speaker: 'You', en: "We can offer a volume discount if you commit to a 12-month contract.", ja: "12ヶ月契約をコミットしていただければ、数量割引を提供できます。" },
      { speaker: 'Client', en: "That sounds reasonable. I need to consult with my team first.", ja: "それは理にかなっていますね。まずチームと相談する必要があります。" },
      { speaker: 'You', en: "Of course. Please feel free to reach out by Friday.", ja: "もちろんです。金曜日までにお気軽にご連絡ください。" },
      { speaker: 'Client', en: "We have a deal. Let's draw up a formal agreement.", ja: "合意しました。正式な契約書を作成しましょう。" },
    ],
  },
  {
    id: 'biz_presentation',
    title: 'プレゼン発表',
    level: 'B2',
    icon: '📊',
    isBusiness: true,
    lines: [
      { speaker: 'You', en: "Good afternoon. Thank you for having me today.", ja: "こんにちは。本日はお招きいただきありがとうございます。" },
      { speaker: 'You', en: "I'd like to walk you through our Q3 performance and future strategy.", ja: "第3四半期の業績と今後の戦略についてご説明したいと思います。" },
      { speaker: 'You', en: "As you can see from this slide, revenue grew by 25% year over year.", ja: "このスライドをご覧のとおり、売上は前年比25%増加しました。" },
      { speaker: 'Audience', en: "Could you elaborate on the growth drivers?", ja: "成長要因についてもう少し詳しく説明していただけますか？" },
      { speaker: 'You', en: "That's a great question. To put it simply, three factors drove the growth.", ja: "素晴らしい質問ですね。簡単に言うと、3つの要因が成長を牽引しました。" },
      { speaker: 'You', en: "In conclusion, I'd like to recommend we invest in digital channels.", ja: "結論として、デジタルチャネルへの投資を推奨したいと思います。" },
      { speaker: 'Audience', en: "Excellent presentation! Are there any risks we should be aware of?", ja: "素晴らしいプレゼンでした！注意すべきリスクはありますか？" },
      { speaker: 'You', en: "Let me highlight the key risks. I'll take further questions at the end.", ja: "主なリスクを強調させていただきます。詳細な質問は最後に受け付けます。" },
    ],
  },
];

// ---- Storage Keys ----
const PROGRESS_KEY = 'english_app_progress';
const FAVORITES_KEY = 'english_app_favorites';
const SRS_KEY = 'english_app_srs';
const STAMPS_KEY = 'english_app_stamps';

// SRS levels: 0=New, 1=Learning(1d), 2=Young(3d), 3=Mature(7d), 4=Mastered(21d)
const SRS_INTERVALS = [0, 1, 3, 7, 21];

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; } catch { return {}; }
}
function saveProgress(data) { localStorage.setItem(PROGRESS_KEY, JSON.stringify(data)); }

function loadFavorites() {
  try { return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []; } catch { return []; }
}
function saveFavorites(data) { localStorage.setItem(FAVORITES_KEY, JSON.stringify(data)); }

function loadSRS() {
  try { return JSON.parse(localStorage.getItem(SRS_KEY)) || {}; } catch { return {}; }
}
function saveSRS(data) { localStorage.setItem(SRS_KEY, JSON.stringify(data)); }

function loadStamps() {
  try { return JSON.parse(localStorage.getItem(STAMPS_KEY)) || []; } catch { return []; }
}
function saveStamps(data) { localStorage.setItem(STAMPS_KEY, JSON.stringify(data)); }

function todayStr() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function stampToday() {
  const stamps = loadStamps();
  const today = todayStr();
  if (!stamps.includes(today)) {
    stamps.push(today);
    saveStamps(stamps);
  }
}

function getStreak() {
  const stamps = loadStamps().sort();
  if (stamps.length === 0) return 0;
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const s = d.toISOString().slice(0, 10);
    if (stamps.includes(s)) { streak++; } else { break; }
  }
  return streak;
}

function getSRSCard(key) {
  const srs = loadSRS();
  return srs[key] || { level: 0, nextReview: todayStr() };
}

function updateSRSCard(key, correct) {
  const srs = loadSRS();
  const card = srs[key] || { level: 0, nextReview: todayStr() };
  if (correct) {
    card.level = Math.min(4, card.level + 1);
  } else {
    card.level = Math.max(1, card.level - 1);
  }
  const days = SRS_INTERVALS[card.level];
  const next = new Date();
  next.setDate(next.getDate() + days);
  card.nextReview = next.toISOString().slice(0, 10);
  srs[key] = card;
  saveSRS(srs);
  return card;
}

function getDueCards() {
  const srs = loadSRS();
  const today = todayStr();
  const allPhrases = [];
  [...CATEGORIES, ...BIZ_CATEGORIES].forEach(cat => {
    const phrases = (PHRASES[cat.id] || BIZ_PHRASES[cat.id] || []);
    phrases.forEach((p, i) => {
      const key = `${cat.id}_${i}`;
      const card = srs[key] || { level: 0, nextReview: today };
      if (card.nextReview <= today) {
        allPhrases.push({ key, phrase: p, card, catId: cat.id });
      }
    });
  });
  return allPhrases.slice(0, 20); // Max 20 per session
}
