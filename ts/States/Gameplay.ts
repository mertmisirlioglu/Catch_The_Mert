import 'p2';
import 'pixi';
import 'phaser';

import IGame from '../Fabrique/IGame';
// import Label from '../Objects/Label';
// import Label from '../Objects/LabeledButton';


// import {Sounds, Constants, Atlases} from '../Data';
// import {Menu} from './';

let speed: number = 6;
const gameState: any = { score: 0 };

export default class Gameplay extends Phaser.State {
    public static Name: string = 'gameplay';
    public static pause: boolean = false;

    public name: string = Gameplay.Name;
    public game: IGame;

    private background: Phaser.Image;
    // private text: Label;
    private rewardGroup: Phaser.Group;
    // private backBtn: LabeledButton;

    private hero: any = {
        sprite: undefined,
        direction: 'right',
        doNothing: true
    };

    private cursors: Phaser.CursorKeys;
    private attackButton: Phaser.Key;
    private reward_music: any;

    constructor() {
        super();
    }
    public preload(): void {
        this.load.image('mert_photo1', 'assets/sprites/mert_photo.png');
        this.load.image('mert_photo2', 'assets/sprites/mert_photo_second.png');
        this.load.image('bg_game', 'assets/sprites/bg_game.png');
        this.load.spritesheet('character', 'assets/sprites/spritesheet.png', 306, 306, 41);
        this.load.audio('reward_voice', 'assets/sound/reward.mp3');

    }

    public init(): void {
        this.game.world.removeAll();
        //Play background music

    }

    public create(): void {
        super.create();

        this.world.setBounds( 0, 0, this.world.width, this.world.height);

        //Send a screen view to Google to track different states
        // this.game.analytics.google.sendScreenView(this.name);

        this.background = this.game.add.sprite(0, 0,'bg_game');
        this.hero.sprite = this.game.add.sprite(0, 0, 'character');

        this.rewardGroup = this.game.add.group();
        this.game.physics.enable(this.hero.sprite);
        this.game.physics.arcade.enable(this.hero.sprite);
        this.hero.sprite.animations.add('idle', [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27], 3, true);
        this.hero.sprite.animations.add('walking', [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41], 5, true);
        this.hero.sprite.animations.add('attack', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 3, true);
        this.hero.sprite.body.collideWorldBounds = true;

        this.game.time.events.add(0, this.functionDestroyCreateReward, this);
        gameState.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '36px', fill: '#000000' });
        // let textStyle: any = {font: 'bold ' + 30 * Constants.GAME_SCALE + 'px Arial', fill: '#FFFFFF'};
        this.reward_music = this.game.add.sound('reward_voice');

        // this.text = new Label(this.game, 0, 0, 'time_to_play', textStyle);
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.attackButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        // this.backBtn = new LabeledButton(this.game, 0, 0, 'back', textStyle, this.startMenu, this, 300, 100);
        // this.backBtn.setFrames('btn_blue', 'btn_blue', 'btn_blue_onpress', 'btn_blue');

        this.resize();
    }

    public randomSpawn(): any {
        let category: number = Phaser.Math.between(1, 2);
        let x: number = Phaser.Math.between(0, this.game.width - 100);
        let y: number = Phaser.Math.between(0, this.game.height - 100);
        let reward: any;
        if (category === 1) {
            reward = this.game.add.sprite(x, y, 'mert_photo1');
            this.game.physics.arcade.enable(reward);
            reward.scale.setTo(0.5, 0.5);
            this.rewardGroup.add(reward);

        } else {
            reward = this.game.add.sprite(x, y, 'mert_photo2');
            this.game.physics.arcade.enable(reward);
            reward.scale.setTo(0.3, 0.3);
            this.rewardGroup.add(reward);

        }
        this.hero.sprite.bringToTop();
        return reward;
    }

    public update(): void {

        // this.game.input.keyboard.onDownCallback = this.somethingWasPressed;
        this.game.physics.arcade.collide(this.hero.sprite, this.rewardGroup.getTop(), this.collisionHandler, null, this);
        if (this.attackButton.isDown) {
            console.log('mert');
            this.hero.sprite.animations.play('attack', 60, false);

        }

        if (this.cursors.right.isDown) {
            this.hero.sprite.scale.setTo(0.7, 0.7);
            this.hero.sprite.x += speed;
            this.hero.sprite.animations.play('walking');

        } else if (this.cursors.left.isDown) {
            this.hero.sprite.scale.setTo(-0.7, 0.7);
            this.hero.sprite.x -= speed;
            this.hero.sprite.animations.play('walking');

        } else {
            this.hero.sprite.animations.stop('walking');
            if (this.hero.sprite.animations.currentAnim.isFinished) {
                this.hero.sprite.animations.play('idle');
            }
        }
        if (this.cursors.up.isDown) {
            this.hero.sprite.y -= speed;

        } else if (this.cursors.down.isDown) {

            this.hero.sprite.y += speed;
        }

    }

    public functionDestroyCreateReward(reward: any): any {
        if (reward != null) {
            reward.kill();
        }
        let new_reward: any = this.randomSpawn();
        this.game.time.events.add(2000, this.functionDestroyCreateReward, this, new_reward);

    }

    public collisionHandler(obj1: any, obj2: any): void {
        if (this.attackButton.isDown) {
            obj2.kill();
            this.reward_music.play();
            gameState.score += 10;
            gameState.scoreText.setText(`Score: ${gameState.score}`);
            console.log('killed');

        }

    }
    //
    // private startMenu(): void {
    //     this.game.state.add(Menu.Name, Menu, true);
    // }

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
        // this.text.alignIn(this.world.bounds, Phaser.TOP_RIGHT);
        gameState.scoreText.alignIn(this.world.bounds, Phaser.TOP_RIGHT);
        gameState.scoreText.anchor.setTo(1, 0);
        gameState.scoreText.y += 30;
        // this.backBtn.x = this.game.width / 2;
        // this.backBtn.y = this.text.y + this.text.height + this.backBtn.height;
    }

    public shutdown(): void {
        super.shutdown();

        this.background = null;
        // this.text = null;
        // this.backBtn = null;
    }
}
