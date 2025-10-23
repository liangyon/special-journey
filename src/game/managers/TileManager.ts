import { Scene } from 'phaser';
import { CollisionManager } from './CollisionManager';
import { CollisionBox } from '../config/CollisionBoxes';

interface Neighbors {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
    topLeft: boolean;
    topRight: boolean;
    bottomLeft: boolean;
    bottomRight: boolean;
}

export class TileManager {
    private scene: Scene;
    private islandMap: number[][];
    private gridWidth: number;
    private gridHeight: number;
    private tileSize: number;
    private collisionManager: CollisionManager | null = null;

    constructor(scene: Scene, islandMap: number[][], gridWidth: number, gridHeight: number, tileSize: number) {
        this.scene = scene;
        this.islandMap = islandMap;
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.tileSize = tileSize;
    }

    setCollisionManager(collisionManager: CollisionManager): void {
        this.collisionManager = collisionManager;
    }

    createIsland() {
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                this.createTile(x, y);
                
                // Register collision for water tiles (not walkable)
                if (this.collisionManager && this.islandMap[y][x] === 0) {
                    // Water tiles have full collision box
                    const waterCollisionBox: CollisionBox = {
                        x: 0,
                        y: 0,
                        width: 1,
                        height: 1
                    };
                    this.collisionManager.registerTileCollision(x, y, [waterCollisionBox], 'water_tileset', 0);
                }
            }
        }
    }

    private createTile(x: number, y: number) {
        const centerX = x * this.tileSize + this.tileSize / 2;
        const centerY = y * this.tileSize + this.tileSize / 2;

        // Always draw water first (base layer)
        this.createWaterTile(centerX, centerY);

        // Draw grass on top if it's land
        if (this.islandMap[y][x] === 1) {
            this.createGrassTile(centerX, centerY, x, y);
        }
    }

    private createWaterTile(x: number, y: number) {
        const waterTile = this.scene.add.sprite(x, y, 'water_tileset');
        waterTile.setScale(4); // Scale 16px to 64px
        waterTile.play('water_flow');
        waterTile.setDepth(0);
    }

    private createGrassTile(x: number, y: number, gridX: number, gridY: number) {
        const grassFrame = this.getGrassTileFrame(gridX, gridY);
        const grassTile = this.scene.add.sprite(x, y, 'grass_tileset', grassFrame);
        grassTile.setScale(4); // Scale 16px to 64px
        grassTile.setDepth(1); // Grass above water
    }

    private getGrassTileFrame(x: number, y: number): number {
        const neighbors = this.getNeighbors(x, y);

        // Check for inner corners first (highest priority)
        const innerCorner = this.checkInnerCorners(neighbors);
        if (innerCorner !== null) return innerCorner;

        // Check for outer corners
        const outerCorner = this.checkOuterCorners(neighbors);
        if (outerCorner !== null) return outerCorner;

        // Check for edges
        const edge = this.checkEdges(neighbors);
        if (edge !== null) return edge;

        // Default to center tile
        return 12;
    }

    private getNeighbors(x: number, y: number): Neighbors {
        return {
            // Direct neighbors
            top: this.hasGrass(x, y - 1),
            bottom: this.hasGrass(x, y + 1),
            left: this.hasGrass(x - 1, y),
            right: this.hasGrass(x + 1, y),

            // Diagonal neighbors
            topLeft: this.hasGrass(x - 1, y - 1),
            topRight: this.hasGrass(x + 1, y - 1),
            bottomLeft: this.hasGrass(x - 1, y + 1),
            bottomRight: this.hasGrass(x + 1, y + 1)
        };
    }

    private hasGrass(x: number, y: number): boolean {
        if (x < 0 || x >= this.gridWidth || y < 0 || y >= this.gridHeight) {
            return false;
        }
        return this.islandMap[y][x] === 1;
    }

    private checkInnerCorners(n: Neighbors): number | null {
        // Inner corners = concave corners (grass on all sides, missing one diagonal)

        // Frame 16: Top-left inner (missing bottom-right diagonal)
        if (n.right && n.bottom && !n.bottomRight && n.top && n.left) {
            return 16;
        }

        // Frame 17: Top-right inner (missing bottom-left diagonal)
        if (n.left && n.bottom && !n.bottomLeft && n.top && n.right) {
            return 17;
        }

        // Frame 27: Bottom-left inner (missing top-right diagonal)
        if (n.right && n.top && !n.topRight && n.bottom && n.left) {
            return 27;
        }

        // Frame 28: Bottom-right inner (missing top-left diagonal)
        if (n.left && n.top && !n.topLeft && n.bottom && n.right) {
            return 28;
        }

        return null;
    }

    private checkOuterCorners(n: Neighbors): number | null {
        // Outer corners = convex corners (2 adjacent sides)

        // Frame 0: Top-left outer corner
        if (!n.top && !n.left && n.bottom && n.right) {
            return 0;
        }

        // Frame 2: Top-right outer corner
        if (!n.top && !n.right && n.bottom && n.left) {
            return 2;
        }

        // Frame 22: Bottom-left outer corner
        if (!n.bottom && !n.left && n.top && n.right) {
            return 22;
        }

        // Frame 24: Bottom-right outer corner
        if (!n.bottom && !n.right && n.top && n.left) {
            return 24;
        }

        return null;
    }

    private checkEdges(n: Neighbors): number | null {
        // Frame 1: Top edge
        if (!n.top && n.left && n.right && n.bottom) {
            return 1;
        }

        // Frame 23: Bottom edge
        if (!n.bottom && n.left && n.right && n.top) {
            return 23;
        }

        // Frame 11: Left edge
        if (!n.left && n.top && n.bottom && n.right) {
            return 11;
        }

        // Frame 13: Right edge
        if (!n.right && n.top && n.bottom && n.left) {
            return 13;
        }

        return null;
    }

    isValidPosition(gridX: number, gridY: number): boolean {
        if (gridX < 0 || gridX >= this.gridWidth || gridY < 0 || gridY >= this.gridHeight) {
            return false;
        }
        return this.islandMap[gridY][gridX] === 1;
    }
}
