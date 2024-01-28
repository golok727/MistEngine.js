import Vector2, { vec2 } from "./vec2";
import Vector3, { vec3 } from "./vec3";
import Vector4, { vec4 } from "./vec4";
import { Matrix4 } from "./mat4";

export { Vector2, Vector3, Vector4, vec2, vec3, vec4, Matrix4 };

export class MthX {
	static PI = Math.PI;
	static TAU = this.PI * 2;
	static HALF_PI = this.PI / 2;
	static DEG_TO_RAD = this.PI / 180;
	static RAD_TO_DEG = 180 / this.PI;

	static degToRad(degrees: number) {
		return degrees * this.DEG_TO_RAD;
	}

	static radToDeg(radians: number) {
		return radians * this.RAD_TO_DEG;
	}

	static lerp(start: number, stop: number, t: number) {
		return start + (stop - start) * t;
	}

	static map(
		value: number,
		inMin: number,
		inMax: number,
		outMin: number,
		outMax: number,
		clamp = false
	) {
		if (clamp) value = this.clamp(value, inMin, inMax);
		return (value - inMin) * ((outMax - outMin) / (inMax - inMin)) + outMin;
	}

	static clamp(value: number, min: number, max: number) {
		return this.min(max, this.max(min, value));
	}
	static isBetween(value: number, l: number, r: number) {
		return value >= l && value <= r;
	}

	static min = Math.min;
	static max = Math.max;
	static floor = Math.floor;
	static random = Math.random;
	static ceil = Math.ceil;
	static round = Math.round;

	static cos = Math.cos;
	static sin = Math.sin;
	static tan = Math.tan;
	static atan = Math.atan;
	static atan2 = Math.atan2;
	static sqrt = Math.sqrt;
	static pow = Math.pow;
	static log = Math.log;
	static sign = Math.sign;
}
