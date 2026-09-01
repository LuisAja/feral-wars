// Motor Modular de Efectos para Insectos en Guerra TCG
// Registrador y ejecutor de habilidades especiales, gritos de guerra, hechizos, rampa de néctar, tutores, trampas y revivir del cementerio

const EFFECTS_REGISTRY = {
  // Infligir daño a un objetivo seleccionado
  DAMAGE_TARGET: (ctx, target, val) => {
    if (!target) return false;
    if (target.isHive) {
      target.player.hp = Math.max(0, target.player.hp - val);
      createFloatingText(target.element, `-${val}`, 'damage');
    } else if (target.card) {
      if (typeof window.takeCardDamage === 'function') {
        window.takeCardDamage(target.card, val, target.element);
      } else {
        target.card.hp -= val;
        createFloatingText(target.element, `-${val}`, 'damage');
      }
    }
    return true;
  },

  // 🩸 Infligir daño o sacrificar vida del propio Reino/Colmena
  DAMAGE_SELF_HIVE: (ctx, target, val) => {
    const amount = val || 1;
    ctx.player.hp = Math.max(0, ctx.player.hp - amount);
    const hiveEl = document.getElementById(ctx.isPlayer ? 'player-hive' : 'enemy-hive');
    if (hiveEl) {
      hiveEl.classList.add('anim-shake');
      createFloatingText(hiveEl, `-${amount}`, 'damage');
      setTimeout(() => { if (hiveEl) hiveEl.classList.remove('anim-shake'); }, 400);
    }
    return true;
  },

  // Restaurar vida a la Colmena
  HEAL_HIVE: (ctx, target, val) => {
    ctx.player.hp = Math.min(30, ctx.player.hp + val);
    const hiveEl = document.getElementById(ctx.isPlayer ? 'player-hive' : 'enemy-hive');
    if (hiveEl) createFloatingText(hiveEl, `+${val}`, 'heal');
    return true;
  },

  // 💚 Curar a todas las criaturas del campo propio
  HEAL_ALL_FRIENDLIES: (ctx, target, val) => {
    ctx.player.board.forEach(card => {
      if (card.hp > 0 && card.maxHp) {
        card.hp = Math.min(card.maxHp, card.hp + val);
        const cardEl = document.querySelector(`[data-inst="${card.instanceId}"]`);
        if (cardEl) createFloatingText(cardEl, `+${val}`, 'heal');
      }
    });
    return true;
  },

  // 💥 Dañar a todas las criaturas del campo enemigo
  DAMAGE_ALL_ENEMIES: (ctx, target, val) => {
    const oppBoard = ctx.opponent.board;
    for (let i = oppBoard.length - 1; i >= 0; i--) {
      const card = oppBoard[i];
      const cardEl = document.querySelector(`[data-inst="${card.instanceId}"]`);
      if (typeof window.takeCardDamage === 'function') {
        window.takeCardDamage(card, val, cardEl);
      } else {
        card.hp -= val;
        if (cardEl) createFloatingText(cardEl, `-${val}`, 'damage');
      }
    }
    return true;
  },

  // 💀 Destruir una criatura seleccionada del enemigo
  DESTROY_TARGET_CREATURE: (ctx, target) => {
    if (!target || !target.card) return false;
    if (target.card.hasShield) {
      target.card.hasShield = false;
      createFloatingText(target.element, "🛡️ ESCUDO ROTO", "status");
    } else {
      target.card.hp = 0;
      createFloatingText(target.element, "☠️ DESTRUIDO", "damage");
    }
    return true;
  },

  // 🃏 Robar cartas del mazo
  DRAW_CARD: (ctx, target, val) => {
    const amount = val || 1;
    if (typeof window.drawCardForPlayer === 'function') {
      window.drawCardForPlayer(ctx.player, amount);
    }
    return true;
  },

  // ⚔️ Potenciar Ataque a todas tus criaturas en campo
    // 🛡️ Aumentar Salud Máxima (HP Máximo y Salud Actual) a todas tus criaturas en campo
  BUFF_ALL_FRIENDLIES_HP: (ctx, target, val) => {
    const amount = val || 1;
    ctx.player.board.forEach(card => {
      card.maxHp = (card.maxHp || card.hp) + amount;
      card.hp += amount;
      const cardEl = document.querySelector(`[data-inst="${card.instanceId}"]`);
      if (cardEl) createFloatingText(cardEl, `+${amount} HP MAX`, 'heal');
    });
    return true;
  },

  BUFF_ALL_FRIENDLIES_MAX_HP: (ctx, target, val) => {
    const amount = val || 1;
    ctx.player.board.forEach(card => {
      card.maxHp = (card.maxHp || card.hp) + amount;
      card.hp += amount;
      const cardEl = document.querySelector(`[data-inst="${card.instanceId}"]`);
      if (cardEl) createFloatingText(cardEl, `+${amount} HP MAX`, 'heal');
    });
    return true;
  },

  BUFF_ALL_FRIENDLIES_ATK: (ctx, target, val) => {
    ctx.player.board.forEach(card => {
      card.attack += val;
      const cardEl = document.querySelector(`[data-inst="${card.instanceId}"]`);
      if (cardEl) createFloatingText(cardEl, `+${val} ATK`, 'heal');
    });
    return true;
  },

  // 🎯 Daño directo a la Colmena enemiga (Ignora Provocar)
  DAMAGE_ENEMY_HIVE: (ctx, target, val) => {
    ctx.opponent.hp = Math.max(0, ctx.opponent.hp - val);
    const hiveEl = document.getElementById(ctx.isPlayer ? 'enemy-hive' : 'player-hive');
    if (hiveEl) createFloatingText(hiveEl, `-${val}`, 'damage');
    return true;
  },

  // 💧 Aumentar Néctar en el turno actual
  GAIN_NECTAR: (ctx, target, val) => {
    const amount = val || 1;
    ctx.player.nectar = Math.min(10, ctx.player.nectar + amount);
    const nectarEl = document.getElementById(ctx.isPlayer ? 'player-nectar' : 'enemy-nectar');
    if (nectarEl) createFloatingText(nectarEl, `+${amount} 💧`, 'heal');
    return true;
  },

  // 🧪 Rampa de Néctar Máximo Permanente
  PERMANENT_NECTAR: (ctx, target, val) => {
    const amount = val || 1;
    ctx.player.maxNectar = Math.min(10, ctx.player.maxNectar + amount);
    ctx.player.nectar = Math.min(ctx.player.maxNectar, ctx.player.nectar + amount);
    const nectarEl = document.getElementById(ctx.isPlayer ? 'player-nectar' : 'enemy-nectar');
    if (nectarEl) createFloatingText(nectarEl, `+${amount} LÍMITE`, 'heal');
    return true;
  },

  // 🔍 BUSCAR CARTA EN EL MAZO (Tutor Automático)
  SEARCH_DECK: (ctx, target, criteria) => {
    const deck = ctx.player.deck;
    if (!deck || deck.length === 0) return false;

    let foundIndex = -1;
    if (typeof criteria === 'string') {
      const critUpper = criteria.toUpperCase();
      if (critUpper === 'HECHIZO' || critUpper === 'SPELL') {
        foundIndex = deck.findIndex(card => card.isSpell);
      } else {
        foundIndex = deck.findIndex(card => 
          (card.type && card.type.toLowerCase() === criteria.toLowerCase()) ||
          (card.keywords && card.keywords.includes(criteria)) || 
          (card.name && card.name.toLowerCase().includes(criteria.toLowerCase()))
        );
      }
    } else if (typeof criteria === 'number') {
      foundIndex = deck.findIndex(card => card.cost <= criteria);
    }

    if (foundIndex === -1) {
      const nameTag = ctx.isPlayer ? "Jugador" : "Oponente";
      if (typeof addLog === 'function') {
        addLog(`🔍 ${nameTag} buscó en su mazo pero no se encontró ningún ${criteria}.`, "system");
      }
      if (typeof showBanner === 'function' && ctx.isPlayer) {
        showBanner(`🔍 ¡NO SE ENCONTRÓ NINGÚN ${String(criteria).toUpperCase()}!`);
      }
      return false;
    }

    if (foundIndex !== -1 && ctx.player.hand.length < 7) {
      const card = deck.splice(foundIndex, 1)[0];
      card.instanceId = 'card_' + Math.random().toString(36).substr(2, 9);
      ctx.player.hand.push(card);

      const nameTag = ctx.isPlayer ? "Jugador" : "Oponente";
      if (typeof addLog === 'function') {
        addLog(`🔍 ${nameTag} buscó y encontró a ${card.name} en su mazo.`, ctx.isPlayer ? "player" : "enemy");
      }
      if (typeof showBanner === 'function' && ctx.isPlayer) {
        showBanner(`🔍 ¡ENCONTRADO: ${card.name.toUpperCase()}!`);
      }
    }
    return true;
  },

  // 🃏 INVOCAR CRIATURA ALEATORIA DE LA MANO AL CAMPO SIN COSTO (CON MAXCOST)
  SUMMON_RANDOM_FROM_HAND: (ctx, target, val, extraParam) => {
    const hand = ctx.player.hand || [];
    const maxCost = (extraParam && extraParam.maxCost !== undefined) ? extraParam.maxCost : (typeof val === 'object' && val !== null ? val.maxCost : undefined);
    
    const eligible = hand.filter(c => 
      !c.isSpell && 
      !c.isTrap && 
      (maxCost === undefined || maxCost === null || c.cost <= maxCost)
    );

    if (eligible.length === 0) {
      const nameTag = ctx.isPlayer ? "Jugador" : "Oponente";
      if (typeof addLog === 'function') {
        addLog(`🃏 ${nameTag} no tiene criaturas en su mano para invocar.`, ctx.isPlayer ? "player" : "enemy");
      }
      return false;
    }

    if (ctx.player.board.length >= 6) {
      const nameTag = ctx.isPlayer ? "Jugador" : "Oponente";
      if (typeof addLog === 'function') {
        addLog(`⚠️ El campo de ${nameTag} está lleno (Máx. 6 criaturas).`, ctx.isPlayer ? "player" : "enemy");
      }
      return false;
    }

    const count = val || 1;
    let summonedCount = 0;

    for (let i = 0; i < count; i++) {
      if (ctx.player.board.length >= 6) break;

      const currentEligible = (ctx.player.hand || []).filter(c => !c.isSpell && !c.isTrap && (maxCost === undefined || maxCost === null || c.cost <= maxCost));
      if (currentEligible.length === 0) break;

      const randomIndex = Math.floor(Math.random() * currentEligible.length);
      const chosenCard = currentEligible[randomIndex];

      const handIdx = ctx.player.hand.findIndex(c => (c.instanceId && c.instanceId === chosenCard.instanceId) || c.id === chosenCard.id);
      if (handIdx !== -1) ctx.player.hand.splice(handIdx, 1);

      const hasShield = (chosenCard.keywords || []).includes("ESCUDO") || (chosenCard.keywords || []).includes("SHIELD");
      const boardCard = {
        instanceId: 'hand_sum_' + Math.random().toString(36).substr(2, 9),
        id: chosenCard.id,
        name: chosenCard.name,
        cost: chosenCard.cost,
        attack: chosenCard.attack,
        hp: chosenCard.maxHp || chosenCard.hp,
        maxHp: chosenCard.maxHp || chosenCard.hp,
        image: chosenCard.image,
        keywords: chosenCard.keywords || [],
        description: chosenCard.description || '',
        battlecry: chosenCard.battlecry || null,
        hasShield: hasShield,
        canAttack: chosenCard.keywords ? chosenCard.keywords.includes("PRISA") : false,
        isNewSummon: true
      };

      ctx.player.board.push(boardCard);
      summonedCount++;

      const nameTag = ctx.isPlayer ? "Jugador" : "Oponente";
      if (typeof addLog === 'function') {
        addLog(`🃏 ¡${nameTag} invocó a [${boardCard.name}] directamente desde su mano!`, ctx.isPlayer ? "player" : "enemy");
      }
      if (typeof showBanner === 'function' && ctx.isPlayer) {
        showBanner(`🃏 ¡DESDE LA MANO: ${boardCard.name.toUpperCase()}!`);
      }
    }

    return summonedCount > 0;
  },

  // 🔮 REVIVIR CRIATURA ALEATORIA DEL CEMENTERIO
  REVIVE_RANDOM_CREATURE: (ctx, target, val) => {
    const gy = ctx.player.graveyard || [];
    const eligible = gy.filter(c => !c.isSpell && !c.isTrap);

    if (eligible.length === 0) {
      if (typeof addLog === 'function') {
        addLog(`💀 No hay criaturas en el cementerio para revivir.`, ctx.isPlayer ? "player" : "enemy");
      }
      return false;
    }

    const randomIndex = Math.floor(Math.random() * eligible.length);
    const revCard = eligible[randomIndex];

    const gyIdx = gy.findIndex(c => c.instanceId === revCard.instanceId || c.id === revCard.id);
    if (gyIdx !== -1) gy.splice(gyIdx, 1);

    if (ctx.player.board.length < 6) {
      const hasShield = (revCard.keywords || []).includes("ESCUDO") || (revCard.keywords || []).includes("SHIELD");
      const boardCard = {
        instanceId: 'rev_' + Math.random().toString(36).substr(2, 9),
        id: revCard.id,
        name: revCard.name,
        cost: revCard.cost,
        attack: revCard.attack,
        hp: revCard.maxHp || revCard.hp,
        maxHp: revCard.maxHp || revCard.hp,
        image: revCard.image,
        keywords: revCard.keywords || [],
        description: revCard.description || '',
        battlecry: null,
        hasShield: hasShield,
        canAttack: revCard.keywords ? revCard.keywords.includes("PRISA") : false,
        isNewSummon: true
      };

      ctx.player.board.push(boardCard);
      const nameTag = ctx.isPlayer ? "Jugador" : "Oponente";
      if (typeof addLog === 'function') {
        addLog(`🔮 ¡${nameTag} revivió a ${boardCard.name} de su cementerio!`, ctx.isPlayer ? "player" : "enemy");
      }
      if (typeof showBanner === 'function' && ctx.isPlayer) {
        showBanner(`🔮 ¡REVIVIDO: ${boardCard.name.toUpperCase()}!`);
      }
    }
    return true;
  },

  // 🪤 EFECTO DE TRAMPA: Dañar al atacante
  DAMAGE_ATTACKER: (ctx, target, val) => {
    if (!target || !target.card) return false;
    if (typeof window.takeCardDamage === 'function') {
      window.takeCardDamage(target.card, val, target.element);
    } else {
      target.card.hp -= val;
      if (target.element) createFloatingText(target.element, `-${val}`, 'damage');
    }
    return true;
  },

  // 🪤 EFECTO DE TRAMPA: Dañar a la criatura invocada
  DAMAGE_SUMMON: (ctx, target, val) => {
    if (!target || !target.card) return false;
    if (typeof window.takeCardDamage === 'function') {
      window.takeCardDamage(target.card, val, target.element);
    } else {
      target.card.hp -= val;
      if (target.element) createFloatingText(target.element, `-${val}`, 'damage');
    }
    return true;
  }
};

function executeRegisteredEffect(effectType, context, target, val, extraParam) {
  if (EFFECTS_REGISTRY[effectType]) {
    return EFFECTS_REGISTRY[effectType](context, target, val, extraParam);
  }
  console.warn(`Efecto '${effectType}' no encontrado en EFFECTS_REGISTRY.`);
  return false;
}

function createFloatingText(element, text, type = 'damage') {
  if (!element) return;
  const floating = document.createElement('div');
  floating.className = type === 'heal' ? 'floating-heal' : (type === 'status' ? 'floating-status-banner' : 'floating-damage');
  floating.textContent = text;
  
  element.appendChild(floating);
  setTimeout(() => {
    if (floating.parentNode) floating.parentNode.removeChild(floating);
  }, 1100);
}

function showSpellOrTrapBanner(title, text) {
  const container = document.querySelector('.battlefield-container');
  if (!container) return;
  const banner = document.createElement('div');
  banner.className = 'floating-spell-banner';
  banner.innerHTML = `<div style="font-size:14px; color:#f1c40f;">${title}</div><div>${text}</div>`;
  container.appendChild(banner);

  setTimeout(() => {
    if (banner.parentNode) banner.parentNode.removeChild(banner);
  }, 1400);
}
