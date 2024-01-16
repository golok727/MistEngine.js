import VectorBase, { type Vec4Args } from "./vector";

/**
 * Vector 3
 */
export default class Vector4 extends VectorBase {
	x!: number;
	y!: number;
	z!: number;
	w!: number;
	constructor(...args: Vec4Args) {
		super();
		VectorBase.ConstructVectorFromArguments(this, args);
	}

	static new(...args: Vec4Args) {
		return new Vector4(...args);
	}

	setX(x: number) {
		this.x = x;
	}

	setY(y: number) {
		this.y = y;
	}

	setZ(z: number) {
		this.z = z;
	}

	setW(w: number) {
		this.w = w;
	}
}
