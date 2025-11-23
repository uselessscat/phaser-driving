import type { PhaserDrivingGame } from '../game';
import type { PasuunaPlugin } from '@pinkkis/phaser-plugin-pasuuna';

export class BaseScene extends Phaser.Scene {
	public game: PhaserDrivingGame;
	public pasuuna: PasuunaPlugin;

	constructor(key: string, _options?: any) {
		super(key);
	}

	public setTimerEvent(timeMin: number, timeMax: number, callback: () => void, params?: any[]): Phaser.Time.TimerEvent {
		return this.time.delayedCall(Phaser.Math.Between(timeMin, timeMax), callback, params || [], this);
	}
}
