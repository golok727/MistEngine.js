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

	add(v: Vector4) {
		return new Vector4(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w);
	}

	sub(v: Vector4) {
		return new Vector4(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w);
	}

	mul(s: number) {
		return new Vector4(this.x * s, this.y * s, this.z * s, this.w * s);
	}

	div(v: Vector4, floor = false) {
		if (v.x === 0 || v.y === 0 || v.z === 0 || v.w === 0) {
			console.warn("Division by zero!");
			return this;
		}

		let x = this.x / v.x;
		let y = this.y / v.y;
		let z = this.z / v.z;
		let w = this.w / v.w;

		if (floor) {
			x = Math.floor(x);
			y = Math.floor(y);
			z = Math.floor(z);
			w = Math.floor(w);
		}

		return new Vector4(x, y, z, w);
	}

	mag() {
		return Math.hypot(this.x, this.y, this.z, this.w);
	}

	magSq() {
		return (
			this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
		);
	}
}
