import { logger } from '@Utils/Logging';
import { WEBGL, Game } from 'phaser'
import { MainLoop } from './Scenes/MainLoop';
import { CharacterPlugin } from './GameObjects/Character/CharacterPlugin'

const myCustomCanvas = document.createElement('canvas');

myCustomCanvas.id = 'myCustomCanvas';

document.body.appendChild(myCustomCanvas);

const contextCreationConfig = {
    alpha: false,
    depth: false,
    antialias: true,
    premultipliedAlpha: true,
    stencil: true,
    preserveDrawingBuffer: false,
    failIfMajorPerformanceCaveat: false,
    powerPreference: 'default'
};

const myCustomContext = myCustomCanvas.getContext('webgl', contextCreationConfig);

let phaserConfig = {
    type: WEBGL,
    width: 1,
    height: 1,
    canvas: myCustomCanvas,
    context: myCustomContext,
    // fps: {
    //     target: 30,
    //     forceSetTimeOut: true
    // },
    plugins: {
        global: [
            { key: 'CharacterPlugin', plugin: CharacterPlugin, start: true },
        ]
    },
    scene: MainLoop
}

const game = new Game(phaserConfig)

function getScene(scene) {
    return game.scene.getScene(scene)
}

function addScene(scene, autoStart, data) {
    return game.scene.add(scene, getSceneConfig(scene), autoStart, data)
}

function removeScene(scene) {
    game.scene.remove(scene)
}

export { game, getScene, addScene, removeScene }