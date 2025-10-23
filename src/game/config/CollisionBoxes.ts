/**
 * Collision box definitions for different tile types
 * Each box is defined relative to the tile's position (0-1 range)
 * where 0,0 is top-left and 1,1 is bottom-right
 */

export interface CollisionBox {
    x: number;      // X position (0-1, relative to tile)
    y: number;      // Y position (0-1, relative to tile)
    width: number;  // Width (0-1, relative to tile size)
    height: number; // Height (0-1, relative to tile size)
}

export interface TileCollisionConfig {
    spritesheet: string;
    frame: number;
    boxes: CollisionBox[];
}



export const COLLISION_CONFIGS: Record<string, TileCollisionConfig[]> = {
    // House wall tiles
    'house_walls': [
        // Frame 0: Top-left corner
        { frame: 0, spritesheet: 'house_walls', boxes: [
            // { x: 0, y: 0.75, width: 1, height: 0.25 },     // Bottom edge
            { x: 0.75, y: 0, width: 0.25, height: 1 }      // Right edge
        ]},
        
        // Frame 1: Top wall
        { frame: 1, spritesheet: 'house_walls', boxes: [
            { x: 0, y: 0, width: 1, height: 0.25 },         // Top edge 
            { x: 0, y: 0.75, width: 1, height: 0.25 }    // Bottom edge 
        ]},
        
        // Frame 2: Top-right corner
        { frame: 2, spritesheet: 'house_walls', boxes: [
            // { x: 0, y: 0.75, width: 1, height: 0.25 },     // Bottom edge
            { x: 0, y: 0, width: 0.25, height: 1 }         // Left edge
        ]},
        
        // Frame 5: Left wall
        { frame: 5, spritesheet: 'house_walls', boxes: [
            { x: 0.75, y: 0, width: 0.25, height: 1 }      // Right edge only
        ]},
        
        // Frame 6: Floor (no collision)
        { frame: 6, spritesheet: 'house_walls', boxes: [] },
        
        // Frame 7: Right wall
        { frame: 7, spritesheet: 'house_walls', boxes: [
            { x: 0, y: 0, width: 0.25, height: 1 }         // Left edge only
        ]},
        
        // Frame 8: Special corner wall (treat as corner)
        { frame: 8, spritesheet: 'house_walls', boxes: [
            { x: 0, y: 0, width: 1, height: 0.25 },         // Top edge 
            { x: 0, y: 0.75, width: 1, height: 0.25 },     // Bottom edge
            { x: 0, y: 0, width: 0.25, height: 1 }         // Left edge
        ]},
        
        // Frame 10: Bottom-left corner
        { frame: 10, spritesheet: 'house_walls', boxes: [
            // { x: 0, y: 0, width: 1, height: 0.25 },        // Top edge
            { x: 0.75, y: 0, width: 0.25, height: 1 }      // Right edge
        ]},
        
        // Frame 11: Bottom wall
        { frame: 11, spritesheet: 'house_walls', boxes: [
            { x: 0, y: 0, width: 1, height: 0.25 },         // Top edge 
            { x: 0, y: 0.75, width: 1, height: 0.25 }    // Bottom edge 
        ]},
        
        // Frame 12: Bottom-right corner
        { frame: 12, spritesheet: 'house_walls', boxes: [
            // { x: 0, y: 0, width: 1, height: 0.25 },        // Top edge
            { x: 0, y: 0, width: 0.25, height: 1 }         // Left edge
        ]},
        
        // Frame 13: Window (full block)
        { frame: 13, spritesheet: 'house_walls', boxes: [
            { x: 0, y: 0.0, width: 1, height: 1 }    // Centered box
        ]},
    ],
    
    // Doors (minimal or no collision for open doors)
    'doors': [
        // Frame 2: Door (no collision - walkable)
        { frame: 2, spritesheet: 'doors', boxes: [
            { x: 0, y: 0, width: 0.10, height: 1 },         // Left edge
            { x: 0.9, y: 0, width: 0.10, height: 1 }      // Right edge
        ] },
    ],
    
    // Furniture
    'furniture': [
        // Frame 0: Painting (on wall, no floor collision)
        { frame: 0, spritesheet: 'furniture', boxes: [] },
        
        // Frame 5: Flower pot (small collision)
        { frame: 5, spritesheet: 'furniture', boxes: [
            { x: 0.3, y: 0.3, width: 0.4, height: 0.4 }
        ]},
        
        // Frame 21: Cabinet (large collision)
        { frame: 21, spritesheet: 'furniture', boxes: [
            { x: 0.1, y: 0.2, width: 0.8, height: 0.7 }
        ]},
        
        // Frame 22: Cabinet variant
        { frame: 22, spritesheet: 'furniture', boxes: [
            { x: 0.1, y: 0.2, width: 0.8, height: 0.7 }
        ]},
        
        // Frame 30: Table
        { frame: 30, spritesheet: 'furniture', boxes: [
            { x: 0.15, y: 0.15, width: 0.7, height: 0.7 }
        ]},
    ],
};

/**
 * Get collision boxes for a specific tile
 */
export function getCollisionBoxes(spritesheet: string, frame: number): CollisionBox[] {
    const configs = COLLISION_CONFIGS[spritesheet];
    if (!configs) return [];
    
    const config = configs.find(c => c.frame === frame);
    return config?.boxes || [];
}

/**
 * Check if a specific tile type should have collision
 */
export function hasCollision(spritesheet: string, frame: number): boolean {
    const boxes = getCollisionBoxes(spritesheet, frame);
    return boxes.length > 0;
}
