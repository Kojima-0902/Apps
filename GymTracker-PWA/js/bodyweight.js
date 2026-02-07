const BodyWeight = {
  _tempDate: '',
  _tempWeight: '',
  _tempNote: '',

  showAdd() {
    const entries = Store.getBodyWeights();
    this._tempDate = new Date().toISOString().slice(0, 10);
    this._tempWeight = entries.length > 0 ? entries[0].weight.toString() : '';
    this._tempNote = '';
    Router.navigate('add-bodyweight');
  },

  formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return `${d.getMonth() + 1}/${d.getDate()} (${days[d.getDay()]})`;
  },

  renderList(container) {
    const entries = Store.getBodyWeights();

    if (entries.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">⚖️</div>
          <div class="empty-state-text">体重記録がありません<br>＋ボタンから記録を追加しましょう</div>
          <button class="btn btn-primary" style="width:auto" onclick="BodyWeight.showAdd()">記録を追加</button>
        </div>`;
      return;
    }

    const latest = entries[0];
    const change = entries.length >= 2 ? latest.weight - entries[1].weight : null;

    let html = `
      <div class="weight-display">
        <div class="weight-big">${latest.weight.toFixed(1)}<span class="weight-unit"> kg</span></div>
        ${change !== null ? `
          <div class="weight-change ${change >= 0 ? 'up' : 'down'}">
            ${change >= 0 ? '↑' : '↓'} ${change >= 0 ? '+' : ''}${change.toFixed(1)} kg
          </div>` : ''}
      </div>`;

    // Stats
    if (entries.length >= 2) {
      const weights = entries.map(e => e.weight);
      const min = Math.min(...weights);
      const max = Math.max(...weights);
      const avg = weights.reduce((a, b) => a + b, 0) / weights.length;
      html += `
        <div class="stat-row mb-16">
          <div class="stat-item">
            <div class="stat-value" style="color:var(--blue)">${min.toFixed(1)}</div>
            <div class="stat-label">最小 kg</div>
          </div>
          <div class="stat-item">
            <div class="stat-value" style="color:var(--danger)">${max.toFixed(1)}</div>
            <div class="stat-label">最大 kg</div>
          </div>
          <div class="stat-item">
            <div class="stat-value" style="color:#a66bff">${avg.toFixed(1)}</div>
            <div class="stat-label">平均 kg</div>
          </div>
        </div>`;
    }

    html += `<div class="section-title">履歴</div><div class="card" style="padding:0;overflow:hidden">`;
    entries.forEach(e => {
      html += `
        <div class="bw-row">
          <span class="bw-date">${this.formatDate(e.date)}</span>
          <div style="display:flex;align-items:center;gap:12px">
            <span class="bw-value">${e.weight.toFixed(1)} kg</span>
            <button class="set-delete" onclick="event.stopPropagation();BodyWeight.confirmDelete('${e.id}')">✕</button>
          </div>
        </div>`;
    });
    html += `</div>`;

    container.innerHTML = html;
  },

  confirmDelete(id) {
    if (confirm('この記録を削除しますか？')) {
      Store.deleteBodyWeight(id);
      this.renderList(document.getElementById('main'));
    }
  },

  renderAdd(container) {
    const entries = Store.getBodyWeights();
    const lastWeight = entries.length > 0 ? entries[0].weight : null;

    container.innerHTML = `
      <div class="form-group">
        <label class="form-label">日付</label>
        <input type="date" class="form-input" value="${this._tempDate}" onchange="BodyWeight._tempDate=this.value">
      </div>

      <div class="form-group text-center" style="padding:20px 0">
        <input type="number" inputmode="decimal" step="0.1" class="big-input" value="${this._tempWeight}"
          oninput="BodyWeight._tempWeight=this.value" placeholder="0.0" autofocus>
        <span class="big-input-unit">kg</span>
        ${lastWeight ? `<div style="margin-top:12px;color:var(--text-secondary);font-size:13px">前回: <span style="color:var(--primary)">${lastWeight.toFixed(1)} kg</span></div>` : ''}
      </div>

      <div class="form-group">
        <label class="form-label">メモ（任意）</label>
        <textarea class="form-input" rows="2" placeholder="体調や食事メモなど" onchange="BodyWeight._tempNote=this.value">${this._tempNote}</textarea>
      </div>

      <div class="mt-16">
        <button class="btn btn-primary" onclick="BodyWeight._save()" id="bw-save-btn">保存</button>
      </div>`;
  },

  _save() {
    const weight = parseFloat(this._tempWeight);
    if (isNaN(weight) || weight <= 0) {
      alert('体重を入力してください');
      return;
    }

    Store.saveBodyWeight({
      date: this._tempDate,
      weight: weight,
      note: this._tempNote,
    });

    Router.back();
  },
};
