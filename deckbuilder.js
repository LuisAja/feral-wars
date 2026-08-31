
var isDevModeUnlocked = false;

function getUnlockedCards() {
  if (typeof CARD_DATABASE === 'undefined' || !Array.isArray(CARD_DATABASE)) return [];
  try {
    const saved = localStorage.getItem('feral_wars_unlocked_cards');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) { }

  // Colección inicial por defecto
  const starters = CARD_DATABASE.filter(c => c.isStarter).map(c => c.id);
  localStorage.setItem('feral_wars_unlocked_cards', JSON.stringify(starters));
  return starters;
}

function unlockFactionCards(factionName) {
  if (!factionName || typeof CARD_DATABASE === 'undefined') return;
  const current = getUnlockedCards();
  const factionCards = CARD_DATABASE.filter(c => c.type === factionName).map(c => c.id);
  let newUnlocks = 0;
  factionCards.forEach(id => {
    if (!current.includes(id)) {
      current.push(id);
      newUnlocks++;
    }
  });
  localStorage.setItem('feral_wars_unlocked_cards', JSON.stringify(current));
  if (newUnlocks > 0 && typeof showBanner === 'function') {
    showBanner(`🔓 ¡${newUnlocks} NUEVAS CARTAS DESBLOQUEADAS DE LA FACCIÓN ${factionName.toUpperCase()}!`);
  }
}

function toggleDevModeUnlocked() {
  isDevModeUnlocked = !isDevModeUnlocked;
  const btn = document.getElementById('btn-toggle-dev-mode');
  if (btn) {
    btn.textContent = isDevModeUnlocked ? '🔓 Ver Todas (Modo Dev)' : '🔒 Mis Cartas Desbloqueadas';
    btn.style.borderColor = isDevModeUnlocked ? 'var(--accent-red)' : 'var(--accent-gold)';
  }
  renderDeckBuilder();
}


// Limpieza automática de localStorage si contiene IDs de mazos desactualizados
function autoSanitizeLocalStorage() {
  if (typeof localStorage === 'undefined' || typeof CARD_DATABASE === 'undefined' || !Array.isArray(CARD_DATABASE)) return;
  try {
    const savedMain = localStorage.getItem('insectos_tcg_custom_deck');
    if (savedMain) {
      const parsed = JSON.parse(savedMain);
      if (Array.isArray(parsed)) {
        const validCount = parsed.filter(id => CARD_DATABASE.some(c => c.id === id && !c.isExtra && !c.hidden)).length;
        if (validCount < 15) {
          localStorage.removeItem('insectos_tcg_custom_deck');
          console.warn("🧹 Mazo principal de localStorage purgado por contener IDs obsoletos.");
        }
      }
    }
    const savedExtra = localStorage.getItem('insectos_tcg_extra_deck');
    if (savedExtra) {
      const parsedExtra = JSON.parse(savedExtra);
      if (Array.isArray(parsedExtra)) {
        const validExtraCount = parsedExtra.filter(id => CARD_DATABASE.some(c => c.id === id && c.isExtra && !c.hidden)).length;
        // Purga de Deck Extra desactivada
      }
    }
  } catch (e) {
    localStorage.removeItem('insectos_tcg_custom_deck');
    localStorage.removeItem('insectos_tcg_extra_deck');
  }
}
function normalizeStr(str) {
  if (!str) return '';
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
// Gestor del Creador de Mazos (Deck Builder) e Integración con localStorage
// Soporta Mazo Principal (15 cartas, máx 3 copias) y Deck Extra / Comandantes (3 a 5 cartas Leyenda)

let activeCustomDeck = []; // IDs de cartas mazo principal
let activeExtraDeck = [];  // IDs de cartas Deck Extra (Comandantes)

let currentCostFilter = 'ALL';
let currentKeywordFilter = 'ALL';
let currentTypeFilter = 'ALL';
let currentSubtypeFilter = 'ALL';
let currentSortBy = 'cost_asc';
let currentSearchQuery = '';
let currentTabMode = 'MAIN'; // 'MAIN' | 'EXTRA'

// Fallback dinámico si los IDs por defecto no se encuentran en CARD_DATABASE
function getValidDefaultDeck() {
  if (typeof CARD_DATABASE === 'undefined' || !Array.isArray(CARD_DATABASE)) return [];
  const validStandard = CARD_DATABASE.filter(c => !c.isExtra && !c.hidden).map(c => c.id);
  if (validStandard.length === 0) return CARD_DATABASE.map(c => c.id).slice(0, 15);

  const result = [];
  while (result.length < 15 && validStandard.length > 0) {
    for (let id of validStandard) {
      if (result.length < 15) result.push(id);
    }
  }
  return result.slice(0, 15);
}

function getValidDefaultExtra() {
  if (typeof CARD_DATABASE === 'undefined' || !Array.isArray(CARD_DATABASE)) return [];
  const validExtra = CARD_DATABASE.filter(c => c.isExtra && !c.hidden).map(c => c.id);
  if (validExtra.length >= 3) return validExtra.slice(0, 3);
  return CARD_DATABASE.map(c => c.id).slice(0, 3);
}

// Cargar Mazo Principal y Deck Extra desde localStorage con Sanitización Total
function loadSavedCustomDeck() {
  autoSanitizeLocalStorage();
  if (typeof CARD_DATABASE === 'undefined' || !Array.isArray(CARD_DATABASE)) return;

  const savedMain = localStorage.getItem('insectos_tcg_custom_deck');
  if (savedMain) {
    try {
      const parsed = JSON.parse(savedMain);
      if (Array.isArray(parsed) && parsed.length > 0) {
        activeCustomDeck = parsed;
      }
    } catch (e) {
      console.error("Error al leer mazo principal:", e);
    }
  }

  // Sanitizar IDs de mazo principal
  activeCustomDeck = activeCustomDeck.filter(id => {
    const card = CARD_DATABASE.find(c => c.id === id);
    return card && !card.hidden;
  });
  if (activeCustomDeck.length < 15) {
    const defaults = getValidDefaultDeck();
    for (let id of defaults) {
      if (activeCustomDeck.length < 15) {
        activeCustomDeck.push(id);
      }
    }
  }

  const savedExtra = localStorage.getItem('insectos_tcg_extra_deck');
  if (savedExtra) {
    try {
      const parsedExtra = JSON.parse(savedExtra);
      if (Array.isArray(parsedExtra) && parsedExtra.length > 0) {
        activeExtraDeck = parsedExtra;
      }
    } catch (e) {
      console.error("Error al leer Deck Extra:", e);
    }
  }

  // Sanitizar IDs de Deck Extra
  activeExtraDeck = activeExtraDeck.filter(id => {
    const card = CARD_DATABASE.find(c => c.id === id);
    return card && card.isExtra && !card.hidden;
  });
  if (activeExtraDeck.length === 0) {
    activeExtraDeck = getValidDefaultExtra();
  }
}

// Obtener las definiciones del Mazo Principal activo con Fallback Garantizado
function getActiveDeckCards() {
  loadSavedCustomDeck();
  let result = [];
  activeCustomDeck.forEach(id => {
    const cardDef = CARD_DATABASE.find(c => c.id === id);
    if (cardDef) result.push({ ...cardDef });
  });

  if (result.length === 0 && typeof CARD_DATABASE !== 'undefined' && Array.isArray(CARD_DATABASE)) {
    const valid = CARD_DATABASE.filter(c => !c.isExtra && !c.hidden);
    while (result.length < 15 && valid.length > 0) {
      for (let c of valid) {
        if (result.length < 15) result.push({ ...c });
      }
    }
  }
  return result;
}

// Obtener las definiciones del Deck Extra activo con Fallback Garantizado
function getActiveExtraDeckCards() {
  loadSavedCustomDeck();
  let result = [];
  activeExtraDeck.forEach(id => {
    const cardDef = CARD_DATABASE.find(c => c.id === id);
    if (cardDef) result.push({ ...cardDef });
  });

  if (result.length === 0 && typeof CARD_DATABASE !== 'undefined' && Array.isArray(CARD_DATABASE)) {
    const extraCards = CARD_DATABASE.filter(c => c.isExtra && !c.hidden);
    result = extraCards.slice(0, 3).map(c => ({ ...c }));
  }
  return result;
}

// Abrir Modal Creador de Mazos
function openDeckBuilder() {
  loadSavedCustomDeck();
  const modal = document.getElementById('deck-builder-overlay');
  if (modal) {
    modal.style.display = 'flex';
    modal.style.zIndex = '250';
  }
  renderDeckBuilder();
}

// Cerrar Modal Creador de Mazos
function closeDeckBuilder() {
  const modal = document.getElementById('deck-builder-overlay');
  if (modal) {
    modal.style.display = 'none';
  }
}

function switchDeckBuilderTab(mode) {
  currentTabMode = mode;
  const btnMain = document.getElementById('btn-tab-main-deck');
  const btnExtra = document.getElementById('btn-tab-extra-deck');
  if (btnMain) btnMain.classList.toggle('active', mode === 'MAIN');
  if (btnExtra) btnExtra.classList.toggle('active', mode === 'EXTRA');
  renderDeckBuilder();
}

// Añadir carta al mazo correspondiente (Principal o Extra)
function addCardToDeck(cardId) {
  const cardDef = CARD_DATABASE.find(c => c.id === cardId);
  if (!cardDef) return;

  if (currentTabMode === 'MAIN') {
// Restricción de isExtra removida para permitir añadir cualquier carta al mazo principal
    if (activeCustomDeck.length >= 20) {
      alert("El Mazo Principal ya tiene el tamaño máximo (20 cartas).");
      return;
    }
    const count = activeCustomDeck.filter(id => id === cardId).length;
    if (count >= 3) {
      alert("Solo puedes incluir un máximo de 3 copias de la misma carta en tu mazo principal.");
      return;
    }
    activeCustomDeck.push(cardId);
  } else {
    if (!cardDef.isExtra) {
      alert("⚠️ En el Deck Extra solo se pueden incluir cartas Leyenda / Comandantes.");
      return;
    }
    if (activeExtraDeck.length >= 3) {
      alert("El Deck Extra no puede tener más de 3 Comandantes.");
      return;
    }
    if (activeExtraDeck.includes(cardId)) {
      alert("Solo puedes incluir 1 copia de cada Comandante Leyenda en tu Deck Extra.");
      return;
    }
    activeExtraDeck.push(cardId);
  }

  renderDeckBuilder();
}

// Eliminar carta del mazo por su índice
function removeCardFromDeck(index) {
  if (currentTabMode === 'MAIN') {
    if (index >= 0 && index < activeCustomDeck.length) {
      activeCustomDeck.splice(index, 1);
    }
  } else {
    if (index >= 0 && index < activeExtraDeck.length) {
      activeExtraDeck.splice(index, 1);
    }
  }
  renderDeckBuilder();
}

// Guardar mazo en localStorage
function saveCustomDeck() {
  if (typeof CARD_DATABASE !== 'undefined' && Array.isArray(CARD_DATABASE)) {
    activeCustomDeck = activeCustomDeck.filter(id => {
      const card = CARD_DATABASE.find(c => c.id === id);
      return card && !card.hidden;
    });
    activeExtraDeck = activeExtraDeck.filter(id => {
      const card = CARD_DATABASE.find(c => c.id === id);
      return card && card.isExtra && !card.hidden;
    });
  }

  if (activeCustomDeck.length < 20) {
    alert(`Tu Mazo Principal necesita 20 cartas completas para guardarse (Tienes ${activeCustomDeck.length} / 20).`);
    return;
  }

// Validación rígida de tamaño de Deck Extra removida

  localStorage.setItem('insectos_tcg_custom_deck', JSON.stringify(activeCustomDeck));
  localStorage.setItem('insectos_tcg_extra_deck', JSON.stringify(activeExtraDeck));

  alert("¡Mazo y Deck Extra guardados con éxito! Se utilizarán en tus próximas partidas.");
  closeDeckBuilder();
}

// Restablecer por defecto
function resetCustomDeckToDefault() {
  if (confirm("¿Deseas restablecer tu Mazo Principal y Deck Extra al valor estándar?")) {
    localStorage.removeItem('insectos_tcg_custom_deck');
    localStorage.removeItem('insectos_tcg_extra_deck');
    activeCustomDeck = getValidDefaultDeck();
    activeExtraDeck = getValidDefaultExtra();
    renderDeckBuilder();
  }
}

// Renderizado principal del Creador de Mazos
function renderDeckBuilder() {
  if (typeof CARD_DATABASE === 'undefined' || !Array.isArray(CARD_DATABASE)) return;

  activeCustomDeck = activeCustomDeck.filter(id => CARD_DATABASE.some(c => c.id === id));
  activeExtraDeck = activeExtraDeck.filter(id => CARD_DATABASE.some(c => c.id === id));

  const catalogGrid = document.getElementById('db-catalog-grid');
  if (!catalogGrid) return;
  catalogGrid.innerHTML = '';

  const unlockedList = getUnlockedCards();

  const filteredCards = CARD_DATABASE.filter(card => {
    if (card.hidden) return false;
    // Filtro isExtra removido
    // Filtro isExtra removido

    // Si no es Modo Dev, ocultar completamente las cartas bloqueadas para mostrar solo la colección propia
    if (!isDevModeUnlocked && !unlockedList.includes(card.id)) {
      return false;
    }

    if (currentCostFilter !== 'ALL') {
      const targetCost = parseInt(currentCostFilter, 10);
      if (targetCost === 6 && card.cost < 6) return false;
      if (targetCost < 6 && card.cost !== targetCost) return false;
    }
    if (currentKeywordFilter !== 'ALL') {
      if (currentKeywordFilter === 'GRITO' && !card.battlecry) return false;
      if (currentKeywordFilter !== 'GRITO' && (!card.keywords || !card.keywords.includes(currentKeywordFilter))) return false;
    }
    if (currentTypeFilter !== 'ALL' && normalizeStr(card.type) !== normalizeStr(currentTypeFilter)) {
      return false;
    }
    if (currentSubtypeFilter !== 'ALL' && card.subtype !== currentSubtypeFilter) {
      return false;
    }
    if (currentSearchQuery) {
      if (!card.name.toLowerCase().includes(currentSearchQuery.toLowerCase())) return false;
    }
    return true;
  });

  filteredCards.sort((a, b) => {
    if (currentSortBy === 'cost_asc') return (a.cost || 0) - (b.cost || 0) || a.name.localeCompare(b.name);
    if (currentSortBy === 'cost_desc') return (b.cost || 0) - (a.cost || 0) || a.name.localeCompare(b.name);
    if (currentSortBy === 'name_asc') return a.name.localeCompare(b.name);
    if (currentSortBy === 'type_asc') return (a.type || '').localeCompare(b.type || '') || (a.cost || 0) - (b.cost || 0);
    if (currentSortBy === 'subtype_asc') return (a.subtype || '').localeCompare(b.subtype || '') || (a.cost || 0) - (b.cost || 0);
    if (currentSortBy === 'attack_desc') return (b.attack || 0) - (a.attack || 0) || (a.cost || 0) - (b.cost || 0);
    if (currentSortBy === 'hp_desc') return (b.hp || 0) - (a.hp || 0) || (a.cost || 0) - (b.cost || 0);
    return 0;
  });

  filteredCards.forEach(card => {
    const cardEl = document.createElement('div');
    const targetArray = currentTabMode === 'MAIN' ? activeCustomDeck : activeExtraDeck;
    const inDeckCount = targetArray.filter(id => id === card.id).length;
    const maxAllowed = currentTabMode === 'MAIN' ? 3 : 1;
    const isMaxed = inDeckCount >= maxAllowed;

    cardEl.className = `db-catalog-card ${isMaxed ? 'maxed' : ''}`;
    cardEl.style.backgroundImage = `url('${card.image}')`;

    cardEl.innerHTML = `
      <div class="card-cost">${card.cost}</div>
      <div class="card-atk">${card.attack}</div>
      <div class="card-hp">${card.hp}</div>
      <div class="db-card-count-badge">${inDeckCount}/${maxAllowed}</div>
      <div class="card-tooltip">
        <div class="card-tooltip-title">${card.name}</div>
        <div>Energía: ${card.cost} | ATK: ${card.attack} | HP: ${card.hp}</div>
        <div style="margin-top:4px; color:#bdc3c7;">${typeof getCardDescription === 'function' ? getCardDescription(card) : (card.description || '')}</div>
      </div>
    `;

    cardEl.onclick = () => addCardToDeck(card.id);
    catalogGrid.appendChild(cardEl);
  });

  const deckListEl = document.getElementById('db-deck-list');
  const countGauge = document.getElementById('db-deck-count');

  if (countGauge) {
    if (currentTabMode === 'MAIN') {
      countGauge.textContent = `Principal: ${activeCustomDeck.length} / 20`;
      countGauge.style.color = activeCustomDeck.length === 15 ? 'var(--accent-green)' : 'var(--accent-gold)';
    } else {
      countGauge.textContent = `Deck Extra: ${activeExtraDeck.length} / 5 (Mín. 3)`;
      countGauge.style.color = (activeExtraDeck.length >= 3 && activeExtraDeck.length <= 5) ? 'var(--accent-green)' : 'var(--accent-gold)';
    }
  }

  if (deckListEl) {
    deckListEl.innerHTML = '';
    const listToRender = currentTabMode === 'MAIN' ? activeCustomDeck : activeExtraDeck;

    listToRender.forEach((cardId, index) => {
      const cardDef = CARD_DATABASE.find(c => c.id === cardId);
      if (!cardDef) return;

      const itemEl = document.createElement('div');
      itemEl.className = 'db-deck-item';
      itemEl.innerHTML = `
        <div class="db-item-cost">${cardDef.cost}</div>
        <div class="db-item-name">${cardDef.name} ${cardDef.isExtra ? '👑' : ''}</div>
        <div class="db-item-stats">${cardDef.attack}/${cardDef.hp}</div>
        <button class="db-btn-remove" onclick="removeCardFromDeck(${index})">✖</button>
      `;
      deckListEl.appendChild(itemEl);
    });
  }
}

// Filtros de interfaz
function setCostFilter(cost) {
  currentCostFilter = cost;
  document.querySelectorAll('.db-filter-cost').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-cost') === String(cost));
  });
  renderDeckBuilder();
}

function setKeywordFilter(keyword) {
  currentKeywordFilter = keyword;
  document.querySelectorAll('.db-filter-kw').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-kw') === keyword);
  });
  renderDeckBuilder();
}

function setTypeFilter(typeVal) {
  currentTypeFilter = typeVal;
  renderDeckBuilder();
}

function setSubtypeFilter(subtypeVal) {
  currentSubtypeFilter = subtypeVal;
  renderDeckBuilder();
}

function setSortBy(sortVal) {
  currentSortBy = sortVal;
  renderDeckBuilder();
}

function setSearchQuery(query) {
  currentSearchQuery = query;
  renderDeckBuilder();
}

window.addEventListener('DOMContentLoaded', () => {
  loadSavedCustomDeck();
});
