const Store = {
  _get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  },

  _set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  // Workouts
  getWorkouts() {
    return this._get('workouts') || [];
  },

  saveWorkout(workout) {
    const workouts = this.getWorkouts();
    workout.id = workout.id || Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    workout.createdAt = workout.createdAt || new Date().toISOString();
    workouts.push(workout);
    workouts.sort((a, b) => new Date(b.date) - new Date(a.date));
    this._set('workouts', workouts);
    return workout;
  },

  deleteWorkout(id) {
    const workouts = this.getWorkouts().filter(w => w.id !== id);
    this._set('workouts', workouts);
  },

  // Body weight
  getBodyWeights() {
    return this._get('bodyweights') || [];
  },

  saveBodyWeight(entry) {
    const entries = this.getBodyWeights();
    entry.id = entry.id || Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    entries.push(entry);
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    this._set('bodyweights', entries);
    return entry;
  },

  deleteBodyWeight(id) {
    const entries = this.getBodyWeights().filter(e => e.id !== id);
    this._set('bodyweights', entries);
  },

  // Exercise templates
  getDefaultExercises() {
    return [
      { name: 'ベンチプレス', group: '胸' },
      { name: 'ダンベルプレス', group: '胸' },
      { name: 'インクラインベンチプレス', group: '胸' },
      { name: 'チェストフライ', group: '胸' },
      { name: 'ディップス', group: '胸' },
      { name: 'デッドリフト', group: '背中' },
      { name: 'ラットプルダウン', group: '背中' },
      { name: 'ベントオーバーロウ', group: '背中' },
      { name: 'チンニング（懸垂）', group: '背中' },
      { name: 'シーテッドロウ', group: '背中' },
      { name: 'ショルダープレス', group: '肩' },
      { name: 'サイドレイズ', group: '肩' },
      { name: 'フロントレイズ', group: '肩' },
      { name: 'リアデルトフライ', group: '肩' },
      { name: 'バーベルカール', group: '腕' },
      { name: 'ダンベルカール', group: '腕' },
      { name: 'トライセプスエクステンション', group: '腕' },
      { name: 'ハンマーカール', group: '腕' },
      { name: 'スクワット', group: '脚' },
      { name: 'レッグプレス', group: '脚' },
      { name: 'レッグカール', group: '脚' },
      { name: 'レッグエクステンション', group: '脚' },
      { name: 'カーフレイズ', group: '脚' },
      { name: 'ブルガリアンスクワット', group: '脚' },
      { name: 'クランチ', group: '腹筋' },
      { name: 'プランク', group: '腹筋' },
      { name: 'レッグレイズ', group: '腹筋' },
      { name: 'アブローラー', group: '腹筋' },
      { name: 'ランニング', group: '有酸素' },
      { name: 'エアロバイク', group: '有酸素' },
      { name: 'ローイング', group: '有酸素' },
    ];
  },

  getMuscleGroups() {
    return ['胸', '背中', '肩', '腕', '脚', '腹筋', '有酸素', 'その他'];
  },

  getMuscleGroupColor(group) {
    const colors = {
      '胸': '#ff6b6b',
      '背中': '#5b9aff',
      '肩': '#2ed573',
      '腕': '#a66bff',
      '脚': '#ff8c00',
      '腹筋': '#ffd32a',
      '有酸素': '#ff6b9d',
      'その他': '#888',
    };
    return colors[group] || '#888';
  },
};
