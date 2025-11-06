// Tab management
const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
      t.tabIndex = -1;
    });
    contents.forEach(c => c.hidden = true);

    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    tab.tabIndex = 0;
    contents[i].hidden = false;
    tab.focus();
  });
});

// Theme toggle
const themeToggleBtn = document.getElementById('theme-toggle');
themeToggleBtn.addEventListener('click', () => {
  const body = document.body;
  const currentTheme = body.getAttribute('data-theme');
  if (currentTheme === 'light') {
    body.setAttribute('data-theme', 'dark');
    themeToggleBtn.textContent = 'Switch to light mode';
  } else {
    body.setAttribute('data-theme', 'light');
    themeToggleBtn.textContent = 'Switch to dark mode';
  }
});
