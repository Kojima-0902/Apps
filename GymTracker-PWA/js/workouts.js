const Workouts = {
  // Temp state for add form
  _tempSets: [],
  _tempDate: '',
  _tempDuration: 60,
  _tempNote: '',

  showAdd() {
    this._tempSets = [];
    this._tempDate = new Date().toISOString().slice(0, 10);
    this._tempDuration = 60;
    this._tempNote = '';
    Router.navigate('add-workout');
  },

  formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return `${d.getMonth() + 1}/${d.getDate()} (${days[d.getDay()]})`;
  },

  formatMonthYear(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return `${d.getFullYear()}年${d.getMonth() + 1}月`;
  },

  renderList(container) {
    const workouts = Store.getWorkouts();

    if (workouts.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🏋️</div>
          <div class="empty-state-text">トレーニング記録がありません<br>＋ボタンから記録を追加しましょう</div>
          <button class="btn btn-primary" style="width:auto" onclick="Workouts.showAdd()">記録を追加</button>
        </div>`;
      return;
    }

    // Group by month
    const grouped = {};
    workouts.forEach(w => {
      const month = this.formatMonthYear(w.date);
      if (!grouped[month]) grouped[month] = [];
      grouped[month].push(w);
    });

    let html = '';
    for (const [month, items] of Object.entries(grouped)) {
      html += `<div class="section-title">${month}</div>`;
      items.forEach(w => {
        const groups = [...new Set(w.exercises.map(e => e.group))];
        const totalVol = w.exercises.reduce((sum, e) => sum + (e.weight * e.reps), 0);
        const setCount = w.exercises.length;

        html += `
          <div class="card" onclick="Workouts.showDetail('${w.id}')" style="cursor:pointer">
            <div class="card-header">
              <span class="card-date">${this.formatDate(w.date)}</span>
              ${w.duration ? `<span class="card-meta">⏱ ${w.duration}分</span>` : ''}
            </div>
            <div class="tags">${groups.map(g => `<span class="tag">${g}</span>`).join('')}</div>
            <div class="card-meta">${setCount}セット · 合計 ${Math.round(totalVol).toLocaleString()} kg</div>
          </div>`;
      });
    }

    container.innerHTML = html;
  },

  showDetail(id) {
    Router.navigate('workout-detail', id);
  },

  renderDetail(container, id) {
    const w = Store.getWorkouts().find(w => w.id === id);
    if (!w) { Router.back(); return; }

    const totalVol = w.exercises.reduce((sum, e) => sum + (e.weight * e.reps), 0);

    // Group exercises by name
    const exerciseGroups = {};
    w.exercises.forEach(e => {
      if (!exerciseGroups[e.name]) exerciseGroups[e.name] = [];
      exerciseGroups[e.name].push(e);
    });

    let html = `
      <div class="card">
        <div class="flex-between mb-8">
          <span class="card-meta">📅 日付</span>
          <span>${this.formatDate(w.date)}</span>
        </div>
        ${w.duration ? `<div class="flex-between mb-8"><span class="card-meta">⏱ 時間</span><span>${w.duration}分</span></div>` : ''}
        <div class="flex-between mb-8">
          <span class="card-meta">🔥 合計ボリューム</span>
          <span style="color:var(--primary);font-weight:700">${Math.round(totalVol).toLocaleString()} kg</span>
        </div>
        ${w.note ? `<div class="flex-between"><span class="card-meta">📝 メモ</span><span>${this._escapeHtml(w.note)}</span></div>` : ''}
      </div>`;

    for (const [name, sets] of Object.entries(exerciseGroups)) {
      const groupVol = sets.reduce((s, e) => s + e.weight * e.reps, 0);
      html += `<div class="exercise-group-header">${name}</div><div class="card">`;
      sets.forEach((e, i) => {
        html += `
          <div class="set-row">
            <span class="set-num">Set ${i + 1}</span>
            <span>${e.weight} kg</span>
            <span style="color:var(--text-secondary);margin:0 4px">×</span>
            <span>${e.reps} 回</span>
            <span class="set-vol">${Math.round(e.weight * e.reps)} kg</span>
          </div>`;
      });
      html += `<div class="totals-row">小計 ${Math.round(groupVol).toLocaleString()} kg</div></div>`;
    }

    html += `
      <div class="mt-16">
        <button class="btn btn-danger" style="width:100%" onclick="Workouts.confirmDelete('${w.id}')">この記録を削除</button>
      </div>`;

    container.innerHTML = html;
  },

  confirmDelete(id) {
    if (confirm('この記録を削除しますか？')) {
      Store.deleteWorkout(id);
      Router.back();
    }
  },

  renderAdd(container) {
    const groups = Store.getMuscleGroups();

    let setsHtml = '';
    // Group temp sets by exercise name
    const exerciseGroups = {};
    this._tempSets.forEach((s, i) => {
      if (!exerciseGroups[s.name]) exerciseGroups[s.name] = [];
      exerciseGroups[s.name].push({ ...s, _index: i });
    });

    for (const [name, sets] of Object.entries(exerciseGroups)) {
      setsHtml += `<div class="exercise-group-header">${name}</div>`;
      sets.forEach((s, setNum) => {
        setsHtml += `
          <div class="set-row">
            <span class="set-num">Set ${setNum + 1}</span>
            <div class="set-weight">
              <input type="number" inputmode="decimal" step="0.5" class="form-input-inline" value="${s.weight}" onchange="Workouts._updateSet(${s._index},'weight',this.value)" placeholder="0">
              <span class="set-unit">kg</span>
            </div>
            <div class="set-reps">
              <input type="number" inputmode="numeric" class="form-input-inline" style="width:55px" value="${s.reps}" onchange="Workouts._updateSet(${s._index},'reps',this.value)" placeholder="0">
              <span class="set-unit">回</span>
            </div>
            <button class="set-delete" onclick="Workouts._removeSet(${s._index})">✕</button>
          </div>`;
      });
      setsHtml += `
        <button class="btn-icon mt-8 mb-8" onclick="Workouts._addSetForExercise('${name}')">＋ セット追加</button>`;
    }

    container.innerHTML = `
      <div class="form-group">
        <label class="form-label">日付</label>
        <input type="date" class="form-input" value="${this._tempDate}" onchange="Workouts._tempDate=this.value">
      </div>

      <div class="form-group">
        <label class="form-label">トレーニング時間: ${this._tempDuration}分</label>
        <input type="range" min="0" max="300" step="5" value="${this._tempDuration}"
          style="width:100%;accent-color:var(--primary)"
          oninput="Workouts._tempDuration=+this.value;this.previousElementSibling.textContent='トレーニング時間: '+this.value+'分'">
      </div>

      <div class="form-group">
        <label class="form-label">メモ（任意）</label>
        <textarea class="form-input" rows="2" placeholder="調子が良かった、など" onchange="Workouts._tempNote=this.value">${this._tempNote}</textarea>
      </div>

      <button class="btn btn-secondary" style="width:100%;margin-bottom:12px" onclick="Workouts._showExercisePicker()">＋ 種目を追加</button>

      <div id="exercise-sets">${setsHtml}</div>

      <div class="mt-16">
        <button class="btn btn-primary" onclick="Workouts._save()" ${this._tempSets.length === 0 ? 'disabled' : ''}>保存</button>
      </div>

      <div id="exercise-picker-modal" class="hidden"></div>`;
  },

  _updateSet(index, field, value) {
    if (field === 'weight') this._tempSets[index].weight = parseFloat(value) || 0;
    if (field === 'reps') this._tempSets[index].reps = parseInt(value) || 0;
  },

  _removeSet(index) {
    this._tempSets.splice(index, 1);
    this.renderAdd(document.getElementById('main'));
  },

  _addSetForExercise(name) {
    const existing = this._tempSets.filter(s => s.name === name);
    const last = existing[existing.length - 1];
    const lastGlobalIndex = this._tempSets.lastIndexOf(last);
    const newSet = { name, group: last.group, weight: last.weight, reps: last.reps };
    this._tempSets.splice(lastGlobalIndex + 1, 0, newSet);
    this.renderAdd(document.getElementById('main'));
  },

  _showExercisePicker() {
    const modal = document.getElementById('exercise-picker-modal');
    const groups = Store.getMuscleGroups();
    const exercises = Store.getDefaultExercises();

    let selectedGroup = groups[0];

    const render = () => {
      const filtered = exercises.filter(e => e.group === selectedGroup);
      modal.className = '';
      modal.innerHTML = `
        <div class="modal-overlay" onclick="Workouts._closeExercisePicker(event)">
          <div class="modal" onclick="event.stopPropagation()">
            <div class="modal-header">
              <h2>種目を選択</h2>
              <button class="modal-close" onclick="Workouts._closeExercisePicker()">✕</button>
            </div>
            <div class="modal-body">
              <div class="muscle-pills">
                ${groups.map(g => `<button class="muscle-pill ${g === selectedGroup ? 'active' : ''}" onclick="this._selGroup='${g}'" data-group="${g}">${g}</button>`).join('')}
              </div>
              <div>
                ${filtered.map(e => `
                  <div class="exercise-list-item" onclick="Workouts._selectExercise('${e.name}','${e.group}')">
                    <span style="color:${Store.getMuscleGroupColor(e.group)}">●</span>
                    <span>${e.name}</span>
                  </div>`).join('')}
              </div>
              <div class="mt-16" style="display:flex;gap:8px">
                <input type="text" id="custom-exercise-name" class="form-input" placeholder="カスタム種目名" style="flex:1">
                <button class="btn btn-primary" style="width:auto;white-space:nowrap" onclick="Workouts._addCustomExercise('${selectedGroup}')">追加</button>
              </div>
            </div>
          </div>
        </div>`;

      // Attach group click handlers
      modal.querySelectorAll('.muscle-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          selectedGroup = btn.dataset.group;
          render();
        });
      });
    };

    render();
  },

  _closeExercisePicker(event) {
    if (event && event.target !== event.currentTarget) return;
    const modal = document.getElementById('exercise-picker-modal');
    modal.className = 'hidden';
    modal.innerHTML = '';
  },

  _selectExercise(name, group) {
    this._tempSets.push({ name, group, weight: 0, reps: 0 });
    this._closeExercisePicker();
    this.renderAdd(document.getElementById('main'));
  },

  _addCustomExercise(group) {
    const input = document.getElementById('custom-exercise-name');
    const name = input.value.trim();
    if (!name) return;
    this._tempSets.push({ name, group, weight: 0, reps: 0 });
    this._closeExercisePicker();
    this.renderAdd(document.getElementById('main'));
  },

  _save() {
    if (this._tempSets.length === 0) return;

    const workout = {
      date: this._tempDate,
      duration: this._tempDuration,
      note: this._tempNote,
      exercises: this._tempSets.map(s => ({
        name: s.name,
        group: s.group,
        weight: s.weight,
        reps: s.reps,
      })),
    };

    Store.saveWorkout(workout);
    Router.back();
  },

  _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },
};
