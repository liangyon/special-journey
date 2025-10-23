import { Scene } from 'phaser';

export class InventoryManager {
    private scene: Scene;
    private items: Set<string>;

    constructor(scene: Scene) {
        this.scene = scene;
        this.items = new Set<string>();
    }

    /**
     * Add an item to the inventory
     */
    addItem(itemName: string): void {
        this.items.add(itemName);
        console.log(`Added ${itemName} to inventory`);
    }

    /**
     * Remove an item from the inventory
     */
    removeItem(itemName: string): void {
        this.items.delete(itemName);
        console.log(`Removed ${itemName} from inventory`);
    }

    /**
     * Check if inventory contains an item
     */
    hasItem(itemName: string): boolean {
        return this.items.has(itemName);
    }

    /**
     * Get all items in inventory
     */
    getItems(): string[] {
        return Array.from(this.items);
    }

    /**
     * Clear all items from inventory
     */
    clear(): void {
        this.items.clear();
    }

    /**
     * Get number of items in inventory
     */
    getItemCount(): number {
        return this.items.size;
    }
}
