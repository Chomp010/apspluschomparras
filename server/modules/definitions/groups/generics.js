const { base, dfltskl, smshskl } = require('../constants.js');

exports.genericEntity = {
    NAME: "",
    LABEL: "Unknown Entity",
    TYPE: "unknown",
    DAMAGE_CLASS: 0,
    DANGER: 0,
    VALUE: 0,
    SHAPE: 0,
    COLOR: {
        BASE: 16, // ID
        HUE_SHIFT: 0, // Additive, degrees
        SATURATION_SHIFT: 1, // Multiplicative
        BRIGHTNESS_SHIFT: 0, // Additive, ranges from -100 to 100
        ALLOW_BRIGHTNESS_INVERT: true, // Toggles offset invert if exceeding normal color bounds
    },
    INDEPENDENT: false,
    CONTROLLERS: ["doNothing"],
    HAS_NO_MASTER: false,
    MOTION_TYPE: "glide",
    FACING_TYPE: "toTarget",
    DRAW_HEALTH: false,
    DRAW_SELF: true,
    DAMAGE_EFFECTS: true,
    RATEFFECTS: true,
    MOTION_EFFECTS: true,
    INTANGIBLE: false,
    ACCEPTS_SCORE: true,
    GIVE_KILL_MESSAGE: false,
    CAN_GO_OUTSIDE_ROOM: false,
    HITS_OWN_TYPE: "normal",
    DIE_AT_LOW_SPEED: false,
    DIE_AT_RANGE: false,
    CLEAR_ON_MASTER_UPGRADE: false,
    PERSISTS_AFTER_DEATH: false,
    VARIES_IN_SIZE: false,
    HEALTH_WITH_LEVEL: true,
    CAN_BE_ON_LEADERBOARD: true,
    HAS_NO_RECOIL: false,
    BUFF_VS_FOOD: false,
    OBSTACLE: false,
    CRAVES_ATTENTION: false,
    NECRO: false,
    UPGRADES_TIER_0: [],
    UPGRADES_TIER_1: [],
    UPGRADES_TIER_2: [],
    UPGRADES_TIER_3: [],
    UPGRADES_TIER_4: [],
    UPGRADES_TIER_5: [],
    UPGRADES_TIER_6: [],
    UPGRADES_TIER_7: [],
    UPGRADES_TIER_8: [],
    UPGRADES_TIER_9: [],
    SKILL: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    LEVEL: 0,
    BORDERLESS: false,
    DRAW_FILL: true,
    SKILL_CAP: Array(10).fill(dfltskl),
    GUNS: [],
    MAX_CHILDREN: 0,
    BORDERLESS: false,
    DRAW_FILL: true,
    BODY: {
        ACCELERATION: 1,
        SPEED: 0,
        HEALTH: 1,
        RESIST: 1,
        SHIELD: 0,
        REGEN: 0,
        DAMAGE: 1,
        PENETRATION: 1,
        RANGE: 0,
        FOV: 1,
        DENSITY: 1,
        STEALTH: 1,
        PUSHABILITY: 1,
        KNOCKBACK_MULTIPLIER: 1,
        STUN_MULTIPLIER: 0,
        HETERO: 2,
    },
    FOOD: {
        LEVEL: -1,
    },
};
exports.genericTank = {
    LABEL: "Unknown Class",
    TYPE: "tank",
    DAMAGE_CLASS: 2,
    DANGER: 5,
    MOTION_TYPE: "motor",
    FACING_TYPE: "toTarget",
    SIZE: 12,
    MAX_CHILDREN: 0,
    DAMAGE_EFFECTS: false,
    IGNORED_BY_AI: false,
    BODY: {
        ACCELERATION: base.ACCEL,
        SPEED: base.SPEED,
        HEALTH: base.HEALTH,
        DAMAGE: base.DAMAGE,
        PENETRATION: base.PENETRATION,
        SHIELD: base.SHIELD,
        REGEN: base.REGEN,
        FOV: base.FOV,
        DENSITY: base.DENSITY,
        PUSHABILITY: 1,
        KNOCKBACK_MULTIPLIER: 1,
        STUN_MULTIPLIER: 0,
        HETERO: 3,
    },
    GUNS: [],
    TURRETS: [],
    GIVE_KILL_MESSAGE: true,
    DRAW_HEALTH: true,
    HITS_OWN_TYPE: "hardOnlyTanks",
};

exports.food = {
    TYPE: "food",
    DAMAGE_CLASS: 1,
    CONTROLLERS: ["moveInCircles"],
    HITS_OWN_TYPE: "repel",
    MOTION_TYPE: "drift",
    FACING_TYPE: "turnWithSpeed",
    VARIES_IN_SIZE: true,
    BODY: {
        STEALTH: 30,
        PUSHABILITY: 1,
    },
    DAMAGE_EFFECTS: false,
    RATEFFECTS: false,
    HEALTH_WITH_LEVEL: false,
};

exports.bullet = {
    LABEL: "Bullet",
    TYPE: "bullet",
    ACCEPTS_SCORE: false,
    BODY: {
        PENETRATION: 1,
        SPEED: 3.75,
        RANGE: 90,
        DENSITY: 1.25,
        HEALTH: 0.165,
        DAMAGE: 6,
        PUSHABILITY: 0.3,
        KNOCKBACK_MULTIPLIER: 1,
    },
    FACING_TYPE: "smoothWithMotion",
    CAN_GO_OUTSIDE_ROOM: true,
    HITS_OWN_TYPE: "never",
    DIE_AT_RANGE: true,
};
exports.speedBullet = {
    PARENT: ["bullet"],
    MOTION_TYPE: "accel",
};
exports.growBullet = {
    PARENT: ["bullet"],
    MOTION_TYPE: "grow",
};
exports.flare = {
    PARENT: ["growBullet"],
    LABEL: "Flare",
    SHAPE: 4,
};
exports.stunBullet = {
    PARENT: ["bullet"],
    SHAPE: 9,
    FACING_TYPE: "turnWithSpeed",
    BODY: {
        STUN_MULTIPLIER: 1,
    },
};
exports.developerBullet = {
    PARENT: ["bullet"],
    SHAPE: [[-1, -1], [1, -1], [2, 0], [1, 1], [-1, 1]],
};
exports.gravityBullet = {
    PARENT: ["bullet"], 
    SHAPE: 'M -0.0063 -0.8875 C -0.0063 -0.8281 -0.0063 -0.7813 -0.0094 -0.7813 C -0.0094 -0.7813 -0.0313 -0.7906 -0.0563 -0.7969 C -0.2 -0.8469 -0.3531 -0.8562 -0.475 -0.825 C -0.55 -0.8031 -0.6094 -0.7719 -0.6687 -0.725 L -0.7031 -0.6969 L -0.6312 -0.625 C -0.5938 -0.5875 -0.5625 -0.5531 -0.5625 -0.55 C -0.5625 -0.55 -0.5781 -0.5406 -0.5938 -0.5313 C -0.8219 -0.4188 -0.9656 -0.2375 -0.9844 -0.0375 L -0.9906 0.0031 L -0.8844 0.0031 C -0.8281 0.0063 -0.7813 0.0063 -0.7813 0.0063 C -0.7813 0.0094 -0.7875 0.025 -0.7969 0.0437 C -0.8156 0.1 -0.8344 0.1875 -0.8406 0.2531 C -0.8531 0.3844 -0.825 0.5188 -0.7656 0.6125 C -0.7438 0.6469 -0.7031 0.6969 -0.6969 0.6969 C -0.6937 0.6969 -0.6594 0.6656 -0.6219 0.6281 L -0.55 0.5594 L -0.525 0.6062 C -0.4562 0.7469 -0.3344 0.875 -0.2219 0.9313 C -0.1656 0.9625 -0.0719 0.9875 -0.0219 0.9844 L 0 0.9844 L 0 0.8844 C 0 0.825 0.0031 0.7813 0.0031 0.7813 C 0.0031 0.7813 0.025 0.7906 0.05 0.7969 C 0.1938 0.8469 0.3469 0.8562 0.4688 0.825 C 0.5469 0.8031 0.6031 0.775 0.6656 0.7219 L 0.6969 0.6969 L 0.625 0.6219 L 0.5531 0.55 L 0.5813 0.5313 C 0.6563 0.5031 0.7406 0.4437 0.8 0.3875 C 0.9063 0.2844 0.9688 0.1656 0.9844 0.0375 L 0.9844 -0.0031 L 0.8812 -0.0063 C 0.825 -0.0063 0.7781 -0.0031 0.7781 -0.0031 C 0.7781 -0.0094 0.7844 -0.025 0.7906 -0.0437 C 0.8125 -0.1 0.8281 -0.1875 0.8344 -0.2531 C 0.85 -0.3844 0.8219 -0.5156 0.7625 -0.6125 C 0.7406 -0.6469 0.6969 -0.6969 0.6906 -0.6969 C 0.6875 -0.6969 0.6531 -0.6656 0.6156 -0.6281 L 0.5437 -0.5625 L 0.5188 -0.6062 C 0.4469 -0.7469 0.3312 -0.875 0.2188 -0.9313 C 0.1594 -0.9625 0.0688 -0.9875 0.0156 -0.9875 L -0.0031 -0.9875 L -0.0063 -0.8875 Z', 
    MOTION_TYPE: "grow",
    FACING_TYPE: "turnWithSpeed",
    BODY: {
        PUSHABILITY: 0,
        KNOCKBACK_MULTIPLIER: -1.3,
        HEALTH: 165,
        DAMAGE: 0.1,
    },
};
exports.casing = {
    PARENT: ["bullet"],
    LABEL: "Shell",
    TYPE: "swarm",
};

exports.drone = {
    LABEL: "Drone",
    TYPE: "drone",
    ACCEPTS_SCORE: false,
    DANGER: 2,
    CONTROL_RANGE: 0,
    SHAPE: 3,
    MOTION_TYPE: "chase",
    FACING_TYPE: "smoothToTarget",
    CONTROLLERS: [
        "nearestDifferentMaster",
        "canRepel",
        "mapTargetToGoal",
        "hangOutNearMaster",
    ],
    AI: {
        BLIND: true,
    },
    BODY: {
        PENETRATION: 1.2,
        PUSHABILITY: 0.6,
        ACCELERATION: 0.05,
        HEALTH: 0.3,
        DAMAGE: 3.375,
        SPEED: 3.8,
        RANGE: 200,
        DENSITY: 0.03,
        RESIST: 1.5,
        FOV: 0.5,
    },
    HITS_OWN_TYPE: "hard",
    DRAW_HEALTH: false,
    CLEAR_ON_MASTER_UPGRADE: true,
    BUFF_VS_FOOD: true,
};

exports.trap = {
    LABEL: "Thrown Trap",
    TYPE: "trap",
    ACCEPTS_SCORE: false,
    SHAPE: -3,
    MOTION_TYPE: "glide",
    FACING_TYPE: "turnWithSpeed",
    HITS_OWN_TYPE: "push",
    DIE_AT_RANGE: true,
    BODY: {
        HEALTH: 0.5,
        DAMAGE: 3,
        RANGE: 450,
        DENSITY: 2.5,
        RESIST: 2.5,
        SPEED: 0,
    },
};

exports.mendersymbol = {
    PARENT: ["genericTank"],
    COLOR: 16,
    LABEL: "",
    SHAPE: 3,
};
exports.healerBullet = {
    PARENT: ["bullet"],
    HEALER: true,
    HITS_OWN_TYPE: "normal",
};
exports.healerSymbol = {
    PARENT: ["genericEntity"],
    SHAPE: [[0.3, -0.3],[1,-0.3],[1,0.3],[0.3,0.3],[0.3,1],[-0.3,1],[-0.3,0.3],[-1,0.3],[-1,-0.3],[-0.3,-0.3],[-0.3,-1],[0.3,-1]],
    SIZE: 13,
    COLOR: 12,
};

exports.auraBase = {
    TYPE: "aura",
    ACCEPTS_SCORE: false,
    FACING_TYPE: "smoothWithMotion",
    MOTION_TYPE: "withMaster",
    CAN_GO_OUTSIDE_ROOM: true,
    HITS_OWN_TYPE: "never",
    DAMAGE_EFFECTS: false,
    DIE_AT_RANGE: false,
    ALPHA: 0.3,
    CLEAR_ON_MASTER_UPGRADE: true,
    CAN_GO_OUTSIDE_ROOM: true,
    BODY: {
        SHIELD: 1000000,
        REGEN: 100000,
        HEALTH: 1000000,
        DENSITY: 0,
        SPEED: 0,
        PUSHABILITY: 0,
        KNOCKBACK_MULTIPLIER: 0,
    }
};
exports.aura = {
    PARENT: ["auraBase"],
    LABEL: "Aura",
    COLOR: 0,
    BODY: {
        DAMAGE: 0.25,
    },
};
exports.healAura = {
    PARENT: ["auraBase"],
    LABEL: "Heal Aura",
    HEALER: true,
    COLOR: 12,
    BODY: {
        DAMAGE: 0.25/3,
    },
};
exports.gravityAura = {
    PARENT: ["auraBase"],
    LABEL: "Gravity Aura",
    COLOR: 0,
    BODY: {
        DAMAGE: 0,
        DENSITY: 1,
        KNOCKBACK_MULTIPLIER: -1,
    },
};
exports.repelAura = {
    PARENT: ["auraBase"],
    LABEL: "Repelling Aura",
    COLOR: 0,
    BODY: {
        DAMAGE: 0,
        DENSITY: 1,
        KNOCKBACK_MULTIPLIER: 1,
    },
};
exports.auraSymbol = {
    PARENT: ["genericTank"],
    CONTROLLERS: [["spin", {speed: -0.04}]],
    INDEPENDENT: true,
    COLOR: 0,
    SHAPE: [[-0.598,-0.7796],[-0.3817,-0.9053],[0.9688,-0.1275],[0.97,0.125],[-0.3732,0.9116],[-0.593,0.785]]
};