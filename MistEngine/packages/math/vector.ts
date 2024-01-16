type ScalarArg = [v: number];

type V2 = [x: number, y: number];
type V3 = [x: number, y: number, z: number];
type V4 = [x: number, y: number, z: number, w: number];

type MVec2Args = ScalarArg | V2;
type MVec3Args = ScalarArg | V3;
type MVec4Args = ScalarArg | V4;

abstract class VectorBase {
	constructor() {}

	protected static readonly Components = ["x", "y", "z", "w"];

	get componentCount(): number {
		return ["x", "y", "z", "w"].reduce(
			(total, c) => (c in this ? total + 1 : total),
			0
		);
	}

	toFloat32() {
		return new Float32Array(this.toArray());
	}

	toArray(): number[] {
		return Array.from(Array(this.componentCount)).map((_, i) => {
			const currentComponent = VectorBase.Components[i] as keyof VectorBase;
			if (currentComponent in this) return this[currentComponent];
			return 0;
		}) as number[];
	}

	toString() {
		// Make a string based on the components given in the vector
		const vectorStr = Array.from(Array(this.componentCount)).reduce(
			(str, _, i) => {
				const currentComponent = VectorBase.Components[i] as keyof VectorBase;
				return (
					str +
					(currentComponent in this
						? ` ${currentComponent}: ${this[currentComponent]} `
						: "")
				);
			},
			""
		);

		return "[" + vectorStr + "]";
	}

	protected static ConstructVectorFromArguments = <
		T extends { x: number; y: number; z?: number; w?: number }
	>(
		vec: T,
		args: MVec2Args | MVec3Args | MVec4Args
	) => {
		let [x, y, z, w] = args;

		if (args.length === 1) {
			x = y = z = w = args[0];
		}

		vec.x = x ?? 0;
		vec.y = y ?? 0;

		if ("z" in vec) vec.z = z ?? 0;
		if ("w" in vec) vec.w = w ?? 0;
	};
}

/**
 * Vector 2
 */
export class Vec2 extends VectorBase {
	x!: number;
	y!: number;
	constructor(...args: MVec2Args) {
		super();
		VectorBase.ConstructVectorFromArguments(this, args);
	}
}

/**
 * Vector 3
 */
export class Vec3 extends VectorBase {
	x!: number;
	y!: number;
	z!: number;
	constructor(...args: MVec3Args) {
		super();
		VectorBase.ConstructVectorFromArguments(this, args);
	}
}

/**
 * Vector 3
 */
export class Vec4 extends VectorBase {
	x!: number;
	y!: number;
	z!: number;
	w!: number;
	constructor(...args: MVec4Args) {
		super();
		VectorBase.ConstructVectorFromArguments(this, args);
	}
}
