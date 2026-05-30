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

// =========================================================
// INTERACTIVE ROLEPLAYS (音声会話)
// role: 'npc' = AIが話す / 'you' = あなたが声で返す
// you turn: ja=言いたいこと, en=お手本, accept=許容される他の言い方
// =========================================================
const ROLEPLAYS = [
  {
    id: 'rp_greet',
    title: 'はじめての挨拶',
    icon: '👋',
    level: 'A1',
    scene: 'パーティーで初対面の人に話しかけられました。',
    canDo: '初対面の人と挨拶して自己紹介できる',
    npcName: 'Emma',
    turns: [
      { role: 'npc', en: "Hi there! I'm Emma. Nice to meet you.", ja: "こんにちは！エマです。はじめまして。" },
      { role: 'you', ja: "はじめまして。私はユウキです。", en: "Nice to meet you too. I'm Yuki.", accept: ["nice to meet you too im yuki", "nice to meet you i am yuki", "im yuki nice to meet you"] },
      { role: 'npc', en: "Where are you from, Yuki?", ja: "ユウキ、どこの出身ですか？" },
      { role: 'you', ja: "日本出身です。", en: "I'm from Japan.", accept: ["im from japan", "i am from japan", "from japan"] },
      { role: 'npc', en: "Oh, nice! What do you do?", ja: "いいですね！お仕事は何ですか？" },
      { role: 'you', ja: "エンジニアとして働いています。", en: "I work as an engineer.", accept: ["i work as an engineer", "im an engineer", "i am an engineer"] },
      { role: 'npc', en: "That's cool! It was great talking to you.", ja: "素敵ですね！お話できて良かったです。" },
      { role: 'you', ja: "私もです。またね！", en: "You too. See you later!", accept: ["you too see you later", "me too see you", "you too see you"] },
    ],
  },
  {
    id: 'rp_cafe',
    title: 'カフェで注文',
    icon: '☕',
    level: 'A1',
    scene: 'お気に入りのカフェに来ました。店員さんが注文を取りに来ます。',
    canDo: 'カフェで飲み物と食べ物を注文できる',
    npcName: 'Barista',
    turns: [
      { role: 'npc', en: "Hi! Welcome. What can I get for you?", ja: "こんにちは！いらっしゃいませ。ご注文は？" },
      { role: 'you', ja: "コーヒーを1つください。", en: "Can I have a coffee, please?", accept: ["can i have a coffee please", "can i get a coffee", "a coffee please", "i'd like a coffee"] },
      { role: 'npc', en: "Sure! Hot or iced?", ja: "かしこまりました！ホットとアイス、どちらにしますか？" },
      { role: 'you', ja: "ホットでお願いします。", en: "Hot, please.", accept: ["hot please", "hot one please", "a hot one please"] },
      { role: 'npc', en: "Got it. Anything else?", ja: "承知しました。他にご注文は？" },
      { role: 'you', ja: "チョコレートケーキもください。", en: "A chocolate cake, too, please.", accept: ["a chocolate cake too please", "chocolate cake please", "and a chocolate cake", "a chocolate cake please"] },
      { role: 'npc', en: "Great choice! That'll be 8 dollars.", ja: "良い選択ですね！8ドルになります。" },
      { role: 'you', ja: "はい、どうぞ。ありがとう！", en: "Here you go. Thank you!", accept: ["here you go thank you", "here you are thanks", "here you go thanks"] },
    ],
  },
  {
    id: 'rp_restaurant',
    title: 'レストランで食事',
    icon: '🍽️',
    level: 'A2',
    scene: '友達とレストランに来ました。ウェイターが席まで案内してくれます。',
    canDo: 'レストランで席を頼み、料理を注文できる',
    npcName: 'Waiter',
    turns: [
      { role: 'npc', en: "Good evening! How many people?", ja: "こんばんは！何名様ですか？" },
      { role: 'you', ja: "2名でお願いします。", en: "A table for two, please.", accept: ["a table for two please", "two please", "table for two", "for two please"] },
      { role: 'npc', en: "Right this way. Here's the menu.", ja: "こちらへどうぞ。メニューです。" },
      { role: 'you', ja: "おすすめは何ですか？", en: "What do you recommend?", accept: ["what do you recommend", "whats your recommendation", "any recommendations"] },
      { role: 'npc', en: "Our pasta is very popular today.", ja: "本日はパスタが大人気です。" },
      { role: 'you', ja: "では、パスタを注文します。", en: "I'd like to order the pasta, then.", accept: ["id like to order the pasta", "i'll have the pasta", "ill take the pasta", "the pasta please", "i would like the pasta"] },
      { role: 'npc', en: "Excellent choice. Anything to drink?", ja: "素晴らしい選択です。お飲み物は？" },
      { role: 'you', ja: "お水をいただけますか？", en: "Could I have some water?", accept: ["could i have some water", "can i have water", "some water please", "water please"] },
    ],
  },
  {
    id: 'rp_directions',
    title: '道をたずねる',
    icon: '🗺️',
    level: 'A2',
    scene: '旅行中、駅への行き方がわからなくなりました。通りすがりの人に聞いてみましょう。',
    canDo: '道を尋ねて行き方を理解できる',
    npcName: 'Local',
    turns: [
      { role: 'you', ja: "すみません！駅はどこですか？", en: "Excuse me! Where is the station?", accept: ["excuse me where is the station", "where is the station", "wheres the station", "excuse me wheres the station"] },
      { role: 'npc', en: "Go straight and turn left at the corner.", ja: "まっすぐ行って、角を左に曲がってください。" },
      { role: 'you', ja: "ここからどのくらいですか？", en: "How far is it from here?", accept: ["how far is it from here", "how far is it", "is it far", "how far"] },
      { role: 'npc', en: "It's about a five-minute walk.", ja: "歩いて5分くらいです。" },
      { role: 'you', ja: "ありがとうございます！とても助かりました。", en: "Thank you so much! You're very helpful.", accept: ["thank you so much youre very helpful", "thank you so much", "thanks a lot youre very helpful", "thank you very much"] },
      { role: 'npc', en: "No problem! Have a great day!", ja: "どういたしまして！良い一日を！" },
      { role: 'you', ja: "あなたもね！", en: "You too!", accept: ["you too", "you to", "same to you"] },
    ],
  },
  {
    id: 'rp_smalltalk',
    title: '同僚と雑談',
    icon: '💬',
    level: 'A2',
    scene: '月曜の朝、オフィスで同僚に話しかけられました。',
    canDo: '職場で軽い雑談ができる',
    npcName: 'Mike',
    turns: [
      { role: 'npc', en: "Morning! How was your weekend?", ja: "おはよう！週末はどうだった？" },
      { role: 'you', ja: "とても良かったよ。映画を見に行ったんだ。", en: "It was great. I went to the movies.", accept: ["it was great i went to the movies", "it was great i went to the movie", "great i went to the movies", "it was good i went to the movies"] },
      { role: 'npc', en: "Nice! What did you see?", ja: "いいね！何を見たの？" },
      { role: 'you', ja: "新しいアクション映画だよ。すごく面白かった。", en: "A new action movie. It was really fun.", accept: ["a new action movie it was really fun", "a new action movie it was fun", "new action movie it was really fun"] },
      { role: 'npc', en: "Sounds awesome. I should check it out.", ja: "面白そう。僕も見てみようかな。" },
      { role: 'you', ja: "ぜひ！おすすめだよ。", en: "You should! I recommend it.", accept: ["you should i recommend it", "you should i recommend", "definitely i recommend it"] },
    ],
  },
  {
    id: 'rp_shopping',
    title: '買い物をする',
    icon: '🛍️',
    level: 'A2',
    scene: '洋服屋さんで気になるジャケットを見つけました。',
    canDo: '店で値段やサイズを聞いて買い物できる',
    npcName: 'Clerk',
    turns: [
      { role: 'npc', en: "Hi! Can I help you find anything?", ja: "こんにちは！何かお探しですか？" },
      { role: 'you', ja: "このジャケットはいくらですか？", en: "How much is this jacket?", accept: ["how much is this jacket", "hows much is this jacket", "how much is the jacket", "whats the price of this jacket"] },
      { role: 'npc', en: "It's 50 dollars. It's on sale!", ja: "50ドルです。セール中ですよ！" },
      { role: 'you', ja: "Mサイズはありますか？", en: "Do you have it in medium?", accept: ["do you have it in medium", "do you have a medium", "is there a medium", "do you have this in medium"] },
      { role: 'npc', en: "Yes, we do. Would you like to try it on?", ja: "はい、ございます。試着なさいますか？" },
      { role: 'you', ja: "はい、試着できますか？", en: "Yes, can I try it on?", accept: ["yes can i try it on", "can i try it on", "yes id like to try it on", "yes please can i try it on"] },
      { role: 'npc', en: "Of course! The fitting room is over there.", ja: "もちろんです！試着室はあちらです。" },
      { role: 'you', ja: "ぴったりです。これにします！", en: "It fits perfectly. I'll take it!", accept: ["it fits perfectly ill take it", "it fits ill take it", "perfect ill take it", "it fits perfectly i will take it"] },
    ],
  },
  {
    id: 'rp_meeting',
    title: '会議で発言する',
    icon: '🤝',
    level: 'B1',
    scene: 'チーム会議。あなたの意見を求められています。',
    canDo: '会議で自分の意見を英語で言える',
    npcName: 'Manager',
    turns: [
      { role: 'npc', en: "So, what do you think about this plan?", ja: "では、この計画についてどう思いますか？" },
      { role: 'you', ja: "良い考えだと思います。", en: "I think it's a good idea.", accept: ["i think its a good idea", "i think it is a good idea", "its a good idea", "i think thats a good idea"] },
      { role: 'npc', en: "Great. Do you have any concerns?", ja: "良いですね。何か懸念点はありますか？" },
      { role: 'you', ja: "予算について心配しています。", en: "I'm worried about the budget.", accept: ["im worried about the budget", "i am worried about the budget", "im concerned about the budget", "my concern is the budget"] },
      { role: 'npc', en: "Good point. Let's discuss that.", ja: "良い指摘です。それについて話しましょう。" },
      { role: 'you', ja: "もう少し詳しく説明していただけますか？", en: "Could you elaborate on that?", accept: ["could you elaborate on that", "can you elaborate", "could you explain more", "can you tell me more"] },
      { role: 'npc', en: "Sure. Let me share the numbers.", ja: "もちろん。数字を共有しますね。" },
      { role: 'you', ja: "ありがとうございます。賛成です。", en: "Thank you. I agree.", accept: ["thank you i agree", "thanks i agree", "thank you i agree with you"] },
    ],
  },
  {
    id: 'rp_hotel',
    title: 'ホテルでチェックイン',
    icon: '🏨',
    level: 'A2',
    scene: '旅行先のホテルに到着しました。フロントでチェックインします。',
    canDo: 'ホテルでチェックインして質問できる',
    npcName: 'Receptionist',
    turns: [
      { role: 'npc', en: "Good evening! Do you have a reservation?", ja: "こんばんは！ご予約はございますか？" },
      { role: 'you', ja: "はい、予約があります。田中です。", en: "Yes, I have a reservation under Tanaka.", accept: ["yes i have a reservation under tanaka", "yes i have a reservation tanaka", "i have a reservation under tanaka", "yes under tanaka"] },
      { role: 'npc', en: "Welcome, Mr. Tanaka. Two nights, correct?", ja: "ようこそ、田中様。2泊で間違いないですか？" },
      { role: 'you', ja: "はい、そうです。Wi-Fiはありますか？", en: "Yes, that's right. Is there Wi-Fi?", accept: ["yes thats right is there wifi", "yes is there wifi", "thats right is there wifi", "yes correct is there wifi"] },
      { role: 'npc', en: "Yes, it's free. Here's your key card.", ja: "はい、無料です。こちらがキーカードです。" },
      { role: 'you', ja: "ありがとう。朝食は何時ですか？", en: "Thanks. What time is breakfast?", accept: ["thanks what time is breakfast", "thank you what time is breakfast", "what time is breakfast"] },
      { role: 'npc', en: "Breakfast is from 7 to 10. Enjoy your stay!", ja: "朝食は7時から10時です。良いご滞在を！" },
      { role: 'you', ja: "ありがとう！", en: "Thank you!", accept: ["thank you", "thanks", "thank you so much"] },
    ],
  },
];

// can-do一覧 (現実のできること)
function getCanDoList() {
  return ROLEPLAYS.map(r => ({ id: r.id, label: r.canDo, icon: r.icon, done: !!loadCanDo()[r.id] }));
}

// ---- Storage Keys ----
const PROGRESS_KEY = 'english_app_progress';
const FAVORITES_KEY = 'english_app_favorites';
const SRS_KEY = 'english_app_srs';
const STAMPS_KEY = 'english_app_stamps';
const CANDO_KEY = 'english_app_cando';
const SCENES_KEY = 'english_app_scenes'; // total conversation scenes completed

function loadCanDo() {
  try { return JSON.parse(localStorage.getItem(CANDO_KEY)) || {}; } catch { return {}; }
}
function saveCanDo(data) { localStorage.setItem(CANDO_KEY, JSON.stringify(data)); }
function unlockCanDo(id) {
  const c = loadCanDo();
  const isNew = !c[id];
  c[id] = Date.now();
  saveCanDo(c);
  return isNew;
}

function getScenesCount() {
  try { return parseInt(localStorage.getItem(SCENES_KEY)) || 0; } catch { return 0; }
}
function addSceneCount() {
  const n = getScenesCount() + 1;
  localStorage.setItem(SCENES_KEY, n);
  return n;
}

// 励ましメッセージ (アイデンティティ・ベース / 即時祝福)
const CELEBRATIONS = [
  "今日もSpeakerとして話せた！ 🎉",
  "ネイティブみたいだった！ ⭐",
  "会話が成立したね！その調子！ 💪",
  "昨日より自然に話せてる！ 🌟",
  "あなたは英語を話す人です！ 🔥",
  "完璧なやりとりだった！ 👏",
];
function randomCelebration() {
  return CELEBRATIONS[Math.floor(Math.random() * CELEBRATIONS.length)];
}

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
