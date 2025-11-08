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

// Theme management
const loadTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.body.setAttribute('data-theme', savedTheme);
  themeToggleBtn.textContent = savedTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
};

// Theme toggle
const themeToggleBtn = document.getElementById('theme-toggle');
themeToggleBtn.addEventListener('click', () => {
  const body = document.body;
  const currentTheme = body.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  body.setAttribute('data-theme', newTheme);
  themeToggleBtn.textContent = newTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
  localStorage.setItem('theme', newTheme);
});

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


