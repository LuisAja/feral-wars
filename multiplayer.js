
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

if (typeof window.gameMode === 'undefined') {
  window.gameMode = 'VS_AI'; // 'VS_AI' | 'ONLINE_HOST' | 'ONLINE_GUEST'
}

function initPeerNetwork() {
  if (peer) return;

  const randomCode = Math.floor(1000 + Math.random() * 9000);
  myRoomCode = `INSECTO-${randomCode}`;

  try {
    peer = new Peer(myRoomCode, { debug: 1 });

    peer.on('open', (id) => {
      myRoomCode = id;
      const codeDisplay = document.getElementById('my-room-code');
      if (codeDisplay) codeDisplay.textContent = id;
    });

    peer.on('connection', (conn) => {
      p2pConnection = conn;
      window.gameMode = 'ONLINE_HOST';
      setupConnectionListeners();

      addLog("🤝 ¡Amigo conectado a la sala! Iniciando partida...", "system");
      showBanner("🤝 ¡AMIGO CONECTADO!");

      setTimeout(() => {
        startP2pMatchAsHost();
      }, 600);
    });

    peer.on('error', (err) => {
      console.error('Error de PeerJS:', err);
      addLog("❌ Error de red P2P: " + err.type, "system");
    });
  } catch (e) {
    console.error("No se pudo cargar PeerJS:", e);
  }
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

  initPeerNetwork();
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
  initPeerNetwork();
  const inputCode = document.getElementById('join-code-input').value.trim().toUpperCase();

  if (!inputCode) {
    alert("Por favor ingresa el código de sala que te dio tu amigo.");
    return;
  }

  addLog(`Conectando a la sala ${inputCode}...`, "system");
  p2pConnection = peer.connect(inputCode);
  window.gameMode = 'ONLINE_GUEST';

  setupConnectionListeners();
}

function setupConnectionListeners() {
  if (!p2pConnection) return;

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
    addLog("⚠️ Tu amigo se ha desconectado de la sala.", "system");
    alert("Tu amigo se ha desconectado de la sala.");
    location.reload();
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
  let instCounter = 1;

  const customHostDeck = typeof getActiveDeckCards === 'function' ? getActiveDeckCards() : CARD_DATABASE;
  const customHostExtra = typeof getActiveExtraDeckCards === 'function' ? getActiveExtraDeckCards() : CARD_DATABASE.filter(c => c.isExtra && !c.hidden);

  const rawHostDeck = shuffle([...customHostDeck]);
  const rawGuestDeck = shuffle([...(remoteGuestCustomMain && remoteGuestCustomMain.length >= 15 ? remoteGuestCustomMain : CARD_DATABASE)]);

  const hostDeck = rawHostDeck.map(c => ({ instanceId: 'h_inst_' + (instCounter++), ...c }));
  const guestDeck = rawGuestDeck.map(c => ({ instanceId: 'g_inst_' + (instCounter++), ...c }));

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

  enqueueAction('SYNC_STATE', packet);

  if (packet.type === 'GUEST_JOIN') {
    if (packet.guestMain) remoteGuestCustomMain = packet.guestMain;
    if (packet.guestExtra) remoteGuestCustomExtra = packet.guestExtra;
  } else if (packet.type === 'INIT_MATCH') {
    startP2pMatchAsGuest(packet);
  } else if (packet.type === 'PLAY_CARD') {
    enqueueAction('PLAY_CARD', { who: 'enemy', cardObj: packet.card, battlecryTargetInstId: packet.battlecryTargetInstId });
  } else if (packet.type === 'PLAY_EXTRA_CARD') {
    enqueueAction('PLAY_EXTRA_CARD', { who: 'enemy', cardObj: packet.card, battlecryTargetInstId: packet.battlecryTargetInstId });
  } else if (packet.type === 'ATTACK') {
    enqueueAction('ATTACK', { who: 'enemy', targetType: packet.targetType, attackerInstId: packet.attackerInstId, targetInstId: packet.targetInstId });
  } else if (packet.type === 'END_TURN') {
    addLog("--- Tu amigo finalizó su turno ---", "system");
    showBanner("✨ ¡ES TU TURNO!");
    startTurn('player');
  } else if (packet.type === 'INSTINCT_TRIGGER') {
    if (typeof triggerRemoteInstinctP2p === 'function') {
      triggerRemoteInstinctP2p(packet);
    }
  } else if (packet.type === 'SURRENDER') {
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
