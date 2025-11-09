// URL Firebase
const firebaseUrl = "https://jma-ctf-website-default-rtdb.europe-west1.firebasedatabase.app/ctf.json";

// Fonction pour récupérer les données depuis Firebase
async function fetchServerData() {
  try {
    const response = await fetch(firebaseUrl);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch server data:", err);
    return null;
  }
}

// Met à jour les infos de la page Home
function updateHome(data) {
  if (!data) return;

  // Map, duration, mode
  const homeLeft = document.querySelector(".home-left");
  if (homeLeft) {
    const mapName = data.map || "Unknown map";
    const duration = data.duration || "-";
    const mode = data.mode || "-";
    const mapAuthor = data.author || "Unknown";
    const screenshot = data.screenshot || "";

    homeLeft.querySelector("h2").textContent = `Current map : ${mapName}`;
    homeLeft.querySelector("h3:nth-of-type(1)").textContent = `Duration : ${duration}`;
    homeLeft.querySelector("h3:nth-of-type(2)").textContent = `Mode: ${mode}`;
    
    // Teams
    const ulTeams = homeLeft.querySelector("ul");
    if (ulTeams) {
      ulTeams.innerHTML = ""; // clear old list
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
    if (mapImg && screenshot) mapImg.src = screenshot;
  }
}

// Met à jour les leaderboards (top50)
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

// Initial fetch + update
async function loadServerData() {
  const data = await fetchServerData();
  updateHome(data);
  updateLeaderboards(data);
}

// Refresh every 10 seconds
loadServerData();
setInterval(loadServerData, 1000);

