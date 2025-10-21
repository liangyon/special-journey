# Sprout Lands Asset Pack - Usage Guide

## Overview
The Sprout Lands Basic Pack by Cup Nooble contains pixel art assets for creating farming/adventure games. This guide explains how to integrate these assets into your Phaser game.

**License**: Non-commercial use, credit required: "Assets - From: Sprout Lands - By: Cup Nooble"

---

## Asset Structure

### 1. Characters (`Characters/`)
- **Basic Charakter Spritesheet.png** - Main character animations (4x4 grid, 16x16px frames)
  - Row 1: Walk down (4 frames)
  - Row 2: Walk up (4 frames)
  - Row 3: Walk right (4 frames)
  - Row 4: Walk left (4 frames)

- **Basic Charakter Actions.png** - Action animations (watering, hoeing, etc.)
- **Tools.png** - Tool sprites (hoe, watering can, axe, etc.)
- **Free Chicken Sprites.png** - Chicken animations
- **Free Cow Sprites.png** - Cow animations
- **Egg_And_Nest.png** - Egg and nest sprites

### 2. Objects (`Objects/`)
- **Basic_Furniture.png** - Indoor furniture sprites
- **Basic_Grass_Biom_things.png** - Outdoor decorations (rocks, grass, flowers)
- **Basic_Plants.png** - Crop growth stages
- **Basic_tools_and_meterials.png** - Tool and material items
- **Chest.png** - Chest sprites (open/closed states)
- **Egg_item.png** - Egg item sprite
- **Free_Chicken_House.png** - Chicken coop building
- **Paths.png** - Ground path tiles
- **Simple_Milk_and_grass_item.png** - Milk and grass items
- **Wood_Bridge.png** - Bridge tiles

### 3. Tilesets (`Tilesets/`)
- **Grass.png** - Grass terrain tiles with auto-tiling
- **Water.png** - Water terrain tiles with auto-tiling
- **Hills.png** - Hill/elevation tiles
- **Tilled_Dirt.png** & **Tilled_Dirt_v2.png** - Farmland tiles
- **Fences.png** - Fence tiles
- **Doors.png** - Door sprites
- **Wooden_House_Walls_Tilset.png** - Building wall tiles
- **Wooden_House_Roof_Tilset.png** - Building roof tiles
- **Bitmask references** - Visual guides for auto-tiling

---

## Phaser Implementation

### Loading Character Spritesheet

In your `Preloader.ts`:

```typescript
preload()
{
    this.load.setPath('assets/Sprout Lands - Sprites - Basic pack');
    
    // Load character spritesheet (4x4 grid, 16x16 frames)
    this.load.spritesheet('character', 'Characters/Basic Charakter Spritesheet.png', {
        frameWidth: 16,
        frameHeight: 16
    });
    
    // Load action spritesheet
    this.load.spritesheet('character_actions', 'Characters/Basic Charakter Actions.png', {
        frameWidth: 16,
        frameHeight: 16
    });
    
    // Load tools
    this.load.spritesheet('tools', 'Characters/Tools.png', {
        frameWidth: 16,
        frameHeight: 16
    });
}
```

### Creating Character Animations

In your `Preloader.ts` or `Game.ts` create method:

```typescript
create()
{
    // Walk Down (frames 0-3, row 0)
    this.anims.create({
        key: 'walk_down',
        frames: this.anims.generateFrameNumbers('character', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
    });
    
    // Walk Up (frames 4-7, row 1)
    this.anims.create({
        key: 'walk_up',
        frames: this.anims.generateFrameNumbers('character', { start: 4, end: 7 }),
        frameRate: 8,
        repeat: -1
    });
    
    // Walk Right (frames 8-11, row 2)
    this.anims.create({
        key: 'walk_right',
        frames: this.anims.generateFrameNumbers('character', { start: 8, end: 11 }),
        frameRate: 8,
        repeat: -1
    });
    
    // Walk Left (frames 12-15, row 3)
    this.anims.create({
        key: 'walk_left',
        frames: this.anims.generateFrameNumbers('character', { start: 12, end: 15 }),
        frameRate: 8,
        repeat: -1
    });
    
    // Idle poses (use first frame of each direction)
    this.anims.create({
        key: 'idle_down',
        frames: [{ key: 'character', frame: 0 }],
        frameRate: 1
    });
}
```

### Using Character in Game

In your `Game.ts`:

```typescript
createPlayer()
{
    // Create sprite with scaling for better visibility
    this.player = this.add.sprite(400, 300, 'character');
    this.player.setScale(3); // Scale up 16x16 sprite to 48x48
    
    // Play default animation
    this.player.play('idle_down');
}

update()
{
    // Example movement with animations
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-160);
        this.player.play('walk_left', true);
    } 
    else if (this.cursors.right.isDown) {
        this.player.setVelocityX(160);
        this.player.play('walk_right', true);
    }
    else if (this.cursors.up.isDown) {
        this.player.setVelocityY(-160);
        this.player.play('walk_up', true);
    }
    else if (this.cursors.down.isDown) {
        this.player.setVelocityY(160);
        this.player.play('walk_down', true);
    }
    else {
        this.player.setVelocity(0);
        // Play idle based on last direction
        this.player.play('idle_down', true);
    }
}
```

---

## Loading Tilesets and Tilemaps

### Option 1: Manual Tile Placement

```typescript
preload()
{
    this.load.image('grass_tiles', 'Tilesets/Grass.png');
    this.load.image('water_tiles', 'Tilesets/Water.png');
}

create()
{
    // Use the grass tileset as a texture atlas
    const grassTexture = this.textures.get('grass_tiles').getSourceImage();
    
    // Manually place specific tiles from the sheet
    // You'll need to calculate tile positions based on sheet layout
}
```

### Option 2: Using Tiled Map Editor (Recommended)

1. **In Tiled**:
   - Create a new map with 16x16 tile size
   - Import the Sprout Lands tilesets
   - Design your level
   - Export as JSON

2. **In Phaser**:
```typescript
preload()
{
    // Load the tilemap JSON
    this.load.tilemapTiledJSON('farm_map', 'maps/farm.json');
    
    // Load tilesets
    this.load.image('grass', 'Tilesets/Grass.png');
    this.load.image('water', 'Tilesets/Water.png');
    this.load.image('paths', 'Objects/Paths.png');
}

create()
{
    // Create tilemap
    const map = this.make.tilemap({ key: 'farm_map' });
    
    // Add tilesets
    const grassTiles = map.addTilesetImage('Grass', 'grass');
    const waterTiles = map.addTilesetImage('Water', 'water');
    
    // Create layers
    const groundLayer = map.createLayer('Ground', grassTiles, 0, 0);
    const waterLayer = map.createLayer('Water', waterTiles, 0, 0);
    
    // Set collision
    groundLayer.setCollisionByProperty({ collides: true });
}
```

---

## Loading Object Sprites

```typescript
preload()
{
    // Load object spritesheets
    this.load.spritesheet('furniture', 'Objects/Basic_Furniture.png', {
        frameWidth: 16,
        frameHeight: 16
    });
    
    this.load.spritesheet('plants', 'Objects/Basic_Plants.png', {
        frameWidth: 16,
        frameHeight: 16
    });
    
    this.load.image('chest', 'Objects/Chest.png');
    this.load.image('chicken_house', 'Objects/Free_Chicken_House.png');
}

create()
{
    // Place furniture (you'll need to determine frame numbers by inspecting the sheet)
    const table = this.add.sprite(200, 200, 'furniture', 0);
    table.setScale(3);
    
    // Place plants with growth animation
    const plant = this.add.sprite(300, 300, 'plants', 0);
    plant.setScale(3);
    
    // Animate plant growth
    this.anims.create({
        key: 'plant_grow',
        frames: this.anims.generateFrameNumbers('plants', { start: 0, end: 4 }),
        frameRate: 2,
        repeat: 0
    });
}
```

---

## Best Practices

### Scaling
- Base sprites are 16x16 pixels
- Scale 2x-4x for better visibility on modern screens
- Use consistent scaling throughout your game

### Animations
- Character walk animations work best at 6-10 FPS
- Action animations may vary (experiment with timing)
- Use `repeat: -1` for loops, `repeat: 0` for one-time actions

### Organization
```typescript
// Group related asset loading
private loadCharacterAssets() { }
private loadEnvironmentAssets() { }
private loadObjectAssets() { }

// Group animation creation
private createCharacterAnims() { }
private createObjectAnims() { }
```

### Performance
- Load only assets needed for current scene
- Use texture atlases for better performance
- Preload common assets in Boot/Preloader scene

---

## Common Frame Layouts

Most Sprout Lands spritesheets follow these patterns:

**Character Sheets**: 4x4 grid (16x16 each)
- 4 frames per direction
- Order: Down, Up, Right, Left

**Object Sheets**: Variable grid
- Inspect visually to determine layout
- Often organized by type or theme

**Tilesets**: Auto-tiling format
- Use bitmask references provided
- Requires understanding of tile connection patterns

---

## Example: Complete Character Setup

```typescript
// In Preloader.ts
preload()
{
    this.load.setPath('assets/Sprout Lands - Sprites - Basic pack');
    
    this.load.spritesheet('character', 'Characters/Basic Charakter Spritesheet.png', {
        frameWidth: 16,
        frameHeight: 16
    });
}

create()
{
    // Create all 4 directional walk animations
    const directions = ['down', 'up', 'right', 'left'];
    directions.forEach((dir, index) => {
        this.anims.create({
            key: `walk_${dir}`,
            frames: this.anims.generateFrameNumbers('character', { 
                start: index * 4, 
                end: index * 4 + 3 
            }),
            frameRate: 8,
            repeat: -1
        });
        
        this.anims.create({
            key: `idle_${dir}`,
            frames: [{ key: 'character', frame: index * 4 }],
            frameRate: 1
        });
    });
    
    this.scene.start('Game');
}
```

```typescript
// In Game.ts
createPlayer()
{
    this.player = this.add.sprite(
        this.gridWidth * this.tileSize / 2,
        this.gridHeight * this.tileSize / 2,
        'character'
    );
    this.player.setScale(4); // Scale to 64x64 for visibility
    this.player.play('idle_down');
    
    this.currentDirection = 'down';
}

update()
{
    let moving = false;
    let newDirection = this.currentDirection;
    
    if (this.cursors.left.isDown) {
        newDirection = 'left';
        moving = true;
    } else if (this.cursors.right.isDown) {
        newDirection = 'right';
        moving = true;
    } else if (this.cursors.up.isDown) {
        newDirection = 'up';
        moving = true;
    } else if (this.cursors.down.isDown) {
        newDirection = 'down';
        moving = true;
    }
    
    this.currentDirection = newDirection;
    
    if (moving) {
        this.player.play(`walk_${newDirection}`, true);
    } else {
        this.player.play(`idle_${newDirection}`, true);
    }
}
```

---

## Resources

- **Sprout Lands Discord**: https://discord.gg/PyDwcnPY
- **Creator Twitter**: @Sprout_Lands
- **Creator Carrd**: cupnooble.carrd.co

## Notes

- All sprites are designed for 16x16 base size
- Tilesets use auto-tiling (check bitmask references)
- Color palette file included for creating matching custom assets
- Remember to credit Cup Nooble in your project!
