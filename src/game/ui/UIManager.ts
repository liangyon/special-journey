import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class UIManager {
    private scene: Scene;
    private interactionPrompt: Phaser.GameObjects.Text | null = null;
    private messageBox: Phaser.GameObjects.Container | null = null;
    private inventoryDisplay: Phaser.GameObjects.Container | null = null;
    private journalOverlay: Phaser.GameObjects.Container | null = null;
    private messageTimeout: NodeJS.Timeout | null = null;

    constructor(scene: Scene) {
        this.scene = scene;
        this.setupEventListeners();
        this.createInventoryDisplay();
    }

    private setupEventListeners(): void {
        EventBus.on('show-interaction-prompt', this.showInteractionPrompt, this);
        EventBus.on('hide-interaction-prompt', this.hideInteractionPrompt, this);
        EventBus.on('show-message', this.showMessage, this);
        EventBus.on('show-journal', this.showJournal, this);
        EventBus.on('update-inventory', this.updateInventoryDisplay, this);
    }

    /**
     * Show the interaction prompt above the player
     */
    private showInteractionPrompt(objectName: string): void {
        if (!this.interactionPrompt) {
            this.interactionPrompt = this.scene.add.text(640, 100, '', {
                fontSize: '20px',
                color: '#ffffff',
                backgroundColor: '#000000',
                padding: { x: 10, y: 5 }
            });
            this.interactionPrompt.setOrigin(0.5, 0.5);
            this.interactionPrompt.setDepth(1000);
            this.interactionPrompt.setScrollFactor(0);
        }
        
        this.interactionPrompt.setText(`[E] Examine ${objectName}`);
        this.interactionPrompt.setVisible(true);
    }

    /**
     * Hide the interaction prompt
     */
    private hideInteractionPrompt(): void {
        if (this.interactionPrompt) {
            this.interactionPrompt.setVisible(false);
        }
    }

    /**
     * Show a message to the player
     */
    private showMessage(message: string): void {
        // Clear existing message timeout
        if (this.messageTimeout) {
            clearTimeout(this.messageTimeout);
            this.messageTimeout = null;
        }

        // Destroy existing message box
        if (this.messageBox) {
            this.messageBox.destroy();
        }

        // Create message container
        this.messageBox = this.scene.add.container(640, 500);
        this.messageBox.setDepth(1001);
        this.messageBox.setScrollFactor(0);

        // Background
        const bg = this.scene.add.rectangle(0, 0, 700, 100, 0x000000, 0.85);
        const border = this.scene.add.rectangle(0, 0, 700, 100, 0xffffff, 0);
        border.setStrokeStyle(2, 0xffffff);

        // Message text
        const text = this.scene.add.text(0, 0, message, {
            fontSize: '18px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 650 }
        });
        text.setOrigin(0.5, 0.5);

        this.messageBox.add([bg, border, text]);

        // Auto-hide after 4 seconds
        this.messageTimeout = setTimeout(() => {
            if (this.messageBox) {
                this.messageBox.destroy();
                this.messageBox = null;
            }
            this.messageTimeout = null;
        }, 4000);
    }

    /**
     * Create inventory display
     */
    private createInventoryDisplay(): void {
        this.inventoryDisplay = this.scene.add.container(1150, 50);
        this.inventoryDisplay.setDepth(1000);
        this.inventoryDisplay.setScrollFactor(0);

        // Title
        const title = this.scene.add.text(0, 0, 'INVENTORY', {
            fontSize: '16px',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        title.setOrigin(0.5, 0);

        this.inventoryDisplay.add(title);
    }

    /**
     * Update inventory display
     */
    private updateInventoryDisplay(items: string[]): void {
        if (!this.inventoryDisplay) return;

        // Clear existing items (keep title)
        while (this.inventoryDisplay.length > 1) {
            const item = this.inventoryDisplay.getAt(1);
            if (item) {
                (item as Phaser.GameObjects.GameObject).destroy();
            }
        }

        // Add items
        items.forEach((item, index) => {
            const itemText = this.scene.add.text(0, 30 + (index * 25), `• ${item}`, {
                fontSize: '14px',
                color: '#ffdd00'
            });
            itemText.setOrigin(0.5, 0);
            this.inventoryDisplay!.add(itemText);
        });
    }

    /**
     * Show journal overlay
     */
    private showJournal(data: { title: string, content: string }): void {
        // Create full-screen overlay
        this.journalOverlay = this.scene.add.container(640, 480);
        this.journalOverlay.setDepth(2000);
        this.journalOverlay.setScrollFactor(0);

        // Dark background
        const darkBg = this.scene.add.rectangle(0, 0, 1280, 960, 0x000000, 0.8);
        
        // Journal page background
        const journalBg = this.scene.add.rectangle(0, 0, 700, 600, 0xf4e4c1, 1);
        const journalBorder = this.scene.add.rectangle(0, 0, 700, 600, 0x8b4513, 0);
        journalBorder.setStrokeStyle(4, 0x8b4513);

        // Title
        const titleText = this.scene.add.text(0, -250, data.title, {
            fontSize: '24px',
            color: '#000000',
            fontStyle: 'bold',
            align: 'center'
        });
        titleText.setOrigin(0.5, 0);

        // Decorative line
        const line = this.scene.add.rectangle(0, -210, 600, 2, 0x8b4513);

        // Content
        const contentText = this.scene.add.text(0, -170, data.content, {
            fontSize: '16px',
            color: '#2c1810',
            align: 'center',
            wordWrap: { width: 600 },
            lineSpacing: 8
        });
        contentText.setOrigin(0.5, 0);

        // Close instruction
        const closeText = this.scene.add.text(0, 260, '[Press any key to close]', {
            fontSize: '14px',
            color: '#666666',
            fontStyle: 'italic'
        });
        closeText.setOrigin(0.5, 0);

        this.journalOverlay.add([darkBg, journalBg, journalBorder, titleText, line, contentText, closeText]);

        // Close on any key press
        const closeHandler = () => {
            if (this.journalOverlay) {
                this.journalOverlay.destroy();
                this.journalOverlay = null;
            }
            this.scene.input.keyboard!.off('keydown', closeHandler);
        };
        
        this.scene.input.keyboard!.once('keydown', closeHandler);
    }

    /**
     * Cleanup
     */
    destroy(): void {
        EventBus.off('show-interaction-prompt', this.showInteractionPrompt, this);
        EventBus.off('hide-interaction-prompt', this.hideInteractionPrompt, this);
        EventBus.off('show-message', this.showMessage, this);
        EventBus.off('show-journal', this.showJournal, this);
        EventBus.off('update-inventory', this.updateInventoryDisplay, this);

        if (this.messageTimeout) {
            clearTimeout(this.messageTimeout);
        }
    }
}
