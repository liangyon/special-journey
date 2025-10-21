import { Scene } from 'phaser';

export class Player {
    private scene: Scene;
    private container: Phaser.GameObjects.Container;
    private tileSize: number;
    private gridX: number;
    private gridY: number;
    private isMoving: boolean = false;

    constructor(scene: Scene, startX: number, startY: number, tileSize: number) {
        this.scene = scene;
        this.gridX = startX;
        this.gridY = startY;
        this.tileSize = tileSize;

        this.container = this.createPlayerContainer();
        this.updatePosition();
    }

    private createPlayerContainer(): Phaser.GameObjects.Container {
        const container = this.scene.add.container(0, 0);

        const otterSprite = this.scene.add.sprite(0, -this.tileSize * 0.5, 'otter_0');
        otterSprite.setScale(2.0);
        otterSprite.play('otter_walk');

        container.add(otterSprite);
        return container;
    }

    private updatePosition() {
        this.container.x = this.gridX * this.tileSize + this.tileSize / 2;
        this.container.y = (this.gridY + 1) * this.tileSize;
        this.container.setDepth(this.container.y);
    }

    moveTo(newGridX: number, newGridY: number, onComplete?: () => void) {
        if (this.isMoving) return;

        this.isMoving = true;

        const targetX = newGridX * this.tileSize + this.tileSize / 2;
        const targetY = (newGridY + 1) * this.tileSize;

        this.scene.tweens.add({
            targets: this.container,
            x: targetX,
            y: targetY,
            duration: 150,
            ease: 'Power2',
            onUpdate: () => {
                this.container.setDepth(this.container.y);
            },
            onComplete: () => {
                this.gridX = newGridX;
                this.gridY = newGridY;
                this.isMoving = false;
                if (onComplete) onComplete();
            }
        });
    }

    getGridX(): number {
        return this.gridX;
    }

    getGridY(): number {
        return this.gridY;
    }

    isCurrentlyMoving(): boolean {
        return this.isMoving;
    }
}
