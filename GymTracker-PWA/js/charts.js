const Charts = {
  _currentTab: 'weight',
  _weightPeriod: '3m',
  _volumePeriod: '3m',
  _selectedExercise: '',
  _chartInstance: null,

  render(container) {
    container.innerHTML = `
      <div class="chart-tabs">
        <button class="chart-tab ${this._currentTab === 'weight' ? 'active' : ''}" onclick="Charts._switchTab('weight')">体重推移</button>
        <button class="chart-tab ${this._currentTab === 'volume' ? 'active' : ''}" onclick="Charts._switchTab('volume')">ボリューム</button>
        <button class="chart-tab ${this._currentTab === 'exercise' ? 'active' : ''}" onclick="Charts._switchTab('exercise')">種目別</button>
      </div>
      <div id="chart-content"></div>`;

    this._renderTab();
  },

  _switchTab(tab) {
    this._currentTab = tab;
    document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.chart-tab:nth-child(${tab === 'weight' ? 1 : tab === 'volume' ? 2 : 3})`).classList.add('active');
    this._renderTab();
  },

  _renderTab() {
    const el = document.getElementById('chart-content');
    this._destroyChart();

    switch (this._currentTab) {
      case 'weight': this._renderWeightChart(el); break;
      case 'volume': this._renderVolumeChart(el); break;
      case 'exercise': this._renderExerciseChart(el); break;
    }
  },

  _destroyChart() {
    if (this._chartInstance) {
      this._chartInstance.destroy();
      this._chartInstance = null;
    }
  },

  _filterByPeriod(items, period, dateField = 'date') {
    if (period === 'all') return items;
    const now = new Date();
    const months = { '1m': 1, '3m': 3, '6m': 6, '1y': 12 };
    const cutoff = new Date(now);
    cutoff.setMonth(cutoff.getMonth() - (months[period] || 3));
    return items.filter(item => new Date(item[dateField]) >= cutoff);
  },

  _renderWeightChart(el) {
    const entries = Store.getBodyWeights().slice().reverse();
    const periods = [
      { key: '1m', label: '1ヶ月' },
      { key: '3m', label: '3ヶ月' },
      { key: '6m', label: '6ヶ月' },
      { key: '1y', label: '1年' },
      { key: 'all', label: '全期間' },
    ];

    el.innerHTML = `
      <div class="period-selector">
        ${periods.map(p => `<button class="period-btn ${this._weightPeriod === p.key ? 'active' : ''}" onclick="Charts._weightPeriod='${p.key}';Charts._renderTab()">${p.label}</button>`).join('')}
      </div>
      <div class="chart-container">
        <div class="chart-wrapper"><canvas id="weight-canvas"></canvas></div>
      </div>
      <div id="weight-stats"></div>`;

    const filtered = this._filterByPeriod(entries, this._weightPeriod);

    if (filtered.length === 0) {
      el.querySelector('.chart-container').innerHTML = `
        <div class="empty-state" style="padding:40px 0">
          <div class="empty-state-icon">📊</div>
          <div class="empty-state-text">データがありません</div>
        </div>`;
      return;
    }

    const labels = filtered.map(e => {
      const d = new Date(e.date + 'T00:00:00');
      return `${d.getMonth() + 1}/${d.getDate()}`;
    });
    const data = filtered.map(e => e.weight);

    const ctx = document.getElementById('weight-canvas').getContext('2d');
    this._chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: '体重 (kg)',
          data,
          borderColor: '#ff8c00',
          backgroundColor: 'rgba(255,140,0,0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointBackgroundColor: '#ff8c00',
          borderWidth: 2.5,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a1a2e',
            titleColor: '#f0f0f0',
            bodyColor: '#ff8c00',
            borderColor: 'rgba(255,140,0,0.3)',
            borderWidth: 1,
            callbacks: {
              label: ctx => `${ctx.parsed.y.toFixed(1)} kg`,
            },
          },
        },
        scales: {
          x: {
            ticks: { color: '#8888aa', font: { size: 10 }, maxRotation: 0, maxTicksLimit: 8 },
            grid: { color: 'rgba(255,255,255,0.04)' },
          },
          y: {
            ticks: {
              color: '#8888aa',
              font: { size: 10 },
              callback: v => v.toFixed(1),
            },
            grid: { color: 'rgba(255,255,255,0.04)' },
            beginAtZero: false,
          },
        },
      },
    });

    // Stats
    const weights = filtered.map(e => e.weight);
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const avg = weights.reduce((a, b) => a + b, 0) / weights.length;
    const change = weights[weights.length - 1] - weights[0];

    document.getElementById('weight-stats').innerHTML = `
      <div class="stat-row">
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
        <div class="stat-item">
          <div class="stat-value" style="color:${change >= 0 ? 'var(--danger)' : 'var(--blue)'}">${change >= 0 ? '+' : ''}${change.toFixed(1)}</div>
          <div class="stat-label">変化 kg</div>
        </div>
      </div>`;
  },

  _renderVolumeChart(el) {
    const workouts = Store.getWorkouts().slice().reverse();
    const periods = [
      { key: '1m', label: '1ヶ月' },
      { key: '3m', label: '3ヶ月' },
      { key: '6m', label: '6ヶ月' },
      { key: 'all', label: '全期間' },
    ];

    el.innerHTML = `
      <div class="period-selector">
        ${periods.map(p => `<button class="period-btn ${this._volumePeriod === p.key ? 'active' : ''}" onclick="Charts._volumePeriod='${p.key}';Charts._renderTab()">${p.label}</button>`).join('')}
      </div>
      <div class="chart-container">
        <div class="chart-wrapper"><canvas id="volume-canvas"></canvas></div>
      </div>
      <div id="volume-stats"></div>`;

    const filtered = this._filterByPeriod(workouts, this._volumePeriod);

    if (filtered.length === 0) {
      el.querySelector('.chart-container').innerHTML = `
        <div class="empty-state" style="padding:40px 0">
          <div class="empty-state-icon">📊</div>
          <div class="empty-state-text">データがありません</div>
        </div>`;
      return;
    }

    // Collect all muscle groups present
    const allGroups = new Set();
    filtered.forEach(w => w.exercises.forEach(e => allGroups.add(e.group)));
    const groupList = [...allGroups];

    const labels = filtered.map(w => {
      const d = new Date(w.date + 'T00:00:00');
      return `${d.getMonth() + 1}/${d.getDate()}`;
    });

    const datasets = groupList.map(group => ({
      label: group,
      data: filtered.map(w => {
        return w.exercises
          .filter(e => e.group === group)
          .reduce((sum, e) => sum + e.weight * e.reps, 0);
      }),
      backgroundColor: Store.getMuscleGroupColor(group) + 'cc',
      borderWidth: 0,
      borderRadius: 3,
    }));

    const ctx = document.getElementById('volume-canvas').getContext('2d');
    this._chartInstance = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#8888aa', font: { size: 10 }, boxWidth: 12, padding: 8 },
          },
          tooltip: {
            backgroundColor: '#1a1a2e',
            titleColor: '#f0f0f0',
            bodyColor: '#f0f0f0',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            callbacks: {
              label: ctx => `${ctx.dataset.label}: ${Math.round(ctx.parsed.y).toLocaleString()} kg`,
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            ticks: { color: '#8888aa', font: { size: 10 }, maxRotation: 0, maxTicksLimit: 8 },
            grid: { color: 'rgba(255,255,255,0.04)' },
          },
          y: {
            stacked: true,
            ticks: { color: '#8888aa', font: { size: 10 }, callback: v => v.toLocaleString() },
            grid: { color: 'rgba(255,255,255,0.04)' },
          },
        },
      },
    });

    // Stats
    const totalSessions = filtered.length;
    const totalVolume = filtered.reduce((sum, w) => sum + w.exercises.reduce((s, e) => s + e.weight * e.reps, 0), 0);

    document.getElementById('volume-stats').innerHTML = `
      <div class="stat-row mt-16">
        <div class="stat-item">
          <div class="stat-value" style="color:var(--primary)">${totalSessions}</div>
          <div class="stat-label">トレーニング回数</div>
        </div>
        <div class="stat-item">
          <div class="stat-value" style="color:var(--blue)">${Math.round(totalVolume).toLocaleString()}</div>
          <div class="stat-label">合計ボリューム kg</div>
        </div>
      </div>`;
  },

  _renderExerciseChart(el) {
    const workouts = Store.getWorkouts().slice().reverse();

    // Collect all exercise names
    const allNames = new Set();
    workouts.forEach(w => w.exercises.forEach(e => allNames.add(e.name)));
    const nameList = [...allNames].sort();

    if (nameList.length === 0) {
      el.innerHTML = `
        <div class="empty-state" style="padding:40px 0">
          <div class="empty-state-icon">📊</div>
          <div class="empty-state-text">データがありません</div>
        </div>`;
      return;
    }

    if (!this._selectedExercise || !nameList.includes(this._selectedExercise)) {
      this._selectedExercise = nameList[0];
    }

    el.innerHTML = `
      <div class="muscle-pills mb-16">
        ${nameList.map(n => `<button class="muscle-pill ${this._selectedExercise === n ? 'active' : ''}" onclick="Charts._selectedExercise='${n}';Charts._renderTab()">${n}</button>`).join('')}
      </div>
      <div class="chart-container">
        <div class="chart-wrapper"><canvas id="exercise-canvas"></canvas></div>
      </div>
      <div id="exercise-stats"></div>`;

    // Get data for selected exercise
    const points = [];
    workouts.forEach(w => {
      const sets = w.exercises.filter(e => e.name === this._selectedExercise);
      if (sets.length === 0) return;
      const maxWeight = Math.max(...sets.map(e => e.weight));
      const totalVol = sets.reduce((s, e) => s + e.weight * e.reps, 0);
      points.push({
        date: w.date,
        maxWeight,
        totalVol,
      });
    });

    if (points.length === 0) {
      el.querySelector('.chart-container').innerHTML = `
        <div class="empty-state" style="padding:40px 0">
          <div class="empty-state-text">この種目のデータがありません</div>
        </div>`;
      return;
    }

    const labels = points.map(p => {
      const d = new Date(p.date + 'T00:00:00');
      return `${d.getMonth() + 1}/${d.getDate()}`;
    });

    const ctx = document.getElementById('exercise-canvas').getContext('2d');
    this._chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: '最大重量 (kg)',
            data: points.map(p => p.maxWeight),
            borderColor: '#ff8c00',
            backgroundColor: 'rgba(255,140,0,0.1)',
            fill: false,
            tension: 0.3,
            pointRadius: 5,
            pointBackgroundColor: '#ff8c00',
            borderWidth: 2.5,
            yAxisID: 'y',
          },
          {
            label: 'ボリューム (kg)',
            data: points.map(p => p.totalVol),
            borderColor: '#5b9aff',
            backgroundColor: 'rgba(91,154,255,0.08)',
            fill: true,
            tension: 0.3,
            pointRadius: 3,
            pointBackgroundColor: '#5b9aff',
            borderWidth: 1.5,
            yAxisID: 'y1',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#8888aa', font: { size: 10 }, boxWidth: 12 },
          },
          tooltip: {
            backgroundColor: '#1a1a2e',
            titleColor: '#f0f0f0',
            bodyColor: '#f0f0f0',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            ticks: { color: '#8888aa', font: { size: 10 }, maxRotation: 0, maxTicksLimit: 8 },
            grid: { color: 'rgba(255,255,255,0.04)' },
          },
          y: {
            position: 'left',
            title: { display: true, text: '重量 (kg)', color: '#ff8c00', font: { size: 10 } },
            ticks: { color: '#ff8c00', font: { size: 10 } },
            grid: { color: 'rgba(255,255,255,0.04)' },
          },
          y1: {
            position: 'right',
            title: { display: true, text: 'ボリューム (kg)', color: '#5b9aff', font: { size: 10 } },
            ticks: { color: '#5b9aff', font: { size: 10 } },
            grid: { drawOnChartArea: false },
          },
        },
      },
    });

    // Stats
    const bestWeight = Math.max(...points.map(p => p.maxWeight));
    const bestVolume = Math.max(...points.map(p => p.totalVol));
    const growth = points.length >= 2 ? points[points.length - 1].maxWeight - points[0].maxWeight : 0;

    let statsHtml = `
      <div class="card mt-16">
        <div class="flex-between mb-8">
          <span>🏆 自己ベスト重量</span>
          <span style="color:var(--primary);font-weight:700">${bestWeight.toFixed(1)} kg</span>
        </div>
        <div class="flex-between mb-8">
          <span>🔥 最大ボリューム</span>
          <span style="color:var(--primary);font-weight:700">${Math.round(bestVolume).toLocaleString()} kg</span>
        </div>`;

    if (points.length >= 2) {
      statsHtml += `
        <div class="flex-between">
          <span>${growth >= 0 ? '📈' : '📉'} 期間内の成長</span>
          <span style="color:${growth >= 0 ? 'var(--success)' : 'var(--danger)'};font-weight:700">${growth >= 0 ? '+' : ''}${growth.toFixed(1)} kg</span>
        </div>`;
    }

    statsHtml += `</div>`;
    document.getElementById('exercise-stats').innerHTML = statsHtml;
  },
};
