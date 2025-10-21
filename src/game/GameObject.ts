import { Scene } from 'phaser';

export class GameObject extends Phaser.GameObjects.Container {
    gridX: number;
    gridY: number;
    tileSize: number;
    isInteractive: boolean;
    objectWidth: number;
    objectHeight: number;
    
    constructor(
        scene: Scene,
        gridX: number,
        gridY: number,
        tileSize: number,
        objectWidth: number = 1,
        objectHeight: number = 1,
        isInteractive: boolean = false
    ) {
        super(scene, 0, 0);
        
        this.gridX = gridX;
        this.gridY = gridY;
        this.tileSize = tileSize;
        this.isInteractive = isInteractive;
        this.objectWidth = objectWidth;
        this.objectHeight = objectHeight;
        
        // Calculate screen position
        this.updatePosition();
        
        scene.add.existing(this);
    }
    
    updatePosition() {
        // Position based on bottom of object for proper Y-sorting
        this.x = this.gridX * this.tileSize + this.tileSize / 2;
        this.y = (this.gridY + this.objectHeight) * this.tileSize;
        
        // Set depth based on Y position for proper sorting
        this.setDepth(this.y);
    }
    
    occupiesTile(gridX: number, gridY: number): boolean {
        return gridX >= this.gridX && 
               gridX < this.gridX + this.objectWidth &&
               gridY >= this.gridY && 
               gridY < this.gridY + this.objectHeight;
    }
    
    getInteractionPoint(): { x: number, y: number } {
        // Return the front of the object (one tile below)
        return {
            x: this.gridX + Math.floor(this.objectWidth / 2),
            y: this.gridY + this.objectHeight
        };
    }
}
