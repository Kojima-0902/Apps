// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  Router.init();

  // Tab navigation
  document.querySelectorAll('.tab-item').forEach(tab => {
    tab.addEventListener('click', () => {
      const page = tab.dataset.page;
      Router.history = [];
      Router.navigate(page);
    });
  });
});
