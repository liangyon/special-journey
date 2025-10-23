import { Scene } from 'phaser';
import { InteractableObject } from '../objects/InteractableObject';
import { EventBus } from '../EventBus';

export class InteractionManager {
    private scene: Scene;
    private interactables: InteractableObject[];
    private interactKey: Phaser.Input.Keyboard.Key;

    constructor(scene: Scene) {
        this.scene = scene;
        this.interactables = [];
        
        // Set up E key for interaction
        this.interactKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    }

    /**
     * Register an interactable object
     */
    addInteractable(obj: InteractableObject): void {
        this.interactables.push(obj);
    }

    /**
     * Remove an interactable object
     */
    removeInteractable(obj: InteractableObject): void {
        const index = this.interactables.indexOf(obj);
        if (index > -1) {
            this.interactables.splice(index, 1);
        }
    }

    /**
     * Update - check for nearby objects and handle interaction
     */
    update(playerX: number, playerY: number): void {
        // Find nearby interactables
        const nearbyObjects = this.interactables.filter(obj => 
            obj.isAdjacentTo(playerX, playerY)
        );

        // Show/hide interaction prompt
        if (nearbyObjects.length > 0) {
            EventBus.emit('show-interaction-prompt', nearbyObjects[0].getName());
        } else {
            EventBus.emit('hide-interaction-prompt');
        }

        // Handle E key press
        if (Phaser.Input.Keyboard.JustDown(this.interactKey) && nearbyObjects.length > 0) {
            // Interact with the first nearby object
            const message = nearbyObjects[0].onInteract();
            
            if (message) {
                EventBus.emit('show-message', message);
            }
        }
    }

    /**
     * Get all interactable objects
     */
    getInteractables(): InteractableObject[] {
        return this.interactables;
    }

    /**
     * Clear all interactables
     */
    clear(): void {
        this.interactables.forEach(obj => obj.destroy());
        this.interactables = [];
    }
}
