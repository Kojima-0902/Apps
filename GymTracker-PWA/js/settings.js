const Settings = {
  render(container) {
    const workouts = Store.getWorkouts();
    const bodyweights = Store.getBodyWeights();
    const lsBytes = Store.getLocalStorageBytes();

    container.innerHTML = `
      <div class="card">
        <div class="section-title" style="margin-top:0">データ概要</div>
        <div class="flex-between mb-8">
          <span class="card-meta">トレーニング記録</span>
          <span>${workouts.length} 件</span>
        </div>
        <div class="flex-between mb-8">
          <span class="card-meta">体重記録</span>
          <span>${bodyweights.length} 件</span>
        </div>
        <div class="flex-between mb-8">
          <span class="card-meta">データ使用量（localStorage）</span>
          <span>${Settings._formatBytes(lsBytes)}</span>
        </div>
        <div class="flex-between">
          <span class="card-meta">キャッシュ使用量</span>
          <span id="cache-size-display">計算中...</span>
        </div>
      </div>

      <div class="card">
        <div class="section-title" style="margin-top:0">ストレージの整理</div>
        <p style="font-size:13px;color:var(--text-secondary);margin-bottom:12px">
          古いトレーニング記録を削除して空き容量を確保できます。
        </p>
        <div class="flex-between mb-8">
          <button class="btn btn-secondary" style="flex:1;margin-right:8px" onclick="Settings.pruneOldWorkouts(6)">
            6ヶ月以上前を削除
          </button>
          <button class="btn btn-secondary" style="flex:1" onclick="Settings.pruneOldWorkouts(12)">
            1年以上前を削除
          </button>
        </div>
        <button class="btn btn-secondary" style="width:100%" onclick="Settings.clearCache()">
          キャッシュをクリア
        </button>
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

    Settings._updateCacheSize();
  },

  _formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  },

  async _updateCacheSize() {
    const el = document.getElementById('cache-size-display');
    if (!el || !('caches' in window)) {
      if (el) el.textContent = '非対応';
      return;
    }
    let total = 0;
    const keys = await caches.keys();
    for (const key of keys) {
      const cache = await caches.open(key);
      const requests = await cache.keys();
      for (const req of requests) {
        const res = await cache.match(req);
        if (res) {
          const buf = await res.clone().arrayBuffer();
          total += buf.byteLength;
        }
      }
    }
    if (el) el.textContent = Settings._formatBytes(total);
  },

  pruneOldWorkouts(months) {
    const deleted = Store.deleteOldWorkouts(months);
    if (deleted === 0) {
      alert(`${months}ヶ月以上前のトレーニング記録はありません`);
    } else {
      alert(`${deleted}件の古いトレーニング記録を削除しました`);
      Settings.render(document.getElementById('main'));
    }
  },

  async clearCache() {
    if (!('caches' in window)) {
      alert('このブラウザはキャッシュAPIに対応していません');
      return;
    }
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    alert('キャッシュを削除しました。次回アクセス時に再ダウンロードされます。');
    Settings.render(document.getElementById('main'));
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
