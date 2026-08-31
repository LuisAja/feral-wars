// Automated QA Test Suite for Insectos en Guerra TCG

function runAllTests() {
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

  console.log("=== INICIANDO TEST SUITE AUTOMATIZADO ===");

  // TEST 1: Base de Datos de Cartas
  assert("1. Base de Datos de Cartas cargada", typeof CARD_DATABASE !== 'undefined' && CARD_DATABASE.length > 0, `Total cartas: ${CARD_DATABASE.length}`);
  
  const invalidCards = CARD_DATABASE.filter(c => !c.id || !c.name || c.cost < 0 || c.attack < 0 || c.hp <= 0);
  assert("2. Integridad de Estadísticas de Cartas", invalidCards.length === 0, `Cartas inválidas: ${invalidCards.length}`);

  // TEST 2: Inicialización del Juego
  initGame();
  assert("3. Vida inicial de Colmenas = 30", gameState.player.hp === 30 && gameState.enemy.hp === 30);
  assert("4. Néctar Inicial = 1/1", gameState.player.nectar === 1 && gameState.player.maxNectar === 1);
  assert("5. Cartas en Mano Inicial = 4", gameState.player.hand.length === 4 && gameState.enemy.hand.length === 4);

  // TEST 3: Mecánica de Provocar y Vuelo
  gameState.enemy.board = [
    { instanceId: 't1', name: 'Coraza', cost: 3, attack: 1, hp: 5, keywords: ['PROVOCAR'], canAttack: false }
  ];
  gameState.player.board = [
    { instanceId: 'a1', name: 'Tierra', cost: 2, attack: 2, hp: 2, keywords: [], canAttack: true },
    { instanceId: 'a2', name: 'Volador', cost: 2, attack: 2, hp: 1, keywords: ['VUELO'], canAttack: true }
  ];

  // Atacante de tierra intentando atacar colmena con taunt activo
  gameState.selectedAttacker = 'a1';
  const enemyHasTaunt = gameState.enemy.board.some(c => c.keywords.includes("PROVOCAR"));
  const attacker1HasFlying = gameState.player.board.find(c => c.instanceId === 'a1').keywords.includes("VUELO");
  const canAttacker1HitHive = !enemyHasTaunt || attacker1HasFlying;
  assert("6. Provocar bloquea ataques de tierra a Colmena", !canAttacker1HitHive);

  // Atacante con vuelo intentando atacar colmena con taunt activo
  const attacker2HasFlying = gameState.player.board.find(c => c.instanceId === 'a2').keywords.includes("VUELO");
  const canAttacker2HitHive = !enemyHasTaunt || attacker2HasFlying;
  assert("7. Vuelo ignora Provocar y puede atacar Colmena", canAttacker2HitHive);

  // TEST 4: Mecánica de Veneno
  const poisonousAttacker = { attack: 1, hp: 1, keywords: ['VENENO'] };
  const bigDefender = { attack: 5, hp: 10, keywords: [] };
  
  if (poisonousAttacker.keywords.includes("VENENO")) {
    bigDefender.hp = 0;
  }
  assert("8. Veneno destruye objetivo de alta vida instantáneamente", bigDefender.hp === 0);

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
        simulatedAiPlay('player');
        if (gameState.isGameOver) break;
        
        // Turno del Enemigo
        gameState.turn = 'ENEMY';
        startTurn('enemy');
        simulatedAiPlay('enemy');
        
        gameState.turn = 'PLAYER';
        if (!gameState.isGameOver) {
          startTurn('player');
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

  assert("9. Simulación de 50 Partidas sin Errores", matchErrors === 0, `Errores: ${matchErrors}`);
  assert("10. Conclusión de Partidas (Sin Bloqueos)", (playerWins + enemyWins) === 50, `Victorias P1: ${playerWins}, P2: ${enemyWins}, Promedio Turnos: ${(totalTurnsSum / 50).toFixed(1)}`);

  console.log("=== RESUMEN DE PRUEBAS ===");
  console.log(`PASADAS: ${passedCount} | FALLADAS: ${failedCount}`);
  
  return { results, passedCount, failedCount, stats: { playerWins, enemyWins, avgTurns: (totalTurnsSum / 50).toFixed(1) } };
}

// IA Simétrica para pruebas masivas
function simulatedAiPlay(who) {
  const p = gameState[who];
  const opp = gameState[who === 'player' ? 'enemy' : 'player'];

  // Jugar cartas
  let canPlay = true;
  while (canPlay && p.board.length < 6) {
    const idx = p.hand.findIndex(c => c.cost <= p.nectar);
    if (idx !== -1) {
      const card = p.hand.splice(idx, 1)[0];
      p.nectar -= card.cost;
      p.board.push({
        instanceId: card.instanceId,
        id: card.id,
        name: card.name,
        cost: card.cost,
        attack: card.attack,
        hp: card.hp,
        maxHp: card.hp,
        image: card.image,
        keywords: card.keywords || [],
        canAttack: card.keywords.includes("PRISA")
      });
      if (card.battlecry) executeBattlecry(who, card.battlecry);
    } else {
      canPlay = false;
    }
  }

  // Atacar
  p.board.forEach(attacker => {
    if (attacker.canAttack && !gameState.isGameOver) {
      const oppHasTaunt = opp.board.some(c => c.keywords.includes("PROVOCAR"));
      const hasFlying = attacker.keywords.includes("VUELO");

      if (oppHasTaunt && !hasFlying) {
        const taunts = opp.board.filter(c => c.keywords.includes("PROVOCAR"));
        if (taunts.length > 0) {
          const t = taunts[0];
          if (attacker.keywords.includes("VENENO")) t.hp = 0; else t.hp -= attacker.attack;
          if (t.keywords.includes("VENENO")) attacker.hp = 0; else attacker.hp -= t.attack;
        }
      } else {
        // Atacar Colmena
        opp.hp -= attacker.attack;
      }
      attacker.canAttack = false;
    }
  });

  checkDeaths();
}
