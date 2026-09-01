// Automated QA Test Suite for Feral Wars TCG

async function runAllTests() {
  const results = [];
  let passedCount = 0;
  let failedCount = 0;

  function assert(testName, condition, details = "") {
    if (condition) {
      results.push({ name: testName, status: "PASS", details });
      passedCount++;
    } else {
      results.push({ name: testName, status: "FAIL", details });
      failedCount++;
    }
  }

  // Las pausas de animación se anulan durante las pruebas: la suite valida reglas, no tiempos.
  const realSleep = sleep;
  globalThis.sleep = () => Promise.resolve();

  // Espera a que la cola de acciones del juego termine de procesar lo encolado.
  // Si la cola sigue ocupada al vencer el plazo, corta la suite: seguir mediría un estado a medio aplicar.
  const DRAIN_TIMEOUT_MS = 5000;
  async function drainActionQueue() {
    const deadline = Date.now() + DRAIN_TIMEOUT_MS;
    while (actionQueue.length > 0 || isProcessingQueue) {
      if (Date.now() > deadline) {
        throw new Error(`La cola de acciones no terminó en ${DRAIN_TIMEOUT_MS} ms (pendientes: ${actionQueue.length}, procesando: ${isProcessingQueue}).`);
      }
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  function resetBoardState() {
    gameState.turn = 'PLAYER';
    gameState.isGameOver = false;
    gameState.isAnimating = false;
    gameState.selectedAttacker = null;
    ['player', 'enemy'].forEach(side => {
      const p = gameState[side];
      p.hp = 30;
      p.nectar = 10;
      p.maxNectar = 10;
      p.hand = [];
      p.board = [];
      p.traps = [];
      p.graveyard = [];
    });
  }

  function makeCreature(props) {
    const card = Object.assign({
      id: 'test_card',
      name: 'Criatura de Prueba',
      cost: 1,
      attack: 1,
      hp: 1,
      keywords: [],
      canAttack: true,
      attacksLeft: 1
    }, props);
    if (card.maxHp === undefined) card.maxHp = card.hp;
    return card;
  }

  console.log("=== INICIANDO TEST SUITE AUTOMATIZADO ===");

  let stats = { playerWins: 0, enemyWins: 0, avgTurns: "0.0" };

  try {
    // TEST 1: Base de Datos de Cartas
    assert("1. Base de Datos de Cartas cargada", typeof CARD_DATABASE !== 'undefined' && CARD_DATABASE.length > 0, `Total cartas: ${CARD_DATABASE.length}`);

    // Las criaturas viven en el tablero (necesitan HP); hechizos, trampas e instintos no llegan nunca al tablero,
    // así que no pueden declarar vida útil (el campo hp puede faltar, valer 0 o null).
    const invalidCards = CARD_DATABASE.filter(c => {
      if (!c.id || !c.name || c.cost < 0 || c.attack < 0) return true;
      const goesToBoard = !c.isSpell && !c.isTrap && !c.isInstinct;
      return goesToBoard ? !(c.hp > 0) : c.hp > 0;
    });
    assert("2. Integridad de Estadísticas de Cartas", invalidCards.length === 0, `Cartas inválidas: ${invalidCards.length}${invalidCards.length ? ' (' + invalidCards.map(c => c.id).join(', ') + ')' : ''}`);

    // TEST 2: Inicialización del Juego
    initGame();
    assert("3. Vida inicial de Colmenas = 30", gameState.player.hp === 30 && gameState.enemy.hp === 30);
    assert("4. Néctar Inicial = 1/1", gameState.player.nectar === 1 && gameState.player.maxNectar === 1);
    assert("5. Cartas en Mano Inicial = 4", gameState.player.hand.length === 4 && gameState.enemy.hand.length === 4);

    // TEST 3: Mecánica de Provocar y Vuelo (contra el código real de targeting)
    resetBoardState();
    gameState.enemy.board = [
      makeCreature({ instanceId: 't1', name: 'Coraza', cost: 3, attack: 1, hp: 5, keywords: ['PROVOCAR'], canAttack: false })
    ];
    gameState.player.board = [
      makeCreature({ instanceId: 'a1', name: 'Tierra', cost: 2, attack: 2, hp: 2 }),
      makeCreature({ instanceId: 'a2', name: 'Volador', cost: 2, attack: 2, hp: 1, keywords: ['VUELO'] })
    ];

    // Atacante de tierra intentando atacar la Colmena con Provocar activo
    gameState.selectedAttacker = 'a1';
    await attackTarget('HIVE', null);
    await drainActionQueue();
    const groundAfterBlock = gameState.player.board.find(c => c.instanceId === 'a1');
    // El ataque tiene que quedar intacto: si se consumió (o nunca llegó al motor), la Colmena en 30 no prueba nada.
    const attackStillAvailable = !!groundAfterBlock && groundAfterBlock.attacksLeft === 1 && groundAfterBlock.canAttack === true;

    // Mismo atacante, mismo camino, objetivo legal: prueba que el motor de combate estaba vivo durante el bloqueo.
    gameState.selectedAttacker = 'a1';
    await attackTarget('CREATURE', 't1');
    await drainActionQueue();
    const tauntAfterLegalHit = gameState.enemy.board.find(c => c.instanceId === 't1');
    const engineAlive = !!tauntAfterLegalHit && tauntAfterLegalHit.hp === 3;

    assert(
      "6. Provocar bloquea ataques de tierra a Colmena",
      gameState.enemy.hp === 30 && attackStillAvailable && engineAlive,
      `HP Colmena enemiga: ${gameState.enemy.hp} (esperado 30) · ataque disponible tras el bloqueo: ${attackStillAvailable} · daño del ataque legal a Coraza: ${tauntAfterLegalHit ? 5 - tauntAfterLegalHit.hp : 'la criatura no está'} (esperado 2)`
    );

    // Atacante con vuelo intentando atacar la Colmena con Provocar activo
    gameState.selectedAttacker = 'a2';
    await attackTarget('HIVE', null);
    await drainActionQueue();
    assert("7. Vuelo ignora Provocar y puede atacar Colmena", gameState.enemy.hp === 28, `HP Colmena enemiga: ${gameState.enemy.hp} (esperado 28)`);

    // TEST 4: Mecánica de Veneno (combate real)
    resetBoardState();
    gameState.player.board = [makeCreature({ instanceId: 'ven1', name: 'Colmillo Tóxico', attack: 1, hp: 1, keywords: ['VENENO'] })];
    gameState.enemy.board = [makeCreature({ instanceId: 'big1', name: 'Coloso', attack: 0, hp: 10 })];
    await handleAttackAction({ who: 'player', isLocal: true, targetType: 'CREATURE', attackerInstId: 'ven1', targetInstId: 'big1' });
    assert(
      "8. Veneno destruye objetivo de alta vida instantáneamente",
      gameState.enemy.board.length === 0 && gameState.enemy.graveyard.some(c => c.instanceId === 'big1'),
      `Criaturas enemigas vivas: ${gameState.enemy.board.length}`
    );

    // TEST 5: Simulación de 50 Partidas Automatizadas Bot vs Bot
    console.log("Simulando 50 partidas automatizadas...");
    let playerWins = 0;
    let enemyWins = 0;
    let totalTurnsSum = 0;
    let matchErrors = 0;

    for (let match = 1; match <= 50; match++) {
      try {
        initGame();
        let turnsLimit = 100;

        while (!gameState.isGameOver && turnsLimit > 0) {
          turnsLimit--;

          // Turno del Jugador (Simulado por IA)
          await simulatedAiPlay('player');
          if (gameState.isGameOver) break;

          // Turno del Enemigo
          gameState.turn = 'ENEMY';
          await startTurn('enemy');
          await simulatedAiPlay('enemy');

          gameState.turn = 'PLAYER';
          if (!gameState.isGameOver) {
            await startTurn('player');
          }
        }

        if (gameState.enemy.hp <= 0) playerWins++;
        else if (gameState.player.hp <= 0) enemyWins++;

        totalTurnsSum += (100 - turnsLimit);
      } catch (e) {
        matchErrors++;
        console.error(`Error en partida ${match}:`, e);
      }
    }

    stats = { playerWins, enemyWins, avgTurns: (totalTurnsSum / 50).toFixed(1) };

    assert("9. Simulación de 50 Partidas sin Errores", matchErrors === 0, `Errores: ${matchErrors}`);
    assert("10. Conclusión de Partidas (Sin Bloqueos)", (playerWins + enemyWins) === 50, `Victorias P1: ${playerWins}, P2: ${enemyWins}, Promedio Turnos: ${stats.avgTurns}`);

    // TEST 6: Reglas del turno de la IA y de la primera ronda
    resetBoardState();
    gameState.turn = 'ENEMY';
    gameState.enemy.maxNectar = 1;
    gameState.enemy.nectar = 1;
    gameState.enemy.deck = [];
    gameState.enemy.extraDeck = [];
    gameState.enemy.hand = [{ instanceId: 'nokw1', id: 'test_nokw', name: 'Sin Palabras Clave', cost: 1, attack: 1, hp: 2 }];
    await runAiTurn();
    assert(
      "11. Criatura sin keywords no rompe el turno de la IA",
      gameState.enemy.board.length === 1 && gameState.enemy.board[0].instanceId === 'nokw1',
      `Criaturas invocadas por la IA: ${gameState.enemy.board.length} (esperado 1)`
    );

    resetBoardState();
    gameState.turn = 'ENEMY';
    gameState.enemy.hand = [];
    gameState.enemy.deck = [];
    gameState.enemy.extraDeck = [];
    gameState.enemy.board = [makeCreature({ instanceId: 'dbl1', name: 'Doble Filo', attack: 2, hp: 5, keywords: ['DOBLE_ATAQUE'] })];
    await runAiTurn();
    assert(
      "12. DOBLE_ATAQUE ataca dos veces en el mismo turno de la IA",
      gameState.player.hp === 26,
      `HP del Reino jugador: ${gameState.player.hp} (esperado 26: 2 ataques de 2)`
    );

    // Ronda 1 simétrica: mazos de relleno impagables para que nadie juegue ni ataque.
    initGame();
    const filler = (side, count) => {
      const cards = [];
      for (let i = 0; i < count; i++) {
        cards.push(makeCreature({ instanceId: `${side}_fill_${i}`, id: 'test_filler', name: 'Relleno', cost: 9, attack: 1, hp: 1 }));
      }
      return cards;
    };
    gameState.player.hand = filler('p', 4);
    gameState.player.deck = filler('pd', 5);
    gameState.player.board = [];
    gameState.player.extraDeck = [];
    gameState.enemy.hand = filler('e', 4);
    gameState.enemy.deck = filler('ed', 5);
    gameState.enemy.board = [];
    gameState.enemy.extraDeck = [];

    const playerRound1 = { nectar: gameState.player.nectar, cards: gameState.player.hand.length };
    endTurn();
    await drainActionQueue();
    const enemyRound1 = { nectar: gameState.enemy.nectar, cards: gameState.enemy.hand.length };
    assert(
      "13. Ronda 1: jugador e IA con el mismo néctar y las mismas cartas",
      playerRound1.nectar === enemyRound1.nectar && playerRound1.cards === enemyRound1.cards,
      `Jugador: ${playerRound1.nectar} néctar / ${playerRound1.cards} cartas · IA: ${enemyRound1.nectar} néctar / ${enemyRound1.cards} cartas`
    );

    // TEST 7: ESCUDO frente a VENENO
    resetBoardState();
    gameState.player.board = [makeCreature({ instanceId: 'ven2', name: 'Colmillo Tóxico', attack: 3, hp: 4, keywords: ['VENENO'] })];
    gameState.enemy.board = [makeCreature({ instanceId: 'shd1', name: 'Guardián', attack: 0, hp: 4, keywords: ['ESCUDO'], hasShield: true })];
    await handleAttackAction({ who: 'player', isLocal: true, targetType: 'CREATURE', attackerInstId: 'ven2', targetInstId: 'shd1' });
    const shielded = gameState.enemy.board.find(c => c.instanceId === 'shd1');
    assert(
      "14. ESCUDO absorbe el golpe entero y el VENENO no lo atraviesa",
      !!shielded && shielded.hp === 4 && shielded.hasShield === false,
      shielded ? `HP: ${shielded.hp} (esperado 4), escudo restante: ${shielded.hasShield}` : "El defensor con ESCUDO murió al primer golpe"
    );

    // TEST 8: Arranque con el almacenamiento del navegador en modo de solo lectura
    // (pestaña privada, cuota llena o cookies bloqueadas: setItem tira y la partida tiene que arrancar igual).
    const storage = globalThis.localStorage;
    const isolatedStorage = !!storage && (typeof Storage === 'undefined' || !(storage instanceof Storage));
    if (!isolatedStorage) {
      assert(
        "15. La partida arranca aunque no se pueda escribir en localStorage",
        false,
        "No se pudo probar sin pisar datos reales: localStorage no está aislado. Corré la suite desde test_runner.html."
      );
    } else {
      const realSetItem = storage.setItem;
      // Sin borrar la colección, getUnlockedCards lee la guardada y nunca intenta escribir.
      storage.removeItem('feral_wars_unlocked_cards');
      storage.setItem = () => { throw new Error("QuotaExceededError simulado"); };
      let initError = null;
      try {
        initGame();
      } catch (e) {
        initError = e;
      } finally {
        storage.setItem = realSetItem;
      }
      assert(
        "15. La partida arranca aunque no se pueda escribir en localStorage",
        !initError && gameState.player.hand.length === 4 && gameState.enemy.hand.length === 4 && gameState.player.deck.length > 0,
        initError
          ? `initGame lanzó: ${initError.message}`
          : `Mano jugador: ${gameState.player.hand.length}, mano IA: ${gameState.enemy.hand.length}, mazo jugador: ${gameState.player.deck.length}`
      );
    }
  } finally {
    globalThis.sleep = realSleep;
  }

  console.log("=== RESUMEN DE PRUEBAS ===");
  console.log(`PASADAS: ${passedCount} | FALLADAS: ${failedCount}`);

  return { results, passedCount, failedCount, stats };
}

// IA Simétrica para pruebas masivas: juega y combate con las mismas funciones que el juego real
async function simulatedAiPlay(who) {
  const p = gameState[who];
  const opp = gameState[who === 'player' ? 'enemy' : 'player'];

  // Jugar cartas (los Instintos y las Trampas no se bajan a mano, igual que en playCard)
  let canPlay = true;
  while (canPlay && !gameState.isGameOver) {
    const idx = p.hand.findIndex(c => c.cost <= p.nectar && !c.isInstinct && !c.isTrap && (c.isSpell || p.board.length < 6));
    if (idx === -1) {
      canPlay = false;
    } else {
      await handlePlayCardAction({ who: who, isLocal: who === 'player', handIndex: idx, cardObj: p.hand[idx] });
    }
  }

  // Atacar
  for (const attacker of p.board.slice()) {
    let attacksAllowed = attacker.attacksLeft || 1;
    while (attacksAllowed > 0 && attacker.canAttack && !gameState.isGameOver && p.board.indexOf(attacker) !== -1) {
      attacksAllowed--;

      const oppHasTaunt = opp.board.some(c => (c.keywords || []).includes("PROVOCAR"));
      const hasFlying = (attacker.keywords || []).includes("VUELO");

      let targetType = 'HIVE';
      let targetInstId = null;
      if (oppHasTaunt && !hasFlying) {
        targetType = 'CREATURE';
        targetInstId = opp.board.filter(c => (c.keywords || []).includes("PROVOCAR"))[0].instanceId;
      }

      await handleAttackAction({ who: who, isLocal: who === 'player', targetType: targetType, attackerInstId: attacker.instanceId, targetInstId: targetInstId });
    }
  }

  await checkDeathsAsync();
}
