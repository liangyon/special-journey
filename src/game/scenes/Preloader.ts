import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load your otter sprites
        this.load.setPath('assets');
        
        this.load.image('otter_0', 'Otter Base/sprite_0.png');
        this.load.image('otter_1', 'Otter Base/sprite_1.png');
        this.load.image('otter_2', 'Otter Base/sprite_2.png');
        this.load.image('otter_3', 'Otter Base/sprite_3.png');
        this.load.image('otter_4', 'Otter Base/sprite_4.png');
        this.load.image('otter_5', 'Otter Base/sprite_5.png');
        
        this.load.image('otter_walk_0', 'Otter Walk/sprite_0.png');
        this.load.image('otter_walk_1', 'Otter Walk/sprite_1.png');
        this.load.image('otter_walk_2', 'Otter Walk/sprite_2.png');
        this.load.image('otter_walk_3', 'Otter Walk/sprite_3.png');
        
        //  Load Sprout Lands tilesets (these contain multiple tiles)
        this.load.setPath('assets/Sprout Lands - Sprites - Basic pack');
        this.load.spritesheet('grass_tileset', 'Tilesets/Grass.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('water_tileset', 'Tilesets/Water.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('house_walls', 'Tilesets/Wooden_House_Walls_Tilset.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('doors', 'Tilesets/Doors.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('furniture', 'Objects/Basic_Furniture.png', {
            frameWidth: 16,
            frameHeight: 16
        });
    }

    create ()
    {
        //  Create otter idle animation using Otter Base sprites
        this.anims.create({
            key: 'otter_idle',
            frames: [
                { key: 'otter_0' },
                { key: 'otter_1' },
                { key: 'otter_2' },
                { key: 'otter_3' },
                { key: 'otter_4' },
                { key: 'otter_5' }
            ],
            frameRate: 8,
            repeat: -1
        });
        
        //  Create otter walk animation using Otter Walk sprites
        this.anims.create({
            key: 'otter_walk',
            frames: [
                { key: 'otter_walk_0' },
                { key: 'otter_walk_1' },
                { key: 'otter_walk_2' },
                { key: 'otter_walk_3' }
            ],
            frameRate: 6,
            repeat: -1
        });
        
        //  Create water animation (frames 0-4)
        this.anims.create({
            key: 'water_flow',
            frames: this.anims.generateFrameNumbers('water_tileset', { start: 0, end: 3 }),
            frameRate: 3,
            repeat: -1
        });

        //  Go straight to the game
        this.scene.start('Game');
    }
}
