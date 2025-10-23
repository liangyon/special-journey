/**
 * Game configuration constants
 */
export const GameConstants = {
    // Player constants
    PLAYER: {
        SPEED: 200, // pixels per second
        ACCELERATION: 1500, // pixels per second squared
        DECELERATION: 1500, // pixels per second squared
        MOVEMENT_THRESHOLD: 10, // minimum speed to be considered "moving"
        SPRITE_OFFSET_Y: -0.5, // sprite vertical offset multiplier
        SPRITE_SCALE: 2.0,
    },

    // Grid constants
    TILE_SIZE: 64,
    GRID_WIDTH: 20,
    GRID_HEIGHT: 15,

    // Camera constants
    CAMERA: {
        BACKGROUND_COLOR: 0x5b9bd5, // Ocean blue
    },
} as const;
