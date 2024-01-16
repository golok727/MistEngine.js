import VectorBase, { type Vec2Args } from "./vector";
/**
 * Vector 2
 */
export default class Vector2 extends VectorBase {
	x!: number;
	y!: number;
	constructor(...args: Vec2Args) {
		super();
		VectorBase.ConstructVectorFromArguments(this, args);
	}

	static new(...args: Vec2Args) {
		return new Vector2(...args);
	}

	setX(x: number) {
		this.x = x;
	}

	setY(y: number) {
		this.y = y;
	}
}
