// ======================
// Tabs management
// ======================
const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.tab-content');

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
    try {
      localStorage.setItem('activeTab', tab.id);
    } catch (e) {}
  });
});

// ======================
// Theme management
// ======================
const themeToggleBtn = document.getElementById('theme-toggle');
const loadTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.body.setAttribute('data-theme', savedTheme);
  if (themeToggleBtn) {
    themeToggleBtn.textContent = savedTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
  }
};
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
    themeToggleBtn.textContent = newTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
    try { localStorage.setItem('theme', newTheme); } catch (e) {}
  });
}
loadTheme();

// ======================
// Discord stats simulation
// ======================
function updateDiscordStats() {
  const onlineElement = document.getElementById('discord-online');
  const totalElement = document.getElementById('discord-total');
  if (onlineElement && totalElement) {
    const totalMembers = 150;
    const minOnline = Math.floor(totalMembers * 0.1);
    const maxAdditionalOnline = Math.floor(totalMembers * 0.3);
    const onlineMembers = minOnline + Math.floor(Math.random() * maxAdditionalOnline);
    onlineElement.textContent = onlineMembers;
    totalElement.textContent = totalMembers;
  }
}
updateDiscordStats();
setInterval(updateDiscordStats, 5 * 60 * 1000);

// ======================
// Firebase integration
// ======================
const firebaseUrl = "https://jma-ctf-website-default-rtdb.europe-west1.firebasedatabase.app/ctf.json";

async function fetchServerData() {
  try {
    const response = await fetch(firebaseUrl);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (err) {
    console.error("Failed to fetch server data:", err);
    return null;
  }
}

function updateHome(data) {
  if (!data) return;
  const homeLeft = document.querySelector(".home-left");
  if (!homeLeft) return;

  homeLeft.querySelector("h2").textContent = `Current map : ${data.map || "Unknown map"}`;
  homeLeft.querySelector("h3:nth-of-type(1)").textContent = `Duration : ${data.duration || "-"}`;
  homeLeft.querySelector("h3:nth-of-type(2)").textContent = `Mode: ${data.mode || "-"}`;

  // Teams
  const ulTeams = homeLeft.querySelector("ul");
  if (ulTeams) {
    ulTeams.innerHTML = "";
    if (data.teams) {
      for (const team in data.teams) {
        const players = data.teams[team].players.join(", ");
        const color = team === "red" ? "🔴" : team === "blue" ? "🔵" : "🟠";
        const li = document.createElement("li");
        li.textContent = `${color} ${players}`;
        ulTeams.appendChild(li);
      }
    }
  }

  // Staff
  const staffUl = homeLeft.querySelectorAll("ul")[1];
  if (staffUl) {
    staffUl.innerHTML = "";
    if (data.moderators) data.moderators.forEach(m => {
      const li = document.createElement("li");
      li.textContent = `${m} (moderator)`;
      staffUl.appendChild(li);
    });
    if (data.admins) data.admins.forEach(a => {
      const li = document.createElement("li");
      li.textContent = `${a} (admin)`;
      staffUl.appendChild(li);
    });
  }

  // Map picture
  const mapImg = document.querySelector(".home-right img.map-picture");
  if (mapImg && data.screenshot) mapImg.src = data.screenshot;
}

function updateLeaderboards(data) {
  const leaderboardDiv = document.getElementById("leaderboards");
  if (!leaderboardDiv || !data.top50) return;

  leaderboardDiv.innerHTML = "<h2>Leaderboards and Stats</h2>";

  for (const mode in data.top50) {
    const modeSection = document.createElement("div");
    modeSection.className = "mode-section";
    const title = document.createElement("h3");
    title.textContent = `Mode: ${mode}`;
    modeSection.appendChild(title);

    const table = document.createElement("table");
    const headerRow = document.createElement("tr");
    ["Rank", "Player", "Score", "Kills", "Deaths", "Assists", "Flag Captures"].forEach(h => {
      const th = document.createElement("th");
      th.textContent = h;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    data.top50[mode].forEach(entry => {
      const tr = document.createElement("tr");
      ["rank", "player", "score", "kills", "deaths", "assists", "flag_captures"].forEach(key => {
        const td = document.createElement("td");
        td.textContent = entry[key] ?? "-";
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });

    modeSection.appendChild(table);
    leaderboardDiv.appendChild(modeSection);
  }
}

async function loadServerData() {
  const data = await fetchServerData();
  updateHome(data);
  updateLeaderboards(data);
}

// Rafraîchissement automatique toutes les 2 secondes
loadServerData();
setInterval(loadServerData, 2000);
