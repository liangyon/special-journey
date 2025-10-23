import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1280,
    height: 960,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280,
        height: 960
    },
    render: {
        pixelArt: true,
        roundPixels: true
    },
    scene: [
        Boot,
        Preloader,
        MainGame
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
