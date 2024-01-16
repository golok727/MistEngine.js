import VectorBase, { type Vec2Args } from "./vector";

type Vec2Like = { x: number; y: number };

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

	// Math
	add(v: Vector2 | Vec2Like) {
		return new Vector2(this.x + v.x, this.y + v.y);
	}

	sub(v: Vector2 | Vec2Like) {
		return new Vector2(this.x - v.x, this.y - v.y);
	}

	mul(s: number) {
		return new Vector2(this.x * s, this.y * s);
	}

	div(v: Vector2 | Vec2Like, floor = false) {
		if (v.x === 0 || v.y === 0) {
			console.warn("Division by zero!");
			return this;
		}

		let x = this.x / v.x;
		let y = this.y / v.y;

		if (floor) {
			x = Math.floor(x);
			y = Math.floor(y);
		}

		return new Vector2(x, y);
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
		return magnitude !== 0 ? this.div(Vector2.new(magnitude)) : Vector2.new(0);
	}

	dot(v: Vector2): number {
		return this.x * v.x + this.y * v.y;
	}

	cross(v: Vector2 | Vec2Like): number {
		return this.x * v.y - this.y * v.x;
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
		return Vector2.new(x, y);
	}
}
