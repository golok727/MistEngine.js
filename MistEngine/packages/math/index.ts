import Vector2, { vec2 } from "./vec2";
import Vector3, { vec3 } from "./vec3";
import Vector4, { vec4 } from "./vec4";

export { Vector2, Vector3, Vector4, vec2, vec3, vec4 };

export class MthX {
	static PI = Math.PI;
	static TAU = MthX.PI * 2;
	static HALF_PI = MthX.PI / 2;
	static DEG_TO_RAD = MthX.PI / 180;
	static RAD_TO_DEG = 180 / MthX.PI;

	static degToRad(degrees: number) {
		return degrees * MthX.DEG_TO_RAD;
	}

	static radToDeg(radians: number) {
		return radians * MthX.RAD_TO_DEG;
	}

	static lerp(start: number, stop: number, t: number) {
		return start + (stop - start) * t;
	}

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
}
