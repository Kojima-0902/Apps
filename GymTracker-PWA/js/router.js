const Router = {
  currentPage: 'workouts',
  history: [],

  init() {
    this.navigate('workouts');
  },

  navigate(page, data = null) {
    this.history.push({ page: this.currentPage });
    this.currentPage = page;
    this._render(page, data);
    this._updateTabs(page);
  },

  back() {
    const prev = this.history.pop();
    if (prev) {
      this.currentPage = prev.page;
      this._render(prev.page);
      this._updateTabs(prev.page);
    }
  },

  _render(page, data) {
    const main = document.getElementById('main');
    const header = document.getElementById('header');

    switch (page) {
      case 'workouts':
        header.innerHTML = `<h1>トレーニング</h1><button class="header-btn" onclick="Workouts.showAdd()">＋</button>`;
        Workouts.renderList(main);
        break;
      case 'add-workout':
        header.innerHTML = `<button class="header-btn header-back" onclick="Router.back()">← 戻る</button><h1>トレーニング記録</h1><div></div>`;
        Workouts.renderAdd(main);
        break;
      case 'workout-detail':
        header.innerHTML = `<button class="header-btn header-back" onclick="Router.back()">← 戻る</button><h1>トレーニング詳細</h1><div></div>`;
        Workouts.renderDetail(main, data);
        break;
      case 'bodyweight':
        header.innerHTML = `<h1>体重記録</h1><button class="header-btn" onclick="BodyWeight.showAdd()">＋</button>`;
        BodyWeight.renderList(main);
        break;
      case 'add-bodyweight':
        header.innerHTML = `<button class="header-btn header-back" onclick="Router.back()">← 戻る</button><h1>体重を記録</h1><div></div>`;
        BodyWeight.renderAdd(main);
        break;
      case 'charts':
        header.innerHTML = `<h1>グラフ</h1><div></div>`;
        Charts.render(main);
        break;
      case 'settings':
        header.innerHTML = `<h1>設定</h1><div></div>`;
        Settings.render(main);
        break;
    }
  },

  _updateTabs(page) {
    const base = page.split('-')[0].replace('add', '').replace('detail', '') || page;
    document.querySelectorAll('.tab-item').forEach(tab => {
      const tabPage = tab.dataset.page;
      const isActive = (tabPage === 'workouts' && (page === 'workouts' || page === 'add-workout' || page === 'workout-detail'))
        || (tabPage === 'bodyweight' && (page === 'bodyweight' || page === 'add-bodyweight'))
        || (tabPage === 'charts' && page === 'charts')
        || (tabPage === 'settings' && page === 'settings');
      tab.classList.toggle('active', isActive);
    });
  },
};
