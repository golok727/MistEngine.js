import Vector3 from "./vec3";
import { V3 } from "./vector";

// prettier-ignore
type Matrix4Elements =  [ m11: number, m12: number , m13: number , m14: number , m21: number , m22: number , m23: number , m24: number , m31: number , m32: number , m33: number , m34: number , m41: number , m42: number , m43: number , m44: number ]

export class Matrix4 {
	private elements: Matrix4Elements;

	constructor(...values: Matrix4Elements | []) {
		//  prettier-ignore
		this.elements = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ];

		if (values.length) {
			this.set(...values);
		}
	}

	public static Ortho(
		...args: Parameters<Matrix4["makeOrthographic"]>
	): Matrix4 {
		const m = new Matrix4();
		m.makeOrthographic(...args);
		return m;
	}

	public set(...m: Matrix4Elements) {
		const el = this.elements;
		el[0] = m[0] ?? el[0];
		el[1] = m[1] ?? el[1];
		el[2] = m[2] ?? el[2];
		el[3] = m[3] ?? el[3];
		el[4] = m[4] ?? el[4];
		el[5] = m[5] ?? el[5];
		el[6] = m[6] ?? el[6];
		el[7] = m[7] ?? el[7];
		el[8] = m[8] ?? el[8];
		el[9] = m[9] ?? el[9];
		el[10] = m[10] ?? el[10];
		el[11] = m[11] ?? el[11];
		el[12] = m[12] ?? el[12];
		el[13] = m[13] ?? el[13];
		el[14] = m[14] ?? el[14];
		el[15] = m[15] ?? el[15];
		return this;
	}

	public identity() {
		// prettier-ignore
		this.set(
			1, 0, 0, 0, 
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		);
		return this;
	}

	public multiplyScalar(s: number) {
		const m = this.elements;
		m[0] *= s;
		m[4] *= s;
		m[8] *= s;
		m[12] *= s;
		m[1] *= s;
		m[5] *= s;
		m[9] *= s;
		m[13] *= s;
		m[2] *= s;
		m[6] *= s;
		m[10] *= s;
		m[14] *= s;
		m[3] *= s;
		m[7] *= s;
		m[11] *= s;
		m[15] *= s;

		return this;
	}

	public setPosition(...args: [Vector3] | V3) {
		const el = this.elements;

		if (args.length === 1) {
			el[12] = args[0].x;
			el[13] = args[0].y;
			el[13] = args[0].z;
		} else {
			el[12] = args[0];
			el[13] = args[1];
			el[14] = args[2];
		}
		return this;
	}

	public scale(v: Vector3) {
		const el = this.elements;
		el[0] *= v.x;
		el[1] *= v.x;
		el[2] *= v.x;
		el[3] *= v.x;

		el[4] *= v.y;
		el[5] *= v.y;
		el[6] *= v.y;
		el[7] *= v.y;

		el[8] *= v.z;
		el[9] *= v.z;
		el[10] *= v.z;
		el[11] *= v.z;
		return this;
	}

	public setFromArray(elms: Matrix4Elements) {
		for (let i = 0; i < 16; i++) this.elements[i] = elms[i];
		return this;
	}

	public copyFrom(m: Matrix4) {
		const te = this.elements;
		const me = m.elements;

		te[0] = me[0];
		te[1] = me[1];
		te[2] = me[2];
		te[3] = me[3];
		te[4] = me[4];
		te[5] = me[5];
		te[6] = me[6];
		te[7] = me[7];
		te[8] = me[8];
		te[9] = me[9];
		te[10] = me[10];
		te[11] = me[11];
		te[12] = me[12];
		te[13] = me[13];
		te[14] = me[14];
		te[15] = me[15];

		return this;
	}

	public copyPosition(m: Matrix4) {
		const te = this.elements,
			me = m.elements;

		te[12] = me[12];
		te[13] = me[13];
		te[14] = me[14];

		return this;
	}

	public makeOrthographic(
		left: number,
		right: number,
		top: number,
		bottom: number,
		near: number,
		far: number
	) {
		// https://en.wikipedia.org/wiki/Orthographic_projection
		const w = 1.0 / (right - left);
		const h = 1.0 / (bottom - top);
		const p = 1.0 / (far - near);

		const x = (right + left) * w;
		const y = (top + bottom) * h;

		// Change this according to coordinate systems
		const z = (far + near) * p;

		const el = this.elements;

		el[0] = 2 * w;
		el[1] = 0;
		el[2] = 0;
		el[3] = -x;

		el[4] = 0;
		el[5] = 2 * h;
		el[6] = 0;
		el[7] = -y;

		el[8] = 0;
		el[9] = 0;
		el[10] = -2 * p;
		el[11] = -z;

		el[12] = 0;
		el[13] = 0;
		el[14] = 0;
		el[15] = 1;

		return this;
	}

	public toArray() {
		return [...this.elements];
	}
}
