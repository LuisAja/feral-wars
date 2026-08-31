// Módulo del Modo Historia / Campaña PVE

const STORY_CHAPTERS = [
  {
    id: 1,
    title: "Capítulo 1: El Orgullo del León",
    bossName: "Gran Campeón Leonino",
    bossAvatar: "🦁",
    bossHp: 30,
    bossFaction: "Leon",
    bossMainDeckIds: [
      "s1_02", "s1_02", "s1_02",
      "s1_03", "s1_03", "s1_03",
      "s1_04", "s1_04", "s1_04",
      "s1_05", "s1_05", "s1_05",
      "s1_06", "s1_06",
      "s1_07"
    ],
    bossExtraDeckIds: ["s1_01"]
  },
  {
    id: 2,
    title: "Capítulo 2: El Baluarte de la Tortuga",
    bossName: "Guerrero Caparazón Ancestral",
    bossAvatar: "🐢",
    bossHp: 35,
    bossFaction: "Tortuga",
    bossMainDeckIds: [
      "s1_19", "s1_19", "s1_19",
      "s1_20", "s1_20", "s1_20",
      "s1_21", "s1_21", "s1_21",
      "s1_22", "s1_22", "s1_22",
      "s1_23", "s1_23",
      "s1_24"
    ],
    bossExtraDeckIds: ["s1_18"]
  },
  {
    id: 3,
    title: "Capítulo 3: El Gremio de los Mapaches",
    bossName: "Bandido Mapache Enmascarado",
    bossAvatar: "🦝",
    bossHp: 35,
    bossFaction: "Mapache",
    bossMainDeckIds: [
      "s1_25", "s1_25", "s1_25",
      "s1_26", "s1_26", "s1_26",
      "s1_27", "s1_27", "s1_27",
      "s1_28", "s1_28", "s1_28",
      "s1_29", "s1_29", "s1_29"
    ],
    bossExtraDeckIds: ["s1_30"]
  },
  {
    id: 4,
    title: "Capítulo 4: El Cónclave de los Búhos",
    bossName: "Hechicero Esfera Oscura",
    bossAvatar: "🦉",
    bossHp: 35,
    bossFaction: "Búho",
    bossMainDeckIds: [
      "s1_08", "s1_08", "s1_08",
      "s1_09", "s1_09", "s1_09",
      "s1_10", "s1_10", "s1_10",
      "sp_01", "sp_01", "sp_01",
      "sp_04", "sp_04", "sp_04"
    ],
    bossExtraDeckIds: ["s1_11"]
  }
];

let currentStoryChapterIndex = 0;

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
  const chapter = getCurrentStoryChapter();
  const deck = [];
  chapter.bossExtraDeckIds.forEach(id => {
    const cardDef = CARD_DATABASE.find(c => c.id === id);
    if (cardDef) deck.push({ ...cardDef });
  });
  return deck;
}

function openStoryChapterSelect() {
  const modal = document.getElementById('story-select-modal');
  if (!modal) {
    startStoryChapter(0);
    return;
  }

  const listContainer = document.getElementById('story-chapter-list');
  if (listContainer) {
    listContainer.innerHTML = '';
    STORY_CHAPTERS.forEach((ch, idx) => {
      const card = document.createElement('div');
      card.className = 'story-chapter-card';
      card.innerHTML = `
        <div style="font-size: 2.2rem;">${ch.bossAvatar}</div>
        <div style="flex: 1; margin-left: 15px;">
          <div style="font-weight: bold; color: var(--accent-gold); font-size: 1.1rem;">${ch.title}</div>
          <div style="color: #ecf0f1; font-size: 0.95rem;">Jefe: ${ch.bossName} | Vida: ${ch.bossHp} HP</div>
          <div style="color: #95a5a6; font-size: 0.85rem; margin-top:2px;">Facción: ${ch.bossFaction}</div>
        </div>
        <button class="btn-lobby-mode" style="padding: 8px 16px; font-size: 0.95rem; border-color: var(--accent-green);" onclick="startStoryChapter(${idx})">
          ⚔️ ¡Luchar!
        </button>
      `;
      listContainer.appendChild(card);
    });
  }

  modal.style.display = 'flex';
}

function closeStoryChapterSelect() {
  const modal = document.getElementById('story-select-modal');
  if (modal) modal.style.display = 'none';
}

function startStoryChapter(chapterIdx) {

  // Desbloquear cartas de la facción derrotada
  if (typeof unlockFactionCards === 'function') {
    const currentChapter = getCurrentStoryChapter();
    if (currentChapter && currentChapter.bossFaction) {
      unlockFactionCards(currentChapter.bossFaction);
    }
  }

  currentStoryChapterIndex = chapterIdx;
  closeStoryChapterSelect();

  gameMode = 'STORY_MODE';
  const overlay = document.getElementById('lobby-overlay');
  if (overlay) overlay.style.display = 'none';
  initGame();
}

function startStoryMode() {
  openStoryChapterSelect();
}
