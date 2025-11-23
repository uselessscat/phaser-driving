import { BaseScene } from './BaseScene';

export class LoadScene extends BaseScene {
	constructor(_key: string, _options: any) {
		super('LoadScene');
	}

	public preload(): void {
		const progress = this.add.graphics();

		this.load.on('progress', (value: number) => {
			progress.clear();
			progress.fillStyle(0xffffff, 1);
			progress.fillRect(0, this.scale.gameSize.height / 2, this.scale.gameSize.width * value, 60);
		});

		this.load.on('complete', () => {
			progress.destroy();
		});

		this.load.image('clouds1', './assets/images/clouds.png');
		this.load.image('clouds2', './assets/images/clouds2.png');
		this.load.image('mountain', './assets/images/mountain.png');
		this.load.image('hills', './assets/images/hills.png');
		this.load.image('boulder1', './assets/images/boulder.png');
		this.load.image('boulder2', './assets/images/boulder2.png');
		this.load.image('tree1', './assets/images/tree.png');
		this.load.image('tree2', './assets/images/tree2.png');
		this.load.image('tree3', './assets/images/tree3.png');
		this.load.image('turnsign', './assets/images/turn-sign.png');

		this.load.spritesheet('smoke', './assets/particles/smoke.png', { frameWidth: 16, frameHeight: 16 });

		this.load.spritesheet('car-green', './assets/images/car-green.png', { frameWidth: 64, frameHeight: 64 });
		this.load.spritesheet('car-army', './assets/images/car-army.png', { frameWidth: 64, frameHeight: 64 });
		this.load.spritesheet('car-red', './assets/images/car-red.png', { frameWidth: 64, frameHeight: 64 });
		this.load.spritesheet('car-yellow', './assets/images/car-yellow.png', { frameWidth: 64, frameHeight: 64 });
		this.load.spritesheet('car-blue', './assets/images/car-blue.png', { frameWidth: 64, frameHeight: 64 });

		this.load.binary('playercar', './assets/models/car.glb');

		this.load.audio('engine', ['./assets/sound/engine-loop.wav']);
		this.load.audio('tire-squeal', ['./assets/sound/tire-squeal.wav']);
		this.load.audio('collision', ['./assets/sound/car-collision.wav']);
		this.load.audio('confirm', ['./assets/sound/confirm.wav']);
		this.load.audio('explosion', ['./assets/sound/explosion.wav']);
		this.load.audio('select', ['./assets/sound/select.wav']);
		this.load.audio('time-extended', ['./assets/sound/time-extended.wav']);

		this.load.binary('dream-candy', './assets/sound/drozerix_-_dream_candy.xm');

		this.load.bitmapFont('numbers', './assets/fonts/number-font.png', './assets/fonts/number-font.xml');
		this.load.bitmapFont('impact', './assets/fonts/impact-24-outline.png', './assets/fonts/impact-24-outline.xml');
	}

	public create(): void {
		this.scene.start('GameScene', {});
	}
}
