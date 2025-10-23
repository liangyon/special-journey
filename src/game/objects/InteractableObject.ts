import { Scene } from 'phaser';

export interface InteractableConfig {
    gridX: number;
    gridY: number;
    spriteKey: string;
    frame?: number;
    scale?: number;
    depth?: number;
    name: string;
    blocksMovement?: boolean;
}

export abstract class InteractableObject {
    protected scene: Scene;
    protected sprite: Phaser.GameObjects.Sprite;
    protected gridX: number;
    protected gridY: number;
    protected name: string;
    protected blocksMovement: boolean;
    protected tileSize: number;

    constructor(scene: Scene, config: InteractableConfig, tileSize: number) {
        this.scene = scene;
        this.gridX = config.gridX;
        this.gridY = config.gridY;
        this.name = config.name;
        this.blocksMovement = config.blocksMovement ?? true;
        this.tileSize = tileSize;

        // Create sprite
        const worldX = this.gridX * tileSize + tileSize / 2;
        const worldY = this.gridY * tileSize + tileSize / 2;

        this.sprite = scene.add.sprite(worldX, worldY, config.spriteKey, config.frame);
        this.sprite.setScale(config.scale ?? 4);
        this.sprite.setDepth(config.depth ?? 1.8);
        this.sprite.setOrigin(0.5, 0.5);
    }

    /**
     * Called when player interacts with this object
     * Returns a message to display, or null if no message
     */
    abstract onInteract(): string | null;

    /**
     * Check if player is adjacent to this object
     */
    isAdjacentTo(playerX: number, playerY: number): boolean {
        const dx = Math.abs(this.gridX - playerX);
        const dy = Math.abs(this.gridY - playerY);
        return (dx <= 1 && dy === 0) || (dx === 0 && dy <= 1);
    }

    getGridPosition(): { x: number, y: number } {
        return { x: this.gridX, y: this.gridY };
    }

    getName(): string {
        return this.name;
    }

    shouldBlockMovement(): boolean {
        return this.blocksMovement;
    }

    destroy(): void {
        this.sprite.destroy();
    }

    setVisible(visible: boolean): void {
        this.sprite.setVisible(visible);
    }

    setBlocksMovement(blocks: boolean): void {
        this.blocksMovement = blocks;
    }
}
