// Módulo del Modo Historia / Campaña PVE Lineal

const STORY_CHAPTERS = [
  {
    id: 1,
    title: "Capítulo 1: El Orgullo del León",
    bossName: "Gran Campeón Leonino",
    bossAvatar: "🦁",
    bossHp: 30,
    bossFaction: "Leon",
    rewardCardIds: ["s1_04", "s1_05", "s1_06"], // Recompensas por vencer al León
    bossMainDeckIds: [
      "s1_02", "s1_02", "s1_02",
      "s1_03", "s1_03", "s1_03",
      "s1_04", "s1_04", "s1_04",
      "s1_05", "s1_05", "s1_05",
      "s1_06", "s1_06",
      "s1_07"
    ],
    bossExtraDeckIds: []
  },
  {
    id: 2,
    title: "Capítulo 2: El Cónclave de los Búhos",
    bossName: "Hechicero Esfera Oscura",
    bossAvatar: "🦉",
    bossHp: 35,
    bossFaction: "Búho",
    rewardCardIds: ["s1_11", "sp_01", "sp_04"], // Recompensas por vencer al Búho
    bossMainDeckIds: [
      "s1_08", "s1_08", "s1_08",
      "s1_09", "s1_09", "s1_09",
      "s1_10", "s1_10", "s1_10",
      "sp_01", "sp_01", "sp_01",
      "sp_04", "sp_04", "sp_04"
    ],
    bossExtraDeckIds: []
  },
  {
    id: 3,
    title: "Capítulo 3: El Gremio de los Mapaches",
    bossName: "Bandido Mapache Enmascarado",
    bossAvatar: "🦝",
    bossHp: 35,
    bossFaction: "Mapache",
    rewardCardIds: ["s1_27", "s1_28", "s1_29"], // Recompensas por vencer al Mapache
    bossMainDeckIds: [
      "s1_25", "s1_25", "s1_25",
      "s1_26", "s1_26", "s1_26",
      "s1_27", "s1_27", "s1_27",
      "s1_28", "s1_28", "s1_28",
      "s1_29", "s1_29", "s1_29"
    ],
    bossExtraDeckIds: []
  },
  {
    id: 4,
    title: "Capítulo 4: El Baluarte de la Tortuga",
    bossName: "Guerrero Caparazón Ancestral",
    bossAvatar: "🐢",
    bossHp: 35,
    bossFaction: "Tortuga",
    rewardCardIds: ["s1_20", "s1_21", "sp_12"], // Recompensas por vencer a la Tortuga
    bossMainDeckIds: [
      "s1_19", "s1_19", "s1_19",
      "s1_20", "s1_20", "s1_20",
      "s1_21", "s1_21", "s1_21",
      "s1_22", "s1_22", "s1_22",
      "s1_23", "s1_23",
      "s1_24"
    ],
    bossExtraDeckIds: []
  },
  {
    id: 5,
    title: "Capítulo 5: La tribu Jabalí",
    bossName: "Lider Tribal",
    bossAvatar: "🐗",
    bossHp: 35,
    bossFaction: "Búho",
    rewardCardIds: ["s1_98", "s1_97", "s1_95"], // Recompensas por vencer al Búho
    bossMainDeckIds: [
      "s1_90", "s1_90", "s1_90",
      "s1_91", "s1_91", "s1_92",
      "s1_93", "s1_94", "s1_94",
      "s1_95", "s1_95", "s1_98",
      "s1_98", "s1_98", "s1_97"
    ],
    bossExtraDeckIds: []
  }
];

let currentStoryChapterIndex = 0;

function getSavedStoryProgress() {
  try {
    const saved = localStorage.getItem('feral_wars_story_progress');
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < STORY_CHAPTERS.length) {
        return parsed;
      }
    }
  } catch (e) { }
  return 0;
}

function saveStoryProgress(idx) {
  try {
    localStorage.setItem('feral_wars_story_progress', idx.toString());
  } catch (e) { }
}

function getCurrentStoryChapter() {
  return STORY_CHAPTERS[currentStoryChapterIndex] || STORY_CHAPTERS[0];
}

function getStoryBossMainDeck() {
  const chapter = getCurrentStoryChapter();
  const deck = [];
  chapter.bossMainDeckIds.forEach(id => {
    const cardDef = CARD_DATABASE.find(c => c.id === id);
    if (cardDef) deck.push({ ...cardDef });
  });
  return deck;
}

function getStoryBossExtraDeck() {
  return [];
}

function startStoryMode() {
  currentStoryChapterIndex = getSavedStoryProgress();
  gameMode = 'STORY_MODE';
  const overlay = document.getElementById('lobby-overlay');
  if (overlay) overlay.style.display = 'none';
  const modalOverlay = document.getElementById('modal-overlay');
  if (modalOverlay) modalOverlay.style.display = 'none';
  initGame();
}

function advanceToNextStoryChapter() {
  if (currentStoryChapterIndex + 1 < STORY_CHAPTERS.length) {
    currentStoryChapterIndex++;
    saveStoryProgress(currentStoryChapterIndex);
  }
  gameMode = 'STORY_MODE';
  const modalOverlay = document.getElementById('modal-overlay');
  if (modalOverlay) modalOverlay.style.display = 'none';
  const overlay = document.getElementById('lobby-overlay');
  if (overlay) overlay.style.display = 'none';
  initGame();
}

function resetStoryProgress() {
  saveStoryProgress(0);
  currentStoryChapterIndex = 0;
}
