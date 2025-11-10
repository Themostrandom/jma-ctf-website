// Tab management
const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.tab-content');

// Activate a tab by index and update ARIA/hidden states
function activateTabByIndex(index) {
  tabs.forEach((t, idx) => {
    const isActive = idx === index;
    t.classList.toggle('active', isActive);
    t.setAttribute('aria-selected', isActive ? 'true' : 'false');
    t.tabIndex = isActive ? 0 : -1;
    if (contents[idx]) contents[idx].hidden = !isActive;
    if (isActive) t.focus();
  });
}

// Restore saved tab (by id) or default to first tab
const savedTabId = localStorage.getItem('activeTab');
let startIndex = 0;
if (savedTabId) {
  const savedEl = document.getElementById(savedTabId);
  if (savedEl) startIndex = Array.from(tabs).indexOf(savedEl);
}

activateTabByIndex(startIndex);

tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => {
    activateTabByIndex(i);
    // Persist the active tab id so it's restored on reload
    try {
      localStorage.setItem('activeTab', tab.id);
    } catch (e) {
      // Ignore storage errors (e.g., private mode)
    }
  });
});

// Theme management
const loadTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.body.setAttribute('data-theme', savedTheme);
  if (themeToggleBtn) {
    themeToggleBtn.textContent = savedTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
  }
};

// Theme toggle
const themeToggleBtn = document.getElementById('theme-toggle');
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    body.setAttribute('data-theme', newTheme);
    themeToggleBtn.textContent = newTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
    try { localStorage.setItem('theme', newTheme); } catch (e) {}
  });
}

// Load saved theme on page load
loadTheme();

// Discord stats simulation
function updateDiscordStats() {
  const onlineElement = document.getElementById('discord-online');
  const totalElement = document.getElementById('discord-total');
  
  if (onlineElement && totalElement) {
    // Simulate some realistic numbers
    const totalMembers = 150; // Base total members
    const minOnline = Math.floor(totalMembers * 0.1); // At least 10% online
    const maxAdditionalOnline = Math.floor(totalMembers * 0.3); // Up to 40% total online
    const onlineMembers = minOnline + Math.floor(Math.random() * maxAdditionalOnline);
    
    onlineElement.textContent = onlineMembers;
    totalElement.textContent = totalMembers;
  }
}

// Update Discord stats initially and every 5 minutes
updateDiscordStats();
setInterval(updateDiscordStats, 5 * 60 * 1000);

