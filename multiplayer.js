
function copyRoomCodeToClipboard() {
  const codeEl = document.getElementById('my-room-code');
  const code = codeEl ? codeEl.textContent.trim() : myRoomCode;
  if (code && code !== 'Generando...') {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(() => {
        showBanner("📋 ¡CÓDIGO DE SALA COPIADO AL PORTAPAPELES!");
      }).catch(() => {
        fallbackCopyText(code);
      });
    } else {
      fallbackCopyText(code);
    }
  }
}

function fallbackCopyText(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showBanner("📋 ¡CÓDIGO DE SALA COPIADO AL PORTAPAPELES!");
  } catch (err) {}
  document.body.removeChild(textArea);
}

// Gestor Multijugador P2P con Cola de Acciones y Soporte para Deck Extra / Comandantes

let peer = null;
let p2pConnection = null;
let myRoomCode = '';
let p2pMatchStarted = false;
let p2pHostStartTimer = null;

if (typeof window.gameMode === 'undefined') {
  window.gameMode = 'VS_AI'; // 'VS_AI' | 'ONLINE_HOST' | 'ONLINE_GUEST'
}

// Una partida (online o no) está en curso cuando el lobby ya no está a la vista
function isDuelInProgress() {
  const lobby = document.getElementById('lobby-overlay');
  if (!lobby || lobby.style.display !== 'none') return false;
  return !(typeof gameState === 'undefined' || !gameState || gameState.isGameOver);
}

function isOnlineMatchInProgress() {
  if (window.gameMode !== 'ONLINE_HOST' && window.gameMode !== 'ONLINE_GUEST') return false;
  if (!p2pMatchStarted) return false;
  return !(typeof gameState === 'undefined' || !gameState || gameState.isGameOver);
}

function abortP2pMatch(reason) {
  if (typeof addLog === 'function') addLog(reason, "system");
  if (typeof showBanner === 'function') showBanner(reason);

  p2pMatchStarted = false;
  window.gameMode = 'VS_AI';
  if (typeof gameState !== 'undefined' && gameState) gameState.isGameOver = true;

  if (p2pConnection) {
    try { p2pConnection.close(); } catch (e) {}
    p2pConnection = null;
  }

  const lobby = document.getElementById('lobby-overlay');
  if (lobby) lobby.style.display = 'flex';
}

// Corta el enlace y suelta el código de sala; la llama restartGame() al salir del duelo al lobby (el cierre se difiere para que salga el último paquete)
function closeP2pConnection() {
  p2pMatchStarted = false;
  if (p2pHostStartTimer) {
    clearTimeout(p2pHostStartTimer);
    p2pHostStartTimer = null;
  }

  const conn = p2pConnection;
  const oldPeer = peer;
  p2pConnection = null;
  peer = null;
  myRoomCode = '';
  remoteGuestCustomMain = null;
  remoteGuestCustomExtra = null;

  if (window.gameMode === 'ONLINE_HOST' || window.gameMode === 'ONLINE_GUEST') {
    window.gameMode = 'VS_AI';
  }

  setTimeout(() => {
    if (conn) {
      try { conn.close(); } catch (e) {}
    }
    if (oldPeer) {
      try { oldPeer.destroy(); } catch (e) {}
    }
  }, 300);
}

function beginP2pMatchAsHost() {
  if (p2pMatchStarted) return;

  if (p2pHostStartTimer) {
    clearTimeout(p2pHostStartTimer);
    p2pHostStartTimer = null;
  }

  p2pMatchStarted = true;
  try {
    startP2pMatchAsHost();
  } catch (e) {
    console.error("No se pudo iniciar la partida online como Anfitrión:", e);
    abortP2pMatch("❌ No se pudo iniciar la partida online. Volvé al menú e intentá de nuevo.");
  }
}

// El Invitado no publica sala: deja que el broker le asigne un id en vez de ocupar un código adivinable
function initPeerNetwork(asGuest) {
  if (peer) return true;

  if (typeof Peer === 'undefined') {
    addLog("❌ La red P2P todavía no terminó de cargar. Esperá unos segundos y volvé a intentarlo.", "system");
    if (typeof showBanner === 'function') showBanner("❌ LA RED P2P TODAVÍA NO CARGÓ");
    return false;
  }

  const randomCode = Math.floor(1000 + Math.random() * 9000);
  const requestedCode = `INSECTO-${randomCode}`;
  myRoomCode = '';

  try {
    peer = asGuest ? new Peer({ debug: 1 }) : new Peer(requestedCode, { debug: 1 });

    peer.on('open', (id) => {
      myRoomCode = id;
      const codeDisplay = document.getElementById('my-room-code');
      if (codeDisplay) codeDisplay.textContent = id;
    });

    peer.on('connection', (conn) => {
      if (p2pConnection || isDuelInProgress()) {
        addLog("🚫 Se rechazó una conexión entrante: la sala ya está ocupada.", "system");
        const rejectConn = () => {
          try {
            conn.send({ type: 'ROOM_BUSY' });
          } catch (e) {}
          setTimeout(() => {
            try { conn.close(); } catch (e) {}
          }, 300);
        };
        if (conn.open) rejectConn(); else conn.on('open', rejectConn);
        return;
      }

      p2pConnection = conn;
      window.gameMode = 'ONLINE_HOST';
      setupConnectionListeners();

      addLog("🤝 ¡Amigo conectado a la sala! Iniciando partida...", "system");
      showBanner("🤝 ¡AMIGO CONECTADO!");

      // El arranque real lo dispara el GUEST_JOIN; esto es solo la red de seguridad
      if (p2pHostStartTimer) clearTimeout(p2pHostStartTimer);
      p2pHostStartTimer = setTimeout(() => {
        p2pHostStartTimer = null;
        if (!p2pConnection || !p2pConnection.open) {
          abortP2pMatch("🔌 Tu amigo se desconectó antes de que empezara el duelo. Volvé a crear la sala.");
          return;
        }
        beginP2pMatchAsHost();
      }, 5000);
    });

    peer.on('error', (err) => {
      console.error('Error de PeerJS:', err);
      addLog("❌ Error de red P2P: " + err.type, "system");
    });
  } catch (e) {
    console.error("No se pudo iniciar PeerJS:", e);
    peer = null;
    addLog("❌ No se pudo iniciar la red P2P. Recargá la página e intentá de nuevo.", "system");
    return false;
  }

  return true;
}

function createP2pRoom() {
  if (peer) {
    try {
      peer.destroy();
    } catch (e) {}
    peer = null;
  }
  p2pConnection = null;
  remoteGuestCustomMain = null;
  remoteGuestCustomExtra = null;
  myRoomCode = '';
  p2pMatchStarted = false;
  if (p2pHostStartTimer) {
    clearTimeout(p2pHostStartTimer);
    p2pHostStartTimer = null;
  }

  if (!initPeerNetwork(false)) return;
  document.getElementById('lobby-status').innerHTML = `
    <div style="color: var(--accent-gold); font-size: 16px; margin-bottom: 10px;">Código de Sala Creado (Haz clic para copiar):</div>
    <div id="room-code-badge" onclick="copyRoomCodeToClipboard()" style="font-size: 26px; font-weight: 900; background: rgba(0,0,0,0.6); padding: 12px; border-radius: 8px; border: 2px dashed var(--accent-gold); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;" title="Haz clic para copiar el código">
      <span id="my-room-code">${myRoomCode || 'Generando...'}</span>
      <span style="font-size: 20px;">📋</span>
    </div>
    <div style="margin-top: 10px; color: var(--accent-green); font-size: 13px; font-weight: bold;">(Haz clic sobre el código para copiarlo al portapapeles)</div>
  `;
}

function joinP2pRoom() {
  const inputCode = document.getElementById('join-code-input').value.trim().toUpperCase();

  if (!inputCode) {
    alert("Por favor ingresa el código de sala que te dio tu amigo.");
    return;
  }

  if (!initPeerNetwork(true)) return;

  p2pMatchStarted = false;
  addLog(`Conectando a la sala ${inputCode}...`, "system");

  try {
    p2pConnection = peer.connect(inputCode);
  } catch (e) {
    console.error("No se pudo abrir la conexión con la sala:", e);
    p2pConnection = null;
  }

  if (!p2pConnection) {
    addLog("❌ No se pudo conectar a la sala. Revisá el código e intentá de nuevo.", "system");
    if (typeof showBanner === 'function') showBanner("❌ NO SE PUDO CONECTAR A LA SALA");
    return;
  }

  window.gameMode = 'ONLINE_GUEST';

  setupConnectionListeners();
}

function setupConnectionListeners() {
  if (!p2pConnection) return;
  const conn = p2pConnection;

  p2pConnection.on('open', () => {
    addLog("🌐 Conexión P2P establecida exitosamente.", "system");
    document.getElementById('lobby-overlay').style.display = 'none';
    showBanner("🌐 ¡CONECTADO EN VIVO!");

    // Si somos el Invitado, enviar nuestro mazo personalizado al Anfitrión
    if (window.gameMode === 'ONLINE_GUEST') {
      const guestCustomMain = typeof getActiveDeckCards === 'function' ? getActiveDeckCards() : [];
      const guestCustomExtra = typeof getActiveExtraDeckCards === 'function' ? getActiveExtraDeckCards() : [];
      sendP2pPacket({ type: 'GUEST_JOIN', guestMain: guestCustomMain, guestExtra: guestCustomExtra });
    }
  });

  p2pConnection.on('data', (data) => {
    handleP2pPacket(data);
  });

  p2pConnection.on('close', () => {
    const isCurrent = p2pConnection === conn;

    if (isCurrent && p2pHostStartTimer) {
      clearTimeout(p2pHostStartTimer);
      p2pHostStartTimer = null;
    }

    if (isCurrent && isOnlineMatchInProgress()) {
      addLog("⚠️ Tu amigo se ha desconectado de la sala.", "system");
      alert("Tu amigo se ha desconectado de la sala.");
      location.reload();
      return;
    }

    // El lobby ya está oculto desde que la conexión abrió: si se corta antes del reparto hay que reponerlo
    const wasOnline = window.gameMode === 'ONLINE_HOST' || window.gameMode === 'ONLINE_GUEST';
    const beforeMatch = isCurrent && wasOnline && !p2pMatchStarted;

    if (isCurrent) {
      p2pConnection = null;
      p2pMatchStarted = false;
    }

    if (beforeMatch) {
      abortP2pMatch("🔌 Se cortó la conexión antes de empezar el duelo. Volvé a crear una sala o a unirte a otra.");
      return;
    }

    addLog("🔌 Conexión P2P cerrada.", "system");
  });
}

function sendP2pPacket(packet) {
  if (p2pConnection && p2pConnection.open) {
    if (window.gameMode === 'ONLINE_HOST') {
      // El Anfitrión solo transmite SU propia salud y SU propio néctar como Autoridad
      packet.hostHp = gameState.player.hp;
      packet.hostNectar = gameState.player.nectar;
      packet.hostMaxNectar = gameState.player.maxNectar;
      packet.hostBoard = gameState.player.board;
      packet.hostHand = gameState.player.hand;
      packet.hostExtraDeck = gameState.player.extraDeck;
    } else {
      // El Invitado solo transmite SU propia salud y SU propio néctar como Autoridad
      packet.guestHp = gameState.player.hp;
      packet.guestNectar = gameState.player.nectar;
      packet.guestMaxNectar = gameState.player.maxNectar;
      packet.guestBoard = gameState.player.board;
      packet.guestHand = gameState.player.hand;
      packet.guestExtraDeck = gameState.player.extraDeck;
    }

    p2pConnection.send(packet);
  }
}

let remoteGuestCustomMain = null;
let remoteGuestCustomExtra = null;

function startP2pMatchAsHost() {
  if (typeof window.startNewGameGeneration === 'function') window.startNewGameGeneration();
  if (typeof window.resetEffectSummonQueue === 'function') window.resetEffectSummonQueue();

  let instCounter = 1;

  const defaultMainDeck = CARD_DATABASE.filter(c => !c.isExtra && !c.hidden);
  const customHostDeck = typeof getActiveDeckCards === 'function' ? getActiveDeckCards() : defaultMainDeck;
  const customHostExtra = typeof getActiveExtraDeckCards === 'function' ? getActiveExtraDeckCards() : CARD_DATABASE.filter(c => c.isExtra && !c.hidden);

  const rawHostDeck = shuffleDeck([...customHostDeck]);
  const rawGuestDeck = shuffleDeck([...(remoteGuestCustomMain && remoteGuestCustomMain.length >= 15 ? remoteGuestCustomMain : defaultMainDeck)]);

  // shuffleDeck le pone un instanceId genérico a cada carta; acá se reemplaza por uno con el prefijo del lado que la juega
  const hostDeck = rawHostDeck.map(c => ({ ...c, instanceId: 'h_inst_' + (instCounter++) }));
  const guestDeck = rawGuestDeck.map(c => ({ ...c, instanceId: 'g_inst_' + (instCounter++) }));

  const hostExtra = customHostExtra.map(c => ({ instanceId: 'h_extra_' + (instCounter++), ...c }));
  const customGuestExtraList = remoteGuestCustomExtra && remoteGuestCustomExtra.length >= 1 ? remoteGuestCustomExtra : CARD_DATABASE.filter(c => c.isExtra && !c.hidden);
  const guestExtra = customGuestExtraList.map(c => ({ instanceId: 'g_extra_' + (instCounter++), ...c }));

  const hostHand = [];
  const guestHand = [];

  const hLowIdx = hostDeck.findIndex(c => c.cost === 1);
  if (hLowIdx !== -1) hostHand.push(hostDeck.splice(hLowIdx, 1)[0]);
  while (hostHand.length < 4 && hostDeck.length > 0) hostHand.push(hostDeck.pop());

  const gLowIdx = guestDeck.findIndex(c => c.cost === 1);
  if (gLowIdx !== -1) guestHand.push(guestDeck.splice(gLowIdx, 1)[0]);
  while (guestHand.length < 4 && guestDeck.length > 0) guestHand.push(guestDeck.pop());

  gameState.isGameOver = false;
  gameState.isAnimating = false;
  gameState.turn = 'PLAYER';
  gameState.turnNumber = 1;
  gameState.selectedAttacker = null;

  gameState.player.hp = 30;
  gameState.player.maxHp = 30;
  gameState.player.nectar = 1;
  gameState.player.maxNectar = 1;
  gameState.player.hand = hostHand;
  gameState.player.board = [];
  gameState.player.deck = hostDeck;
  gameState.player.extraDeck = hostExtra;

  gameState.enemy.hp = 30;
  gameState.enemy.maxHp = 30;
  gameState.enemy.nectar = 1;
  gameState.enemy.maxNectar = 1;
  gameState.enemy.hand = guestHand;
  gameState.enemy.board = [];
  gameState.enemy.deck = guestDeck;
  gameState.enemy.extraDeck = guestExtra;

  sendP2pPacket({
    type: 'INIT_MATCH',
    guestHand: guestHand,
    guestDeck: guestDeck,
    guestExtra: guestExtra,
    hostHand: hostHand,
    hostDeck: hostDeck,
    hostExtra: hostExtra
  });

  document.getElementById('lobby-overlay').style.display = 'none';
  addLog("¡Partida Iniciada! Eres el Jugador 1: TU TURNO.", "system");
  showBanner("👑 ¡TU TURNO (JUGADOR 1)!");
  render();
}

function startP2pMatchAsGuest(packet) {
  if (typeof window.startNewGameGeneration === 'function') window.startNewGameGeneration();
  if (typeof window.resetEffectSummonQueue === 'function') window.resetEffectSummonQueue();

  gameState.isGameOver = false;
  gameState.isAnimating = false;
  gameState.turn = 'ENEMY';
  gameState.turnNumber = 1;
  gameState.selectedAttacker = null;

  const customGuestExtra = typeof getActiveExtraDeckCards === 'function' ? getActiveExtraDeckCards() : CARD_DATABASE.filter(c => c.isExtra && !c.hidden);
  const guestExtra = customGuestExtra.map((c, i) => ({ instanceId: 'g_extra_' + i, ...c }));

  gameState.player.hp = 30;
  gameState.player.maxHp = 30;
  gameState.player.nectar = 1;
  gameState.player.maxNectar = 1;
  gameState.player.hand = packet.guestHand;
  gameState.player.board = [];
  gameState.player.deck = packet.guestDeck;
  gameState.player.extraDeck = guestExtra;

  gameState.enemy.hp = 30;
  gameState.enemy.maxHp = 30;
  gameState.enemy.nectar = 1;
  gameState.enemy.maxNectar = 1;
  gameState.enemy.hand = packet.hostHand;
  gameState.enemy.board = [];
  gameState.enemy.deck = packet.hostDeck;
  gameState.enemy.extraDeck = packet.hostExtra || [];

  document.getElementById('lobby-overlay').style.display = 'none';
  addLog("¡Partida Iniciada! Tu amigo va primero. Esperando su turno...", "system");
  showBanner("⏳ TURNO DE TU AMIGO...");
  render();
}

async function handleP2pPacket(packet) {
  console.log("Paquete P2P recibido:", packet);

  if (!packet) return;
  packet.isLocal = false;

  // Paquetes de handshake: GUEST_JOIN e INIT_MATCH cargan el estado anterior al reparto y ROOM_BUSY no carga ninguno
  if (packet.type !== 'GUEST_JOIN' && packet.type !== 'INIT_MATCH' && packet.type !== 'ROOM_BUSY') {
    enqueueAction('SYNC_STATE', packet);
  }

  if (packet.type === 'GUEST_JOIN') {
    if (packet.guestMain) remoteGuestCustomMain = packet.guestMain;
    if (packet.guestExtra) remoteGuestCustomExtra = packet.guestExtra;
    if (window.gameMode === 'ONLINE_HOST') beginP2pMatchAsHost();
  } else if (packet.type === 'ROOM_BUSY') {
    abortP2pMatch("🚫 Esa sala ya está ocupada: tu amigo ya tiene un rival o una partida en curso.");
  } else if (packet.type === 'INIT_MATCH') {
    if (p2pMatchStarted) return;
    p2pMatchStarted = true;
    try {
      startP2pMatchAsGuest(packet);
    } catch (e) {
      console.error("No se pudo iniciar la partida online como Invitado:", e);
      abortP2pMatch("❌ No se pudo iniciar la partida online. Volvé al menú e intentá de nuevo.");
    }
  } else if (packet.type === 'PLAY_CARD') {
    enqueueAction('PLAY_CARD', { who: 'enemy', cardObj: packet.card, battlecryTargetInstId: packet.battlecryTargetInstId, isLocal: false });
  } else if (packet.type === 'PLAY_EXTRA_CARD') {
    enqueueAction('PLAY_EXTRA_CARD', { who: 'enemy', cardObj: packet.card, battlecryTargetInstId: packet.battlecryTargetInstId, isLocal: false });
  } else if (packet.type === 'ATTACK') {
    enqueueAction('ATTACK', { who: 'enemy', targetType: packet.targetType, attackerInstId: packet.attackerInstId, targetInstId: packet.targetInstId, isLocal: false });
  } else if (packet.type === 'END_TURN') {
    showBanner("✨ ¡ES TU TURNO!");
    enqueueAction('END_TURN', { who: 'enemy', isLocal: false });
  } else if (packet.type === 'INSTINCT_TRIGGER') {
    if (typeof triggerRemoteInstinctP2p === 'function') {
      triggerRemoteInstinctP2p(packet);
    }
  } else if (packet.type === 'SURRENDER') {
    if (!isOnlineMatchInProgress()) return;
    gameState.isGameOver = true;
    showBanner("🏆 ¡TU RIVAL ABANDONÓ EL DUELO!");
    addLog("🏆 ¡Tu oponente se ha rendido! Has ganado el Duelo.", "player");
    if (typeof showEndModal === 'function') {
      showEndModal("¡VICTORIA POR RENDICIÓN!", "Tu oponente ha abandonado el Duelo.", "win");
    }
  } else if (packet.type === 'EMOTE') {
    showBanner(`${packet.sender}: ${packet.msg}`);
  }
}

function sendEmote(msg) {
  showBanner(`💬 Tú: ${msg}`);
  sendP2pPacket({ type: 'EMOTE', sender: 'Tu Amigo', msg });
}
