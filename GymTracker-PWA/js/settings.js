const Settings = {
  render(container) {
    const workouts = Store.getWorkouts();
    const bodyweights = Store.getBodyWeights();

    container.innerHTML = `
      <div class="card">
        <div class="section-title" style="margin-top:0">データ概要</div>
        <div class="flex-between mb-8">
          <span class="card-meta">トレーニング記録</span>
          <span>${workouts.length} 件</span>
        </div>
        <div class="flex-between">
          <span class="card-meta">体重記録</span>
          <span>${bodyweights.length} 件</span>
        </div>
      </div>

      <div class="card">
        <div class="section-title" style="margin-top:0">データのバックアップ</div>
        <p style="font-size:13px;color:var(--text-secondary);margin-bottom:12px">
          機種変更やデータ消失に備えて、バックアップを保存できます。
        </p>
        <button class="btn btn-primary mb-16" onclick="Settings.exportData()">
          データをエクスポート（保存）
        </button>

        <div class="section-title">データの復元</div>
        <p style="font-size:13px;color:var(--text-secondary);margin-bottom:12px">
          バックアップファイルからデータを復元します。<br>
          <span style="color:var(--danger)">※ 現在のデータは上書きされます</span>
        </p>
        <label class="btn btn-secondary" style="width:100%;cursor:pointer">
          バックアップファイルを選択
          <input type="file" accept=".json" style="display:none" onchange="Settings.importData(this)">
        </label>
      </div>

      <div class="card">
        <div class="section-title" style="margin-top:0;color:var(--danger)">データの削除</div>
        <p style="font-size:13px;color:var(--text-secondary);margin-bottom:12px">
          すべてのデータを削除します。この操作は取り消せません。
        </p>
        <button class="btn btn-danger" style="width:100%" onclick="Settings.clearAllData()">
          すべてのデータを削除
        </button>
      </div>`;
  },

  exportData() {
    const json = Store.exportData();
    const date = new Date().toISOString().slice(0, 10);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gymtracker-backup-${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('バックアップファイルをダウンロードしました');
  },

  importData(input) {
    const file = input.files[0];
    if (!file) return;

    if (!confirm('現在のデータが上書きされます。よろしいですか？')) {
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = Store.importData(e.target.result);
        alert(`復元が完了しました！\nトレーニング: ${result.workouts}件\n体重: ${result.bodyweights}件`);
        Settings.render(document.getElementById('main'));
      } catch (err) {
        alert('エラー: ' + err.message);
      }
      input.value = '';
    };
    reader.readAsText(file);
  },

  clearAllData() {
    if (!confirm('すべてのデータを削除しますか？\nこの操作は取り消せません。')) return;
    if (!confirm('本当に削除しますか？')) return;
    localStorage.removeItem('workouts');
    localStorage.removeItem('bodyweights');
    alert('すべてのデータを削除しました');
    Settings.render(document.getElementById('main'));
  },
};
