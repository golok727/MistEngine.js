import VectorBase, { type Vec4Args, type V4 } from "./vector";

export type Vec4Like = { x: number; y: number; z: number; w: number };

/**
 * Vector 4
 */
export default class Vector4 extends VectorBase<V4> {
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
		return this;
	}

	setY(y: number) {
		this.y = y;
		return this;
	}

	setZ(z: number) {
		this.z = z;
		return this;
	}

	setW(w: number) {
		this.w = w;
		return this;
	}

	clone(): Vector4 {
		return new Vector4(...this.toArray());
	}

	add(v: Vector4) {
		const [x, y, z, w] = this.parseComponents(v);
		this.x += x;
		this.y += y;
		this.z += z;
		this.w += w;
		return this;
	}

	sub(v: Vector4) {
		const [x, y, z, w] = this.parseComponents(v);
		this.x -= x;
		this.y -= y;
		this.z -= z;
		this.w -= w;
		return this;
	}

	mul(v: number | Vector4 | V4) {
		if (typeof v === "number") {
			this.x *= v;
			this.y *= v;
			this.z *= v;
			this.w *= v;
			return this;
		}

		const [x, y, z, w] = this.parseComponents(v);
		this.x *= x;
		this.y *= y;
		this.z *= z;
		this.w *= w;

		return this;
	}

	div(v: Vector4) {
		const [x, y, z, w] = this.parseComponents(v);

		if (x === 0 || y === 0 || z === 0 || w === 0) {
			throw new Error("Division by zero"); // TODO better errors
		}

		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;
		this.w /= v.w;

		return this;
	}

	floor() {
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		this.z = Math.floor(this.z);
		this.w = Math.floor(this.w);
		return this;
	}

	mag() {
		return Math.hypot(this.x, this.y, this.z, this.w);
	}

	magSq() {
		return (
			this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
		);
	}
	normalize(): Vector4 {
		const magnitude = this.mag();
		return magnitude !== 0 ? this.div(Vector4.new(magnitude)) : this;
	}

	private parseComponents(v: Vector4 | V4): V4 {
		if (v instanceof Vector4) return v.toArray();
		else return v;
	}
}

/**
 * @description A helper function to construct a new `Vector4`
 */
export const vec4 = (...args: ConstructorParameters<typeof Vector4>) => {
	return new Vector4(...args);
};
