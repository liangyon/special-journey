import { Scene } from 'phaser';
import { InteractableObject, InteractableConfig } from './InteractableObject';
import { InventoryManager } from '../managers/InventoryManager';
import { PuzzleManager } from '../managers/PuzzleManager';

export class HiddenKey extends InteractableObject {
    private inventory: InventoryManager;
    private puzzleManager: PuzzleManager;
    private collected: boolean = false;

    constructor(
        scene: Scene, 
        config: InteractableConfig, 
        tileSize: number,
        inventory: InventoryManager,
        puzzleManager: PuzzleManager
    ) {
        super(scene, config, tileSize);
        this.inventory = inventory;
        this.puzzleManager = puzzleManager;
    }

    onInteract(): string | null {
        if (this.collected) {
            return "You already collected the key from here.";
        }

        // Add key to inventory
        this.inventory.addItem('small_key');
        this.puzzleManager.setState('keyFound', true);
        this.collected = true;
        
        // Hide the key sprite
        this.setVisible(false);
        
        // Key no longer blocks movement
        this.setBlocksMovement(false);
        
        return "You found a small key hidden behind the flower pot!";
    }
}
