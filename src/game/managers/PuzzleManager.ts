import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class PuzzleManager {
    private scene: Scene;
    private puzzleStates: Map<string, boolean>;

    constructor(scene: Scene) {
        this.scene = scene;
        this.puzzleStates = new Map<string, boolean>();
        
        // Initialize puzzle states
        this.initializePuzzles();
    }

    private initializePuzzles(): void {
        // Cabinet puzzle states
        this.puzzleStates.set('keyFound', false);
        this.puzzleStates.set('cabinetUnlocked', false);
        this.puzzleStates.set('puzzleComplete', false);
    }

    /**
     * Set a puzzle state
     */
    setState(key: string, value: boolean): void {
        this.puzzleStates.set(key, value);
        console.log(`Puzzle state: ${key} = ${value}`);
        
        // Emit event for state changes
        EventBus.emit('puzzle-state-changed', { key, value });
    }

    /**
     * Get a puzzle state
     */
    getState(key: string): boolean {
        return this.puzzleStates.get(key) ?? false;
    }

    /**
     * Check if all required states are true
     */
    checkCompletion(requiredStates: string[]): boolean {
        return requiredStates.every(state => this.getState(state));
    }

    /**
     * Complete the cabinet puzzle
     */
    completeCabinetPuzzle(): void {
        this.setState('puzzleComplete', true);
        
        // Emit event to show journal
        EventBus.emit('show-journal', {
            title: 'JOURNAL ENTRY - Day 1',
            content: `I've unlocked the old cabinet in the cottage. Inside, I found this journal belonging to the previous inhabitant...

"The island holds many secrets. Not everything is as it seems. Look for the hidden paths, examine everything carefully, and remember - the answers you seek are often right in front of you."

I wonder what other mysteries this island holds...`
        });
    }

    /**
     * Reset all puzzle states
     */
    reset(): void {
        this.initializePuzzles();
    }
}
