import VectorBase, { type Vec3Args } from "./vector";

type Vec3Like = { x: number; y: number; z: number };
/**
 * Vector 3
 */
export default class Vector3 extends VectorBase {
	x!: number;
	y!: number;
	z!: number;

	constructor(...args: Vec3Args) {
		super();
		VectorBase.ConstructVectorFromArguments(this, args);
	}

	static new(...args: Vec3Args) {
		return new Vector3(...args);
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

	add(v: Vector3 | Vec3Like) {
		return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
	}

	sub(v: Vector3 | Vec3Like) {
		return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
	}

	mul(s: number) {
		return new Vector3(this.x * s, this.y * s, this.z * s);
	}

	div(v: Vector3 | Vec3Like, floor = false) {
		if (v.x === 0 || v.y === 0 || v.z === 0) {
			console.warn("Division by zero!");
			return this;
		}

		let x = this.x / v.x;
		let y = this.y / v.y;
		let z = this.z / v.z;

		if (floor) {
			x = Math.floor(x);
			y = Math.floor(y);
			z = Math.floor(z);
		}

		return new Vector3(x, y, z);
	}

	mag() {
		return Math.hypot(this.x, this.y, this.z);
	}

	magSq() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}

	normalize(): Vector3 {
		const magnitude = this.mag();
		return magnitude !== 0 ? this.div(Vector3.new(magnitude)) : Vector3.new(0);
	}

	dot(v: Vector3 | Vec3Like): number {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	}

	cross(v: Vector3 | Vec3Like): Vector3 {
		return new Vector3(
			this.y * v.z - this.z * v.y,
			this.z * v.x - this.x * v.z,
			this.x * v.y - this.y * v.x
		);
	}

	limit(max: number): Vector3 {
		const magnitudeSq = this.magSq();
		if (magnitudeSq > max * max) {
			return this.normalize().mul(max);
		}
		return this;
	}

	setMag(magnitude: number): Vector3 {
		return this.normalize().mul(magnitude);
	}

	rotate(angle: number, axis: Vec3Like): Vector3 {
		const cosA = Math.cos(angle);
		const sinA = Math.sin(angle);
		const x =
			this.x * (cosA + (1 - cosA) * axis.x ** 2) +
			this.y * ((1 - cosA) * axis.x * axis.y - sinA * axis.z) +
			this.z * ((1 - cosA) * axis.x * axis.z + sinA * axis.y);

		const y =
			this.x * ((1 - cosA) * axis.x * axis.y + sinA * axis.z) +
			this.y * (cosA + (1 - cosA) * axis.y ** 2) +
			this.z * ((1 - cosA) * axis.y * axis.z - sinA * axis.x);

		const z =
			this.x * ((1 - cosA) * axis.x * axis.z - sinA * axis.y) +
			this.y * ((1 - cosA) * axis.y * axis.z + sinA * axis.x) +
			this.z * (cosA + (1 - cosA) * axis.z ** 2);

		return new Vector3(x, y, z);
	}
}
