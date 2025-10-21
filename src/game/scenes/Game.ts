import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { MAIN_ISLAND } from '../data/IslandMaps';
import { TileManager } from '../managers/TileManager';
import { DecorationManager } from '../managers/DecorationManager';
import { Player } from '../entities/Player';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    
    // Grid settings
    tileSize: number = 64;
    gridWidth: number = 16;
    gridHeight: number = 14;
    
    // Managers and entities
    private tileManager: TileManager;
    private decorationManager: DecorationManager;
    private player: Player;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.setupCamera();
        this.createWorld();
        this.setupControls();

        EventBus.emit('current-scene-ready', this);
    }
    
    private setupCamera()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x5b9bd5); // Ocean blue
        
        // Center camera on the island
        const worldCenterX = (this.gridWidth * this.tileSize) / 2;
        const worldCenterY = (this.gridHeight * this.tileSize) / 2;
        this.camera.centerOn(worldCenterX, worldCenterY);
    }
    
    private createWorld()
    {
        // Initialize managers
        this.tileManager = new TileManager(
            this,
            MAIN_ISLAND,
            this.gridWidth,
            this.gridHeight,
            this.tileSize
        );
        
        this.decorationManager = new DecorationManager(this, this.tileSize);
        
        // Build the world
        this.tileManager.createIsland();
        this.decorationManager.addDecorations();
        
        // Create player
        this.player = new Player(this, 8, 6, this.tileSize);
    }
    
    private setupControls()
    {
        this.cursors = this.input.keyboard!.createCursorKeys();
        
        // Add WASD keys as alternative controls
        this.input.keyboard!.addKeys({
            w: Phaser.Input.Keyboard.KeyCodes.W,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            d: Phaser.Input.Keyboard.KeyCodes.D
        });
    }
    
    update()
    {
        if (this.player.isCurrentlyMoving()) return;
        
        const movement = this.getMovementInput();
        if (movement.x !== 0 || movement.y !== 0) {
            const newGridX = this.player.getGridX() + movement.x;
            const newGridY = this.player.getGridY() + movement.y;
            
            if (this.tileManager.isValidPosition(newGridX, newGridY)) {
                this.player.moveTo(newGridX, newGridY);
            }
        }
    }
    
    private getMovementInput(): { x: number, y: number }
    {
        const keys = this.input.keyboard!.addKeys('W,A,S,D') as any;
        
        if (this.cursors.left.isDown || keys.A.isDown) {
            return { x: -1, y: 0 };
        } else if (this.cursors.right.isDown || keys.D.isDown) {
            return { x: 1, y: 0 };
        } else if (this.cursors.up.isDown || keys.W.isDown) {
            return { x: 0, y: -1 };
        } else if (this.cursors.down.isDown || keys.S.isDown) {
            return { x: 0, y: 1 };
        }
        
        return { x: 0, y: 0 };
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
