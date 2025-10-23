import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { MAIN_ISLAND } from '../data/IslandMaps';
import { TileManager } from '../managers/TileManager';
import { DecorationManager } from '../managers/DecorationManager';
import { CollisionManager } from '../managers/CollisionManager';
import { InteractionManager } from '../managers/InteractionManager';
import { InventoryManager } from '../managers/InventoryManager';
import { PuzzleManager } from '../managers/PuzzleManager';
import { UIManager } from '../ui/UIManager';
import { Player } from '../entities/Player';
import { GameConstants } from '../config/GameConstants';
import { MAIN_HOUSE, isWallTile, TILE_TYPES } from '../data/BuildingLayouts';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    wasdKeys: {
        W: Phaser.Input.Keyboard.Key;
        A: Phaser.Input.Keyboard.Key;
        S: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
    };
    
    // Grid settings
    tileSize: number = GameConstants.TILE_SIZE;
    gridWidth: number = GameConstants.GRID_WIDTH;
    gridHeight: number = GameConstants.GRID_HEIGHT;
    
    // Managers and entities
    private tileManager: TileManager;
    private decorationManager: DecorationManager;
    private collisionManager: CollisionManager;
    private interactionManager: InteractionManager;
    private inventoryManager: InventoryManager;
    private puzzleManager: PuzzleManager;
    private uiManager: UIManager;
    private player: Player;
    
    // Event listeners for cleanup
    private puzzleStateListener?: () => void;

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
    
    private setupCamera(): void {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(GameConstants.CAMERA.BACKGROUND_COLOR);
        
        // Center camera on the island
        const worldCenterX = (this.gridWidth * this.tileSize) / 2;
        const worldCenterY = (this.gridHeight * this.tileSize) / 2;
        this.camera.centerOn(worldCenterX, worldCenterY);
    }
    
    private createWorld()
    {
        // Initialize core managers
        this.collisionManager = new CollisionManager(this, this.gridWidth, this.gridHeight, this.tileSize);
        this.interactionManager = new InteractionManager(this);
        this.inventoryManager = new InventoryManager(this);
        this.puzzleManager = new PuzzleManager(this);
        this.uiManager = new UIManager(this);
        
        // Initialize world managers
        this.tileManager = new TileManager(
            this,
            MAIN_ISLAND,
            this.gridWidth,
            this.gridHeight,
            this.tileSize
        );
        this.tileManager.setCollisionManager(this.collisionManager);
        
        this.decorationManager = new DecorationManager(this, this.tileSize);
        this.decorationManager.setManagers(
            this.collisionManager,
            this.interactionManager,
            this.inventoryManager,
            this.puzzleManager
        );
        
        // Build the world
        this.tileManager.createIsland();
        this.decorationManager.addDecorations();
        
        // Create player with collision manager
        this.player = new Player(this, 10, 7, this.tileSize, this.collisionManager);
        
        // Listen for inventory changes with proper cleanup tracking
        this.puzzleStateListener = () => {
            EventBus.emit('update-inventory', this.inventoryManager.getItems());
        };
        EventBus.on('puzzle-state-changed', this.puzzleStateListener);
    }
    
    
    private setupControls(): void {
        if (!this.input.keyboard) {
            console.error('Keyboard input not available');
            return;
        }
        
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Add WASD keys as alternative controls - store them to avoid recreating every frame
        this.wasdKeys = this.input.keyboard.addKeys('W,A,S,D') as {
            W: Phaser.Input.Keyboard.Key;
            A: Phaser.Input.Keyboard.Key;
            S: Phaser.Input.Keyboard.Key;
            D: Phaser.Input.Keyboard.Key;
        };
        
        // Add debug toggle key (C)
        const debugKey = this.input.keyboard.addKey('C');
        debugKey.on('down', () => {
            this.collisionManager.toggleDebug();
            console.log(`Collision Debug: ${this.collisionManager.isDebugEnabled() ? 'ON' : 'OFF'}`);
        });
    }
    
    update(time: number, delta: number): void {
        // Update interaction system
        this.interactionManager.update(this.player.getGridX(), this.player.getGridY());
        
        // Get continuous movement input
        const movement = this.getMovementInput();
        
        // Update player movement (collision handled internally now)
        this.player.update(delta, movement.x, movement.y);
        
        // Update debug visualization if enabled
        this.collisionManager.updateDebug();
    }
    
    private getMovementInput(): { x: number; y: number } {
        if (this.cursors.left.isDown || this.wasdKeys.A.isDown) {
            return { x: -1, y: 0 };
        } else if (this.cursors.right.isDown || this.wasdKeys.D.isDown) {
            return { x: 1, y: 0 };
        } else if (this.cursors.up.isDown || this.wasdKeys.W.isDown) {
            return { x: 0, y: -1 };
        } else if (this.cursors.down.isDown || this.wasdKeys.S.isDown) {
            return { x: 0, y: 1 };
        }
        
        return { x: 0, y: 0 };
    }

    shutdown(): void {
        // Clean up event listeners to prevent memory leaks
        if (this.puzzleStateListener) {
            EventBus.off('puzzle-state-changed', this.puzzleStateListener);
            this.puzzleStateListener = undefined;
        }
    }

    changeScene(): void {
        this.scene.start('GameOver');
    }
}
