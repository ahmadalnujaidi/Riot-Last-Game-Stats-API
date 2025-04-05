let puuid = null;
let latestMatchId = null;
let gameName = '';
let tagLine = '';

async function fetchPUUID() {
  gameName = document.getElementById('gameName').value;
  tagLine = document.getElementById('tagLine').value;
  if (!gameName || !tagLine) {
    alert('Please enter both gameName and tagLine');
    return;
  }

  try {
    const response = await fetch('/get-puuid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameName, tagLine })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);

    puuid = data.puuid;
    document.getElementById('puuid-output').textContent = `PUUID: ${puuid}`;
    document.getElementById('matchlist-btn').disabled = false;
  } catch (error) {
    document.getElementById('puuid-output').textContent = `Error: ${error.message}`;
  }
}

async function fetchMatchList() {
  if (!puuid) return;

  try {
    const response = await fetch('/get-matchlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ puuid })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);

    latestMatchId = data.latestMatchId;
    document.getElementById('matchlist-output').textContent = `Latest Match ID: ${latestMatchId}\nFull Match List: ${JSON.stringify(data.matchList, null, 2)}`;
    document.getElementById('stats-btn').disabled = false;
  } catch (error) {
    document.getElementById('matchlist-output').textContent = `Error: ${error.message}`;
  }
}

async function fetchMatchStats() {
  if (!latestMatchId || !puuid) return;

  try {
    const response = await fetch('/get-match-stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId: latestMatchId, puuid })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);

    const stats = data.stats;
    document.getElementById('stats-output').textContent = JSON.stringify(stats, null, 2);
    document.getElementById('final-output').textContent = `${gameName}#${tagLine}: ${stats.kills} kills, ${stats.deaths} deaths, ${stats.assists} assists, ${stats.score} score`;
  } catch (error) {
    document.getElementById('stats-output').textContent = `Error: ${error.message}`;
  }
}