'use strict';

/**
 * セリフ辞書
 *
 * 元記事（ひよこプログラミング「Flutter で VIVANT のドラムが使うアプリを
 * 作成してみた」）の serifMap を移植したもの。
 *
 * フィールド:
 *   label   … ボタンの表示
 *   text    … セリフの正書き
 *   reading … 読み上げ用のテキスト（省略時は text をそのまま読み上げる）
 *             音声エンジンが漢字を読み間違える語だけ指定している
 *   status  … 出典の確度
 *               'exact'   元記事から全文をそのまま復元できたセリフ
 *               'guessed' 元記事のPDFからテキストを抽出した際に漢字が欠落して
 *                         おり、かな部分の骨格から文脈で補完したセリフ（要確認）
 *
 * status: 'guessed' のセリフは text（と reading）を書き換えるだけで直せます。
 */
const SERIFS = [
    // ---- 1話 ----
    {
        label: 'ドラムです',
        text: '私はドラムです。よろしくね。',
        status: 'guessed', // 「◯はドラムです。よろしくね。」の◯を「私」と補完
        episode: 1,
    },
    {
        label: '了解',
        text: '了解、乃木さん。',
        reading: '了解、のぎさん。', // 「乃木」の読みは音声エンジン依存
        status: 'guessed', // 復元できたのは「◯さん。」のみ
        episode: 1,
    },
    {
        label: '案内',
        text: '皆さん、このおじさんが案内してくれますから。',
        status: 'exact',
        episode: 1,
    },
    {
        label: '10万ドル',
        text: 'でも本当にやばい。100,000ドルっていうのは。',
        reading: 'でも本当にやばい。10万ドルっていうのは。', // 桁区切りのカンマで区切って読まれるのを回避
        status: 'exact',
        episode: 1,
    },
    {
        label: 'みんな警察',
        text: '疑ったほうがいいよ。',
        status: 'guessed', // 復元できたのは「◯ったほうがいいよ。」のみ
        episode: 1,
    },
    {
        label: 'チンギス',
        text: '一族で一番優秀ね。',
        status: 'guessed', // 「◯で一番優秀ね。」の◯を補完
        episode: 1,
    },
    {
        label: 'クーダン',
        text: '別班。',
        reading: 'べっぱん。', // 「別班」は「べつはん」と読まれやすい
        status: 'guessed', // 復元できたのは「◯。」のみ
        episode: 1,
    },
    {
        label: 'これでいい?',
        text: '乃木さん。',
        reading: 'のぎさん。',
        status: 'guessed', // 復元できたのは「◯さん。」のみ
        episode: 1,
    },
    // ---- 2話 ----
    {
        label: 'ガラすき',
        text: '今、正門、ガラすきよ。チャンス、チャンス。',
        reading: 'いま、正門、ガラすきよ。チャンス、チャンス。', // 「今」が「こん」と読まれるのを回避
        status: 'guessed', // 「◯、正門、…」の◯を「今」と補完
        episode: 2,
    },
    // ---- 4話 ----
    {
        label: '日本来た',
        text: '嬉しい。これからもよろしくね。',
        status: 'guessed', // 「◯しい。これからも…」の◯を「嬉」と補完
        episode: 4,
    },
    // ---- 5話 ----
    {
        label: 'どうかした?',
        text: '乃木さん',
        reading: 'のぎさん',
        status: 'guessed', // 復元できたのは「◯さん」のみ
        episode: 5,
    },
];
