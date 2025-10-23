import { Scene } from 'phaser';
import { InteractableObject, InteractableConfig } from './InteractableObject';
import { InventoryManager } from '../managers/InventoryManager';
import { PuzzleManager } from '../managers/PuzzleManager';

export class LockedCabinet extends InteractableObject {
    private inventory: InventoryManager;
    private puzzleManager: PuzzleManager;

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
        // Check if already unlocked
        if (this.puzzleManager.getState('cabinetUnlocked')) {
            return "The cabinet is open. There's nothing else inside.";
        }

        // Check if player has the key
        if (this.inventory.hasItem('small_key')) {
            // Unlock the cabinet
            this.puzzleManager.setState('cabinetUnlocked', true);
            this.inventory.removeItem('small_key');
            
            // Cabinet no longer blocks movement
            this.setBlocksMovement(false);
            
            // Complete the puzzle
            this.puzzleManager.completeCabinetPuzzle();
            
            return "The cabinet opens with a satisfying click! You found an old journal inside.";
        }

        // Cabinet is locked and player doesn't have key
        return "The cabinet is locked. Maybe there's a key nearby?";
    }
}
