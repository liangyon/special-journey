import { Scene } from 'phaser';
import { GameConstants } from '../config/GameConstants';
import { CollisionManager } from '../managers/CollisionManager';

export class Player {
    private scene: Scene;
    private container: Phaser.GameObjects.Container;
    private sprite: Phaser.GameObjects.Sprite;
    private tileSize: number;
    private gridX: number;
    private gridY: number;
    
    // Smooth movement properties
    private velocityX: number = 0;
    private velocityY: number = 0;
    private speed: number = GameConstants.PLAYER.SPEED;
    private acceleration: number = GameConstants.PLAYER.ACCELERATION;
    private deceleration: number = GameConstants.PLAYER.DECELERATION;
    
    // Collision properties
    private collisionRadius: number = 12; // Player collision radius in pixels
    private collisionOffsetY: number = 32; // Offset collision down from container position (positive = down)
    private collisionManager: CollisionManager | null = null;
    
    // Debug visualization
    private debugGraphics: Phaser.GameObjects.Graphics;

    constructor(scene: Scene, startX: number, startY: number, tileSize: number, collisionManager?: CollisionManager) {
        this.scene = scene;
        this.gridX = startX;
        this.gridY = startY;
        this.tileSize = tileSize;
        this.collisionManager = collisionManager || null;

        this.container = this.createPlayerContainer();
        
        // Create debug graphics for collision circle
        this.debugGraphics = this.scene.add.graphics();
        this.debugGraphics.setDepth(10001); // Above collision boxes
        
        this.updatePosition();
    }

    private createPlayerContainer(): Phaser.GameObjects.Container {
        const container = this.scene.add.container(0, 0);

        this.sprite = this.scene.add.sprite(
            0,
            -this.tileSize * GameConstants.PLAYER.SPRITE_OFFSET_Y,
            'otter_0'
        );
        this.sprite.setScale(GameConstants.PLAYER.SPRITE_SCALE);
        
        // Start with idle animation
        this.sprite.play('otter_idle');

        container.add(this.sprite);
        return container;
    }

    private updatePosition() {
        this.container.x = this.gridX * this.tileSize + this.tileSize / 2;
        this.container.y = (this.gridY + 1) * this.tileSize;
        this.container.setDepth(this.container.y);
    }

    update(delta: number, inputX: number, inputY: number): void {
        // Convert delta from milliseconds to seconds
        const dt = delta / 1000;
        
        // Apply acceleration based on input
        if (inputX !== 0 || inputY !== 0) {
            // Normalize diagonal movement
            const length = Math.sqrt(inputX * inputX + inputY * inputY);
            const normalizedX = inputX / length;
            const normalizedY = inputY / length;
            
            // Accelerate towards target velocity
            const targetVX = normalizedX * this.speed;
            const targetVY = normalizedY * this.speed;
            
            this.velocityX += (targetVX - this.velocityX) * Math.min(1, (this.acceleration * dt) / this.speed);
            this.velocityY += (targetVY - this.velocityY) * Math.min(1, (this.acceleration * dt) / this.speed);
        } else {
            // Decelerate when no input
            const currentSpeed = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
            if (currentSpeed > 0) {
                const decelAmount = this.deceleration * dt;
                const ratio = Math.max(0, (currentSpeed - decelAmount) / currentSpeed);
                this.velocityX *= ratio;
                this.velocityY *= ratio;
            }
        }
        
        // Calculate intended new position
        let newX = this.container.x + this.velocityX * dt;
        let newY = this.container.y + this.velocityY * dt;
        
        // Perform collision detection with sliding (apply Y offset for collision)
        if (this.collisionManager) {
            const currentX = this.container.x;
            const currentY = this.container.y;
            const collisionY = newY + this.collisionOffsetY;
            const currentCollisionY = currentY + this.collisionOffsetY;
            
            // Try moving in both axes
            const collision = this.collisionManager.checkCircleCollision(newX, collisionY, this.collisionRadius);
            
            if (collision) {
                // Try sliding along X axis
                const collisionX = this.collisionManager.checkCircleCollisionX(newX, currentCollisionY, this.collisionRadius);
                if (!collisionX) {
                    // Can slide along X
                    newX = newX;
                    newY = currentY;
                    this.velocityY = 0;
                } else {
                    // Try sliding along Y axis
                    const collisionYCheck = this.collisionManager.checkCircleCollisionY(currentX, collisionY, this.collisionRadius);
                    if (!collisionYCheck) {
                        // Can slide along Y
                        newX = currentX;
                        newY = newY;
                        this.velocityX = 0;
                    } else {
                        // Can't move, stop completely
                        newX = currentX;
                        newY = currentY;
                        this.velocityX = 0;
                        this.velocityY = 0;
                    }
                }
            }
        }
        
        // Apply the final position
        this.container.x = newX;
        this.container.y = newY;
        
        // Update grid position
        this.gridX = Math.round((newX - this.tileSize / 2) / this.tileSize);
        this.gridY = Math.round(newY / this.tileSize) - 1;
        
        this.container.setDepth(this.container.y);
        
        // Update animation based on velocity
        this.updateAnimation();
        
        // Update debug visualization if collision manager has debug enabled
        if (this.collisionManager?.isDebugEnabled()) {
            this.renderDebugCollision();
        } else {
            this.debugGraphics.clear();
        }
    }
    
    /**
     * Render debug visualization of player collision circle
     */
    private renderDebugCollision(): void {
        this.debugGraphics.clear();
        
        const collisionY = this.container.y + this.collisionOffsetY;
        
        // Draw collision circle at offset position
        this.debugGraphics.lineStyle(2, 0x00ff00, 1); // Green outline
        this.debugGraphics.strokeCircle(this.container.x, collisionY, this.collisionRadius);
        
        // Draw filled circle with transparency
        this.debugGraphics.fillStyle(0x00ff00, 0.2);
        this.debugGraphics.fillCircle(this.container.x, collisionY, this.collisionRadius);
        
        // Draw center point
        this.debugGraphics.fillStyle(0xff0000, 1);
        this.debugGraphics.fillCircle(this.container.x, collisionY, 2);
        
        // Draw line from container position to collision position to show offset
        this.debugGraphics.lineStyle(1, 0xffff00, 0.5);
        this.debugGraphics.lineBetween(this.container.x, this.container.y, this.container.x, collisionY);
    }

    private updateAnimation(): void {
        const speed = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
        if (speed > GameConstants.PLAYER.MOVEMENT_THRESHOLD) {
            if (!this.sprite.anims.isPlaying || this.sprite.anims.currentAnim?.key !== 'otter_walk') {
                this.sprite.play('otter_walk');
            }
        } else {
            if (!this.sprite.anims.isPlaying || this.sprite.anims.currentAnim?.key !== 'otter_idle') {
                this.sprite.play('otter_idle');
            }
        }
    }

    getGridX(): number {
        return this.gridX;
    }

    getGridY(): number {
        return this.gridY;
    }

    isMoving(): boolean {
        const speed = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
        return speed > GameConstants.PLAYER.MOVEMENT_THRESHOLD;
    }

    getContainer(): Phaser.GameObjects.Container {
        return this.container;
    }

    getTileSize(): number {
        return this.tileSize;
    }
    
    getCollisionRadius(): number {
        return this.collisionRadius;
    }
    
    getWorldX(): number {
        return this.container.x;
    }
    
    getWorldY(): number {
        return this.container.y;
    }
}
