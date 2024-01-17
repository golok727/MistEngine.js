export type ScalarArg = [v: number];

export type V2 = [x: number, y: number];
export type V3 = [x: number, y: number, z: number];
export type V4 = [x: number, y: number, z: number, w: number];

export type Vec2Args = ScalarArg | V2;
export type Vec3Args = ScalarArg | V3;
export type Vec4Args = ScalarArg | V4;

export default abstract class VectorBase<T extends V2 | V3 | V4> {
	protected static readonly Components = ["x", "y", "z", "w"];

	get componentCount(): number {
		return this.toArray().length;
	}

	toFloat32() {
		return new Float32Array(this.toArray());
	}

	toArray() {
		return [...this] as T; // use the Iterator;
	}

	toString() {
		// Make a string based on the components given in the vector
		const vectorStr = (this.toArray() as number[])
			.map((val: number, i: number) => {
				return `${VectorBase.Components[i]}: ${val}`;
			})
			.join(", ");

		return `${Object.getPrototypeOf(this)?.constructor?.name} [ ${vectorStr} ]`;
	}

	protected static ConstructVectorFromArguments = <T extends V2 | V3 | V4>(
		vec: VectorBase<T>,
		args: Vec2Args | Vec3Args | Vec4Args
	) => {
		let [x, y, z, w] = args;

		if (args.length === 1) {
			x = y = z = w = args[0];
		}

		if ("x" in vec) vec.x = x ?? 0;
		if ("y" in vec) vec.y = y ?? 0;

		if ("z" in vec) vec.z = z ?? 0;
		if ("w" in vec) vec.w = w ?? 0;
	};

	*[Symbol.iterator](): Generator<number, void, void> {
		if ("x" in this) yield this.x as number;
		if ("y" in this) yield this.y as number;

		if ("z" in this) yield this.z as number;
		if ("w" in this) yield this.w as number;
	}
}
