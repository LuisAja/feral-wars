const CARD_DATABASE = [
  {
    "id": "s1_01",
    "image": "assets/cards/carta_01.png",
    "name": "Gran Campeón",
    "type": "León",
    "subtype": "Guerrero",
    "isExtra": false,
    "cost": 7,
    "attack": 8,
    "hp": 7,
    "keywords": [
      "PRISA"
    ],
    "battlecry": {
      "type": "BUFF_ALL_FRIENDLIES_ATK",
      "val": 2
    },
    "description": "COMANDANTE LEYENDA (Deck Extra). PRISA (Puede atacar inmediatamente en el turno que es invocada). GRITO DE GUERRA: Otorga +2 de Ataque a todas tus criaturas aliadas.",
    "isStarter": false
  },
  {
    "id": "s1_02",
    "image": "assets/cards/carta_02.png",
    "name": "Arquero Del Este",
    "type": "León",
    "subtype": "Tirador",
    "cost": 1,
    "attack": 2,
    "hp": 1,
    "keywords": [],
    "battlecry": {
      "type": "DAMAGE_TARGET",
      "val": 1
    },
    "description": "PRISA (Puede atacar inmediatamente en el turno que es invocada). GRITO DE GUERRA: Inflige 1 de daño al objetivo elegido.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_03",
    "image": "assets/cards/carta_03.png",
    "name": "Modesto Leonino",
    "type": "León",
    "subtype": "Normal",
    "cost": 1,
    "attack": 1,
    "hp": 2,
    "keywords": [],
    "battlecry": {
      "type": "SEARCH_DECK",
      "val": "León"
    },
    "description": "GRITO DE GUERRA: Busca y roba León carta(s) de tu mazo.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_04",
    "image": "assets/cards/carta_04.png",
    "name": "Caballero Real",
    "type": "León",
    "subtype": "Guerrero",
    "cost": 3,
    "attack": 3,
    "hp": 3,
    "keywords": [],
    "battlecry": {
      "type": "SUMMON_RANDOM_FROM_HAND",
      "val": 1,
      "maxCost": 5
    },
    "description": "PRISA (Puede atacar inmediatamente en el turno que es invocada).",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_05",
    "image": "assets/cards/carta_05.png",
    "name": "Caballero Espectral",
    "type": "León",
    "subtype": "Zombi",
    "cost": 4,
    "attack": 3,
    "hp": 1,
    "keywords": [
      "PRISA"
    ],
    "battlecry": {
      "type": "REVIVE_RANDOM_CREATURE",
      "val": 1
    },
    "description": "PRISA (Puede atacar inmediatamente en el turno que es invocada). GRITO DE GUERRA: Revive 1 criatura(s) aleatoria(s) del cementerio a tu campo.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_06",
    "image": "assets/cards/carta_06.png",
    "name": "Reina de Combate",
    "type": "León",
    "subtype": "Guerrero",
    "cost": 5,
    "attack": 6,
    "hp": 7,
    "keywords": [
      "PRISA",
      "PROVOCAR"
    ],
    "description": "PROVOCAR (Los enemigos deben atacar a esta criatura primero). PRISA (Puede atacar inmediatamente en el turno que es invocada).",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_07",
    "image": "assets/cards/carta_07.png",
    "name": "Rey Legendario",
    "type": "León",
    "subtype": "Guerrero",
    "cost": 7,
    "attack": 4,
    "hp": 8,
    "keywords": [
      "PRISA"
    ],
    "battlecry": {
      "type": "SUMMON_RANDOM_FROM_HAND",
      "val": 2,
      "maxCost": 5
    },
    "description": "PRISA (Puede atacar inmediatamente en el turno que es invocada). GRITO DE GUERRA: Otorga +1 de Ataque a todas tus criaturas aliadas.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_08",
    "image": "assets/cards/carta_08.png",
    "name": "Brujo esfera Lapislazuli",
    "type": "Búho",
    "subtype": "Mago",
    "cost": 1,
    "attack": 2,
    "hp": 4,
    "keywords": [
      "VUELO"
    ],
    "battlecry": [
      {
        "type": "SEARCH_DECK",
        "val": "HECHIZO"
      },
      {
        "type": "GAIN_NECTAR",
        "val": 6
      },
      {
        "type": "DAMAGE_SELF_HIVE",
        "val": 8
      }
    ],
    "description": "VUELO (Puede ignorar criaturas con Provocar y atacar al Reino). GRITO DE GUERRA: Busca y roba HECHIZO carta(s) de tu mazo. GRITO DE GUERRA: Otorga +2 de Energía en este turno.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_09",
    "image": "assets/cards/carta_09.png",
    "name": "Mago esfera Carmesi",
    "type": "Búho",
    "subtype": "Mago",
    "cost": 1,
    "attack": 1,
    "hp": 4,
    "keywords": [
      "VUELO"
    ],
    "battlecry": [
      {
        "type": "SEARCH_DECK",
        "val": "HECHIZO"
      },
      {
        "type": "GAIN_NECTAR",
        "val": 8
      },
      {
        "type": "DAMAGE_SELF_HIVE",
        "val": 8
      }
    ],
    "description": "VUELO (Puede ignorar criaturas con Provocar y atacar al Reino). GRITO DE GUERRA: Roba 2 carta(s) de tu mazo. GRITO DE GUERRA: Otorga +1 de Energía en este turno.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_10",
    "image": "assets/cards/carta_10.png",
    "name": "Maestro esfera Ambar",
    "type": "Búho",
    "subtype": "Mago",
    "cost": 1,
    "attack": 1,
    "hp": 2,
    "keywords": [
      "VUELO",
      "ESCUDO"
    ],
    "battlecry": [
      {
        "type": "GAIN_NECTAR",
        "val": 6
      },
    ],
    "description": "VUELO (Puede ignorar criaturas con Provocar y atacar al Reino). ESCUDO (Protege del primer impacto de daño). GRITO DE GUERRA: Otorga +4 de Energía en este turno.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_11",
    "image": "assets/cards/carta_11.png",
    "name": "Hechizero esfera Oscura",
    "type": "Búho",
    "subtype": "Mago",
    "isExtra": false,
    "cost": 5,
    "attack": 4,
    "hp": 6,
    "keywords": [
      "VUELO",
      "ESCUDO"
    ],
    "battlecry": [
      {
        "type": "SEARCH_DECK",
        "val": "HECHIZO"
      },
      {
        "type": "GAIN_NECTAR",
        "val": 4
      },
      {
        "type": "DAMAGE_SELF_HIVE",
        "val": 8
      }
    ],
    "description": "COMANDANTE LEYENDA (Deck Extra). VUELO (Puede ignorar criaturas con Provocar y atacar al Reino). ESCUDO (Protege del primer impacto de daño). GRITO DE GUERRA: Roba 2 carta(s) de tu mazo. GRITO DE GUERRA: Otorga +2 de Energía en este turno.",
    "isStarter": false
  },
  {
    "id": "s1_12",
    "image": "assets/cards/carta_12.png",
    "name": "Brujo Aterrador",
    "type": "Buitre",
    "subtype": "Zombi",
    "cost": 4,
    "attack": 3,
    "hp": 4,
    "keywords": [],
    "battlecry": [
      {
        "type": "REVIVE_RANDOM_CREATURE",
        "val": 1
      }
    ],
    "description": "VUELO (Puede ignorar criaturas con Provocar y atacar al Reino). GRITO DE GUERRA: Inflige 2 de daño a todas las criaturas enemigas. GRITO DE GUERRA: Revive 1 criatura(s) aleatoria(s) del cementerio a tu campo.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_13",
    "image": "assets/cards/carta_13.png",
    "name": "Buitre Esqueleto",
    "type": "Buitre",
    "subtype": "Zombi",
    "cost": 1,
    "attack": 2,
    "hp": 3,
    "keywords": [
      "VUELO"
    ],
    "battlecry": {
      "type": "SEARCH_DECK",
      "val": "Buitre"
    },
    "description": "VUELO (Puede ignorar criaturas con Provocar y atacar al Reino). GRITO DE GUERRA: Busca y roba Buitre carta(s) de tu mazo.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_14",
    "image": "assets/cards/carta_14.png",
    "name": "Chaman del cielo",
    "type": "Buitre",
    "subtype": "Zombi",
    "cost": 2,
    "attack": 2,
    "hp": 4,
    "keywords": [],
    "battlecry": {
      "type": "HEAL_ALL_FRIENDLIES",
      "val": 2
    },
    "description": "VUELO (Puede ignorar criaturas con Provocar y atacar al Reino). GRITO DE GUERRA: Restaura +2 de salud a todas tus criaturas aliadas.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_15",
    "image": "assets/cards/carta_15.png",
    "name": "Caballero Calavera",
    "type": "Buitre",
    "subtype": "Zombi",
    "cost": 3,
    "attack": 5,
    "hp": 1,
    "keywords": [
      "VUELO",
      "PRISA"
    ],
    "description": "VUELO (Puede ignorar criaturas con Provocar y atacar al Reino). PRISA (Puede atacar inmediatamente en el turno que es invocada).",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_16",
    "image": "assets/cards/carta_16.png",
    "name": "Hechizero Nocturno",
    "type": "Buitre",
    "subtype": "Zombi",
    "cost": 4,
    "attack": 3,
    "hp": 5,
    "keywords": [
      "VUELO"
    ],
    "battlecry": [
      {
        "type": "SEARCH_DECK",
        "val": "HECHIZO"
      },
      {
        "type": "REVIVE_RANDOM_CREATURE",
        "val": 1
      }
    ],
    "description": "VUELO (Puede ignorar criaturas con Provocar y atacar al Reino). GRITO DE GUERRA: Busca y roba HECHIZO carta(s) de tu mazo. GRITO DE GUERRA: Revive 1 criatura(s) aleatoria(s) del cementerio a tu campo.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_17",
    "image": "assets/cards/carta_17.png",
    "name": "Nigromante Rapaz",
    "type": "Buitre",
    "subtype": "Zombi",
    "isExtra": false,
    "cost": 6,
    "attack": 5,
    "hp": 6,
    "keywords": [
      "VUELO"
    ],
    "battlecry": {
      "type": "REVIVE_RANDOM_CREATURE",
      "val": 2
    },
    "description": "COMANDANTE LEYENDA (Deck Extra). VUELO (Puede ignorar criaturas con Provocar y atacar al Reino). GRITO DE GUERRA: Revive 2 criatura(s) aleatoria(s) del cementerio a tu campo.",
    "isStarter": false
  },
  {
    "id": "s1_18",
    "image": "assets/cards/carta_18.png",
    "name": "Guerrero Caparazón",
    "type": "Tortuga",
    "subtype": "Guerrero",
    "isExtra": false,
    "cost": 5,
    "attack": 3,
    "hp": 10,
    "keywords": [
      "PROVOCAR",
      "ESCUDO"
    ],
    "battlecry": {
      "type": "BUFF_ALL_FRIENDLIES_HP",
      "val": 3
    },
    "description": "PROVOCAR (Los enemigos deben atacar a esta criatura primero). ESCUDO (Protege del primer impacto de daño). GRITO DE GUERRA: Aumenta la salud de todas tus criaturas aliadas en +3 HP.",
    "isStarter": false
  },
  {
    "id": "s1_19",
    "image": "assets/cards/carta_19.png",
    "name": "Bestia Tortuga",
    "type": "Tortuga",
    "subtype": "Guerrero",
    "cost": 1,
    "attack": 1,
    "hp": 4,
    "keywords": [
      "PROVOCAR"
    ],
    "description": "PROVOCAR (Los enemigos deben atacar a esta criatura primero).",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_20",
    "image": "assets/cards/carta_20.png",
    "name": "Caballero Heroico",
    "type": "Tortuga",
    "subtype": "Guerrero",
    "cost": 1,
    "attack": 1,
    "hp": 4,
    "keywords": [
      "ESCUDO"
    ],
    "description": "PROVOCAR (Los enemigos deben atacar a esta criatura primero). ESCUDO (Protege del primer impacto de daño).",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_21",
    "image": "assets/cards/carta_21.png",
    "name": "Laud Hechizero",
    "type": "Tortuga",
    "subtype": "Mago",
    "cost": 3,
    "attack": 1,
    "hp": 6,
    "keywords": [
      "PROVOCAR"
    ],
    "battlecry": {
      "type": "SEARCH_DECK",
      "val": "Tortuga"
    },
    "description": "PROVOCAR (Los enemigos deben atacar a esta criatura primero). GRITO DE GUERRA: Restaura +5 de salud a tu Reino.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_22",
    "image": "assets/cards/carta_22.png",
    "name": "Escudero Honorable",
    "type": "Tortuga",
    "subtype": "Guerrero",
    "cost": 4,
    "attack": 2,
    "hp": 7,
    "keywords": [
      "PROVOCAR",
    ],
    "description": "PROVOCAR (Los enemigos deben atacar a esta criatura primero). ESCUDO (Protege del primer impacto de daño).",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_23",
    "image": "assets/cards/carta_23.png",
    "name": "Guerrero Tortuga",
    "type": "Tortuga",
    "subtype": "Guerrero",
    "cost": 5,
    "attack": 3,
    "hp": 8,
    "keywords": [
      "PROVOCAR"
    ],
    "battlecry": {
      "type": "HEAL_ALL_FRIENDLIES",
      "val": 2
    },
    "description": "PROVOCAR (Los enemigos deben atacar a esta criatura primero). GRITO DE GUERRA: Restaura +2 de salud a todas tus criaturas aliadas.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_24",
    "image": "assets/cards/carta_24.png",
    "name": "Defensor Valiente",
    "type": "Tortuga",
    "subtype": "Guerrero",
    "cost": 7,
    "attack": 4,
    "hp": 9,
    "keywords": [
      "ESCUDO"
    ],
    "battlecry": {
      "type": "BUFF_ALL_FRIENDLIES_HP",
      "val": 2
    },
    "description": "PROVOCAR (Los enemigos deben atacar a esta criatura primero). ESCUDO (Protege del primer impacto de daño). GRITO DE GUERRA: Aumenta la salud de todas tus criaturas aliadas en +2 HP.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_25",
    "image": "assets/cards/carta_25.png",
    "name": "Arquero Mapache",
    "type": "Mapache",
    "subtype": "Tirador",
    "cost": 1,
    "attack": 2,
    "hp": 1,
    "keywords": [],
    "battlecry": {
      "type": "DAMAGE_TARGET",
      "val": 2
    },
    "description": "GRITO DE GUERRA: Inflige 2 de daño al objetivo elegido.",
    "isExtra": false,
    "isStarter": true
  },
  {
    "id": "s1_26",
    "image": "assets/cards/carta_26.png",
    "name": "Heroe Mapache",
    "type": "Mapache",
    "subtype": "Normal",
    "cost": 1,
    "attack": 3,
    "hp": 3,
    "keywords": [],
    "battlecry": {
      "type": "SUMMON_RANDOM_FROM_HAND",
      "maxCost": 4
    },
    "description": "GRITO DE GUERRA: Otorga +1 de Ataque a todas tus criaturas aliadas.",
    "isExtra": false,
    "isStarter": true
  },
  {
    "id": "s1_27",
    "image": "assets/cards/carta_27.png",
    "name": "Clérigo Mapache",
    "type": "Mapache",
    "subtype": "Chamán",
    "cost": 2,
    "attack": 2,
    "hp": 4,
    "keywords": [],
    "battlecry": {
      "type": "HEAL_ALL_FRIENDLIES",
      "val": 2
    },
    "description": "GRITO DE GUERRA: Restaura +2 de salud a todas tus criaturas aliadas.",
    "isExtra": false,
    "isStarter": true
  },
  {
    "id": "s1_28",
    "image": "assets/cards/carta_28.png",
    "name": "Escudero Mapache",
    "type": "Mapache",
    "subtype": "Guerrero",
    "cost": 3,
    "attack": 1,
    "hp": 6,
    "keywords": [
      "PROVOCAR"
    ],
    "description": "PROVOCAR (Los enemigos deben atacar a esta criatura primero).",
    "isExtra": false,
    "isStarter": true
  },
  {
    "id": "s1_29",
    "image": "assets/cards/carta_29.png",
    "name": "Estratega Mapache",
    "type": "Mapache",
    "subtype": "Normal",
    "cost": 1,
    "attack": 2,
    "hp": 2,
    "keywords": [],
    "battlecry": {
      "type": "SEARCH_DECK",
      "val": "Mapache"
    },
    "description": "GRITO DE GUERRA: Busca y roba Mapache carta(s) de tu mazo.",
    "isExtra": false,
    "isStarter": true
  },
  {
    "id": "s1_30",
    "image": "assets/cards/carta_30.png",
    "name": "Bandido Mapache",
    "type": "Mapache",
    "subtype": "Bandido",
    "isExtra": false,
    "cost": 4,
    "attack": 6,
    "hp": 8,
    "keywords": [
      "PRISA",
      "VENENO"
    ],
    "description": "COMANDANTE LEYENDA (Deck Extra). VENENO (Destruye instantáneamente a cualquier criatura a la que dañe). PRISA (Puede atacar inmediatamente en el turno que es invocada).",
    "isStarter": true
  },
  {
    "id": "s1_31",
    "image": "assets/cards/carta_31.png",
    "name": "Cuerno Viejo",
    "type": "Toro",
    "subtype": "Normal",
    "cost": 1,
    "attack": 1,
    "hp": 4,
    "keywords": [],
    "battlecry": {
      "type": "SUMMON_RANDOM_FROM_HAND",
      "maxCost": 3
    },
    "description": "PROVOCAR (Los enemigos deben atacar a esta criatura primero).",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_32",
    "image": "assets/cards/carta_32.png",
    "name": "Vaca loca",
    "type": "Toro",
    "subtype": "Tirador",
    "cost": 1,
    "attack": 2,
    "hp": 3,
    "keywords": [],
    "battlecry": {
      "type": "DAMAGE_TARGET",
      "val": 2
    },
    "description": "GRITO DE GUERRA: Inflige 2 de daño al objetivo elegido.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_33",
    "image": "assets/cards/carta_33.png",
    "name": "Sheriff Cuernos",
    "type": "Toro",
    "subtype": "Tirador",
    "cost": 3,
    "attack": 3,
    "hp": 5,
    "keywords": [
      "PROVOCAR",
      "DOBLE_ATAQUE"
    ],
    "battlecry": {
      "type": "DAMAGE_TARGET",
      "val": 1
    },
    "description": "PROVOCAR (Los enemigos deben atacar a esta criatura primero). DOBLE ATAQUE (Puede realizar 2 ataques por turno). GRITO DE GUERRA: Inflige 1 de daño al objetivo elegido.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_34",
    "image": "assets/cards/carta_34.png",
    "name": "Billy the Bull",
    "type": "Toro",
    "subtype": "Tirador",
    "cost": 3,
    "attack": 4,
    "hp": 4,
    "keywords": [
      "PRISA"
    ],
    "battlecry": {
      "type": "DAMAGE_ENEMY_HIVE",
      "val": 2
    },
    "description": "PRISA (Puede atacar inmediatamente en el turno que es invocada). GRITO DE GUERRA: Inflige 2 de daño directo al Reino enemigo.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_35",
    "image": "assets/cards/carta_35.png",
    "name": "Buffalo Jhonson",
    "type": "Toro",
    "subtype": "Tirador",
    "isExtra": false,
    "cost": 6,
    "attack": 5,
    "hp": 8,
    "keywords": [
      "PROVOCAR",
      "ESCUDO",
      "DOBLE_ATAQUE"
    ],
    "description": "COMANDANTE LEYENDA (Deck Extra). PROVOCAR (Los enemigos deben atacar a esta criatura primero). ESCUDO (Protege del primer impacto de daño). DOBLE ATAQUE (Puede realizar 2 ataques por turno).",
    "isStarter": false
  },
  {
    "id": "s1_36",
    "image": "assets/cards/carta_36.png",
    "name": "Forajido Toro",
    "type": "Toro",
    "subtype": "Tirador",
    "cost": 5,
    "attack": 5,
    "hp": 6,
    "keywords": [],
    "battlecry": {
      "type": "DESTROY_TARGET_CREATURE",
      "val": 1
    },
    "description": "GRITO DE GUERRA: Destruye instantáneamente a una criatura enemiga elegida.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_37",
    "image": "assets/cards/carta_37.png",
    "name": "Falconforce Raptor",
    "type": "Halcón",
    "subtype": "Chamán",
    "cost": 2,
    "attack": 2,
    "hp": 3,
    "keywords": [
      "VUELO"
    ],
    "battlecry": {
      "type": "HEAL_HIVE",
      "val": 4
    },
    "description": "VUELO (Puede ignorar criaturas con Provocar y atacar al Reino). GRITO DE GUERRA: Restaura +4 de salud a tu Reino.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_38",
    "image": "assets/cards/carta_38.png",
    "name": "Falconforce Typhoon",
    "type": "Halcón",
    "subtype": "Tirador",
    "cost": 1,
    "attack": 3,
    "hp": 2,
    "keywords": [
      "VUELO"
    ],
    "battlecry": {
      "type": "DAMAGE_TARGET",
      "val": 3
    },
    "description": "VUELO (Puede ignorar criaturas con Provocar y atacar al Reino). GRITO DE GUERRA: Inflige 3 de daño al objetivo elegido.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_39",
    "image": "assets/cards/carta_39.png",
    "name": "Falconforce Hornet",
    "type": "Halcón",
    "subtype": "Luchador",
    "cost": 2,
    "attack": 3,
    "hp": 4,
    "keywords": [
      "VUELO",
      "PRISA"
    ],
    "description": "VUELO (Puede ignorar criaturas con Provocar y atacar al Reino). PRISA (Puede atacar inmediatamente en el turno que es invocada).",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_40",
    "image": "assets/cards/carta_40.png",
    "name": "Falconforce Rafale",
    "type": "Halcón",
    "subtype": "Luchador",
    "cost": 3,
    "attack": 4,
    "hp": 4,
    "keywords": [
      "VUELO"
    ],
    "battlecry": {
      "type": "DAMAGE_ENEMY_HIVE",
      "val": 2
    },
    "description": "VUELO (Puede ignorar criaturas con Provocar y atacar al Reino). GRITO DE GUERRA: Inflige 2 de daño directo al Reino enemigo.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_41",
    "image": "assets/cards/carta_41.png",
    "name": "Falconforce Sabre",
    "type": "Halcón",
    "subtype": "Tirador",
    "cost": 5,
    "attack": 4,
    "hp": 3,
    "keywords": [
      "VUELO"
    ],
    "battlecry": {
      "type": "DAMAGE_TARGET",
      "val": 4
    },
    "description": "VUELO (Puede ignorar criaturas con Provocar y atacar al Reino). GRITO DE GUERRA: Inflige 4 de daño al objetivo elegido.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_42",
    "image": "assets/cards/carta_42.png",
    "name": "Falconforce Corsair",
    "type": "Halcón",
    "subtype": "Luchador",
    "cost": 5,
    "attack": 5,
    "hp": 5,
    "keywords": [
      "VUELO",
      "PRISA"
    ],
    "description": "VUELO (Puede ignorar criaturas con Provocar y atacar al Reino). PRISA (Puede atacar inmediatamente en el turno que es invocada).",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_43",
    "image": "assets/cards/carta_43.png",
    "name": "Falconforce Hellcat",
    "type": "Halcón",
    "subtype": "Luchador",
    "isExtra": false,
    "cost": 6,
    "attack": 6,
    "hp": 6,
    "keywords": [
      "VUELO",
      "PRISA"
    ],
    "battlecry": {
      "type": "BUFF_ALL_FRIENDLIES_ATK",
      "val": 1
    },
    "description": "COMANDANTE LEYENDA (Deck Extra). VUELO (Puede ignorar criaturas con Provocar y atacar al Reino). PRISA (Puede atacar inmediatamente en el turno que es invocada). GRITO DE GUERRA: Otorga +1 de Ataque a todas tus criaturas aliadas.",
    "isStarter": false
  },
  {
    "id": "s1_44",
    "image": "assets/cards/carta_44.png",
    "name": "Bandido del Coral",
    "type": "Pulpo",
    "subtype": "Bandido",
    "cost": 1,
    "attack": 2,
    "hp": 3,
    "keywords": [
      "VENENO"
    ],
    "battlecry": {
      "type": "SEARCH_DECK",
      "val": "VENENO"
    },
    "description": "VENENO (Destruye instantáneamente a cualquier criatura a la que dañe). GRITO DE GUERRA: Busca y roba VENENO carta(s) de tu mazo.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_45",
    "image": "assets/cards/carta_45.png",
    "name": "General Samurai",
    "type": "Pulpo",
    "subtype": "Guerrero",
    "cost": 5,
    "attack": 4,
    "hp": 6,
    "keywords": [
      "VENENO",
      "PROVOCAR"
    ],
    "battlecry": {
      "type": "BUFF_ALL_FRIENDLIES_ATK",
      "val": 1
    },
    "description": "COMANDANTE LEYENDA (Deck Extra). PROVOCAR (Los enemigos deben atacar a esta criatura primero). VENENO (Destruye instantáneamente a cualquier criatura a la que dañe). GRITO DE GUERRA: Otorga +1 de Ataque a todas tus criaturas aliadas.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_46",
    "image": "assets/cards/carta_46.png",
    "name": "Ronin del Sur",
    "type": "Pulpo",
    "subtype": "Guerrero",
    "cost": 3,
    "attack": 3,
    "hp": 3,
    "keywords": [
      "VENENO"
    ],
    "description": "VENENO (Destruye instantáneamente a cualquier criatura a la que dañe).",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_47",
    "image": "assets/cards/carta_47.png",
    "name": "Ronin del Norte",
    "type": "Pulpo",
    "subtype": "Guerrero",
    "cost": 4,
    "attack": 3,
    "hp": 5,
    "keywords": [
      "VENENO"
    ],
    "description": "VENENO (Destruye instantáneamente a cualquier criatura a la que dañe).",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_48",
    "image": "assets/cards/carta_48.png",
    "name": "Ninja Marino",
    "type": "Pulpo",
    "subtype": "Bandido",
    "cost": 3,
    "attack": 1,
    "hp": 3,
    "keywords": [
      "VENENO"
    ],
    "battlecry": {
      "type": "DAMAGE_ENEMY_HIVE",
      "val": 2
    },
    "description": "VENENO (Destruye instantáneamente a cualquier criatura a la que dañe). GRITO DE GUERRA: Inflige 2 de daño directo al Reino enemigo.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_49",
    "image": "assets/cards/carta_49.png",
    "name": "Sharksenal Tigre",
    "type": "Tiburón",
    "subtype": "Tirador",
    "cost": 2,
    "attack": 4,
    "hp": 3,
    "keywords": [
      "PRISA"
    ],
    "battlecry": {
      "type": "DAMAGE_TARGET",
      "val": 2
    },
    "description": "PRISA (Puede atacar inmediatamente en el turno que es invocada). GRITO DE GUERRA: Inflige 2 de daño al objetivo elegido.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_50",
    "image": "assets/cards/carta_50.png",
    "name": "Sharksenal Terror",
    "type": "Tiburón",
    "subtype": "Tirador",
    "cost": 4,
    "attack": 4,
    "hp": 5,
    "keywords": [
      "ESCUDO"
    ],
    "battlecry": {
      "type": "DAMAGE_ALL_ENEMIES",
      "val": 2
    },
    "description": "ESCUDO (Protege del primer impacto de daño). GRITO DE GUERRA: Inflige 2 de daño a todas las criaturas enemigas.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_51",
    "image": "assets/cards/carta_51.png",
    "name": "Sharksenal Martillo",
    "type": "Tiburón",
    "subtype": "Tirador",
    "cost": 4,
    "attack": 4,
    "hp": 4,
    "keywords": [
      "PROVOCAR"
    ],
    "battlecry": {
      "type": "DESTROY_TARGET_CREATURE",
      "val": 1
    },
    "description": "PROVOCAR (Los enemigos deben atacar a esta criatura primero). GRITO DE GUERRA: Destruye instantáneamente a una criatura enemiga elegida.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_52",
    "image": "assets/cards/carta_52.png",
    "name": "Sharksenal Enfermero",
    "type": "Tiburón",
    "subtype": "Tirador",
    "cost": 2,
    "attack": 2,
    "hp": 4,
    "keywords": [
      "ESCUDO"
    ],
    "battlecry": {
      "type": "HEAL_ALL_FRIENDLIES",
      "val": 2
    },
    "description": "ESCUDO (Protege del primer impacto de daño). GRITO DE GUERRA: Restaura +2 de salud a todas tus criaturas aliadas.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_53",
    "image": "assets/cards/carta_53.png",
    "name": "Sharksenal Ballena",
    "type": "Tiburón",
    "subtype": "Tirador",
    "isExtra": false,
    "cost": 7,
    "attack": 6,
    "hp": 8,
    "keywords": [
      "PROVOCAR",
      "ESCUDO"
    ],
    "battlecry": [
      {
        "type": "DAMAGE_ALL_ENEMIES",
        "val": 2
      },
      {
        "type": "DAMAGE_ENEMY_HIVE",
        "val": 2
      }
    ],
    "description": "COMANDANTE LEYENDA (Deck Extra). PROVOCAR (Los enemigos deben atacar a esta criatura primero). ESCUDO (Protege del primer impacto de daño). GRITO DE GUERRA: Inflige 2 de daño a todas las criaturas enemigas. GRITO DE GUERRA: Inflige 2 de daño directo al Reino enemigo.",
    "isStarter": false
  },
  {
    "id": "s1_54",
    "image": "assets/cards/carta_54.png",
    "name": "Sharksenal Azul",
    "type": "Tiburón",
    "subtype": "Tirador",
    "cost": 1,
    "attack": 3,
    "hp": 2,
    "keywords": [
      "PRISA"
    ],
    "battlecry": {
      "type": "DAMAGE_ENEMY_HIVE",
      "val": 3
    },
    "description": "PRISA (Puede atacar inmediatamente en el turno que es invocada). GRITO DE GUERRA: Inflige 3 de daño directo al Reino enemigo.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_55",
    "image": "assets/cards/carta_55.png",
    "name": "Escudero Primitivo",
    "type": "Dinosaurio",
    "subtype": "Guerrero",
    "cost": 1,
    "attack": 1,
    "hp": 6,
    "keywords": [
      "PROVOCAR"
    ],
    "description": "COMANDANTE LEYENDA (Deck Extra). PROVOCAR (Los enemigos deben atacar a esta criatura primero).",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_56",
    "image": "assets/cards/carta_56.png",
    "name": "Luchador Prehistorico",
    "type": "Dinosaurio",
    "subtype": "Luchador",
    "cost": 3,
    "attack": 4,
    "hp": 4,
    "keywords": [],
    "battlecry": {
      "type": "DAMAGE_TARGET",
      "val": 4
    },
    "description": "COMANDANTE LEYENDA (Deck Extra). GRITO DE GUERRA: Inflige 5 de daño al objetivo elegido.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_57",
    "image": "assets/cards/carta_57.png",
    "name": "Tirano Aereo",
    "type": "Dinosaurio",
    "subtype": "Tirador",
    "cost": 2,
    "attack": 3,
    "hp": 1,
    "keywords": [
      "VUELO"
    ],
    "battlecry": {
      "type": "DAMAGE_ENEMY_HIVE",
      "val": 4
    },
    "description": "COMANDANTE LEYENDA (Deck Extra). VUELO (Puede ignorar criaturas con Provocar y atacar al Reino). GRITO DE GUERRA: Inflige 8 de daño directo al Reino enemigo.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_58",
    "image": "assets/cards/carta_58.png",
    "name": "Caballero Rex",
    "type": "Dinosaurio",
    "subtype": "Guerrero",
    "isExtra": false,
    "cost": 6,
    "attack": 10,
    "hp": 10,
    "keywords": [],
    "description": "",
    "isStarter": false
  },
  {
    "id": "s1_59",
    "image": "assets/cards/carta_59.png",
    "name": "Bronto Destructor",
    "type": "Dinosaurio",
    "subtype": "Guerrero",
    "cost": 4,
    "attack": 6,
    "hp": 7,
    "keywords": [],
    "battlecry": {
      "type": "BUFF_ALL_FRIENDLIES_ATK",
      "val": 3
    },
    "description": "ESCUDO (Protege del primer impacto de daño).",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_60",
    "image": "assets/cards/carta_60.png",
    "name": "Aniquilador Antiguo",
    "type": "Dinosaurio",
    "subtype": "Guerrero",
    "cost": 4,
    "attack": 3,
    "hp": 8,
    "keywords": [
      "ESCUDO"
    ],
    "description": "COMANDANTE LEYENDA (Deck Extra). PROVOCAR (Los enemigos deben atacar a esta criatura primero).",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_61",
    "image": "assets/cards/carta_61.png",
    "name": "Cabeza de Hoz",
    "type": "Dinosaurio",
    "subtype": "Guerrero",
    "cost": 3,
    "attack": 2,
    "hp": 4,
    "keywords": [],
    "battlecry": {
      "type": "SUMMON_RANDOM_FROM_HAND",
      "maxCost": 5
    },
    "description": "COMANDANTE LEYENDA (Deck Extra). PRISA (Puede atacar inmediatamente en el turno que es invocada).",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_62",
    "image": "assets/cards/carta_62.png",
    "name": "Escapitan Carabajo",
    "type": "Insecto",
    "subtype": "Guerrero",
    "isExtra": false,
    "cost": 6,
    "attack": 6,
    "hp": 8,
    "keywords": [
      "ESCUDO",
      "PROVOCAR"
    ],
    "description": "COMANDANTE LEYENDA (Deck Extra). PROVOCAR (Los enemigos deben atacar a esta criatura primero). ESCUDO (Protege del primer impacto de daño).",
    "isStarter": false
  },
  {
    "id": "s1_63",
    "image": "assets/cards/carta_63.png",
    "name": "Generantis",
    "type": "Insecto",
    "subtype": "Guerrero",
    "cost": 4,
    "attack": 5,
    "hp": 4,
    "keywords": [
      "PRISA"
    ],
    "battlecry": {
      "type": "DAMAGE_TARGET",
      "val": 2
    },
    "description": "PRISA (Puede atacar inmediatamente en el turno que es invocada). GRITO DE GUERRA: Inflige 2 de daño al objetivo elegido.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_64",
    "image": "assets/cards/carta_64.png",
    "name": "Liberador Belula",
    "type": "Insecto",
    "subtype": "Tirador",
    "cost": 1,
    "attack": 3,
    "hp": 3,
    "keywords": [
      "VUELO"
    ],
    "battlecry": {
      "type": "DAMAGE_TARGET",
      "val": 2
    },
    "description": "VUELO (Puede ignorar criaturas con Provocar y atacar al Reino). GRITO DE GUERRA: Inflige 2 de daño al objetivo elegido.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_65",
    "image": "assets/cards/carta_65.png",
    "name": "Monarca",
    "type": "Insecto",
    "subtype": "Tirador",
    "cost": 2,
    "attack": 4,
    "hp": 4,
    "keywords": [
      "VUELO"
    ],
    "battlecry": {
      "type": "DAMAGE_ENEMY_HIVE",
      "val": 3
    },
    "description": "VUELO (Puede ignorar criaturas con Provocar y atacar al Reino). GRITO DE GUERRA: Inflige 3 de daño directo al Reino enemigo.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_66",
    "image": "assets/cards/carta_66.png",
    "name": "Capolilla",
    "type": "Insecto",
    "subtype": "Tirador",
    "cost": 1,
    "attack": 2,
    "hp": 3,
    "keywords": [
      "PRISA"
    ],
    "battlecry": [
      {
        "type": "GAIN_NECTAR",
        "val": 1
      },
      {
        "type": "SEARCH_DECK",
        "val": "Insecto"
      }
    ],
    "description": "PRISA (Puede atacar inmediatamente en el turno que es invocada). GRITO DE GUERRA: Otorga +1 de Energía en este turno. GRITO DE GUERRA: Busca y roba Insecto carta(s) de tu mazo.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_67",
    "image": "assets/cards/carta_67.png",
    "name": "Avispatron",
    "type": "Insecto",
    "subtype": "Bandido",
    "cost": 3,
    "attack": 6,
    "hp": 1,
    "keywords": [
      "VENENO",
      "VUELO",
      "PRISA"
    ],
    "description": "VUELO (Puede ignorar criaturas con Provocar y atacar al Reino). VENENO (Destruye instantáneamente a cualquier criatura a la que dañe). PRISA (Puede atacar inmediatamente en el turno que es invocada).",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_68",
    "name": "Augurio de la peste",
    "cost": 3,
    "attack": 4,
    "hp": 5,
    "image": "assets/cards/carta_68.png",
    "keywords": [
      "VUELO",
      "VENENO"
    ],
    "description": "VUELO (Puede ignorar criaturas con Provocar y atacar al Reino). VENENO (Destruye instantáneamente a cualquier criatura a la que dañe). GRITO DE GUERRA: Inflige 2 de daño al objetivo elegido.",
    "battlecry": {
      "type": "DAMAGE_TARGET",
      "val": 2
    },
    "type": "Cuervo",
    "subtype": "Normal",
    "hidden": true,
    "isStarter": false
  },
  {
    "id": "s1_69",
    "name": "Cirujano de almas",
    "cost": 4,
    "attack": 3,
    "hp": 4,
    "image": "assets/cards/carta_69.png",
    "keywords": [
      "PRISA",
      "PROVOCAR"
    ],
    "description": "PROVOCAR (Los enemigos deben atacar a esta criatura primero). PRISA (Puede atacar inmediatamente en el turno que es invocada).",
    "type": "Cuervo",
    "subtype": "Guerrero",
    "hidden": true,
    "isStarter": false
  },
  {
    "id": "s1_70",
    "name": "Curandero malicioso",
    "cost": 7,
    "attack": 7,
    "hp": 8,
    "image": "assets/cards/carta_70.png",
    "keywords": [
      "PRISA",
      "ESCUDO"
    ],
    "description": "ESCUDO (Protege del primer impacto de daño). PRISA (Puede atacar inmediatamente en el turno que es invocada). GRITO DE GUERRA: Destruye instantáneamente a una criatura enemiga elegida.",
    "battlecry": {
      "type": "DESTROY_TARGET_CREATURE"
    },
    "type": "Cuervo",
    "subtype": "Guerrero",
    "hidden": true,
    "isStarter": false
  },
  {
    "id": "s1_71",
    "name": "Enfermero Espectral",
    "cost": 6,
    "attack": 7,
    "hp": 8,
    "image": "assets/cards/carta_71.png",
    "keywords": [
      "PRISA"
    ],
    "description": "PRISA (Puede atacar inmediatamente en el turno que es invocada).",
    "type": "Cuervo",
    "subtype": "Guerrero",
    "hidden": true,
    "isStarter": false
  },
  {
    "id": "s1_72",
    "name": "Gorilla de Combate",
    "cost": 1,
    "attack": 1,
    "hp": 1,
    "image": "assets/cards/carta_72.png",
    "keywords": [
      "PROVOCAR"
    ],
    "description": "COMANDANTE LEYENDA (Deck Extra). PROVOCAR (Los enemigos deben atacar a esta criatura primero). GRITO DE GUERRA: Restaura +5 de salud a tu Reino.",
    "battlecry": {
      "type": "HEAL_HIVE",
      "val": 5
    },
    "type": "Primate",
    "subtype": "Luchador",
    "isExtra": false,
    "hidden": true,
    "isStarter": false
  },
  {
    "id": "s1_73",
    "name": "Cyber Chimpance",
    "cost": 2,
    "attack": 2,
    "hp": 3,
    "image": "assets/cards/carta_73.png",
    "keywords": [
      "VUELO"
    ],
    "description": "VUELO (Puede ignorar criaturas con Provocar y atacar al Reino).",
    "type": "Primate",
    "subtype": "Luchador",
    "hidden": true,
    "isStarter": false
  },
  {
    "id": "s1_74",
    "name": "Capitan Orangutan",
    "cost": 3,
    "attack": 4,
    "hp": 5,
    "image": "assets/cards/carta_74.png",
    "keywords": [
      "VENENO"
    ],
    "description": "VENENO (Destruye instantáneamente a cualquier criatura a la que dañe). GRITO DE GUERRA: Inflige 2 de daño a todas las criaturas enemigas.",
    "battlecry": {
      "type": "DAMAGE_ALL_ENEMIES",
      "val": 2
    },
    "type": "Primate",
    "subtype": "Luchador",
    "hidden": true,
    "isStarter": false
  },
  {
    "id": "s1_75",
    "name": "Dr Bonobo",
    "cost": 4,
    "attack": 3,
    "hp": 4,
    "image": "assets/cards/carta_75.png",
    "keywords": [
      "ESCUDO"
    ],
    "description": "ESCUDO (Protege del primer impacto de daño).",
    "type": "Primate",
    "subtype": "Tirador",
    "hidden": true,
    "isStarter": false
  },
  {
    "id": "s1_76",
    "name": "Robo Mandril",
    "cost": 5,
    "attack": 5,
    "hp": 6,
    "image": "assets/cards/carta_76.png",
    "keywords": [
      "PRISA",
      "ESCUDO"
    ],
    "description": "ESCUDO (Protege del primer impacto de daño). PRISA (Puede atacar inmediatamente en el turno que es invocada). GRITO DE GUERRA: Inflige 3 de daño directo al Reino enemigo.",
    "battlecry": {
      "type": "DAMAGE_ENEMY_HIVE",
      "val": 3
    },
    "type": "Primate",
    "subtype": "Tirador",
    "hidden": true,
    "isStarter": false
  },
  {
    "id": "s1_77",
    "name": "Risa Macabra",
    "cost": 4,
    "attack": 4,
    "hp": 5,
    "image": "assets/cards/carta_77.png",
    "keywords": [
      "ESCUDO"
    ],
    "description": "ESCUDO (Protege del primer impacto de daño).",
    "type": "Hyena",
    "subtype": "Luchador",
    "hidden": true,
    "isStarter": false
  },
  {
    "id": "s1_78",
    "name": "Carcajada Siniestra",
    "cost": 1,
    "attack": 1,
    "hp": 2,
    "image": "assets/cards/carta_78.png",
    "keywords": [
      "PRISA"
    ],
    "description": "PRISA (Puede atacar inmediatamente en el turno que es invocada).",
    "type": "Hyena",
    "subtype": "Bandido",
    "hidden": true,
    "isStarter": false
  },
  {
    "id": "s1_79",
    "name": "Bromista Desquiciado",
    "cost": 2,
    "attack": 2,
    "hp": 3,
    "image": "assets/cards/carta_79.png",
    "keywords": [
      "PROVOCAR"
    ],
    "description": "PROVOCAR (Los enemigos deben atacar a esta criatura primero).",
    "type": "Hyena",
    "subtype": "Bandido",
    "hidden": true,
    "isStarter": false
  },
  {
    "id": "s1_80",
    "name": "Bestia Payaso",
    "cost": 5,
    "attack": 5,
    "hp": 6,
    "image": "assets/cards/carta_80.png",
    "keywords": [
      "PROVOCAR"
    ],
    "description": "PROVOCAR (Los enemigos deben atacar a esta criatura primero).",
    "type": "Hyena",
    "subtype": "Luchador",
    "hidden": true,
    "isStarter": false
  },
  {
    "id": "s1_81",
    "name": "Payaso Asesino",
    "cost": 3,
    "attack": 3,
    "hp": 4,
    "image": "assets/cards/carta_81.png",
    "keywords": [
      "PRISA"
    ],
    "description": "PRISA (Puede atacar inmediatamente en el turno que es invocada).",
    "type": "Hyena",
    "subtype": "Guerrero",
    "hidden": true,
    "isStarter": false
  },
  {
    "id": "s1_82",
    "name": "Jefe de Payasos",
    "cost": 6,
    "attack": 6,
    "hp": 6,
    "image": "assets/cards/carta_82.png",
    "keywords": [
      "PRISA",
      "PROVOCAR"
    ],
    "description": "COMANDANTE LEYENDA (Deck Extra). PROVOCAR (Los enemigos deben atacar a esta criatura primero). PRISA (Puede atacar inmediatamente en el turno que es invocada).",
    "type": "Hyena",
    "subtype": "Guerrero",
    "hidden": true,
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_83",
    "image": "assets/cards/carta_83.png",
    "name": "Caballero Dragon",
    "type": "Dragón",
    "subtype": "Guerrero",
    "cost": 1,
    "attack": 3,
    "hp": 4,
    "keywords": [],
    "battlecry": {
      "type": "SEARCH_DECK",
      "val": "Dragon"
    },
    "description": "GRITO DE GUERRA: Busca y roba Dragon carta(s) de tu mazo.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_84",
    "image": "assets/cards/carta_84.png",
    "name": "Dragon Espectral",
    "type": "Dragón",
    "subtype": "Guerrero",
    "cost": 3,
    "attack": 4,
    "hp": 4,
    "keywords": [
      "VUELO"
    ],
    "battlecry": {
      "type": "REVIVE_RANDOM_CREATURE",
      "val": 1
    },
    "description": "VUELO (Puede ignorar criaturas con Provocar y atacar al Reino). GRITO DE GUERRA: Aumenta tu Energía máxima permanentemente en +2.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_85",
    "image": "assets/cards/carta_85.png",
    "name": "Alubion la Tempestad",
    "type": "Dragón",
    "subtype": "Guerrero",
    "isExtra": false,
    "cost": 5,
    "attack": 8,
    "hp": 8,
    "keywords": [
      "VUELO",
    ],
    "battlecry": [
      {
        "type": "DAMAGE_ALL_ENEMIES",
        "val": 6
      },
    ],
    "description": "COMANDANTE LEYENDA (Deck Extra). VUELO (Puede ignorar criaturas con Provocar y atacar al Reino). ESCUDO (Protege del primer impacto de daño). PRISA (Puede atacar inmediatamente en el turno que es invocada). GRITO DE GUERRA: Inflige 3 de daño a todas las criaturas enemigas. GRITO DE GUERRA: Roba 2 carta(s) de tu mazo.",
    "isStarter": false
  },
  {
    "id": "s1_86",
    "image": "assets/cards/carta_86.png",
    "name": "Orumon la Desolación",
    "type": "Dragón",
    "subtype": "Guerrero",
    "isExtra": false,
    "cost": 4,
    "attack": 9,
    "hp": 7,
    "keywords": [
      "VUELO",
    ],
    "battlecry": [
      {
        "type": "HEAL_ALL_FRIENDLIES",
        "val": 5
      },
    ],
    "description": "COMANDANTE LEYENDA (Deck Extra). VUELO (Puede ignorar criaturas con Provocar y atacar al Reino). PRISA (Puede atacar inmediatamente en el turno que es invocada). GRITO DE GUERRA: Inflige 5 de daño directo al Reino enemigo. GRITO DE GUERRA: Inflige 2 de daño a todas las criaturas enemigas.",
    "isStarter": false
  },
  {
    "id": "s1_87",
    "image": "assets/cards/carta_87.png",
    "name": "Eroma la Destrucción",
    "type": "Dragón",
    "subtype": "Guerrero",
    "isExtra": false,
    "cost": 4,
    "attack": 8,
    "hp": 9,
    "keywords": [
      "VUELO",
      "ESCUDO",
      "PROVOCAR"
    ],
    "battlecry": [
      {
        "type": "DESTROY_TARGET_CREATURE",
        "val": 3
      },
    ],
    "description": "COMANDANTE LEYENDA (Deck Extra). PROVOCAR (Los enemigos deben atacar a esta criatura primero). VUELO (Puede ignorar criaturas con Provocar y atacar al Reino). ESCUDO (Protege del primer impacto de daño). GRITO DE GUERRA: Destruye instantáneamente a una criatura enemiga elegida. GRITO DE GUERRA: Restaura +4 de salud a todas tus criaturas aliadas.",
    "isStarter": false
  },
  {
    "id": "s1_88",
    "image": "assets/cards/carta_88.png",
    "name": "Umire la Miseria",
    "type": "Dragón",
    "subtype": "Guerrero",
    "isExtra": false,
    "cost": 5,
    "attack": 9,
    "hp": 8,
    "keywords": [
      "VUELO",
      "PRISA",
      "VENENO"
    ],
    "battlecry": [
      {
        "type": "BUFF_ALL_FRIENDLIES_ATK",
        "val": 4
      },
    ],
    "description": "COMANDANTE LEYENDA (Deck Extra). VUELO (Puede ignorar criaturas con Provocar y atacar al Reino). VENENO (Destruye instantáneamente a cualquier criatura a la que dañe). PRISA (Puede atacar inmediatamente en el turno que es invocada). GRITO DE GUERRA: Otorga +2 de Ataque a todas tus criaturas aliadas. GRITO DE GUERRA: Restaura +5 de salud a tu Reino.",
    "isStarter": false
  },
  {
    "id": "s1_89",
    "image": "assets/cards/carta_89.png",
    "name": "Inarum la Desesperación",
    "type": "Dragón",
    "subtype": "Guerrero",
    "isExtra": false,
    "cost": 8,
    "attack": 10,
    "hp": 10,
    "keywords": [
      "VUELO",
    ],
    "battlecry": [
      {
        "type": "GAIN_NECTAR",
        "val": 2
      }
    ],
    "description": "COMANDANTE LEYENDA (Deck Extra). PROVOCAR (Los enemigos deben atacar a esta criatura primero). VUELO (Puede ignorar criaturas con Provocar y atacar al Reino). ESCUDO (Protege del primer impacto de daño). PRISA (Puede atacar inmediatamente en el turno que es invocada). GRITO DE GUERRA: Inflige 10 de daño a todas las criaturas enemigas.",
    "isStarter": false
  },
  {
    "id": "s1_90",
    "image": "assets/cards/carta_90.png",
    "name": "Jabalí Bestial",
    "type": "Jabalí",
    "subtype": "Normal",
    "cost": 1,
    "attack": 3,
    "hp": 1,
    "keywords": [
      "PRISA"
    ],
    "description": "PRISA (Puede atacar inmediatamente en el turno que es invocada).",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_91",
    "image": "assets/cards/carta_91.png",
    "name": "Lider Tribal",
    "type": "Jabalí",
    "subtype": "Guerrero",
    "isExtra": false,
    "cost": 6,
    "attack": 7,
    "hp": 6,
    "keywords": [
      "PRISA"
    ],
    "battlecry": {
      "type": "BUFF_ALL_FRIENDLIES_ATK",
      "val": 1
    },
    "description": "COMANDANTE LEYENDA (Deck Extra). PRISA (Puede atacar inmediatamente en el turno que es invocada). GRITO DE GUERRA: Otorga +1 de Ataque a todas tus criaturas aliadas.",
    "isStarter": false
  },
  {
    "id": "s1_92",
    "image": "assets/cards/carta_92.png",
    "name": "Curandero Jabalí",
    "type": "Jabalí",
    "subtype": "Chamán",
    "cost": 2,
    "attack": 2,
    "hp": 4,
    "keywords": [],
    "battlecry": {
      "type": "HEAL_HIVE",
      "val": 4
    },
    "description": "GRITO DE GUERRA: Restaura +4 de salud a tu Reino.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_93",
    "image": "assets/cards/carta_93.png",
    "name": "Chamán de la Tribu",
    "type": "Jabalí",
    "subtype": "Chamán",
    "cost": 5,
    "attack": 4,
    "hp": 5,
    "keywords": [],
    "battlecry": {
      "type": "REVIVE_RANDOM_CREATURE",
      "val": 1
    },
    "description": "GRITO DE GUERRA: Revive 1 criatura(s) aleatoria(s) del cementerio a tu campo.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_94",
    "image": "assets/cards/carta_94.png",
    "name": "Guerrero Porcino",
    "type": "Jabalí",
    "subtype": "Guerrero",
    "cost": 3,
    "attack": 3,
    "hp": 4,
    "keywords": [
      "PROVOCAR"
    ],
    "description": "PRISA (Puede atacar inmediatamente en el turno que es invocada).",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_95",
    "image": "assets/cards/carta_95.png",
    "name": "Guerrero del Lodo",
    "type": "Jabalí",
    "subtype": "Guerrero",
    "cost": 3,
    "attack": 5,
    "hp": 3,
    "keywords": [
      "PRISA"
    ],
    "battlecry": {
      "type": "DAMAGE_TARGET",
      "val": 2
    },
    "description": "PRISA (Puede atacar inmediatamente en el turno que es invocada). GRITO DE GUERRA: Inflige 2 de daño al objetivo elegido.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_96",
    "image": "assets/cards/carta_96.png",
    "name": "Barbaro Colmillo",
    "type": "Jabalí",
    "subtype": "Guerrero",
    "cost": 4,
    "attack": 6,
    "hp": 4,
    "keywords": [],
    "battlecry": {
      "type": "SUMMON_RANDOM_FROM_HAND",
      "maxCost": 4
    },
    "description": "PRISA (Puede atacar inmediatamente en el turno que es invocada).",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_97",
    "image": "assets/cards/carta_97.png",
    "name": "Campeón Porcino",
    "type": "Jabalí",
    "subtype": "Guerrero",
    "cost": 6,
    "attack": 7,
    "hp": 5,
    "keywords": [
      "PRISA"
    ],
    "battlecry": {
      "type": "DAMAGE_ENEMY_HIVE",
      "val": 3
    },
    "description": "PRISA (Puede atacar inmediatamente en el turno que es invocada). GRITO DE GUERRA: Inflige 3 de daño directo al Reino enemigo.",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "s1_98",
    "image": "assets/cards/carta_98.png",
    "name": "Colmillos de Acero",
    "type": "Jabalí",
    "subtype": "Luchador",
    "cost": 1,
    "attack": 4,
    "hp": 1,
    "keywords": [
      "PRISA"
    ],
    "description": "PRISA (Puede atacar inmediatamente en el turno que es invocada).",
    "isExtra": false,
    "isStarter": false
  },
  {
    "id": "sp_01",
    "name": "Sello Abrumador",
    "type": "Buho",
    "cost": 7,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/00buho.png",
    "battlecry": [
      {
        "type": "DAMAGE_TARGET",
        "val": 8
      },
      {
        "type": "HEAL_HIVE",
        "val": 7
      }
    ],
    "description": "HECHIZO: Inflige 3 de daño al objetivo elegido. HECHIZO: Busca y roba HECHIZO carta(s) de tu mazo.",
    "isStarter": false
  },
  {
    "id": "sp_02",
    "name": "Sello Destructivo",
    "type": "Buho",
    "cost": 6,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/01buho.png",
    "battlecry": [
      {
        "type": "DAMAGE_ALL_ENEMIES",
        "val": 4
      },
      {
        "type": "HEAL_HIVE",
        "val": 7
      }
    ],
    "description": "HECHIZO: Inflige 2 de daño a todas las criaturas enemigas. HECHIZO: Otorga +1 de Energía en este turno.",
    "isStarter": false
  },
  {
    "id": "sp_03",
    "name": "Sello Dominante",
    "type": "Buho",
    "cost": 7,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/02buho.png",
    "battlecry": [{
      "type": "DESTROY_TARGET_CREATURE",
      "val": 2
    },
    {
      "type": "HEAL_HIVE",
      "val": 7
    }],
    "description": "HECHIZO: Destruye instantáneamente a una criatura enemiga al azar.",
    "isStarter": false
  },
  {
    "id": "sp_04",
    "name": "Sello Inspirador",
    "type": "Buho",
    "cost": 6,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/03buho.png",
    "battlecry": [
      {
        "type": "DRAW_CARD",
        "val": 2
      },
      {
        "type": "BUFF_ALL_FRIENDLIES_ATK",
        "val": 5
      },
      {
        "type": "HEAL_HIVE",
        "val": 7
      }
    ],
    "description": "HECHIZO: Roba 2 carta(s) de tu mazo. HECHIZO: Otorga +1 de Ataque a todas tus criaturas aliadas.",
    "isStarter": false
  },
  {
    "id": "sp_05",
    "name": "Sello Mágico",
    "type": "Buho",
    "cost": 7,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/04buho.png",
    "battlecry": [{
      "type": "DAMAGE_ALL_ENEMIES",
      "val": 6
    },
    {
      "type": "HEAL_HIVE",
      "val": 7
    }
    ],
    "description": "HECHIZO: Otorga +2 de Energía en este turno.",
    "isStarter": false
  },
  {
    "id": "sp_06",
    "name": "Sello Renaciente",
    "type": "Buho",
    "cost": 6,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/05buho.png",
    "battlecry": [{
      "type": "REVIVE_RANDOM_CREATURE",
      "val": 2
    },
    {
      "type": "HEAL_HIVE",
      "val": 7
    }
    ],
    "description": "HECHIZO: Revive 1 criatura(s) aleatoria(s) del cementerio a tu campo.",
    "isStarter": false
  },
  {
    "id": "sp_07",
    "name": "Sello del Amor",
    "type": "Buitre",
    "cost": 2,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/06buitre.png",
    "battlecry": {
      "type": "HEAL_HIVE",
      "val": 5
    },
    "description": "HECHIZO: Restaura +5 de salud a tu Reino.",
    "isStarter": false
  },
  {
    "id": "sp_08",
    "name": "Sello Renaciente Buitre",
    "type": "Buitre",
    "cost": 3,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/07buitre.png",
    "battlecry": {
      "type": "REVIVE_RANDOM_CREATURE",
      "val": 2
    },
    "description": "HECHIZO: Revive 1 criatura(s) aleatoria(s) del cementerio a tu campo.",
    "isStarter": false
  },
  {
    "id": "sp_09",
    "name": "Tierras Alegres",
    "type": "Buitre",
    "cost": 3,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/08buitre.png",
    "battlecry": [
      {
        "type": "HEAL_ALL_FRIENDLIES",
        "val": 3
      },
      {
        "type": "HEAL_HIVE",
        "val": 5
      }
    ],
    "description": "HECHIZO: Restaura +2 de salud a todas tus criaturas aliadas. HECHIZO: Restaura +3 de salud a tu Reino.",
    "isStarter": false
  },
  {
    "id": "sp_10",
    "name": "Día de Muertos",
    "type": "Buitre",
    "cost": 5,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/09buitre.png",
    "battlecry": [
      {
        "type": "REVIVE_RANDOM_CREATURE",
        "val": 1
      },
      {
        "type": "DAMAGE_ENEMY_HIVE",
        "val": 8
      }
    ],
    "description": "HECHIZO: Revive 1 criatura(s) aleatoria(s) del cementerio a tu campo. HECHIZO: Inflige 4 de daño directo al Reino enemigo.",
    "isStarter": false
  },
  {
    "id": "sp_11",
    "name": "Arena Central",
    "type": "General",
    "cost": 2,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/sp_11.png",
    "battlecry": {
      "type": "BUFF_ALL_FRIENDLIES_ATK",
      "val": 1
    },
    "description": "HECHIZO: Otorga +1 de Ataque a todas tus criaturas aliadas.",
    "hidden": true,
    "isStarter": false
  },
  {
    "id": "sp_12",
    "name": "Muralla de Escamas",
    "type": "Dinosaurio",
    "cost": 0,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/27dinos.png",
    "isInstinct": true,
    "trigger": "ATTACK",
    "battlecry": {
      "type": "DESTROY_TARGET_CREATURE"
    },
    "description": "HECHIZO: Restaura +3 de salud a todas tus criaturas aliadas.",
    "isStarter": false
  },
  {
    "id": "sp_13",
    "name": "Imperio Primitivo",
    "type": "Dinosaurio",
    "cost": 4,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/28dinos.png",
    "battlecry": {
      "type": "DAMAGE_ENEMY_HIVE",
      "val": 5
    },
    "description": "HECHIZO: Otorga +2 de Ataque a todas tus criaturas aliadas.",
    "isStarter": false
  },
  {
    "id": "sp_14",
    "name": "Arena Prehistórica",
    "type": "Dinosaurio",
    "cost": 5,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/29dinos.png",
    "battlecry": {
      "type": "DAMAGE_ALL_ENEMIES",
      "val": 4
    },
    "description": "HECHIZO: Inflige 4 de daño al objetivo elegido.",
    "isStarter": false
  },
  {
    "id": "sp_15",
    "name": "Consilio de Saurios",
    "type": "Dinosaurio",
    "cost": 3,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/30dinos.png",
    "battlecry": {
      "type": "SEARCH_DECK",
      "val": "Dinosaurio"
    },
    "description": "HECHIZO: Busca y roba Dinosaurio carta(s) de tu mazo.",
    "isStarter": false
  },
  {
    "id": "sp_16",
    "name": "Metamorfosis",
    "type": "Insecto",
    "cost": 3,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/33insecto.png",
    "battlecry": {
      "type": "BUFF_ALL_FRIENDLIES_ATK",
      "val": 2
    },
    "description": "HECHIZO: Otorga +2 de Ataque a todas tus criaturas aliadas.",
    "isStarter": false
  },
  {
    "id": "sp_17",
    "name": "Colmena Legendaria",
    "type": "Insecto",
    "cost": 4,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/32insecto.png",
    "battlecry": {
      "type": "HEAL_HIVE",
      "val": 5
    },
    "description": "HECHIZO: Restaura +5 de salud a tu Reino.",
    "isStarter": false
  },
  {
    "id": "sp_18",
    "name": "Ejército Invertebrado",
    "type": "Insecto",
    "cost": 3,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/31insecto.png",
    "battlecry": {
      "type": "BUFF_ALL_FRIENDLIES_ATK",
      "val": 1
    },
    "description": "HECHIZO: Otorga +1 de Ataque a todas tus criaturas aliadas.",
    "isStarter": false
  },
  {
    "id": "sp_19",
    "name": "Hexoesqueleto",
    "type": "Insecto",
    "cost": 2,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/34insecto.png",
    "battlecry": {
      "type": "HEAL_HIVE",
      "val": 4
    },
    "description": "HECHIZO: Restaura +4 de salud a tu Reino.",
    "isStarter": false
  },
  {
    "id": "sp_20",
    "name": "Todo por la Reina",
    "type": "Insecto",
    "cost": 5,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/35insecto.png",
    "battlecry": {
      "type": "DAMAGE_ENEMY_HIVE",
      "val": 6
    },
    "description": "HECHIZO: Inflige 6 de daño directo al Reino enemigo.",
    "isStarter": false
  },
  {
    "id": "sp_21",
    "name": "Tribu Jabalí",
    "type": "Jabali",
    "cost": 3,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/36jabali.png",
    "battlecry": {
      "type": "BUFF_ALL_FRIENDLIES_ATK",
      "val": 2
    },
    "description": "HECHIZO: Otorga +2 de Ataque a todas tus criaturas aliadas.",
    "isStarter": false
  },
  {
    "id": "sp_22",
    "name": "Altar de Sacrificios",
    "type": "Jabali",
    "cost": 2,
    "attack": 0,
    "hp": 0,
    "image": "assets/cards/37jabali.png",
    "description": "HECHIZO: Revive 1 criatura(s) aleatoria(s) del cementerio a tu campo.",
    "isSpell": true,
    "battlecry": {
      "type": "REVIVE_RANDOM_CREATURE",
      "val": 1
    },
    "isStarter": false
  },
  {
    "id": "sp_23",
    "name": "Combate Tribal",
    "type": "Jabali",
    "cost": 3,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/38jabali.png",
    "battlecry": {
      "type": "DAMAGE_ALL_ENEMIES",
      "val": 3
    },
    "description": "HECHIZO: Inflige 3 de daño a todas las criaturas enemigas.",
    "isStarter": false
  },
  {
    "id": "sp_25",
    "name": "Plegaria Mapache",
    "type": "Mapache",
    "cost": 2,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/18mapache.png",
    "battlecry": [
      {
        "type": "HEAL_ALL_FRIENDLIES",
        "val": 3
      },
      {
        "type": "HEAL_HIVE",
        "val": 3
      }
    ],
    "description": "HECHIZO: Restaura +3 de salud a todas tus criaturas aliadas. HECHIZO: Restaura +3 de salud a tu Reino.",
    "isStarter": true
  },
  {
    "id": "sp_28",
    "name": "Terrores Submarinos",
    "type": "Pulpo",
    "cost": 3,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/21pulpo.png",
    "battlecry": {
      "type": "DAMAGE_ALL_ENEMIES",
      "val": 2
    },
    "description": "HECHIZO: Inflige 2 de daño a todas las criaturas enemigas.",
    "isStarter": false
  },
  {
    "id": "sp_29",
    "name": "Mapa del Paraíso",
    "type": "Pulpo",
    "cost": 2,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/22pulpo.png",
    "battlecry": {
      "type": "DRAW_CARD",
      "val": 2
    },
    "description": "HECHIZO: Roba 2 carta(s) de tu mazo.",
    "isStarter": false
  },
  {
    "id": "sp_30",
    "name": "Mapa de la Paz",
    "type": "Pulpo",
    "cost": 3,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/23pulpo.png",
    "battlecry": {
      "type": "HEAL_HIVE",
      "val": 5
    },
    "description": "HECHIZO: Restaura +5 de salud a tu Reino.",
    "isStarter": false
  },
  {
    "id": "sp_31",
    "name": "Megalodón de Acero",
    "type": "Tiburon",
    "cost": 5,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/24tiburon.png",
    "battlecry": [
      {
        "type": "DAMAGE_TARGET",
        "val": 4
      },
    ],
    "description": "HECHIZO: Inflige 4 de daño al objetivo elegido. HECHIZO: Inflige 2 de daño a todas las criaturas enemigas.",
    "isStarter": false
  },
  {
    "id": "sp_32",
    "name": "Rompe Marinos",
    "type": "Tiburon",
    "cost": 3,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/25tiburon.png",
    "battlecry": {
      "type": "DESTROY_TARGET_CREATURE",
      "val": 1
    },
    "description": "HECHIZO: Destruye instantáneamente a una criatura enemiga elegida.",
    "isStarter": false
  },
  {
    "id": "sp_33",
    "name": "Carga Abisal",
    "type": "Tiburon",
    "cost": 3,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/26tiburon.png",
    "battlecry": {
      "type": "SUMMON_RANDOM_FROM_HAND",
      "maxCost": 5,
      "val": 3
    },
    "description": "HECHIZO: Inflige 4 de daño directo al Reino enemigo.",
    "isStarter": false
  },
  {
    "id": "sp_34",
    "name": "Se Busca",
    "type": "Toro",
    "cost": 1,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/10toro.png",
    "battlecry": [
      {
        "type": "GAIN_NECTAR",
        "val": 2
      },
      {
        "type": "SEARCH_DECK",
        "val": "Toro"
      }
    ],
    "description": "HECHIZO: Otorga +2 de Energía en este turno. HECHIZO: Roba 1 carta(s) de tu mazo.",
    "isStarter": false
  },
  {
    "id": "sp_35",
    "name": "El Viejo Corral",
    "type": "Toro",
    "cost": 3,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/11toro.png",
    "battlecry": {
      "type": "BUFF_ALL_FRIENDLIES_ATK",
      "val": 3
    },
    "description": "HECHIZO: Otorga +1 de Ataque a todas tus criaturas aliadas.",
    "isStarter": false
  },
  {
    "id": "sp_36",
    "name": "¡Duelo!",
    "type": "Toro",
    "cost": 2,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/12toro.png",
    "battlecry": {
      "type": "SUMMON_RANDOM_FROM_HAND",
      "maxCost": 5
    },
    "description": "HECHIZO: Inflige 3 de daño al objetivo elegido.",
    "isStarter": false
  },
  {
    "id": "sp_37",
    "name": "Primer Protección",
    "type": "Tortuga",
    "cost": 1,
    "attack": 0,
    "hp": 0,
    "image": "assets/cards/15tortuga.png",
    "description": "HECHIZO: Otorga +1 de Ataque a todas tus criaturas aliadas.",
    "isSpell": true,
    "battlecry": {
      "type": "BUFF_ALL_FRIENDLIES_ATK",
      "val": 1
    },
    "isStarter": false
  },
  {
    "id": "sp_38",
    "name": "Segunda Protección",
    "type": "Tortuga",
    "cost": 2,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/14tortuga.png",
    "battlecry": {
      "type": "HEAL_ALL_FRIENDLIES",
      "val": 4
    },
    "description": "HECHIZO: Restaura +4 de salud a todas tus criaturas aliadas.",
    "isStarter": false
  },
  {
    "id": "sp_39",
    "name": "Tercera Protección",
    "type": "Tortuga",
    "cost": 3,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/13tortuga.png",
    "battlecry": {
      "type": "HEAL_HIVE",
      "val": 5
    },
    "description": "HECHIZO: Restaura +5 de salud a tu Reino.",
    "isStarter": false
  },
  {
    "id": "sp_40",
    "name": "Cuarta Protección",
    "type": "Tortuga",
    "cost": 4,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/16tortuga.png",
    "battlecry": [
      {
        "type": "HEAL_HIVE",
        "val": 6
      },
      {
        "type": "HEAL_ALL_FRIENDLIES",
        "val": 3
      }
    ],
    "description": "HECHIZO: Restaura +6 de salud a tu Reino. HECHIZO: Restaura +3 de salud a todas tus criaturas aliadas.",
    "isStarter": false
  },
  {
    "id": "inst_01",
    "name": "Reino Mapache",
    "type": "Mapache",
    "cost": 0,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/17mapache.png",
    "isInstinct": true,
    "isStarter": true,
    "trigger": "ATTACK",
    "battlecry": {
      "type": "DAMAGE_TARGET",
      "val": 4
    },
    "description": "INSTINTO: Se activa automáticamente desde la mano cuando el oponente declara un ataque. Inflige 3 de daño al objetivo elegido."
  },
  {
    "id": "inst_02",
    "name": "Ley Real Mapache",
    "type": "Mapache",
    "cost": 0,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/19mapache.png",
    "isInstinct": true,
    "isStarter": true,
    "trigger": "SUMMON",
    "battlecry": {
      "type": "DESTROY_TARGET_CREATURE"
    },
    "description": "INSTINTO: Se activa automáticamente desde la mano cuando el oponente invoca una criatura. Inflige 4 de daño al objetivo elegido."
  },
  {
    "id": "inst_03",
    "name": "Gloria Mapache",
    "type": "Mapache",
    "cost": 0,
    "attack": 0,
    "hp": 0,
    "isSpell": true,
    "image": "assets/cards/20mapache.png",
    "isInstinct": true,
    "isStarter": true,
    "trigger": "ATTACK",
    "battlecry": {
      "type": "DESTROY_TARGET_CREATURE",
    },
    "description": "INSTINTO: Se activa automáticamente desde la mano cuando tu Reino sufre daño. Restaura +4 HP a tu Reino."
  }
];


// === GENERADOR DINÁMICO DE DESCRIPCIONES BASADO EN DATOS DE CARTA ===
function getCardDescription(card) {
  if (!card) return "";
  if (card.customLore) return card.customLore;

  let descParts = [];

  // 1. Comandante Leyenda
  if (card.isExtra) {
    descParts.push("COMANDANTE LEYENDA (Deck Extra).");
  }

  // 2. Instintos
  if (card.isInstinct || card.isTrap) {
    let trig = card.trigger || '';
    let desc = "INSTINTO: Se activa automáticamente desde la mano ";
    if (trig === 'ATTACK') desc += "cuando el oponente declara un ataque.";
    else if (trig === 'SUMMON') desc += "cuando el oponente invoca una criatura.";
    else if (trig === 'DAMAGE_HIVE' || trig === 'HIVE_DAMAGED') desc += "cuando tu Reino sufre daño.";
    else desc += "al cumplirse su detonante.";

    let bc = card.battlecry;
    if (bc) {
      let bcList = Array.isArray(bc) ? bc : [bc];
      for (let b of bcList) {
        if (b.type === 'DAMAGE_TARGET') desc += ` Inflige ${b.val || 0} de daño al objetivo.`;
        else if (b.type === 'DESTROY_TARGET_CREATURE') desc += " Destruye a la criatura enemiga objetivo.";
        else if (b.type === 'HEAL_HIVE') desc += ` Restaura +${b.val || 0} HP a tu Reino.`;
        else if (b.type === 'HEAL_ALL_FRIENDLIES') desc += ` Restaura +${b.val || 0} HP a todas tus criaturas.`;
        else if (b.type === 'DAMAGE_ENEMY_HIVE') desc += ` Inflige ${b.val || 0} de daño directo al Reino enemigo.`;
        else if (b.type === 'BUFF_ALL_FRIENDLIES_ATK') desc += ` Otorga +${b.val || 0} de Ataque a tus criaturas.`;
      }
    }
    descParts.push(desc);
  }

  // 3. Palabras Clave
  let keywords = card.keywords || [];
  let kwDescs = [];
  if (keywords.includes("PROVOCAR")) kwDescs.push("PROVOCAR (Los enemigos deben atacar a esta criatura primero).");
  if (keywords.includes("VUELO")) kwDescs.push("VUELO (Puede ignorar criaturas con Provocar y atacar al Reino).");
  if (keywords.includes("VENENO")) kwDescs.push("VENENO (Destruye instantáneamente a cualquier criatura a la que dañe).");
  if (keywords.includes("ESCUDO") || keywords.includes("SHIELD")) kwDescs.push("ESCUDO (Protege del primer impacto de daño).");
  if (keywords.includes("PRISA")) kwDescs.push("PRISA (Puede atacar inmediatamente en el turno que es invocada).");
  if (keywords.includes("DOBLE_ATAQUE")) kwDescs.push("DOBLE ATAQUE (Puede realizar 2 ataques por turno).");

  if (kwDescs.length > 0) descParts.push(kwDescs.join(" "));

  // 4. Grito de Guerra y Hechizos
  if (!card.isInstinct && !card.isTrap && card.battlecry) {
    let bcList = Array.isArray(card.battlecry) ? card.battlecry : [card.battlecry];
    for (let b of bcList) {
      let prefix = card.isSpell ? "HECHIZO: " : "GRITO DE GUERRA: ";
      let btype = b.type;
      let val = b.val || 0;
      if (btype === 'DAMAGE_TARGET') descParts.push(`${prefix}Inflige ${val} de daño a la primera criatura enemiga; si el rival no tiene criaturas, al Reino enemigo.`);
      else if (btype === 'DESTROY_TARGET_CREATURE') descParts.push(`${prefix}Destruye instantáneamente a la primera criatura enemiga; si el rival no tiene criaturas, no hace nada.`);
      else if (btype === 'BUFF_ALL_FRIENDLIES_HP' || btype === 'BUFF_ALL_FRIENDLIES_MAX_HP') descParts.push(`${prefix}Aumenta la salud de todas tus criaturas aliadas en +${val} HP.`);
      else if (btype === 'BUFF_ALL_FRIENDLIES_ATK') descParts.push(`${prefix}Otorga +${val} de Ataque a todas tus criaturas aliadas.`);
      else if (btype === 'HEAL_HIVE') descParts.push(`${prefix}Restaura +${val} de salud a tu Reino.`);
      else if (btype === 'DAMAGE_SELF_HIVE') descParts.push(`${prefix}Inflige ${val} de daño a tu propio Reino.`);
      else if (btype === 'DAMAGE_ENEMY_HIVE') descParts.push(`${prefix}Inflige ${val} de daño directo al Reino enemigo.`);
      else if (btype === 'DAMAGE_ALL_ENEMIES') descParts.push(`${prefix}Inflige ${val} de daño a todas las criaturas enemigas.`);
      else if (btype === 'SEARCH_DECK') descParts.push(`${prefix}Busca en tu mazo la primera carta que coincida con "${val}" y la roba.`);
      else if (btype === 'HEAL_ALL_FRIENDLIES') descParts.push(`${prefix}Restaura +${val} de salud a todas tus criaturas aliadas.`);
      else if (btype === 'SUMMON_RANDOM_FROM_HAND') {
        let costTxt = (b.maxCost !== undefined && b.maxCost !== null) ? ` de costo ${b.maxCost} o menos` : "";
        descParts.push(`${prefix}Invoca ${val || 1} criatura(s) aleatoria(s)${costTxt} de tu mano al campo de batalla sin costo de Néctar.`);
      }
      else if (btype === 'REVIVE_RANDOM_CREATURE') descParts.push(`${prefix}Revive ${val} criatura(s) aleatoria(s) del cementerio a tu campo.`);
      else if (btype === 'GAIN_NECTAR') descParts.push(`${prefix}Otorga +${val} de Energía en este turno.`);
      else if (btype === 'PERMANENT_NECTAR') descParts.push(`${prefix}Aumenta tu Energía máxima permanentemente en +${val}.`);
      else if (btype === 'DRAW_CARD') descParts.push(`${prefix}Roba ${val} carta(s) de tu mazo.`);
    }
  }

  let finalDesc = descParts.join(" ").trim();
  return finalDesc || (card.description || "Criatura estándar sin habilidades especiales.");
}


if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CARD_DATABASE, getCardDescription };
}
