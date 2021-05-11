import 'p2';
import 'pixi';
import 'phaser';

import IGame from '../Fabrique/IGame';
import Label from '../Objects/Label';
import Label from '../Objects/LabeledButton';
import SoundManager from '../Managers/SoundManager';

import {Sounds, Constants, Atlases} from '../Data';
import {Menu} from './';

let speed: number = 6;

export default class Gameplay extends Phaser.State {
    public static Name: string = 'gameplay';
    public static pause: boolean = false;

    public name: string = Gameplay.Name;
    public game: IGame;

    private background: Phaser.Image;
    private text: Label;

    // private backBtn: LabeledButton;

    private hero: any = {
        sprite: undefined,
        direction: 'right',
        doNothing: true
    };

    constructor() {
        super();
    }
    public preload(): void {
        this.load.spritesheet('idle', 'assets/sprites/idle.png', 306, 306, 11);
        this.load.spritesheet('walking', 'assets/sprites/walking.png', 306, 306, 17);
        this.load.spritesheet('attacking', 'assets/sprites/attacking.png', 306, 306, 11);
    }

    public init(): void {
        this.game.world.removeAll();
        //Play background music
        SoundManager.getInstance().playMusic(Sounds.GameMusic);
    }

    public create(): void {
        super.create();

        this.world.setBounds( 0, 0, this.world.width, this.world.height);

        //Send a screen view to Google to track different states
        // this.game.analytics.google.sendScreenView(this.name);

        this.background = this.game.add.image(0, 0, Atlases.Interface, 'bg_blue');
        this.hero.sprite = this.game.add.sprite(0, 0, 'walking');

        this.hero.sprite.animations.add('idle');
        this.hero.sprite.animations.add('walking');
        this.hero.sprite.animations.add('attacking');
        let textStyle: any = {font: 'bold ' + 30 * Constants.GAME_SCALE + 'px Arial', fill: '#FFFFFF'};

        this.text = new Label(this.game, 0, 0, 'time_to_play', textStyle);

        // this.backBtn = new LabeledButton(this.game, 0, 0, 'back', textStyle, this.startMenu, this, 300, 100);
        // this.backBtn.setFrames('btn_blue', 'btn_blue', 'btn_blue_onpress', 'btn_blue');

        this.resize();
    }

    public update(): void {

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.hero.sprite.animations.play('attacking', 12 , false);
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.hero.sprite.scale.setTo(0.7, 0.7);
            this.hero.sprite.x += speed;
            this.hero.sprite.animations.play('walking', 12, true);

        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.hero.sprite.scale.setTo(-0.7, 0.7);
            this.hero.sprite.x -= speed;
            this.hero.sprite.animations.play('walking', 12, true);

        } else {
            this.hero.sprite.animations.stop('walking');
            this.hero.sprite.frame = 6;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            this.hero.sprite.y -= speed;

        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {

            this.hero.sprite.y += speed;
        }

    }
    //
    private startMenu(): void {
        this.game.state.add(Menu.Name, Menu, true);
    }

    /**
     * Called every time the rotation or game size has changed.
     * Rescales and repositions the objects.
     */
    public resize(): void {
        this.background.width = this.game.width;
        this.background.height = this.game.height;

        this.hero.width = 200;
        this.hero.height = 200;
        this.hero.sprite.x = 300;
        this.hero.sprite.y = 300;
        this.hero.sprite.scale.setTo(0.7, 0.7);
        this.text.alignIn(this.world.bounds, Phaser.TOP_RIGHT);

        // this.backBtn.x = this.game.width / 2;
        // this.backBtn.y = this.text.y + this.text.height + this.backBtn.height;
    }

    public shutdown(): void {
        super.shutdown();

        this.background = null;
        this.text = null;
        // this.backBtn = null;
    }
}
