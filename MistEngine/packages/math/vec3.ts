import VectorBase, { type Vec3Args, type V3 } from "./vector";

export type Vec3Like = { x: number; y: number; z: number };

/**
 * Vector 3
 */
export default class Vector3 extends VectorBase<V3> {
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

	clone() {
		return new Vector3(...this.toArray());
	}

	add(v: Vector3 | V3) {
		const [x, y, z] = this.parseComponents(v);
		this.x += x;
		this.y += y;
		this.z += z;

		return this;
	}

	sub(v: Vector3 | V3) {
		const [x, y, z] = this.parseComponents(v);

		this.x -= x;
		this.y -= y;
		this.z -= z;
		return this;
	}

	mul(s: number) {
		this.x *= s;
		this.y *= s;
		this.z *= s;
		return this;
	}

	div(v: Vector3 | V3) {
		let [x, y, z] = this.parseComponents(v);

		if (x === 0 || y === 0 || z === 0) {
			console.warn("Division by zero!");
			return this;
		}

		this.x /= x;
		this.y /= y;
		this.z /= z;

		return this;
	}

	mag() {
		return Math.hypot(this.x, this.y, this.z);
	}

	magSq() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}

	normalize(): Vector3 {
		const magnitude = this.mag();
		return magnitude !== 0 ? this.div(Vector3.new(magnitude)) : this;
	}

	dot(v: Vector3 | V3): number {
		const [x, y, z] = this.parseComponents(v);

		return this.x * x + this.y * y + this.z * z;
	}

	cross(v: Vector3 | V3): Vector3 {
		const [x, y, z] = this.parseComponents(v);

		return new Vector3(
			this.y * z - this.z * y,
			this.z * x - this.x * z,
			this.x * y - this.y * x
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

	rotate(angle: number, axis: Vector3 | V3): Vector3 {
		const [x, y, z] = this.parseComponents(axis);

		const cosA = Math.cos(angle);
		const sinA = Math.sin(angle);
		const newX =
			this.x * (cosA + (1 - cosA) * x ** 2) +
			this.y * ((1 - cosA) * x * y - sinA * z) +
			this.z * ((1 - cosA) * x * z + sinA * y);

		const newY =
			this.x * ((1 - cosA) * x * y + sinA * z) +
			this.y * (cosA + (1 - cosA) * y ** 2) +
			this.z * ((1 - cosA) * y * z - sinA * x);

		const newZ =
			this.x * ((1 - cosA) * x * z - sinA * y) +
			this.y * ((1 - cosA) * y * z + sinA * x) +
			this.z * (cosA + (1 - cosA) * z ** 2);

		this.x = newX;
		this.y = newY;
		this.z = newZ;
		return this;
	}

	private parseComponents(v: Vector3 | V3): V3 {
		if (v instanceof Vector3) return v.toArray();
		else return v;
	}
}

/**
 * @description A helper function to construct a new `Vector3`
 */
export const vec3 = (...args: ConstructorParameters<typeof Vector3>) => {
	return new Vector3(...args);
};
