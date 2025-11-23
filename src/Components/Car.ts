import type { GameScene } from '../scenes/GameScene';
import type { TrackSegment } from './TrackSegment';
import { gameSettings } from '../config/GameSettings';
import { Util } from '../utils/Util';
import type { Road } from './Road';

export class Car {
	private readonly MAX_FRAME_DISTANCE = 20;
	private readonly MIN_LATERAL_DIFF = 0.3;
	private readonly LOOKAHEAD_SEGMENTS = 50;

	public scene: GameScene;
	public road: Road;
	public sprite: Phaser.GameObjects.Sprite;
	public offset: number = 0;
	public speed: number = 0;
	public trackPosition: number = 0;
	public percent: number = 0;
	public scale: number = 1500;

	constructor(scene: GameScene, road: Road, offset: number, trackPosition: number, sprite: string, speed: number) {
		this.scene = scene;
		this.road = road;
		this.offset = offset;
		this.speed = speed;
		this.trackPosition = trackPosition;
		this.sprite = this.scene.add.sprite(0, 0, sprite, 0).setOrigin(0.5, 1).setVisible(false);
	}

	private steerAwayFrom(targetOffset: number, delta: number, strength: number = 1): void {
		const dt = delta / 1000;
		const direction = targetOffset < this.offset ? 1 : -1;

		this.offset = Util.interpolate(this.offset, direction, dt * strength);
	}

	public update(delta: number, carSegment: TrackSegment, playerSegment: TrackSegment, playerOffset: number): void {
		this.updateOffset(delta, carSegment, playerSegment);
		this.updateAngleFrame(carSegment, playerSegment, playerOffset);
	}

	public draw(x: number = 0, y: number = 0, scale: number = 1, segmentClip: number = 0) {
		this.sprite.setPosition(x, y);
		this.sprite.setScale(this.scale * scale);
		this.sprite.setDepth(10 + scale); // draw order

		if (!this.sprite.visible) {
			this.sprite.setVisible(true);
		}

		// calculate clipping behind hills
		if (y > segmentClip) {
			const clipped = (y - segmentClip) / this.sprite.scaleY;
			const cropY = this.sprite.height - clipped;
			this.sprite.setCrop(0, 0, this.sprite.width, cropY);
		} else {
			this.sprite.setCrop();
		}
	}

	public updateAngleFrame(carSegment: TrackSegment, playerSegment: TrackSegment, playerOffset: number): void {
		const roadDistance = Math.abs(carSegment.index - playerSegment.index);
		const offsetDistance = Math.abs(playerOffset - this.offset);
		const isPlayerRight = playerOffset > this.offset;

		if (roadDistance < this.MAX_FRAME_DISTANCE && offsetDistance > this.MIN_LATERAL_DIFF) {
			this.sprite.setFrame(1);
			this.sprite.flipX = !isPlayerRight;
		} else {
			this.sprite.setFrame(0);
		}
	}

	public updateOffset(delta: number, carSegment: TrackSegment, playerSegment: TrackSegment): void {
		// segments ahead to see if there's somethign to avoid
		const player = this.scene.player;

		// car not visible, don't do ai behaviour
		if (carSegment.index - playerSegment.index > gameSettings.drawDistance) {
			return;
		}

		for (let i = 0; i < this.LOOKAHEAD_SEGMENTS; i++) {
			const segment = this.road.segments[(carSegment.index + i) % this.road.segments.length];

			if (segment === playerSegment && this.speed > player.speed && Util.overlapPlayer(player, this)) {
				this.steerAwayFrom(player.x, delta);
			}

			if (segment.cars.size) {
				segment.cars.forEach((car: Car) => {
					if (car === this) {
						return;
					}

					if (this.speed > car.speed && Util.overlapSprite(car.sprite, this.sprite)) {
						this.steerAwayFrom(car.offset, delta);
					}
				});
			}
		}

		// steer towards center of track if outside it
		if (Math.abs(this.offset) > 0.9) {
			this.offset = Util.interpolate(this.offset, 0, delta);
		}
	}

	public destroy(): void {
		this.sprite.destroy();
	}
}
