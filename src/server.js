const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.RIOT_API_KEY;
const REGION = 'americas'; // Fixed for demo; could be configurable

app.use(express.static('public'));
app.use(express.json());

// Step 1: Get PUUID from gameName and tagLine
app.post('/get-puuid', async (req, res) => {
  const { gameName, tagLine } = req.body;
  const url = `https://${REGION}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`;
  try {
    const response = await axios.get(url, { headers: { 'X-Riot-Token': API_KEY } });
    res.json({ puuid: response.data.puuid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch PUUID: ' + error.message });
  }
});

// Step 2: Get match list from PUUID
app.post('/get-matchlist', async (req, res) => {
  const { puuid } = req.body;
  const url = `https://${REGION}.api.riotgames.com/val/match/v1/matchlists/by-puuid/${puuid}`;
  try {
    const response = await axios.get(url, { headers: { 'X-Riot-Token': API_KEY } });
    res.json({ matchList: response.data.history, latestMatchId: response.data.history[0].matchId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch match list: ' + error.message });
  }
});

// Step 3: Get stats from match ID and PUUID
app.post('/get-match-stats', async (req, res) => {
  const { matchId, puuid } = req.body;
  const url = `https://${REGION}.api.riotgames.com/val/match/v1/matches/${matchId}`;
  try {
    const response = await axios.get(url, { headers: { 'X-Riot-Token': API_KEY } });
    const player = response.data.players.find(p => p.puuid === puuid);
    res.json({ stats: player.stats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch match stats: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});