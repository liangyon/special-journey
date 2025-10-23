import { Scene } from 'phaser';
import { CollisionManager } from './CollisionManager';
import { InteractionManager } from './InteractionManager';
import { InventoryManager } from './InventoryManager';
import { PuzzleManager } from './PuzzleManager';
import { LockedCabinet } from '../objects/LockedCabinet';
import { HiddenKey } from '../objects/HiddenKey';
import { getCollisionBoxes } from '../config/CollisionBoxes';

export class DecorationManager {
    private scene: Scene;
    private tileSize: number;
    private collisionManager: CollisionManager | null = null;
    private interactionManager: InteractionManager | null = null;
    private inventoryManager: InventoryManager | null = null;
    private puzzleManager: PuzzleManager | null = null;

    constructor(scene: Scene, tileSize: number) {
        this.scene = scene;
        this.tileSize = tileSize;
    }

    setManagers(
        collisionManager: CollisionManager,
        interactionManager: InteractionManager,
        inventoryManager: InventoryManager,
        puzzleManager: PuzzleManager
    ): void {
        this.collisionManager = collisionManager;
        this.interactionManager = interactionManager;
        this.inventoryManager = inventoryManager;
        this.puzzleManager = puzzleManager;
    }

    addDecorations() {
        this.buildHouse();
        this.addFurniture();
        this.addPuzzleObjects();
    }

    private buildHouse() {
        // More natural house shape - L-shaped cottage
        // Main body: 6x5, extension: 3x3
        const houseX = 5; // Start x position
        const houseY = 3; // Start y position
        
        // Define house layout with tile type codes:
        // 0 = empty/skip
        // 1 = auto-calculated wall/floor (procedural)
        // 2 = door
        // 3 = window
        // 4+ = special decorative tiles (can be extended)
        const houseLayout = [
            [1,3,1,3,1,1,0,0,0],  // Row 0 - with windows
            [1,1,1,1,1,1,0,0,0],  // Row 1
            [1,1,1,1,1,5,1,3,1],  // Row 2 - extension with window
            [1,1,1,1,1,1,1,1,1],  // Row 3 - extension
            [1,1,1,1,1,1,1,1,1],  // Row 4 - with door
            [1,1,1,1,1,1,1,1,1],  // Row 5 - entrance area
            [1,1,1,2,1,1,1,1,1],  // Row 6 - with door
            [0,0,0,0,0,0,0,0,0],  // Row 7 - entrance area
        ];
        
        const houseHeight = houseLayout.length;
        const houseWidth = houseLayout[0].length;

        // Draw house structure with proper layering
        for (let y = 0; y < houseHeight; y++) {
            for (let x = 0; x < houseWidth; x++) {
                const tileType = houseLayout[y][x];
                if (tileType === 0) continue; // Skip empty spaces
                
                const worldX = (houseX + x) * this.tileSize + this.tileSize / 2;
                const worldY = (houseY + y) * this.tileSize + this.tileSize / 2;
                
                // Get the appropriate spritesheet and frame for this tile type
                const tileInfo = this.getTileInfo(tileType, x, y, houseLayout);
                let depth = 2; // Default depth for walls
                
                // Floor tiles should be at lower depth
                if (tileInfo.frame === 6) {
                    depth = 1.5; // Floor between grass and walls
                }
                
                const tile = this.scene.add.sprite(worldX, worldY, tileInfo.spritesheet, tileInfo.frame);
                tile.setScale(4);
                tile.setDepth(depth);
                
                // Ensure pixel-perfect rendering
                tile.setOrigin(0.5, 0.5);
                
                // Register collision boxes for this tile
                if (this.collisionManager) {
                    const collisionBoxes = getCollisionBoxes(tileInfo.spritesheet, tileInfo.frame);
                    if (collisionBoxes.length > 0) {
                        this.collisionManager.registerTileCollision(
                            houseX + x, 
                            houseY + y, 
                            collisionBoxes,
                            tileInfo.spritesheet,
                            tileInfo.frame
                        );
                    }
                }
            }
        }
    }
    
    /**
     * Get the appropriate spritesheet and frame based on tile type
     * Supports custom tiles (doors, windows) and auto-calculated walls
     */
    private getTileInfo(tileType: number, x: number, y: number, layout: number[][]): { spritesheet: string, frame: number } {
        // Handle custom tile types
        switch (tileType) {
            case 2: // Door (from doors.png)
                return { spritesheet: 'doors', frame: 2 };
            case 3: // Window (from house_walls)
                return { spritesheet: 'house_walls', frame: 13 };
            case 4: // Special decorative wall (can be extended)
                return { spritesheet: 'house_walls', frame: 4 };
            case 5: // Special corner wall
                return { spritesheet: 'house_walls', frame: 8 };

            case 6: // painting (only on north walls) (can be extended)
                return { spritesheet: 'furniture', frame: 0 };
            case 7: // flower pot (can be extended)
                return { spritesheet: 'furniture', frame: 5 };
            case 8: // table(can be extended)   
                return { spritesheet: 'furniture', frame: 30 };
            case 9: // cabinet(can be extended) 
                return { spritesheet: 'furniture', frame: 22 };
            // Add more custom tile types here as needed
            // case 5: return { spritesheet: 'some_sheet', frame: X };
            default:
                // For type 1 (normal walls/floors), use auto-calculation
                return { 
                    spritesheet: 'house_walls', 
                    frame: this.getNaturalHouseFrame(x, y, layout) 
                };
        }
    }

    private getNaturalHouseFrame(x: number, y: number, layout: number[][]): number {
        const height = layout.length;
        const width = layout[0].length;
        
        // Check adjacent tiles - treat any non-zero value as solid (walls, windows, doors, etc.)
        const hasTop = y > 0 && layout[y - 1][x] > 0;
        const hasBottom = y < height - 1 && layout[y + 1][x] > 0;
        const hasLeft = x > 0 && layout[y][x - 1] > 0;
        const hasRight = x < width - 1 && layout[y][x + 1] > 0;
        
        // Determine frame based on surrounding tiles
        // Top-left corner
        if (!hasTop && !hasLeft) return 0;
        // Top-right corner
        if (!hasTop && !hasRight) return 2;
        // Bottom-left corner
        if (!hasBottom && !hasLeft) return 10;
        // Bottom-right corner
        if (!hasBottom && !hasRight) return 12;
        // Top wall
        if (!hasTop) return 1;
        // Bottom wall
        if (!hasBottom) return 11;
        // Left wall
        if (!hasLeft) return 5;
        // Right wall
        if (!hasRight) return 7;
        
        // Interior floor
        return 6;
    }

    /**
     * Add furniture inside the house
     * Furniture is placed on top of the floor layer
     */
    private addFurniture() {
        const houseX = 5; // Must match buildHouse position
        const houseY = 3; // Must match buildHouse position
        
        // Define furniture placements with individual depths
        // Frames: 0=painting, 30=table
        const furniturePlacements = [
            { x: 2, y: 0, frame: 0, name: 'painting', depth: 2.5 },      // Painting ON wall (above walls)
            { x: 3, y: 3, frame: 30, name: 'table', depth: 1.8 },        // Table on floor
        ];
        
        // Place each furniture item
        for (const furniture of furniturePlacements) {
            const worldX = (houseX + furniture.x) * this.tileSize + this.tileSize / 2;
            const worldY = (houseY + furniture.y) * this.tileSize + this.tileSize / 2;
            
            const item = this.scene.add.sprite(worldX, worldY, 'furniture', furniture.frame);
            item.setScale(4);
            item.setDepth(furniture.depth);
            item.setOrigin(0.5, 0.5);
            
            // Register collision boxes for furniture
            if (this.collisionManager) {
                const collisionBoxes = getCollisionBoxes('furniture', furniture.frame);
                if (collisionBoxes.length > 0) {
                    this.collisionManager.registerTileCollision(
                        houseX + furniture.x,
                        houseY + furniture.y,
                        collisionBoxes,
                        'furniture',
                        furniture.frame
                    );
                }
            }
        }
    }

    /**
     * Add puzzle objects (interactable items)
     */
    private addPuzzleObjects() {
        if (!this.interactionManager || !this.inventoryManager || !this.puzzleManager || !this.collisionManager) {
            console.warn('Managers not set, skipping puzzle objects');
            return;
        }

        const houseX = 5;
        const houseY = 3;

        // Add locked cabinet at position (9, 4) in world grid
        const cabinet = new LockedCabinet(
            this.scene,
            {
                gridX: houseX + 4,
                gridY: houseY + 1,
                spriteKey: 'furniture',
                frame: 21,
                scale: 4,
                depth: 1.8,
                name: 'Cabinet',
                blocksMovement: true
            },
            this.tileSize,
            this.inventoryManager,
            this.puzzleManager
        );
        this.interactionManager.addInteractable(cabinet);
        
        // Register cabinet collision
        const cabinetBoxes = getCollisionBoxes('furniture', 21);
        if (cabinetBoxes.length > 0) {
            this.collisionManager.registerTileCollision(
                houseX + 4,
                houseY + 1,
                cabinetBoxes,
                'furniture',
                21
            );
        }

        // Add hidden key behind flower pot at position (12, 6) in world grid
        const key = new HiddenKey(
            this.scene,
            {
                gridX: houseX + 7,
                gridY: houseY + 3,
                spriteKey: 'furniture',
                frame: 5,
                scale: 4,
                depth: 1.8,
                name: 'Flower Pot',
                blocksMovement: false
            },
            this.tileSize,
            this.inventoryManager,
            this.puzzleManager
        );
        this.interactionManager.addInteractable(key);
    }
}
