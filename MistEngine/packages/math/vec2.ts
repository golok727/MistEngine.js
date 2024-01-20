import VectorBase, { type Vec2Args, type V2 } from "./vector";

export type Vec2Like = { x: number; y: number };

/**
 * Vector 2
 */
export default class Vector2 extends VectorBase<V2> {
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
		return this;
	}

	setY(y: number) {
		this.y = y;
		return this;
	}

	clone() {
		return new Vector2(...this.toArray());
	}

	// Math
	add(v: Vector2 | V2) {
		const [x, y] = this.parseComponents(v);
		this.x += x;
		this.y += y;
		return this;
	}

	sub(v: Vector2 | V2) {
		const [x, y] = this.parseComponents(v);
		this.x -= x;
		this.y -= y;
		return this;
	}

	mul(v: number | Vector2 | V2) {
		if (typeof v === "number") {
			this.x *= v;
			this.y *= v;
			return this;
		}

		const [x, y] = this.parseComponents(v);
		this.x *= x;
		this.y *= y;

		return this;
	}

	div(v: Vector2 | V2) {
		const [x, y] = this.parseComponents(v);

		if (x === 0 || y === 0) {
			throw new Error("Division by zero"); // TODO better errors
		}

		this.x /= x;
		this.y /= y;
		return this;
	}

	floor() {
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		return this;
	}

	mag() {
		return Math.hypot(this.x, this.y);
	}

	magSq() {
		return this.x * this.x + this.y * this.y;
	}

	heading(): number {
		return Math.atan2(this.y, this.x);
	}

	normalize(): Vector2 {
		const magnitude = this.mag();
		return magnitude !== 0 ? this.div(Vector2.new(magnitude)) : this;
	}

	dot(v: Vector2 | V2): number {
		const [x, y] = this.parseComponents(v);
		return this.x * x + this.y * y;
	}

	cross(v: Vector2 | V2): number {
		const [x, y] = this.parseComponents(v);
		return this.x * x - this.y * y;
	}

	limit(max: number): Vector2 {
		const magnitudeSq = this.magSq();
		if (magnitudeSq > max * max) {
			return this.normalize().mul(max);
		}
		return this;
	}

	// Set the vector's magnitude to a specific value
	setMag(magnitude: number): Vector2 {
		return this.normalize().mul(magnitude);
	}

	// Rotate the vector by an angle (in radians)
	rotate(angle: number): Vector2 {
		const cosA = Math.cos(angle);
		const sinA = Math.sin(angle);
		const x = this.x * cosA - this.y * sinA;
		const y = this.x * sinA + this.y * cosA;

		this.x = x;
		this.y = y;
		return this;
	}

	private parseComponents(v: Vector2 | V2): V2 {
		if (v instanceof Vector2) return v.toArray();
		else return v;
	}
}

/**
 * @description A helper function to construct a new `Vector2`
 */
export const vec2 = (...args: ConstructorParameters<typeof Vector2>) =>
	new Vector2(...args);
