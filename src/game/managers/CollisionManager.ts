import { Scene } from 'phaser';
import { CollisionBox } from '../config/CollisionBoxes';

/**
 * A world-space collision rectangle
 */
export interface WorldCollisionBox {
    x: number;      // World X position (pixels)
    y: number;      // World Y position (pixels)
    width: number;  // Width in pixels
    height: number; // Height in pixels
    spritesheet?: string;  // Optional: for debugging
    frame?: number;        // Optional: for debugging
}

/**
 * Manages AABB collision detection with custom collision boxes per tile
 */
export class CollisionManager {
    private scene: Scene;
    private collisionBoxes: WorldCollisionBox[] = [];
    private tileSize: number;
    private gridWidth: number;
    private gridHeight: number;
    
    // Debug visualization
    private debugGraphics: Phaser.GameObjects.Graphics | null = null;
    private showDebug: boolean = false;

    constructor(scene: Scene, gridWidth: number, gridHeight: number, tileSize: number = 64) {
        this.scene = scene;
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.tileSize = tileSize;
        
        // Create debug graphics object
        this.debugGraphics = this.scene.add.graphics();
        this.debugGraphics.setDepth(10000); // Always on top
        this.debugGraphics.setVisible(false);
    }

    /**
     * Register a collision box for a tile at a grid position
     */
    registerTileCollision(
        gridX: number, 
        gridY: number, 
        boxes: CollisionBox[], 
        spritesheet?: string, 
        frame?: number
    ): void {
        // Convert relative collision boxes to world-space rectangles
        const worldX = gridX * this.tileSize;
        const worldY = gridY * this.tileSize;

        for (const box of boxes) {
            this.collisionBoxes.push({
                x: worldX + (box.x * this.tileSize),
                y: worldY + (box.y * this.tileSize),
                width: box.width * this.tileSize,
                height: box.height * this.tileSize,
                spritesheet,
                frame
            });
        }
    }

    /**
     * Remove all collision boxes for a specific grid position
     */
    unregisterTileCollision(gridX: number, gridY: number): void {
        const worldX = gridX * this.tileSize;
        const worldY = gridY * this.tileSize;
        const worldX2 = worldX + this.tileSize;
        const worldY2 = worldY + this.tileSize;

        // Remove any boxes that are within this tile's bounds
        this.collisionBoxes = this.collisionBoxes.filter(box => {
            return !(box.x >= worldX && box.x < worldX2 && 
                     box.y >= worldY && box.y < worldY2);
        });
    }

    /**
     * Clear all collision boxes
     */
    clearAll(): void {
        this.collisionBoxes = [];
    }

    /**
     * Check if a circle (player) collides with any registered collision boxes
     * Returns null if no collision, or the collision box if there is one
     */
    checkCircleCollision(centerX: number, centerY: number, radius: number): WorldCollisionBox | null {
        for (const box of this.collisionBoxes) {
            if (this.circleRectIntersect(centerX, centerY, radius, box)) {
                return box;
            }
        }
        return null;
    }

    /**
     * Check collision on X axis only (for sliding)
     */
    checkCircleCollisionX(centerX: number, centerY: number, radius: number): WorldCollisionBox | null {
        for (const box of this.collisionBoxes) {
            // Check if circle would intersect on X axis
            const closestX = Math.max(box.x, Math.min(centerX, box.x + box.width));
            const closestY = Math.max(box.y, Math.min(centerY, box.y + box.height));
            
            const distanceX = centerX - closestX;
            const distanceY = centerY - closestY;
            
            // Only count as collision if X contributes to overlap
            if (distanceX * distanceX + distanceY * distanceY < radius * radius) {
                // Check if removing X movement would resolve collision
                const centerXOnly = Math.max(box.x, Math.min(centerX, box.x + box.width));
                if (Math.abs(centerX - centerXOnly) > 0.1) {
                    return box;
                }
            }
        }
        return null;
    }

    /**
     * Check collision on Y axis only (for sliding)
     */
    checkCircleCollisionY(centerX: number, centerY: number, radius: number): WorldCollisionBox | null {
        for (const box of this.collisionBoxes) {
            // Check if circle would intersect on Y axis
            const closestX = Math.max(box.x, Math.min(centerX, box.x + box.width));
            const closestY = Math.max(box.y, Math.min(centerY, box.y + box.height));
            
            const distanceX = centerX - closestX;
            const distanceY = centerY - closestY;
            
            // Only count as collision if Y contributes to overlap
            if (distanceX * distanceX + distanceY * distanceY < radius * radius) {
                // Check if removing Y movement would resolve collision
                const centerYOnly = Math.max(box.y, Math.min(centerY, box.y + box.height));
                if (Math.abs(centerY - centerYOnly) > 0.1) {
                    return box;
                }
            }
        }
        return null;
    }

    /**
     * Check if a circle intersects with a rectangle (AABB collision)
     */
    private circleRectIntersect(
        circleX: number, 
        circleY: number, 
        radius: number, 
        rect: WorldCollisionBox
    ): boolean {
        // Find the closest point on the rectangle to the circle
        const closestX = Math.max(rect.x, Math.min(circleX, rect.x + rect.width));
        const closestY = Math.max(rect.y, Math.min(circleY, rect.y + rect.height));
        
        // Calculate distance from circle center to closest point
        const distanceX = circleX - closestX;
        const distanceY = circleY - closestY;
        
        // Check if distance is less than radius
        return (distanceX * distanceX + distanceY * distanceY) < (radius * radius);
    }

    /**
     * Get all collision boxes (for debugging)
     */
    getAllCollisionBoxes(): WorldCollisionBox[] {
        return this.collisionBoxes;
    }
    
    /**
     * Toggle debug visualization
     */
    toggleDebug(): void {
        this.showDebug = !this.showDebug;
        if (this.debugGraphics) {
            this.debugGraphics.setVisible(this.showDebug);
        }
        if (this.showDebug) {
            this.renderDebug();
        }
    }
    
    /**
     * Check if debug mode is enabled
     */
    isDebugEnabled(): boolean {
        return this.showDebug;
    }
    
    /**
     * Render debug visualization of all collision boxes
     */
    renderDebug(): void {
        if (!this.debugGraphics || !this.showDebug) return;
        
        this.debugGraphics.clear();
        
        // Draw each collision box
        for (const box of this.collisionBoxes) {
            // Choose color based on spritesheet
            let color = 0xff0000; // Red for default
            let alpha = 0.3;
            
            if (box.spritesheet === 'water_tileset') {
                color = 0x0000ff; // Blue for water
            } else if (box.spritesheet === 'house_walls') {
                color = 0xffff00; // Yellow for walls
            } else if (box.spritesheet === 'furniture') {
                color = 0xff00ff; // Magenta for furniture
            } else if (box.spritesheet === 'doors') {
                color = 0x00ff00; // Green for doors
            }
            
            // Draw filled rectangle
            this.debugGraphics.fillStyle(color, alpha);
            this.debugGraphics.fillRect(box.x, box.y, box.width, box.height);
            
            // Draw border
            this.debugGraphics.lineStyle(2, color, 1);
            this.debugGraphics.strokeRect(box.x, box.y, box.width, box.height);
        }
    }
    
    /**
     * Update debug visualization (call each frame if debug is enabled)
     */
    updateDebug(): void {
        if (this.showDebug) {
            this.renderDebug();
        }
    }


    /**
     * Check if a position is within the grid bounds
     */
    private isValidPosition(gridX: number, gridY: number): boolean {
        return gridX >= 0 && gridX < this.gridWidth && gridY >= 0 && gridY < this.gridHeight;
    }

    /**
     * Block an entire region (deprecated - use registerTileCollision)
     */
    blockRegion(startX: number, startY: number, width: number, height: number): void {
        // Deprecated - use registerTileCollision instead
    }

    /**
     * Make an entire region walkable (deprecated - use unregisterTileCollision)
     */
    unblockRegion(startX: number, startY: number, width: number, height: number): void {
        // Deprecated - use unregisterTileCollision instead
    }
}
