import VectorBase, { type Vec3Args } from "./vector";
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
}
