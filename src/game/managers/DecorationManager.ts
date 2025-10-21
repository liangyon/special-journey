import { Scene } from 'phaser';

export class DecorationManager {
    private scene: Scene;
    private tileSize: number;

    constructor(scene: Scene, tileSize: number) {
        this.scene = scene;
        this.tileSize = tileSize;
    }

    addDecorations() {
        this.addRocks();
        this.addTrees();
    }

    private addRocks() {
        const rocks = [
            { x: 6, y: 4 },
            { x: 10, y: 5 },
            { x: 13, y: 8 }
        ];

        rocks.forEach(rock => {
            const rockSprite = this.scene.add.circle(
                rock.x * this.tileSize + this.tileSize / 2,
                rock.y * this.tileSize + this.tileSize / 2,
                this.tileSize / 3,
                0x808080
            );
            rockSprite.setDepth(rock.y * this.tileSize);
        });
    }

    private addTrees() {
        const trees = [
            { x: 4, y: 6 },
            { x: 12, y: 7 }
        ];

        trees.forEach(tree => {
            const trunk = this.scene.add.rectangle(
                tree.x * this.tileSize + this.tileSize / 2,
                tree.y * this.tileSize + this.tileSize / 2,
                this.tileSize / 5,
                this.tileSize / 2,
                0x8b4513
            );
            const leaves = this.scene.add.circle(
                tree.x * this.tileSize + this.tileSize / 2,
                tree.y * this.tileSize + this.tileSize / 3,
                this.tileSize / 2.5,
                0x2d5016
            );
            trunk.setDepth(tree.y * this.tileSize);
            leaves.setDepth(tree.y * this.tileSize);
        });
    }
}
