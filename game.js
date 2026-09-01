function triggerBoardSlamShakeHeavy() {
  const battleContainer = document.querySelector('.battlefield-container') || document.querySelector('.board-zone') || document.getElementById('player-board');
  if (battleContainer) {
    battleContainer.classList.remove('board-slam-shake', 'board-slam-shake-heavy');
    void battleContainer.offsetWidth;
    battleContainer.classList.add('board-slam-shake-heavy');
    setTimeout(() => {
      if (battleContainer) battleContainer.classList.remove('board-slam-shake-heavy');
    }, 500);
  }
}

function triggerBoardSlamShake(who = 'player') {
  const battleContainer = document.querySelector('.battlefield-container') || document.querySelector('.board-zone') || document.getElementById('player-board');
  if (battleContainer) {
    battleContainer.classList.remove('board-slam-shake');
    void battleContainer.offsetWidth;
    battleContainer.classList.add('board-slam-shake');
    setTimeout(() => {
      if (battleContainer) battleContainer.classList.remove('board-slam-shake');
    }, 400);
  }
}


function exitDuelToMenu() {
  if (confirm("¿Estás seguro de que deseas abandonar el Duelo y volver al Menú Principal?")) {
    gameState.isGameOver = true;
    if (typeof sendP2pPacket === 'function' && (gameMode === 'ONLINE_HOST' || gameMode === 'ONLINE_GUEST')) {
      sendP2pPacket({ type: 'SURRENDER' });
    }
    addLog("🏳️ Has abandonado el Duelo.", "player");
    restartGame();
  }
}


// === MOTOR DE CARTAS DE INSTINTO (ACTIVACIÓN AUTOMÁTICA DESDE MANO) ===
async function checkHandInstinctTriggers(who, triggerType, contextObj = {}) {
  const defender = gameState[who];
  if (!defender || !defender.hand || defender.hand.length === 0) return false;

  const instinctIdx = defender.hand.findIndex(c => (c.isInstinct || c.isTrap) && c.trigger === triggerType);
  if (instinctIdx === -1) return false;

  const card = defender.hand.splice(instinctIdx, 1)[0];
  const defenderName = who === 'player' ? "tu mano" : "la mano enemiga";

  if (typeof showInstinctCardPopup === 'function') {
    showInstinctCardPopup(card, who);
  } else if (typeof showSummonCardPopup === 'function') {
    showSummonCardPopup(card, who);
  }
  if (typeof showBanner === 'function') {
    showBanner(`🧠⚡ ¡INSTINTO ACTIVADO: ${card.name.toUpperCase()}!`);
  }

  const context = {
    player: defender,
    opponent: gameState[who === 'player' ? 'enemy' : 'player'],
    isPlayer: who === 'player'
  };

  if (typeof addLog === 'function') {
    addLog(`🧠⚡ ¡INSTINTO ACTIVADO! [${card.name}] saltó automáticamente desde ${defenderName}.`, who);
  }

  let targetObj = null;
  if (contextObj.attackerInstId) {
    const oppBoard = context.opponent.board;
    const attCard = oppBoard.find(c => c.instanceId === contextObj.attackerInstId);
    if (attCard) {
      const el = document.querySelector(`[data-inst="${contextObj.attackerInstId}"]`);
      targetObj = { card: attCard, element: el };
    }
  } else if (contextObj.summonedInstId) {
    const oppBoard = context.opponent.board;
    const sumCard = oppBoard.find(c => c.instanceId === contextObj.summonedInstId);
    if (sumCard) {
      const el = document.querySelector(`[data-inst="${contextObj.summonedInstId}"]`);
      targetObj = { card: sumCard, element: el };
    }
  }

  if (card.battlecry) {
    if (typeof executeRegisteredEffect === 'function') {
      const bcList = Array.isArray(card.battlecry) ? card.battlecry : [card.battlecry];
      for (let bc of bcList) {
        executeRegisteredEffect(bc.type, context, targetObj, bc.val);
      }
    }
    await drainEffectSummonQueue(who);
  }

  if (!defender.graveyard) defender.graveyard = [];
  defender.graveyard.push(card);

  // Transmitir activación de Instinto en P2P si estamos en partida online
  if (typeof sendP2pPacket === 'function' && (gameMode === 'ONLINE_HOST' || gameMode === 'ONLINE_GUEST')) {
    sendP2pPacket({
      type: 'INSTINCT_TRIGGER',
      instinctWho: who,
      cardObj: card,
      triggerType: triggerType,
      contextObj: contextObj
    });
  }

  render();
  await sleep(1400);
  await checkDeathsAsync();
  checkWinCondition();
  return true;
}

// Motor Principal de Juego TCG para Insectos en Guerra

// Corrección de Renderizado de Campo (cardEl.className = classes) y Cola de Acciones Determinista



var gameMode = 'VS_AI';

var myP2pRole = 'HOST';



const gameState = {

  turn: 'PLAYER',

  turnNumber: 1,

  isGameOver: false,

  isAnimating: false,

  selectedAttacker: null,

  player: { hp: 30, nectar: 1, maxNectar: 1, deck: [], hand: [], board: [], extraDeck: [], traps: [], graveyard: [] },

  enemy: { hp: 30, nectar: 1, maxNectar: 1, deck: [], hand: [], board: [], extraDeck: [], traps: [], graveyard: [] }

};



// Se incrementa en cada initGame(): identifica la partida en curso.

var gameGeneration = 0;

// Las partidas online se arman fuera de initGame(): multiplayer.js llama a esto para que los
// turnos que quedaron en vuelo de la partida anterior se den por abortados.
window.startNewGameGeneration = function () {
  gameGeneration++;
};



// === COLA DE ACCIONES DETERMINISTA (actionQueue) ===

const actionQueue = [];

let isProcessingQueue = false;



function enqueueAction(type, payload) {

  actionQueue.push({ type, payload });

  processActionQueue();

}



async function processActionQueue() {

  if (isProcessingQueue) return;

  isProcessingQueue = true;



  while (actionQueue.length > 0) {

    const action = actionQueue.shift();

    try {

      if (action.type === 'PLAY_CARD') {

        await handlePlayCardAction(action.payload);

      } else if (action.type === 'PLAY_EXTRA_CARD') {

        await handlePlayExtraCardAction(action.payload);

      } else if (action.type === 'ATTACK') {

        await handleAttackAction(action.payload);

      } else if (action.type === 'END_TURN') {

        await handleEndTurnAction(action.payload);

      } else if (action.type === 'SYNC_STATE') {

        handleSyncStateAction(action.payload);

      }

    } catch (e) {

      console.error("Error al procesar acción en actionQueue:", e);

    }

  }



  isProcessingQueue = false;

}



window.takeCardDamage = function (card, amount, element) {

  if (!card) return;

  if (card.hasShield) {

    card.hasShield = false;

    if (element) spawnFloatingText(element, "🛡️ ESCUDO ROTO", true);

    return;

  }

  card.hp -= amount;

  if (element) spawnFloatingText(element, `-${amount}`);

};



window.drawCardForPlayer = function (playerObj, count = 1) {

  for (let i = 0; i < count; i++) {

    if (playerObj.deck && playerObj.deck.length > 0 && playerObj.hand.length < 7) {

      const card = playerObj.deck.pop();

      card.instanceId = 'card_' + Math.random().toString(36).substr(2, 9);

      playerObj.hand.push(card);

    }

  }

  render();

};



function initGame() {

  if (typeof autoSanitizeLocalStorage === 'function') autoSanitizeLocalStorage();

  gameGeneration++;

  actionQueue.length = 0;

  isProcessingQueue = false;

  window.effectSummonQueue = [];



  gameState.turn = 'PLAYER';

  gameState.turnNumber = 1;

  gameState.isGameOver = false;

  gameState.isAnimating = false;

  gameState.selectedAttacker = null;

  gameState.enemyHasStartedTurn = false;



  let playerDeckDefs = typeof getActiveDeckCards === 'function' ? getActiveDeckCards() : [];

  let playerExtraDefs = typeof getActiveExtraDeckCards === 'function' ? getActiveExtraDeckCards() : [];



  if (!playerDeckDefs || playerDeckDefs.length < 15) {

    const validStd = CARD_DATABASE.filter(c => !c.isExtra && !c.hidden);

    playerDeckDefs = [];

    while (playerDeckDefs.length < 15 && validStd.length > 0) {

      for (let c of validStd) {

        if (playerDeckDefs.length < 15) playerDeckDefs.push({ ...c });

      }

    }

  }

  if (!playerExtraDefs || playerExtraDefs.length === 0) {

    const validExt = CARD_DATABASE.filter(c => c.isExtra && !c.hidden);

    playerExtraDefs = validExt.slice(0, 3).map(c => ({ ...c }));

  }



  gameState.player = {

    hp: 30, nectar: 1, maxNectar: 1,

    deck: shuffleDeck(playerDeckDefs),

    hand: [], board: [], traps: [], graveyard: [],

    extraDeck: playerExtraDefs.map(c => ({

      ...c,

      instanceId: 'extra_' + Math.random().toString(36).substr(2, 9)

    }))

  };



  let enemyDeckDefs = [];

  let enemyExtraDefs = [];



  if (gameMode === 'STORY_MODE' && typeof getStoryBossMainDeck === 'function') {

    enemyDeckDefs = getStoryBossMainDeck();

    enemyExtraDefs = getStoryBossExtraDeck();

  } else {

    enemyDeckDefs = typeof getActiveDeckCards === 'function' ? getActiveDeckCards() : [];

    enemyExtraDefs = typeof getActiveExtraDeckCards === 'function' ? getActiveExtraDeckCards() : [];

  }



  if (!enemyDeckDefs || enemyDeckDefs.length === 0) {

    enemyDeckDefs = CARD_DATABASE.filter(c => !c.isExtra && !c.hidden);

  }

  if (!enemyExtraDefs || enemyExtraDefs.length === 0) {

    enemyExtraDefs = CARD_DATABASE.filter(c => c.isExtra && !c.hidden);

  }



  gameState.enemy = {

    hp: 30, nectar: 1, maxNectar: 1,

    deck: shuffleDeck(enemyDeckDefs),

    hand: [], board: [], traps: [], graveyard: [],

    extraDeck: enemyExtraDefs.map(c => ({

      ...c,

      instanceId: 'extra_enemy_' + Math.random().toString(36).substr(2, 9)

    }))

  };



  for (let i = 0; i < 4; i++) {

    drawCard('player');

    drawCard('enemy');

  }



  addLog("🎮 ¡La batalla de el Reino ha comenzado!", "system");

  render();

}



function shuffleDeck(cards) {

  if (!cards || !Array.isArray(cards)) return [];

  const deck = cards.map(c => ({

    ...c,

    instanceId: 'card_' + Math.random().toString(36).substr(2, 9)

  }));

  for (let i = deck.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [deck[i], deck[j]] = [deck[j], deck[i]];

  }

  return deck;

}



function drawCard(who) {
  const p = gameState[who];
  if (p && p.deck && p.deck.length > 0 && p.hand.length < 7) {
    const card = p.deck.pop();
    p.hand.push(card);
    if (who === 'player') {
      addLog(`🃏 Robaste a [${card.name}].`, "player");
    } else {
      addLog("🃏 Oponente robó 1 carta.", "enemy");
    }
  }
}

function deduplicateBoard(board) {
  if (!Array.isArray(board)) return [];
  const seen = new Set();
  return board.filter(card => {
    if (!card) return false;
    if (card.instanceId === undefined || card.instanceId === null) return true;
    if (seen.has(card.instanceId)) return false;
    seen.add(card.instanceId);
    return true;
  });
}



function endTurn() {

  if (gameState.turn !== 'PLAYER' || gameState.isGameOver || gameState.isAnimating) return;

  enqueueAction('END_TURN', { who: 'player' });

}



async function handleEndTurnAction(payload) {

  const { who } = payload;



  if (who === 'player') {

    gameState.selectedAttacker = null;

    removeBadges();



    if (gameMode === 'VS_AI' || gameMode === 'STORY_MODE') {

      gameState.turn = 'ENEMY';

      render();

      addLog("🤖 Turno de la IA Enemiga...", "enemy");

      await sleep(500);

      await runAiTurn();

    } else {

      sendP2pPacket({ type: 'END_TURN' });

      gameState.turn = 'ENEMY';

      addLog("⏳ Esperando el turno del Oponente...", "system");

      render();

    }

  } else {

    addLog("🌐 El oponente finalizó su turno. ¡Es tu turno!", "player");

    startTurn('player');

  }

}



async function startTurn(who) {

  const p = gameState[who];

  if (who === 'player') {

    gameState.turn = 'PLAYER';

    gameState.turnNumber++;

  } else {

    gameState.turn = 'ENEMY';

  }



  p.maxNectar = Math.min(10, p.maxNectar + 1);

  p.nectar = p.maxNectar;

  drawCard(who);



  p.board.forEach(c => {

    const maxAttacks = (c.keywords || []).includes('DOBLE_ATAQUE') ? 2 : 1;

    c.attacksLeft = maxAttacks;

    c.canAttack = true;

  });



  const name = who === 'player' ? "Jugador" : "Oponente";

  addLog(`--- Turno ${gameState.turnNumber}: ${name} (${p.nectar} Néctar) ---`, "system");



  render();

}



async function playCard(handIndex) {
  if (gameState.turn !== 'PLAYER' || gameState.isGameOver || gameState.isAnimating) return;

  const p = gameState.player;
  const card = p.hand[handIndex];

  if (!card) return;

  if (card.isInstinct || card.isTrap) {
    showBanner("🧠⚡ CARTAS DE INSTINTO: Se activan automáticamente desde la mano al reaccionar.");
    return;
  }

  if (p.nectar < card.cost) {
    addLog(`💧 Necesitas ${card.cost} Néctar para jugar a ${card.name} (Tienes ${p.nectar}).`, "system");
    showBanner(`💧 ¡NECESITAS ${card.cost} NÉCTAR!`);
    return;
  }

  if (!card.isSpell && !card.isTrap && p.board.length >= 6) {
    addLog("Tu tablero está lleno (Máx. 6 criaturas).", "system");
    return;
  }

  if (card.isTrap && p.traps.length >= 3) {
    addLog("Ya tienes el máximo de 3 trampas ocultas activas.", "system");
    return;
  }

  enqueueAction('PLAY_CARD', { who: 'player', handIndex: handIndex, cardObj: card, isLocal: true });
}



function playExtraCard(extraIndex) {

  if (gameState.turn !== 'PLAYER' || gameState.isGameOver || gameState.isAnimating) return;



  const p = gameState.player;

  const card = p.extraDeck[extraIndex];



  if (!card) return;



  if (p.nectar < card.cost) {

    addLog(`💧 Necesitas ${card.cost} Néctar para invocar al Comandante ${card.name} (Tienes ${p.nectar}).`, "system");

    showBanner(`💧 ¡NECESITAS ${card.cost} NÉCTAR!`);

    return;

  }



  if (p.board.length >= 6) {

    addLog("Tu tablero está lleno (Máx. 6 criaturas).", "system");

    return;

  }



  enqueueAction('PLAY_EXTRA_CARD', { who: 'player', extraIndex: extraIndex, cardObj: card, isLocal: true });

}

// La cola guarda instanceIds de la partida en curso: al empezar otra hay que vaciarla.
window.resetEffectSummonQueue = function () {
  window.effectSummonQueue = [];
};

// Criaturas que un efecto acaba de poner en el tablero: cada una dispara un INSTINTO de SUMMON en el rival.
async function drainEffectSummonQueue(who) {
  while (window.effectSummonQueue && window.effectSummonQueue.length > 0) {
    const summonedInstId = window.effectSummonQueue.shift();
    await checkHandInstinctTriggers(who === 'player' ? 'enemy' : 'player', 'SUMMON', { summonedInstId: summonedInstId });
  }
}

// Estos efectos escriben desde effects.js su propio motivo de fracaso (mazo vacío, mano llena,
// cementerio sin criaturas): volver a loguearlo acá duplicaría la línea.
const SELF_EXPLAINED_FAILURES = ['SEARCH_DECK', 'REVIVE_RANDOM_CREATURE', 'SUMMON_RANDOM_FROM_HAND'];

async function executeBattlecryAsync(who, battlecry) {
  if (!battlecry) return;
  const p = gameState[who];
  const opp = gameState[who === 'player' ? 'enemy' : 'player'];
  const isPlayer = who === 'player';
  const nameTag = isPlayer ? "Jugador" : "Oponente";

  const bcList = Array.isArray(battlecry) ? battlecry : [battlecry];

  for (let bc of bcList) {
    if (!bc || !bc.type) continue;

    let targetObj = null;

    // Asignación inteligente de objetivo por defecto si el efecto requiere un objetivo (ej. DAMAGE_TARGET)
    if (!targetObj && (bc.type === 'DAMAGE_TARGET' || bc.type === 'DESTROY_TARGET_CREATURE')) {
      if (opp.board && opp.board.length > 0) {
        const targetCard = opp.board[0];
        const targetEl = document.querySelector(`[data-inst="${targetCard.instanceId}"]`);
        targetObj = { card: targetCard, element: targetEl };
      } else {
        const hiveEl = document.getElementById(isPlayer ? 'enemy-hive' : 'player-hive');
        targetObj = { isHive: true, player: opp, element: hiveEl };
      }
    }

    const context = {
      player: p,
      opponent: opp,
      isPlayer: isPlayer
    };

    let effectApplied = true;
    if (typeof executeRegisteredEffect === 'function') {
      effectApplied = executeRegisteredEffect(bc.type, context, targetObj, bc.val, bc) !== false;
    }

    const targetName = targetObj ? (targetObj.isHive ? "el Reino Enemigo" : `[${targetObj.card ? targetObj.card.name : 'Criatura'}]`) : "el objetivo";

    if (!effectApplied) {
      // El efecto no llegó a aplicarse: no se anuncia como si hubiera pasado algo.
      if (bc.type === 'DESTROY_TARGET_CREATURE') {
        addLog(`💀 Grito/Hechizo: ${nameTag} no encontró ninguna criatura enemiga que destruir.`, who);
      } else if (!SELF_EXPLAINED_FAILURES.includes(bc.type)) {
        addLog(`⚠️ Grito/Hechizo: el efecto de ${nameTag} no tuvo ningún resultado.`, who);
      }
    } else if (bc.type === 'DAMAGE_TARGET') {
      addLog(`💥 Grito/Hechizo: ${nameTag} infligió ${bc.val} de daño a ${targetName}.`, who);
    } else if (bc.type === 'DESTROY_TARGET_CREATURE') {
      // El ESCUDO absorbe la destrucción: la criatura sigue en el tablero.
      if (targetObj && targetObj.card && targetObj.card.hp > 0) {
        addLog(`🛡️ Grito/Hechizo: ${nameTag} solo rompió el ESCUDO de ${targetName}.`, who);
      } else {
        addLog(`💀 Grito/Hechizo: ${nameTag} destruyó a ${targetName}.`, who);
      }
    } else if (bc.type === 'DAMAGE_SELF_HIVE') {
      addLog(`🩸 Grito/Hechizo: ${nameTag} sacrificó ${bc.val || 1} HP de su propio Reino.`, who);
    } else if (bc.type === 'SUMMON_RANDOM_FROM_HAND') {
      addLog(`🃏 Grito/Hechizo: ${nameTag} invocó una criatura aleatoria directamente de su mano.`, who);
    } else if (bc.type === 'BUFF_ALL_FRIENDLIES_HP' || bc.type === 'BUFF_ALL_FRIENDLIES_MAX_HP') {
      addLog(`✨ Grito/Hechizo: ${nameTag} aumentó la salud máxima de todas sus criaturas en +${bc.val} HP.`, who);
    } else if (bc.type === 'BUFF_ALL_FRIENDLIES_ATK') {
      addLog(`⚔️ Grito/Hechizo: ${nameTag} aumentó el ataque de todas sus criaturas en +${bc.val} ATK.`, who);
    } else if (bc.type === 'HEAL_HIVE') {
      addLog(`💚 Grito/Hechizo: ${nameTag} restauró +${bc.val} HP a su Reino.`, who);
    } else if (bc.type === 'HEAL_ALL_FRIENDLIES') {
      addLog(`💚 Grito/Hechizo: ${nameTag} restauró +${bc.val} HP a todas sus criaturas.`, who);
    } else if (bc.type === 'DAMAGE_ENEMY_HIVE') {
      addLog(`🎯 Grito/Hechizo: ${nameTag} infligió ${bc.val} de daño directo al Reino enemigo.`, who);
    } else if (bc.type === 'DAMAGE_ALL_ENEMIES') {
      addLog(`💥 Grito/Hechizo: ${nameTag} infligió ${bc.val} de daño a todas las criaturas enemigas.`, who);
    } else if (bc.type === 'GAIN_NECTAR') {
      addLog(`💧 Grito/Hechizo: ${nameTag} obtuvo +${bc.val} de Néctar en este turno.`, who);
    } else if (bc.type === 'PERMANENT_NECTAR') {
      addLog(`🧪 Grito/Hechizo: ${nameTag} aumentó su límite máximo de Néctar en +${bc.val}.`, who);
    } else if (bc.type === 'SEARCH_DECK') {
      addLog(`🔍 Grito/Hechizo: ${nameTag} buscó en su mazo.`, who);
    } else if (bc.type === 'REVIVE_RANDOM_CREATURE') {
      addLog(`🔮 Grito/Hechizo: ${nameTag} revivió criaturas de su cementerio.`, who);
    } else if (bc.type === 'DRAW_CARD') {
      addLog(`🃏 Grito/Hechizo: ${nameTag} robó ${bc.val || 1} carta(s) de su mazo.`, who);
    }

    // El número flotante lo dibuja el propio efecto, colgado de la carta que tocó.
    // render() reconstruye esos nodos, así que primero se muda el flotante al overlay.
    liftFloatingTextsToOverlay();
    render();
    await sleep(250);

    await drainEffectSummonQueue(who);
  }

  await checkDeathsAsync();
  checkWinCondition();
}



function selectAttacker(instanceId) {

  if (gameState.turn !== 'PLAYER' || gameState.isGameOver || gameState.isAnimating) return;

  const card = gameState.player.board.find(c => c.instanceId === instanceId);

  if (!card || !card.canAttack) return;



  if (gameState.selectedAttacker === instanceId) {

    gameState.selectedAttacker = null;

  } else {

    gameState.selectedAttacker = instanceId;

  }

  removeBadges();

  render();

}



function animatePhysicalSlide(attackerEl, targetEl, onImpactCallback) {
  return new Promise(resolve => {
    if (!attackerEl || !targetEl) {
      onImpactCallback();
      resolve();
      return;
    }

    gameState.isAnimating = true;
    const attRect = attackerEl.getBoundingClientRect();
    const tarRect = targetEl.getBoundingClientRect();

    const attCenterX = attRect.left + (attRect.width / 2);
    const attCenterY = attRect.top + (attRect.height / 2);
    const tarCenterX = tarRect.left + (tarRect.width / 2);
    const tarCenterY = tarRect.top + (tarRect.height / 2);

    const deltaX = tarCenterX - attCenterX;
    const deltaY = tarCenterY - attCenterY;

    // Normalizar vector para la toma de carrera hacia atrás
    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY) || 1;
    const normX = deltaX / dist;
    const normY = deltaY / dist;
    const recoilX = -normX * 38;
    const recoilY = -normY * 38;

    attackerEl.style.zIndex = '200';

    // FASE 1: TOMA DE CARRERA ELEVADA HACIA ATRÁS (1.45X + SOMBRA PROFUNDA) (180ms)
    attackerEl.style.transition = 'transform 0.18s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.18s ease-out';
    attackerEl.style.boxShadow = '0 35px 25px rgba(0, 0, 0, 0.85), 0 0 25px rgba(241, 196, 15, 0.7)';
    attackerEl.style.transform = `translate(${recoilX}px, ${recoilY}px) scale(1.45)`;

    setTimeout(() => {
      // FASE 2: EMBESTIDA EXPLOSIVA Y VELOZ A TODA FUERZA (170ms)
      attackerEl.style.transition = 'transform 0.17s cubic-bezier(0.55, 0.055, 0.675, 0.19), box-shadow 0.17s ease-out';
      attackerEl.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.30)`;

      setTimeout(() => {
        // FASE 3: CHOQUE, DAÑO Y SACUDIDA SÍSMICA DE TODO EL CAMPO (130ms)
        targetEl.classList.add('anim-shake');
        triggerBoardSlamShake();
        onImpactCallback();

        setTimeout(() => {
          // FASE 4: RETORNO SUAVE Y PAUSADO CON PESO HACIA SU CASILLA (430ms)
          attackerEl.style.transition = 'transform 0.43s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.43s ease-out';
          attackerEl.style.boxShadow = '';
          attackerEl.style.transform = 'translate(0px, 0px) scale(1)';

          setTimeout(() => {
            attackerEl.style.transition = '';
            attackerEl.style.zIndex = '';
            targetEl.classList.remove('anim-shake');
            gameState.isAnimating = false;
            resolve();
          }, 440);
        }, 130);
      }, 180);
    }, 185);
  });
}

async function attackTarget(targetType, targetId) {

  if (gameState.turn !== 'PLAYER' || !gameState.selectedAttacker || gameState.isGameOver || gameState.isAnimating) return;



  const attacker = gameState.player.board.find(c => c.instanceId === gameState.selectedAttacker);

  if (!attacker || !attacker.canAttack) return;



  const enemyHasTaunt = gameState.enemy.board.some(c => (c.keywords || []).includes("PROVOCAR"));

  const attackerHasFlying = (attacker.keywords || []).includes("VUELO");



  if (targetType === 'HIVE' && enemyHasTaunt && !attackerHasFlying) {

    addLog("¡Debes atacar primero a las criaturas con PROVOCAR!", "system");

    return;

  }



  if (targetType === 'CREATURE') {

    const defender = gameState.enemy.board.find(c => c.instanceId === targetId);

    if (!defender) return;

    if (enemyHasTaunt && !(defender.keywords || []).includes("PROVOCAR") && !attackerHasFlying) {

      addLog("¡Debes atacar a una carta con PROVOCAR!", "system");

      return;

    }

  }



  enqueueAction('ATTACK', { who: 'player', targetType: targetType, attackerInstId: attacker.instanceId, targetInstId: targetId });

}



async function handleAttackAction(payload) {
  const defenderWho = payload.who === 'player' ? 'enemy' : 'player';
  const instinctTriggered = await checkHandInstinctTriggers(defenderWho, 'ATTACK', { attackerInstId: payload.attackerInstId });
  if (instinctTriggered) {
    // Un ataque cancelado por Instinto igual gasta la acción del atacante en este turno.
    const cancelledBoard = payload.who === 'player' ? gameState.player.board : gameState.enemy.board;
    const cancelledAttacker = cancelledBoard.find(c => c.instanceId === payload.attackerInstId);
    if (cancelledAttacker) {
      cancelledAttacker.attacksLeft = Math.max(0, (cancelledAttacker.attacksLeft || 1) - 1);
      cancelledAttacker.canAttack = cancelledAttacker.attacksLeft > 0;
    }
    if (payload.who === 'player') gameState.selectedAttacker = null;
    addLog(`🛡️ El ataque de la criatura fue cancelado por la reacción de Instinto.`, payload.who);
    render();
    return;
  }

  const { who, targetType, attackerInstId, targetInstId } = payload;

  const isLocal = who === 'player';

  const attackerBoard = isLocal ? gameState.player.board : gameState.enemy.board;

  const defenderBoard = isLocal ? gameState.enemy.board : gameState.player.board;

  const defenderTraps = isLocal ? gameState.enemy.traps : gameState.player.traps;



  const attacker = attackerBoard.find(c => c.instanceId === attackerInstId);

  if (!attacker) return;



  removeBadges();



  // === ACTIVACIÓN DE TRAMPA DE ATAQUE DE DEFENSOR ===

  const attackTrapIdx = defenderTraps.findIndex(t => t.trigger === 'ATTACK');

  if (attackTrapIdx !== -1 && typeof triggerTrapEffect === 'function') {

    const trap = defenderTraps.splice(attackTrapIdx, 1)[0];

    const attackerEl = document.querySelector(`[data-inst="${attacker.instanceId}"]`);

    await triggerTrapEffect(isLocal ? 'enemy' : 'player', trap, { card: attacker, element: attackerEl });

    if (attacker.hp <= 0) {

      await checkDeathsAsync();

      render();

      return;

    }

  }



  if (targetType === 'HIVE') {

    attacker.attacksLeft = Math.max(0, (attacker.attacksLeft || 1) - 1);

    attacker.canAttack = attacker.attacksLeft > 0;

    if (isLocal) gameState.selectedAttacker = null;



    if (isLocal && gameMode !== 'VS_AI') {

      sendP2pPacket({ type: 'ATTACK', targetType: 'HIVE', attackerInstId: attacker.instanceId, targetInstId: null });

    }



    const attackerEl = document.querySelector(`[data-inst="${attacker.instanceId}"]`);

    const targetHiveEl = document.getElementById(isLocal ? 'enemy-hive' : 'player-hive');



    addLog(`⚔️ ${attacker.name} atacó a el Reino (-${attacker.attack} HP).`, isLocal ? "player" : "enemy");



    await animatePhysicalSlide(attackerEl, targetHiveEl, () => {

      if (isLocal) gameState.enemy.hp -= attacker.attack; else gameState.player.hp -= attacker.attack;

      spawnFloatingText(targetHiveEl, `-${attacker.attack}`);

    });



    // === ACTIVACIÓN DE TRAMPA DE DAÑO A COLMENA ===

    const hiveDamagedTrapIdx = defenderTraps.findIndex(t => t.trigger === 'DAMAGE_HIVE');

    if (hiveDamagedTrapIdx !== -1 && typeof triggerTrapEffect === 'function') {

      const trap = defenderTraps.splice(hiveDamagedTrapIdx, 1)[0];

      await triggerTrapEffect(isLocal ? 'enemy' : 'player', trap, { isHive: true, player: isLocal ? gameState.enemy : gameState.player, element: targetHiveEl });

    }



    // Revisar si el defensor tiene un INSTINTO en mano para DAMAGE_HIVE

    await checkHandInstinctTriggers(defenderWho, 'DAMAGE_HIVE', { attackerInstId: attacker.instanceId });



    await sleep(300);

  } else if (targetType === 'CREATURE') {

    const defender = defenderBoard.find(c => c.instanceId === targetInstId);

    if (!defender) return;



    attacker.attacksLeft = Math.max(0, (attacker.attacksLeft || 1) - 1);

    attacker.canAttack = attacker.attacksLeft > 0;

    if (isLocal) gameState.selectedAttacker = null;



    if (isLocal && gameMode !== 'VS_AI') {

      sendP2pPacket({ type: 'ATTACK', targetType: 'CREATURE', attackerInstId: attacker.instanceId, targetInstId: defender.instanceId });

    }



    const attackerEl = document.querySelector(`[data-inst="${attacker.instanceId}"]`);

    const defenderEl = document.querySelector(`[data-inst="${defender.instanceId}"]`);



    addLog(`⚔️ [${attacker.name}] luchó contra [${defender.name}].`, isLocal ? "player" : "enemy");



    await animatePhysicalSlide(attackerEl, defenderEl, () => {

      if (defender.hasShield) {

        defender.hasShield = false;

        spawnFloatingText(defenderEl, "🛡️ ESCUDO ROTO", true);

      } else if ((attacker.keywords || []).includes("VENENO")) {

        defender.hp = 0;

        spawnFloatingText(defenderEl, "☠️ VENENO");

      } else {

        defender.hp -= attacker.attack;

        spawnFloatingText(defenderEl, `-${attacker.attack}`);

      }



      if (attacker.hasShield) {

        attacker.hasShield = false;

        spawnFloatingText(attackerEl, "🛡️ ESCUDO ROTO", true);

      } else if ((defender.keywords || []).includes("VENENO")) {

        attacker.hp = 0;

        spawnFloatingText(attackerEl, "☠️ VENENO");

      } else {

        attacker.hp -= defender.attack;

        spawnFloatingText(attackerEl, `-${defender.attack}`);

      }

    });



    await sleep(350);

    await checkDeathsAsync();

  }



  checkWinCondition();

  render();

}



function checkDeaths() {

  const deadPlayerCards = gameState.player.board.filter(c => c.hp <= 0);

  const deadEnemyCards = gameState.enemy.board.filter(c => c.hp <= 0);



  deadPlayerCards.forEach(c => {

    addLog(`💀 [${c.name}] del Jugador fue destruido.`, "enemy");

    if (!c.isSpell && !c.isTrap) gameState.player.graveyard.push({ ...c });

  });



  deadEnemyCards.forEach(c => {

    addLog(`💀 [${c.name}] del Oponente fue destruido.`, "player");

    if (!c.isSpell && !c.isTrap) gameState.enemy.graveyard.push({ ...c });

  });



  gameState.player.board = gameState.player.board.filter(c => c.hp > 0);

  gameState.enemy.board = gameState.enemy.board.filter(c => c.hp > 0);

}



async function checkDeathsAsync() {

  const deadPlayerCards = gameState.player.board.filter(c => c.hp <= 0);

  const deadEnemyCards = gameState.enemy.board.filter(c => c.hp <= 0);



  const allDead = deadPlayerCards.concat(deadEnemyCards);



  if (allDead.length > 0) {

    gameState.isAnimating = true;



    allDead.forEach(c => {

      const el = document.querySelector(`[data-inst="${c.instanceId}"]`);

      if (el) {

        if (!el.querySelector('.card-cracked-overlay')) {

          const crackOverlay = document.createElement('div');

          crackOverlay.className = 'card-cracked-overlay';

          el.appendChild(crackOverlay);

        }

        el.classList.add('anim-crack-shatter');

        spawnFloatingText(el, "💀 QUEBRADO");

      }

    });



    await sleep(850);



    gameState.player.board = gameState.player.board.filter(c => {

      if (c.hp <= 0) {

        addLog(`💀 [${c.name}] del Jugador se quebró y fue destruido.`, "enemy");

        if (!c.isSpell && !c.isTrap) {

          gameState.player.graveyard.push({ ...c });

        }

        return false;

      }

      return true;

    });



    gameState.enemy.board = gameState.enemy.board.filter(c => {

      if (c.hp <= 0) {

        addLog(`💀 [${c.name}] del Oponente se quebró y fue destruido.`, "player");

        if (!c.isSpell && !c.isTrap) {

          gameState.enemy.graveyard.push({ ...c });

        }

        return false;

      }

      return true;

    });



    gameState.isAnimating = false;

  }

}



function checkWinCondition() {

  if (gameState.isGameOver) return;

  if (gameState.player.hp <= 0) {

    gameState.isGameOver = true;

    showEndModal("¡DERROTA!", "Tu colmena ha caído.", "loss");

  } else if (gameState.enemy.hp <= 0) {
    gameState.isGameOver = true;
    if (gameMode === 'STORY_MODE' && typeof getCurrentStoryChapter === 'function') {
      const ch = getCurrentStoryChapter();
      let unlockedNames = [];
      if (ch.rewardCardIds && typeof unlockSpecificCards === 'function') {
        unlockedNames = unlockSpecificCards(ch.rewardCardIds);
      }
      const hasNext = (currentStoryChapterIndex + 1) < STORY_CHAPTERS.length;
      if (hasNext) {
        saveStoryProgress(currentStoryChapterIndex + 1);
      }
      showStoryVictoryModal(ch, unlockedNames, hasNext);
    } else {
      showEndModal("¡VICTORIA!", "Has destruido la colmena enemiga.", "win");
    }
  }

}



function sleep(ms) {

  return new Promise(resolve => setTimeout(resolve, ms));

}



function handleSyncStateAction(payload) {

  if (!payload) return;

  if (gameMode === 'ONLINE_HOST') {

    if (payload.hostHp !== undefined) gameState.player.hp = payload.hostHp;

    if (payload.guestHp !== undefined) gameState.enemy.hp = payload.guestHp;

    if (payload.hostNectar !== undefined) gameState.player.nectar = payload.hostNectar;

    if (payload.hostMaxNectar !== undefined) gameState.player.maxNectar = payload.hostMaxNectar;

    if (payload.guestNectar !== undefined) gameState.enemy.nectar = payload.guestNectar;

    if (payload.guestMaxNectar !== undefined) gameState.enemy.maxNectar = payload.guestMaxNectar;

    if (payload.guestBoard) gameState.enemy.board = deduplicateBoard(payload.guestBoard);

    if (payload.guestHand) gameState.enemy.hand = payload.guestHand;

    if (payload.guestExtraDeck) gameState.enemy.extraDeck = payload.guestExtraDeck;

    if (payload.guestTraps) gameState.enemy.traps = payload.guestTraps;

  } else {

    if (payload.guestHp !== undefined) gameState.player.hp = payload.guestHp;

    if (payload.hostHp !== undefined) gameState.enemy.hp = payload.hostHp;

    if (payload.guestNectar !== undefined) gameState.player.nectar = payload.guestNectar;

    if (payload.guestMaxNectar !== undefined) gameState.player.maxNectar = payload.guestMaxNectar;

    if (payload.hostNectar !== undefined) gameState.enemy.nectar = payload.hostNectar;

    if (payload.hostMaxNectar !== undefined) gameState.enemy.maxNectar = payload.hostMaxNectar;

    if (payload.hostBoard) gameState.enemy.board = deduplicateBoard(payload.hostBoard);

    if (payload.hostHand) gameState.enemy.hand = payload.hostHand;

    if (payload.hostExtraDeck) gameState.enemy.extraDeck = payload.hostExtraDeck;

    if (payload.hostTraps) gameState.enemy.traps = payload.hostTraps;

  }

}



async function runAiTurn() {

  const myGeneration = gameGeneration;

  const myMode = gameMode;

  // El turno pertenece a la partida que lo lanzó: si arrancó otra (initGame, o el salto a una
  // partida online) nada de lo que quede en vuelo de este debe tocar el tablero.

  const aborted = () => gameGeneration !== myGeneration || gameMode !== myMode;

  try {

    const p = gameState.enemy;

    const opp = gameState.player;



    // INICIO DEL TURNO DE LA IA: Rampa de Néctar, robar carta y activar criaturas en campo

    // En su primer turno no rampa ni roba, igual que el turno 1 del jugador.

    if (gameState.enemyHasStartedTurn) {

      p.maxNectar = Math.min(10, p.maxNectar + 1);

      p.nectar = p.maxNectar;

      drawCard('enemy');

    }

    gameState.enemyHasStartedTurn = true;

    p.board.forEach(c => {

      const maxAttacks = (c.keywords || []).includes('DOBLE_ATAQUE') ? 2 : 1;

      c.attacksLeft = maxAttacks;

      c.canAttack = true;

    });



    addLog(`--- Turno de la IA Enemiga (${p.nectar} Néctar) ---`, "enemy");

    render();

    await sleep(1200);

    if (aborted()) return;





    // Evaluar lanzar Hechizos si la IA los tiene

    const spellHandIdx = p.hand.findIndex(c => c.isSpell && !c.isInstinct && !c.isTrap && c.cost <= p.nectar);

    if (spellHandIdx !== -1 && !gameState.isGameOver) {

      const card = p.hand.splice(spellHandIdx, 1)[0];

      p.nectar -= card.cost;

      showSpellCardPopup(card, 'enemy'); render(); await sleep(1000);

      if (aborted()) return;

      addLog(`✨ Oponente lanzó el Hechizo [${card.name}].`, "enemy");

      if (typeof showSpellOrTrapBanner === 'function') {

        showSpellOrTrapBanner("✨ HECHIZO ENEMIGO", card.name.toUpperCase());

      }

      if (card.battlecry) await executeBattlecryAsync('enemy', card.battlecry);

      if (aborted()) return;

      render();

      await sleep(1200);

      if (aborted()) return;

    }



    // Evaluar invocar Comandantes del Deck Extra

    const affordableExtraIdx = p.extraDeck.findIndex(c => c.cost <= p.nectar);

    if (affordableExtraIdx !== -1 && p.board.length < 6 && !gameState.isGameOver) {

      const card = p.extraDeck.splice(affordableExtraIdx, 1)[0];

      p.nectar -= card.cost;

      const hasShield = (card.keywords || []).includes("ESCUDO") || (card.keywords || []).includes("SHIELD");

      const boardCard = {

        instanceId: card.instanceId,

        id: card.id,

        name: card.name,

        cost: card.cost,

        attack: card.attack,

        hp: card.hp,

        maxHp: card.hp,

        image: card.image,

        keywords: card.keywords || [],

        description: card.description || '',

        battlecry: card.battlecry || null,

        hasShield: hasShield,

        canAttack: (card.keywords || []).includes("PRISA"),

        isNewSummon: true

      };

      p.board.push(boardCard);

      const isAiBoss = (card.cost || 0) >= 5;
        setTimeout(() => {
          if (isAiBoss) triggerBoardSlamShakeHeavy();
          else triggerBoardSlamShake('enemy');
        }, 300);
        render(); await sleep(isAiBoss ? 900 : 750);

      if (aborted()) return;

      addLog(`👑 ¡Enemigo invocó al Comandante Leyenda [${card.name}]!`, "enemy");

      showBanner(`👑 ¡COMANDANTE ENEMIGO: ${card.name.toUpperCase()}!`);

      if (card.battlecry) await executeBattlecryAsync('enemy', card.battlecry);

      if (aborted()) return;



      // Revisar si el jugador tiene un INSTINTO en mano para SUMMON
      await checkHandInstinctTriggers('player', 'SUMMON', { summonedInstId: boardCard.instanceId });

      if (aborted()) return;



      render();

      await sleep(1200);

      if (aborted()) return;

    }



    let playable = true;

    while (playable && p.board.length < 6 && !gameState.isGameOver) {

      p.hand.sort((a, b) => b.cost - a.cost);

      const affordableIndex = p.hand.findIndex(c => c.cost <= p.nectar && !c.isSpell && !c.isTrap);



      if (affordableIndex !== -1) {

        const card = p.hand.splice(affordableIndex, 1)[0];

        p.nectar -= card.cost;

        const hasShield = (card.keywords || []).includes("ESCUDO") || (card.keywords || []).includes("SHIELD");



        const boardCard = {

          instanceId: card.instanceId,

          id: card.id,

          name: card.name,

          cost: card.cost,

          attack: card.attack,

          hp: card.hp,

          maxHp: card.hp,

          image: card.image,

          keywords: card.keywords || [],

          description: card.description || '',

          battlecry: card.battlecry || null,

          hasShield: hasShield,

          canAttack: (card.keywords || []).includes("PRISA"),

          isNewSummon: true

        };



        p.board.push(boardCard);

        const isAiBoss = (card.cost || 0) >= 5;
        setTimeout(() => {
          if (isAiBoss) triggerBoardSlamShakeHeavy();
          else triggerBoardSlamShake('enemy');
        }, 300);
        render(); await sleep(isAiBoss ? 900 : 750);

        if (aborted()) return;

        addLog(`⚔️ Enemigo invocó a [${card.name}] al campo.`, "enemy");

        showBanner(`🤖 ¡ENEMIGO INVOCÓ: ${card.name.toUpperCase()}!`);



        if (card.battlecry) {

          await executeBattlecryAsync('enemy', card.battlecry);

          if (aborted()) return;

        }



        // Revisar si el jugador tiene un INSTINTO en mano para SUMMON
        await checkHandInstinctTriggers('player', 'SUMMON', { summonedInstId: boardCard.instanceId });

        if (aborted()) return;



        render();

        setTimeout(() => { boardCard.isNewSummon = false; }, 600);

        await sleep(1200);

        if (aborted()) return;

      } else {

        playable = false;

      }

    }



    render();

    await sleep(1200);

    if (aborted()) return;



    // Se re-elige atacante en cada vuelta: DOBLE_ATAQUE deja canAttack en true tras el primer golpe.

    while (!gameState.isGameOver) {

      const attacker = p.board.find(c => c.canAttack);

      if (!attacker) break;

      const attacksLeftBefore = attacker.attacksLeft;



      // Revisar si el jugador tiene un INSTINTO en mano para ATTACK
      const instinctTriggered = await checkHandInstinctTriggers('player', 'ATTACK', { attackerInstId: attacker.instanceId });
      if (aborted()) return;
      if (instinctTriggered) {
        // Un ataque cancelado por Instinto igual gasta la acción del atacante en este turno.
        attacker.attacksLeft = Math.max(0, (attacker.attacksLeft || 1) - 1);
        attacker.canAttack = attacker.attacksLeft > 0;
        addLog(`🛡️ El ataque de la criatura enemiga fue cancelado por tu Instinto.`, "player");
        await checkDeathsAsync();
        if (aborted()) return;
        render();
        continue;
      }



      const playerHasTaunt = gameState.player.board.some(c => (c.keywords || []).includes("PROVOCAR"));

      const attackerHasFlying = (attacker.keywords || []).includes("VUELO");



      let targets = [];

      if (playerHasTaunt && !attackerHasFlying) {

        targets = gameState.player.board.filter(c => (c.keywords || []).includes("PROVOCAR"));

      } else {

        targets = [...gameState.player.board, { type: 'HIVE' }];

      }



      if (targets.length > 0) {

        const target = targets[Math.floor(Math.random() * targets.length)];

        const attackerEl = document.querySelector(`[data-inst="${attacker.instanceId}"]`);



        if (target.type === 'HIVE') {

          const pHiveEl = document.getElementById('player-hive');

          await animatePhysicalSlide(attackerEl, pHiveEl, () => {

            if (aborted()) return;

            spawnFloatingText(pHiveEl, `-${attacker.attack}`);

            gameState.player.hp -= attacker.attack;

            addLog(`⚔️ [${attacker.name}] atacó a tu Reino (-${attacker.attack} HP).`, "enemy");

            attacker.attacksLeft = Math.max(0, (attacker.attacksLeft || 1) - 1);

            attacker.canAttack = attacker.attacksLeft > 0;

          });



          if (aborted()) return;

          // Revisar si el jugador tiene un INSTINTO en mano para DAMAGE_HIVE
          await checkHandInstinctTriggers('player', 'DAMAGE_HIVE', { attackerInstId: attacker.instanceId });

          if (aborted()) return;

        } else {

          const defenderEl = document.querySelector(`[data-inst="${target.instanceId}"]`);

          await animatePhysicalSlide(attackerEl, defenderEl, () => {

            if (aborted()) return;

            if (target.hasShield) {

              target.hasShield = false;

              spawnFloatingText(defenderEl, "🛡️ ESCUDO ROTO", true);

            } else if ((attacker.keywords || []).includes("VENENO")) {

              target.hp = 0;

              spawnFloatingText(defenderEl, "☠️ VENENO");

            } else {

              target.hp -= attacker.attack;

              spawnFloatingText(defenderEl, `-${attacker.attack}`);

            }



            if (attacker.hasShield) {

              attacker.hasShield = false;

              spawnFloatingText(attackerEl, "🛡️ ESCUDO ROTO", true);

            } else if ((target.keywords || []).includes("VENENO")) {

              attacker.hp = 0;

              spawnFloatingText(attackerEl, "☠️ VENENO");

            } else {

              attacker.hp -= target.attack;

              spawnFloatingText(attackerEl, `-${target.attack}`);

            }



            addLog(`⚔️ [${attacker.name}] atacó a tu [${target.name}].`, "enemy");

            attacker.attacksLeft = Math.max(0, (attacker.attacksLeft || 1) - 1);

            attacker.canAttack = attacker.attacksLeft > 0;

          });

        }



        if (aborted()) return;

        await checkDeathsAsync();

        if (aborted()) return;

        checkWinCondition();

        render();

        await sleep(1200);

        if (aborted()) return;

      }



      // Si el atacante no gastó ataque en esta vuelta, se retira para no repetirla eternamente.

      if (attacker.canAttack && attacker.attacksLeft === attacksLeftBefore) {

        attacker.canAttack = false;

      }

    }



  } catch (e) {

    console.error('Error durante el turno de la IA:', e);

  } finally {

    if (!aborted() && !gameState.isGameOver) {

      startTurn('player');

    }

  }

}



// Capa fija fuera del tablero: lo que cuelga de acá sobrevive a render().

function getFloatingTextOverlay() {

  let overlay = document.getElementById('floating-text-overlay');

  if (!overlay) {

    overlay = document.createElement('div');

    overlay.id = 'floating-text-overlay';

    overlay.style.cssText = 'position:fixed; inset:0; pointer-events:none; z-index:900;';

    document.body.appendChild(overlay);

  }

  return overlay;

}



// Los flotantes cuelgan de la carta que los provocó, y render() rehace el tablero con innerHTML.

// Mudarlos al overlay, congelados en la posición de pantalla que tenían, los deja terminar su

// animación aunque su carta ya no exista.

function liftFloatingTextsToOverlay() {

  const overlay = getFloatingTextOverlay();

  document.querySelectorAll('.board-row .floating-damage, .board-row .floating-heal, .board-row .floating-status-banner').forEach(floatEl => {

    const host = floatEl.parentElement;

    if (!host) return;

    const hostRect = host.getBoundingClientRect();

    const computed = window.getComputedStyle(floatEl);

    floatEl.style.position = 'fixed';

    floatEl.style.left = (hostRect.left + (parseFloat(computed.left) || 0)) + 'px';

    floatEl.style.top = (hostRect.top + (parseFloat(computed.top) || 0)) + 'px';

    overlay.appendChild(floatEl);

  });

}



function spawnFloatingText(parentEl, text, isHeal = false) {

  if (!parentEl) return;

  const floatEl = document.createElement('div');

  floatEl.className = isHeal ? 'floating-heal' : 'floating-damage';

  floatEl.textContent = text;

  parentEl.appendChild(floatEl);



  setTimeout(() => {

    if (floatEl.parentNode) floatEl.parentNode.removeChild(floatEl);

  }, 1000);

}



function showBanner(text) {

  const container = document.querySelector('.battlefield-container');

  if (!container) return;

  const banner = document.createElement('div');

  banner.className = 'floating-status-banner';

  banner.textContent = text;

  container.appendChild(banner);



  setTimeout(() => {

    if (banner.parentNode) banner.parentNode.removeChild(banner);

  }, 1200);

}



function showBadge(el, text, className) {

  let badge = el.querySelector('.preview-badge');

  if (!badge) {

    badge = document.createElement('div');

    el.appendChild(badge);

  }

  badge.className = `preview-badge ${className}`;

  badge.textContent = text;

}



function removeBadges() {

  document.querySelectorAll('.preview-badge').forEach(b => b.remove());

}



function render() {

  checkWinCondition();

  const pNectar = Math.max(0, gameState.player.nectar);

  const pMaxNectar = Math.max(1, gameState.player.maxNectar);

  const playerNectarEl = document.getElementById('player-nectar');

  if (playerNectarEl) playerNectarEl.textContent = `${pNectar} / ${pMaxNectar}`;



  const eNectar = Math.max(0, gameState.enemy.nectar);

  const eMaxNectar = Math.max(1, gameState.enemy.maxNectar);

  const enemyNectarEl = document.getElementById('enemy-nectar');

  if (enemyNectarEl) enemyNectarEl.textContent = `${eNectar} / ${eMaxNectar}`;



  const pHp = Math.max(0, gameState.player.hp);

  const playerHpEl = document.getElementById('player-hp');

  if (playerHpEl) playerHpEl.textContent = `${pHp} / 30`;

  const playerHpBarEl = document.getElementById('player-hp-bar');

  if (playerHpBarEl) playerHpBarEl.style.width = `${(pHp / 30) * 100}%`;



  const eHp = Math.max(0, gameState.enemy.hp);

  const enemyHpEl = document.getElementById('enemy-hp');

  if (enemyHpEl) enemyHpEl.textContent = `${eHp} / 30`;

  const enemyHpBarEl = document.getElementById('enemy-hp-bar');

  if (enemyHpBarEl) enemyHpBarEl.style.width = `${(eHp / 30) * 100}%`;



  const nameDisplay = document.getElementById('enemy-name-display');

  if (nameDisplay) {

    if (gameMode === 'STORY_MODE' && typeof getCurrentStoryChapter === 'function') {

      const ch = getCurrentStoryChapter();

      nameDisplay.textContent = `${ch.bossAvatar} ${ch.bossName} (${ch.title})`;

    } else {

      nameDisplay.textContent = gameMode === 'VS_AI' ? 'Colmena Enemiga (Bot)' : 'Colmena de tu Amigo';

    }

  }



  const endTurnBtn = document.getElementById('btn-end-turn');

  const isMyTurn = gameState.turn === 'PLAYER';



  if (endTurnBtn) {

    if (isMyTurn && !gameState.isGameOver && !gameState.isAnimating) {

      endTurnBtn.disabled = false;

      endTurnBtn.textContent = 'FINALIZAR TURNO';

    } else {

      endTurnBtn.disabled = true;

      endTurnBtn.textContent = gameState.isAnimating ? 'EN COMBATE...' : (gameState.turn === 'WAITING' ? 'ESPERANDO SALA...' : 'TURNO AMIGO...');

    }

  }



  // --- RENDER DE TRAMPAS DEL JUGADOR ---

  const playerTrapsEl = document.getElementById('player-traps');

  if (playerTrapsEl) {

    playerTrapsEl.innerHTML = '';

    gameState.player.traps.forEach(trap => {

      const badge = document.createElement('div');

      badge.className = 'trap-badge';

      badge.innerHTML = `🪤<div class="card-tooltip"><div class="card-tooltip-title">🪤 ${trap.name}</div><div>${trap.description || 'Trampa Oculta'}</div></div>`;

      playerTrapsEl.appendChild(badge);

    });

  }



  // --- RENDER DE TRAMPAS ENEMIGAS (OCULTAS) ---

  const enemyTrapsEl = document.getElementById('enemy-traps');

  if (enemyTrapsEl) {

    enemyTrapsEl.innerHTML = '';

    gameState.enemy.traps.forEach(trap => {

      const badge = document.createElement('div');

      badge.className = 'trap-badge';

      badge.innerHTML = `❓<div class="card-tooltip"><div class="card-tooltip-title">🪤 Trampa Enemiga</div><div>Se activará ante una acción detonante.</div></div>`;

      enemyTrapsEl.appendChild(badge);

    });

  }



  // --- RENDER DECK EXTRA TUS COMANDANTES ---

  const playerExtraEl = document.getElementById('player-extra-deck');

  if (playerExtraEl) {

    playerExtraEl.innerHTML = '';

    gameState.player.extraDeck.forEach((card, index) => {

      const isPlayable = isMyTurn && gameState.player.nectar >= card.cost && !gameState.isAnimating && gameState.player.board.length < 6;

      const cardEl = document.createElement('div');

      cardEl.className = `extra-card ${isPlayable ? 'playable' : 'disabled'}`;

      cardEl.style.backgroundImage = `url('${card.image}')`;



      cardEl.innerHTML = `

        <div class="extra-crown-badge">👑</div>

        <div class="card-cost">${card.cost}</div>

        <div class="card-atk">${card.attack}</div>

        <div class="card-hp">${card.hp}</div>

        <div class="card-tooltip">

          <div class="card-tooltip-title">👑 ${card.name}</div>

          <div>Néctar: ${card.cost} | ATK: ${card.attack} | HP: ${card.hp}</div>

          <div style="margin-top:4px; color:#bdc3c7;">${typeof getCardDescription === 'function' ? getCardDescription(card) : (card.description || '')}</div>

        </div>

      `;



      if (isPlayable) {

        cardEl.onclick = () => playExtraCard(index);

      }

      playerExtraEl.appendChild(cardEl);

    });

  }



  // --- RENDER DECK EXTRA COMANDANTES ENEMIGOS ---

  const enemyExtraEl = document.getElementById('enemy-extra-deck');

  if (enemyExtraEl) {

    enemyExtraEl.innerHTML = '';

    gameState.enemy.extraDeck.forEach(card => {

      const cardEl = document.createElement('div');

      cardEl.className = 'extra-card disabled';

      cardEl.style.backgroundImage = `url('${card.image}')`;



      cardEl.innerHTML = `

        <div class="extra-crown-badge">👑</div>

        <div class="card-cost">${card.cost}</div>

        <div class="card-atk">${card.attack}</div>

        <div class="card-hp">${card.hp}</div>

        <div class="card-tooltip">

          <div class="card-tooltip-title">👑 ${card.name}</div>

          <div>Néctar: ${card.cost} | ATK: ${card.attack} | HP: ${card.hp}</div>

        </div>

      `;

      enemyExtraEl.appendChild(cardEl);

    });

  }



  // Render Mano Jugador

  const handContainer = document.getElementById('player-hand');

  if (handContainer) {

    handContainer.innerHTML = '';

    gameState.player.hand.forEach((card, index) => {

      const cardEl = document.createElement('div');

      const isPlayable = isMyTurn && gameState.player.nectar >= card.cost && !gameState.isAnimating;

      cardEl.className = `hand-card ${isPlayable ? 'playable' : 'unaffordable'}`;

      cardEl.style.backgroundImage = `url('${card.image}')`;



      const statusText = !isMyTurn ? `<div style="color:#e74c3c; margin-top:2px;">⏳ Espera tu turno</div>` : (gameState.player.nectar < card.cost ? `<div style="color:#e74c3c; margin-top:2px;">💧 Necesitas ${card.cost} Néctar</div>` : '');



      cardEl.innerHTML = `

        <div class="card-tooltip">

          <div class="card-tooltip-title">${card.name}</div>

          <div>Néctar: ${card.cost} ${card.isSpell ? '| ✨ HECHIZO' : (card.isTrap ? '| 🪤 TRAMPA' : `| ATK: ${card.attack} | HP: ${card.hp}`)}</div>

          <div style="margin-top:4px; color:#bdc3c7;">${typeof getCardDescription === 'function' ? getCardDescription(card) : (card.description || '')}</div>

          ${statusText}

        </div>

        <div class="card-cost">${card.cost}</div>

        ${!card.isSpell && !card.isTrap ? `<div class="card-atk">${card.attack}</div><div class="card-hp">${card.hp}</div>` : ''}

        ${renderKeywordIcon(card.keywords, card.isSpell, card.isTrap)}

      `;



      if (isPlayable) {

        cardEl.onclick = () => playCard(index);

      } else {

        cardEl.onclick = () => {

          if (!isMyTurn) showBanner("⏳ ¡ESPERA TU TURNO!");

          else playCard(index);

        };

      }

      handContainer.appendChild(cardEl);

    });

  }



  // Target Colmena Enemiga

  const enemyHiveEl = document.getElementById('enemy-hive');

  const enemyHasTaunt = gameState.enemy.board.some(c => (c.keywords || []).includes("PROVOCAR"));

  let selectedAttackerObj = null;



  if (gameState.selectedAttacker) {

    selectedAttackerObj = gameState.player.board.find(c => c.instanceId === gameState.selectedAttacker);

  }



  if (enemyHiveEl) {

    if (isMyTurn && selectedAttackerObj && (!enemyHasTaunt || (selectedAttackerObj.keywords || []).includes("VUELO")) && !gameState.isAnimating) {

      enemyHiveEl.classList.add('targetable');

      enemyHiveEl.onclick = () => attackTarget('HIVE');



      enemyHiveEl.onmouseenter = () => {

        showBadge(enemyHiveEl, `¡DIRECTO! -${selectedAttackerObj.attack} HP`, "dead");

      };

      enemyHiveEl.onmouseleave = () => removeBadges();

    } else {

      enemyHiveEl.classList.remove('targetable');

      enemyHiveEl.onclick = null;

      enemyHiveEl.onmouseenter = null;

      enemyHiveEl.onmouseleave = null;

    }

  }



  // Render Tu Campo

  const playerBoardEl = document.getElementById('player-board');

  if (playerBoardEl) {

    playerBoardEl.innerHTML = '<span class="board-label">TU CAMPO</span>';

    gameState.player.board.forEach(card => {

      const cardEl = document.createElement('div');

      cardEl.setAttribute('data-inst', card.instanceId);

      let classes = 'card-item';

      if (card.hasShield) classes += ' has-shield';

      if (card.isNewSummon) {
        if ((card.cost || 0) >= 5) {
          classes += ' anim-boss-summon';
        } else {
          classes += ' anim-summon';
        }
        card.isNewSummon = false;
      }

      if (isMyTurn && card.canAttack && !gameState.isAnimating) classes += ' ready-to-attack';

      if (gameState.selectedAttacker === card.instanceId) classes += ' selected-attacker';



      cardEl.className = classes; // FIX CRÍTICO DE CLASE VISUAL

      cardEl.style.backgroundImage = `url('${card.image}')`;



      const shieldBadge = card.hasShield ? `<div class="card-shield-badge" title="Escudo Divino: Absorbe el primer impacto">🛡️</div>` : '';



      cardEl.innerHTML = `

        ${shieldBadge}

        <div class="card-tooltip">

          <div class="card-tooltip-title">${card.name}</div>

          <div>ATK: ${card.attack} | HP: ${card.hp}/${card.maxHp}</div>

          <div style="margin-top:4px; color:#bdc3c7;">${typeof getCardDescription === 'function' ? getCardDescription(card) : (card.description || '')}</div>

        </div>

        <div class="card-cost">${card.cost}</div>

        <div class="card-atk">${card.attack}</div>

        <div class="card-hp">${card.hp}</div>

        ${renderKeywordIcon(card.keywords)}

      `;



      if (isMyTurn) {

        cardEl.onclick = () => selectAttacker(card.instanceId);

        if (card.canAttack && !gameState.isAnimating) {

          cardEl.draggable = true;

          cardEl.ondragstart = (e) => {

            // El handler se enganchó en el render anterior: desde entonces el turno pudo cambiar

            // o pudo arrancar una animación.

            if (gameState.turn !== 'PLAYER' || gameState.isGameOver || gameState.isAnimating || !card.canAttack) {

              e.preventDefault();

              return;

            }

            e.dataTransfer.setData('text/plain', card.instanceId);

            e.dataTransfer.effectAllowed = 'copyMove';

            // render() reconstruye el tablero con innerHTML: si corre ahora destruye el nodo

            // que se está arrastrando y el navegador aborta el drag. Se difiere al siguiente ciclo.

            gameState.selectedAttacker = card.instanceId;

            removeBadges();

            setTimeout(() => render(), 0);

          };

        }

      }

      playerBoardEl.appendChild(cardEl);

    });

  }



  // Render Campo Enemigo

  const enemyBoardEl = document.getElementById('enemy-board');

  if (enemyBoardEl) {

    enemyBoardEl.innerHTML = '<span class="board-label">CAMPO ENEMIGO</span>';

    gameState.enemy.board.forEach(card => {

      const cardEl = document.createElement('div');

      cardEl.setAttribute('data-inst', card.instanceId);

      let classes = 'card-item';

      if (card.hasShield) classes += ' has-shield';

      if (card.isNewSummon) {
        if ((card.cost || 0) >= 5) {
          classes += ' anim-boss-summon';
        } else {
          classes += ' anim-summon';
        }
        card.isNewSummon = false;
      }



      if (isMyTurn && selectedAttackerObj && !gameState.isAnimating) {

        const isTaunt = (card.keywords || []).includes("PROVOCAR");

        const canTarget = !enemyHasTaunt || isTaunt || (selectedAttackerObj.keywords || []).includes("VUELO");

        if (canTarget) classes += ' valid-target';

      }



      cardEl.className = classes;

      cardEl.style.backgroundImage = `url('${card.image}')`;



      const shieldBadge = card.hasShield ? `<div class="card-shield-badge" title="Escudo Divino: Absorbe el primer impacto">🛡️</div>` : '';



      cardEl.innerHTML = `

        ${shieldBadge}

        <div class="card-tooltip">

          <div class="card-tooltip-title">${card.name}</div>

          <div>ATK: ${card.attack} | HP: ${card.hp}/${card.maxHp}</div>

          <div style="margin-top:4px; color:#bdc3c7;">${typeof getCardDescription === 'function' ? getCardDescription(card) : (card.description || '')}</div>

        </div>

        <div class="card-cost">${card.cost}</div>

        <div class="card-atk">${card.attack}</div>

        <div class="card-hp">${card.hp}</div>

        ${renderKeywordIcon(card.keywords)}

      `;



      if (isMyTurn) {

        cardEl.onmouseenter = () => {

          if (!gameState.selectedAttacker || gameState.isAnimating) return;

          const attacker = gameState.player.board.find(c => c.instanceId === gameState.selectedAttacker);

          if (!attacker) return;



          const isAttPoison = (attacker.keywords || []).includes("VENENO");

          const isDefPoison = (card.keywords || []).includes("VENENO");



          const defNextHp = card.hasShield ? card.hp : (isAttPoison ? 0 : (card.hp - attacker.attack));

          const attNextHp = attacker.hasShield ? attacker.hp : (isDefPoison ? 0 : (attacker.hp - card.attack));



          let defText = card.hasShield ? "🛡️ ESCUDO" : (isAttPoison ? "☠️ VENENO" : (defNextHp <= 0 ? "💀 DESTRUIDO" : `HP: ${card.hp}➔${defNextHp}`));

          let defClass = card.hasShield ? "survive" : (isAttPoison ? "poison" : (defNextHp <= 0 ? "dead" : "survive"));

          showBadge(cardEl, defText, defClass);



          const attackerEl = document.querySelector(`[data-inst="${attacker.instanceId}"]`);

          if (attackerEl) {

            let attText = attacker.hasShield ? "🛡️ ESCUDO" : (isDefPoison ? "☠️ VENENO" : (attNextHp <= 0 ? "💀 MUERES" : `HP: ${attacker.hp}➔${attNextHp}`));

            let attClass = attacker.hasShield ? "survive" : (isDefPoison ? "poison" : (attNextHp <= 0 ? "dead" : "survive"));

            showBadge(attackerEl, attText, attClass);

          }

        };



        cardEl.onmouseleave = () => {

          removeBadges();

        };



        cardEl.onclick = () => {

          attackTarget('CREATURE', card.instanceId);

        };



        cardEl.ondragover = (e) => {

          e.preventDefault();

          e.dataTransfer.dropEffect = 'move';

        };



        cardEl.ondrop = (e) => {

          e.preventDefault();

          const attackerId = e.dataTransfer.getData('text/plain') || gameState.selectedAttacker;

          if (attackerId) {

            gameState.selectedAttacker = attackerId;

            attackTarget('CREATURE', card.instanceId);

          }

        };

      }



      enemyBoardEl.appendChild(cardEl);

    });

  }



  // Habilitar Arrastrar y Soltar (Drag & Drop) sobre la Colmena Enemiga

  if (enemyHiveEl) {

    enemyHiveEl.ondragover = (e) => {

      e.preventDefault();

      e.dataTransfer.dropEffect = 'move';

    };

    enemyHiveEl.ondrop = (e) => {

      e.preventDefault();

      const attackerId = e.dataTransfer.getData('text/plain') || gameState.selectedAttacker;

      if (attackerId) {

        gameState.selectedAttacker = attackerId;

        attackTarget('HIVE', null);

      }

    };

  }

}



function renderKeywordIcon(keywords, isSpell = false, isTrap = false) {

  if (isSpell) return `<div class="card-keyword-icon">✨</div>`;

  if (isTrap) return `<div class="card-keyword-icon">🪤</div>`;

  if (!keywords || keywords.length === 0) return '';

  let icons = '';

  if (keywords.includes("PRISA")) icons += '⚡';

  if (keywords.includes("PROVOCAR")) icons += '🛡️';

  if (keywords.includes("VUELO")) icons += '🦅';

  if (keywords.includes("VENENO")) icons += '☠️';

  if (keywords.includes("ESCUDO") || keywords.includes("SHIELD")) icons += '🛡️✨';

  return `<div class="card-keyword-icon">${icons}</div>`;

}



let isLogAutoScroll = true;

function toggleLogAutoScroll() {
  isLogAutoScroll = !isLogAutoScroll;
  const btn = document.getElementById('btn-log-scroll-toggle');
  if (btn) {
    btn.textContent = isLogAutoScroll ? "🔒 Auto-scroll: ON" : "🔓 Pausado";
  }
  if (typeof showBanner === 'function') {
    showBanner(isLogAutoScroll ? "🔒 Auto-scroll del registro activado." : "🔓 Auto-scroll pausado para lectura.");
  }
}

function addLog(msg, type = "system") {
  const container = document.getElementById('log-container');
  if (!container) return;

  const entry = document.createElement('div');
  
  let typeClass = type;
  if (msg.includes('--- Turno')) typeClass = 'turn-header';
  else if (msg.includes('INSTINTO')) typeClass = 'instinct';
  else if (msg.includes('Hechizo') || msg.includes('✨')) typeClass = 'spell';
  else if (msg.includes('Comandante') || msg.includes('👑')) typeClass = 'commander';
  else if (msg.includes('atacó') || msg.includes('⚔️') || msg.includes('💀')) typeClass = 'combat';

  entry.className = `log-entry ${typeClass}`;

  // Formatear nombres de cartas entre corchetes [Nombre] como enlaces interactivos
  let formattedHtml = msg.replace(/\[([^\]]+)\]/g, function(match, cardName) {
    return `<span class="log-card-link" data-card-name="${cardName}">[${cardName}]</span>`;
  });

  entry.innerHTML = formattedHtml;
  container.appendChild(entry);

  if (isLogAutoScroll) {
    container.scrollTop = container.scrollHeight;
  }
}



function showStoryVictoryModal(chapter, unlockedNames, hasNext) {
  const overlay = document.getElementById('modal-overlay');
  const modalTitle = document.getElementById('modal-title');
  const modalText = document.getElementById('modal-text');
  const modalContent = overlay ? overlay.querySelector('.modal-content') : null;

  if (modalTitle) {
    modalTitle.textContent = `🏆 ¡${chapter.title.toUpperCase()} COMPLETADO!`;
    modalTitle.className = 'modal-title win';
  }

  let rewardHtml = '';
  if (unlockedNames && unlockedNames.length > 0) {
    rewardHtml = `<div style="margin-top:12px; padding:10px; background:rgba(46,204,113,0.15); border:1px solid var(--accent-green); border-radius:8px; font-size:0.95rem; color:#2ecc71;">
      🎁 <strong>¡Nuevas Cartas Desbloqueadas!:</strong><br>${unlockedNames.map(n => `✨ [${n}]`).join('  ')}
    </div>`;
  } else {
    rewardHtml = `<div style="margin-top:8px; color:#bdc3c7; font-size:0.9rem;">¡Has dominado este territorio!</div>`;
  }

  let buttonsHtml = '';
  if (hasNext) {
    const nextChapter = STORY_CHAPTERS[currentStoryChapterIndex + 1];
    buttonsHtml = `
      <div style="display:flex; gap:12px; justify-content:center; margin-top:20px;">
        <button class="btn-lobby-mode" style="padding:10px 20px; font-size:1rem; border-color:var(--accent-green); background:rgba(46,204,113,0.2);" onclick="advanceToNextStoryChapter()">
          ▶️ Continuar: ${nextChapter ? nextChapter.bossAvatar + ' ' + nextChapter.title : 'Siguiente Nivel'}
        </button>
        <button class="btn-lobby-mode" style="padding:10px 20px; font-size:1rem; border-color:var(--accent-gold);" onclick="restartGame()">
          🏠 Salir al Menú
        </button>
      </div>`;
  } else {
    buttonsHtml = `
      <div style="margin-top:15px; color:var(--accent-gold); font-size:1.1rem; font-weight:bold;">
        👑 ¡FELICIDADES! ¡HAS COMPLETADO TODA LA CAMPAÑA DE FERAL WARS!
      </div>
      <div style="display:flex; justify-content:center; margin-top:20px;">
        <button class="btn-lobby-mode" style="padding:10px 25px; font-size:1.05rem; border-color:var(--accent-gold);" onclick="restartGame()">
          🏠 Volver al Inicio
        </button>
      </div>`;
  }

  if (modalText) {
    modalText.innerHTML = `<div>Has derrotado a <strong>${chapter.bossAvatar} ${chapter.bossName}</strong>.</div>${rewardHtml}${buttonsHtml}`;
  }

  // Ocultar botón default de reiniciar si existe
  const defaultRestartBtn = modalContent ? modalContent.querySelector('button:not(.btn-lobby-mode)') : null;
  if (defaultRestartBtn) defaultRestartBtn.style.display = 'none';

  if (overlay) overlay.style.display = 'flex';
}

function showEndModal(title, text, type) {

  const overlay = document.getElementById('modal-overlay');

  const modalTitle = document.getElementById('modal-title');

  const modalText = document.getElementById('modal-text');



  if (modalTitle) {

    modalTitle.textContent = title;

    modalTitle.className = `modal-title ${type}`;

  }

  if (modalText) modalText.textContent = text;

  if (overlay) overlay.style.display = 'flex';

}



function restartGame() {

  window.resetEffectSummonQueue();

  const modalOverlay = document.getElementById('modal-overlay');

  if (modalOverlay) modalOverlay.style.display = 'none';

  const logContainer = document.getElementById('log-container');

  if (logContainer) logContainer.innerHTML = '';

  if (typeof closeP2pConnection === 'function') closeP2pConnection();

  const lobbyOverlay = document.getElementById('lobby-overlay');

  if (lobbyOverlay) lobbyOverlay.style.display = 'flex';

}



window.onload = () => {

  applyStoredPlayerAvatar();

};



// === GESTOR GLOBAL DE TOOLTIPS FLOTANTES PRECISOS EN BODY (SOPORTA CARTAS Y ENLACES DEL LOG) ===
document.addEventListener('mouseover', function (e) {
  const cardLinkEl = e.target.closest('.log-card-link');
  if (cardLinkEl) {
    const cardName = cardLinkEl.getAttribute('data-card-name');
    if (!cardName || typeof CARD_DATABASE === 'undefined') return;

    const card = CARD_DATABASE.find(c => c.name.toLowerCase() === cardName.toLowerCase());
    if (!card) return;

    let globalTooltip = document.getElementById('global-card-tooltip');
    if (!globalTooltip) {
      globalTooltip = document.createElement('div');
      globalTooltip.id = 'global-card-tooltip';
      document.body.appendChild(globalTooltip);
    }

    const imgTag = card.image ? `<img src="${card.image}" class="tooltip-card-img" alt="${card.name}">` : '';
    globalTooltip.innerHTML = `
      ${imgTag}
      <div class="card-tooltip-title">${card.name}</div>
      <div>Energía: ${card.cost} | ATK: ${card.attack || 0} | HP: ${card.hp || 0}</div>
      <div style="margin-top:4px; color:#bdc3c7;">${typeof getCardDescription === 'function' ? getCardDescription(card) : (card.description || '')}</div>
    `;

    const rect = cardLinkEl.getBoundingClientRect();
    const winWidth = window.innerWidth;
    const tooltipWidth = 190;

    globalTooltip.style.display = 'block';
    const tooltipHeight = globalTooltip.offsetHeight || 180;

    let topPos = rect.top - tooltipHeight - 6;
    if (topPos < 15) topPos = rect.bottom + 6;

    let leftPos = rect.left + (rect.width / 2) - (tooltipWidth / 2);
    if (leftPos < 10) leftPos = Math.max(10, rect.left);
    else if (leftPos + tooltipWidth > winWidth - 10) leftPos = Math.min(winWidth - tooltipWidth - 10, rect.right - tooltipWidth);

    globalTooltip.style.top = topPos + 'px';
    globalTooltip.style.left = leftPos + 'px';
    return;
  }

  const cardEl = e.target.closest('.card-item, .hand-card, .extra-card, .db-catalog-card, .db-card-item');
  if (!cardEl) return;

  const innerTooltip = cardEl.querySelector('.card-tooltip');
  if (!innerTooltip) return;

  let globalTooltip = document.getElementById('global-card-tooltip');
  if (!globalTooltip) {
    globalTooltip = document.createElement('div');
    globalTooltip.id = 'global-card-tooltip';
    document.body.appendChild(globalTooltip);
  }

  globalTooltip.innerHTML = innerTooltip.innerHTML;

  const rect = cardEl.getBoundingClientRect();
  const winWidth = window.innerWidth;
  const winHeight = window.innerHeight;
  const tooltipWidth = 190;

  globalTooltip.style.display = 'block';
  const tooltipHeight = globalTooltip.offsetHeight || 130;

  let topPos;
  if (rect.top < tooltipHeight + 15) {
    topPos = rect.bottom + 6;
  } else {
    topPos = rect.top - tooltipHeight - 6;
  }

  let leftPos = rect.left + (rect.width / 2) - (tooltipWidth / 2);
  if (leftPos < 10) {
    leftPos = Math.max(10, rect.left);
  } else if (leftPos + tooltipWidth > winWidth - 10) {
    leftPos = Math.min(winWidth - tooltipWidth - 10, rect.right - tooltipWidth);
  }

  globalTooltip.style.top = topPos + 'px';
  globalTooltip.style.left = leftPos + 'px';
});

document.addEventListener('mouseout', function (e) {
  const cardEl = e.target.closest('.log-card-link, .card-item, .hand-card, .extra-card, .db-catalog-card, .db-card-item');
  if (cardEl) {
    const globalTooltip = document.getElementById('global-card-tooltip');
    if (globalTooltip) {
      globalTooltip.style.display = 'none';
    }
  }
});


// === MODO PRACTICAR VS IA ===
function startSinglePlayer() {
  gameMode = 'VS_AI';
  const overlay = document.getElementById('lobby-overlay');
  if (overlay) overlay.style.display = 'none';
  initGame();
}


// === MANEJADOR P2P PARA REPLICAR INSTINTOS ACTIVADOS EN LA PANTALLA REMOTA ===
async function triggerRemoteInstinctP2p(packet) {
  if (!packet || !packet.cardObj) return;

  const card = packet.cardObj;
  // instinctWho viene con la perspectiva del emisor: su 'player' es nuestro 'enemy'.
  const who = packet.instinctWho === 'player' ? 'enemy' : 'player';
  const defender = gameState[who];

  // Remover la carta de la mano si aún está presente en la vista remota
  if (defender && defender.hand) {
    const idx = defender.hand.findIndex(c => c.instanceId === card.instanceId || c.id === card.id);
    if (idx !== -1) defender.hand.splice(idx, 1);
  }

  showSummonCardPopup(card, who);
  showBanner(`🧠⚡ ¡INSTINTO ACTIVADO: ${card.name.toUpperCase()}!`);
  addLog(`🧠⚡ ¡INSTINTO ACTIVADO! [${card.name}] saltó automáticamente.`, who);

  const context = {
    player: defender,
    opponent: gameState[who === 'player' ? 'enemy' : 'player'],
    isPlayer: who === 'player'
  };

  const remoteContext = packet.contextObj || {};
  let targetObj = null;
  const targetInstId = remoteContext.attackerInstId || remoteContext.summonedInstId;
  if (targetInstId && context.opponent && context.opponent.board) {
    const targetCard = context.opponent.board.find(c => c.instanceId === targetInstId);
    if (targetCard) {
      targetObj = { card: targetCard, element: document.querySelector(`[data-inst="${targetInstId}"]`) };
    }
  }

  if (card.battlecry && typeof executeRegisteredEffect === 'function') {
    const bcList = Array.isArray(card.battlecry) ? card.battlecry : [card.battlecry];
    for (let bc of bcList) {
      executeRegisteredEffect(bc.type, context, targetObj, bc.val);
    }
    await drainEffectSummonQueue(who);
  }

  if (defender) {
    if (!defender.graveyard) defender.graveyard = [];
    defender.graveyard.push(card);
  }

  render();
  await sleep(1400);
  await checkDeathsAsync();
  checkWinCondition();
}


// === GESTOR DE AVATAR DE REINO PERSISTENTE Y P2P ===
let currentPlayerAvatar = localStorage.getItem('feral_wars_avatar') || '🐝';

function getSelectedPlayerAvatar() {
  return currentPlayerAvatar;
}

// Sin nada guardado se respeta el avatar que trae el HTML.
function applyStoredPlayerAvatar() {
  if (!localStorage.getItem('feral_wars_avatar')) return;
  const pHive = document.getElementById('player-hive');
  if (pHive) pHive.textContent = currentPlayerAvatar;
}

function openAvatarSelectModal() {
  const modal = document.getElementById('avatar-select-modal');
  if (modal) modal.style.display = 'flex';
}

function closeAvatarSelectModal() {
  const modal = document.getElementById('avatar-select-modal');
  if (modal) modal.style.display = 'none';
}

function selectPlayerAvatar(avatarEmoji) {
  currentPlayerAvatar = avatarEmoji;
  localStorage.setItem('feral_wars_avatar', avatarEmoji);

  const pHive = document.getElementById('player-hive');
  if (pHive) pHive.textContent = avatarEmoji;

  showBanner(`👤 ¡AVATAR SELECCIONADO: ${avatarEmoji}!`);
  closeAvatarSelectModal();
}



// === MANEJADORES ACCIÓN PLAY_CARD Y PLAY_EXTRA_CARD ===
async function handlePlayCardAction(payload) {
  const { who, handIndex, cardObj, isLocal } = payload;
  const p = gameState[who];
  const opp = gameState[who === 'player' ? 'enemy' : 'player'];

  // handIndex se calculó al hacer click; un Instinto que saltó de la mano pudo correrlo desde entonces.
  let handPos = -1;
  if (p.hand && cardObj) {
    handPos = p.hand.indexOf(cardObj);
  } else if (p.hand && handIndex !== undefined && handIndex >= 0) {
    handPos = handIndex;
  }

  const card = (handPos !== -1 ? p.hand[handPos] : null) || cardObj;
  if (!card) return;

  if (!card.isSpell && !card.isTrap && p.board.length >= 6) {
    addLog(`El tablero de ${who === 'player' ? "Jugador" : "Oponente"} está lleno (Máx. 6 criaturas).`, "system");
    return;
  }

  if (p.hand && handPos !== -1) {
    p.hand.splice(handPos, 1);
  }

  p.nectar -= card.cost;

  if (card.isSpell) {
    showSpellCardPopup(card, who); render(); await sleep(1000);
    addLog(`✨ ${who === 'player' ? "Jugador" : "Oponente"} lanzó el Hechizo [${card.name}].`, who);
    if (card.battlecry) await executeBattlecryAsync(who, card.battlecry);
  } else {
    const hasShield = (card.keywords || []).includes("ESCUDO") || (card.keywords || []).includes("SHIELD");
    const boardCard = {
      instanceId: card.instanceId || ('card_' + Math.random().toString(36).substr(2, 9)),
      id: card.id,
      name: card.name,
      cost: card.cost,
      attack: card.attack,
      hp: card.hp,
      maxHp: card.hp,
      image: card.image,
      keywords: card.keywords || [],
      description: card.description || '',
      battlecry: card.battlecry || null,
      hasShield: hasShield,
      canAttack: (card.keywords || []).includes("PRISA"),
      isNewSummon: true
    };

    p.board.push(boardCard);
    const isBossSummon = (card.cost || 0) >= 5;
    setTimeout(() => {
      if (isBossSummon) triggerBoardSlamShakeHeavy();
      else triggerBoardSlamShake(who);
    }, 300);
    render(); await sleep(isBossSummon ? 900 : 750);
    addLog(`⚔️ ${who === 'player' ? "Jugador" : "Oponente"} invocó a [${card.name}] al campo.`, who);

    if (card.battlecry) await executeBattlecryAsync(who, card.battlecry);

    const defenderWho = who === 'player' ? 'enemy' : 'player';
    await checkHandInstinctTriggers(defenderWho, 'SUMMON', { summonedInstId: boardCard.instanceId });

    setTimeout(() => { boardCard.isNewSummon = false; }, 600);
  }

  if (isLocal && typeof sendP2pPacket === 'function' && (gameMode === 'ONLINE_HOST' || gameMode === 'ONLINE_GUEST')) {
    sendP2pPacket({ type: 'PLAY_CARD', card: card, handIndex: handIndex });
  }

  render();
}

async function handlePlayExtraCardAction(payload) {
  const { who, extraIndex, cardObj, isLocal } = payload;
  const p = gameState[who];

  const card = (p.extraDeck && p.extraDeck[extraIndex]) || cardObj;
  if (!card) return;

  if (p.board.length >= 6) {
    addLog(`El tablero de ${who === 'player' ? "Jugador" : "Oponente"} está lleno (Máx. 6 criaturas).`, "system");
    return;
  }

  if (p.extraDeck && extraIndex !== undefined && extraIndex >= 0) {
    p.extraDeck.splice(extraIndex, 1);
  }

  p.nectar -= card.cost;

  const hasShield = (card.keywords || []).includes("ESCUDO") || (card.keywords || []).includes("SHIELD");
  const boardCard = {
    instanceId: card.instanceId || ('extra_' + Math.random().toString(36).substr(2, 9)),
    id: card.id,
    name: card.name,
    cost: card.cost,
    attack: card.attack,
    hp: card.hp,
    maxHp: card.hp,
    image: card.image,
    keywords: card.keywords || [],
    description: card.description || '',
    battlecry: card.battlecry || null,
    hasShield: hasShield,
    canAttack: (card.keywords || []).includes("PRISA"),
    isNewSummon: true
  };

  p.board.push(boardCard);
  showSummonCardPopup(card, who); render(); await sleep(900);
  addLog(`👑 ¡${who === 'player' ? "Jugador" : "Oponente"} invocó al Comandante Leyenda [${card.name}]!`, who);

  if (card.battlecry) await executeBattlecryAsync(who, card.battlecry);

  const defenderWho = who === 'player' ? 'enemy' : 'player';
  await checkHandInstinctTriggers(defenderWho, 'SUMMON', { summonedInstId: boardCard.instanceId });

  if (isLocal && typeof sendP2pPacket === 'function' && (gameMode === 'ONLINE_HOST' || gameMode === 'ONLINE_GUEST')) {
    sendP2pPacket({ type: 'PLAY_EXTRA_CARD', card: card, extraIndex: extraIndex });
  }

  render();
}


// === POPUPS DE PRESENTACIÓN VISUAL CON DELAYS CÓMODOS (~900ms) ===
function showSummonCardPopup(card, who = 'player') {
  if (!card) return;
  const overlay = document.createElement('div');
  overlay.className = 'summon-card-popup-overlay';
  const cardContainer = document.createElement('div');
  cardContainer.className = 'summon-card-popup-content';
  cardContainer.style.backgroundImage = `url('${card.image || ''}')`;
  const isPlayer = who === 'player';
  const badgeText = isPlayer ? `🌱 ¡INVOCANDO ${card.name ? card.name.toUpperCase() : 'CRIATURA'}!` : `🌱 OPONENTE INVOCÓ ${card.name ? card.name.toUpperCase() : 'CRIATURA'}`;
  cardContainer.innerHTML = `<div class="summon-popup-badge">${badgeText}</div>`;
  overlay.appendChild(cardContainer);
  document.body.appendChild(overlay);
  setTimeout(() => { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 800);
}

function showSpellCardPopup(card, who = 'player') {
  if (!card) return;
  const overlay = document.createElement('div');
  overlay.className = 'spell-card-popup-overlay';
  const cardContainer = document.createElement('div');
  cardContainer.className = 'spell-card-popup-content';
  cardContainer.style.backgroundImage = `url('${card.image || ''}')`;
  const isPlayer = who === 'player';
  const badgeText = isPlayer ? `✨ ¡LANZANDO ${card.name ? card.name.toUpperCase() : 'HECHIZO'}!` : `✨ OPONENTE LANZÓ ${card.name ? card.name.toUpperCase() : 'HECHIZO'}`;
  cardContainer.innerHTML = `<div class="spell-popup-badge">${badgeText}</div>`;
  overlay.appendChild(cardContainer);
  document.body.appendChild(overlay);
  setTimeout(() => { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 1100);
}

function showInstinctCardPopup(card, who = 'player') {
  if (!card) return;
  const overlay = document.createElement('div');
  overlay.className = 'instinct-card-popup-overlay';
  const cardContainer = document.createElement('div');
  cardContainer.className = 'instinct-card-popup-content';
  cardContainer.style.backgroundImage = `url('${card.image || ''}')`;
  const isPlayer = who === 'player';
  const badgeText = isPlayer ? `🧠⚡ ¡INSTINTO ACTIVADO: ${card.name ? card.name.toUpperCase() : 'REACCIÓN'}!` : `🧠⚡ ¡INSTINTO ENEMIGO: ${card.name ? card.name.toUpperCase() : 'REACCIÓN'}!`;
  cardContainer.innerHTML = `<div class="instinct-popup-badge">${badgeText}</div>`;
  overlay.appendChild(cardContainer);
  document.body.appendChild(overlay);
  setTimeout(() => { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 1200);
}
