/**
 * Building layout definitions
 * 0 = no structure
 * 1 = floor/wall
 * 2 = door
 * 3 = window
 * 5 = special feature (e.g., cabinet)
 */

export interface BuildingDefinition {
    x: number;
    y: number;
    layout: number[][];
}

export const MAIN_HOUSE: BuildingDefinition = {
    x: 5,
    y: 2,
    layout: [
        [1, 3, 1, 3, 1, 1, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 0, 0, 0],
        [1, 1, 1, 1, 1, 5, 1, 3, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 2, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
};

/**
 * Helper to determine if a cell is a wall based on its neighbors
 */
export function isWallTile(x: number, y: number, layout: number[][]): boolean {
    const height = layout.length;
    const width = layout[0].length;
    
    const neighbors = {
        top: y > 0 && layout[y - 1][x] > 0,
        bottom: y < height - 1 && layout[y + 1][x] > 0,
        left: x > 0 && layout[y][x - 1] > 0,
        right: x < width - 1 && layout[y][x + 1] > 0,
    };
    
    return !neighbors.top || !neighbors.bottom || !neighbors.left || !neighbors.right;
}

/**
 * Tile type constants
 */
export const TILE_TYPES = {
    EMPTY: 0,
    FLOOR_WALL: 1,
    DOOR: 2,
    WINDOW: 3,
    SPECIAL: 5,
} as const;
