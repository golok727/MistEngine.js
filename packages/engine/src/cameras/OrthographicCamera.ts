import { MistEventDispatcher } from "../core/Events";
import { Vector3, Matrix4 } from "@mist/math";
import { Camera } from "./Camera";

export default class OrthographicCamera
	extends MistEventDispatcher
	implements Camera
{
	private projectionMatrix: Matrix4;
	private viewMatrix: Matrix4;
	private viewProjectionMatrix: Matrix4;

	private _position: Vector3;
	private _rotation: number;

	constructor(
		left: number,
		right: number,
		top: number,
		bottom: number,
		near: number = -1.0,
		far: number = 1.0
	) {
		super();
		this.projectionMatrix = Matrix4.Ortho(left, right, top, bottom, near, far);
		this.viewMatrix = new Matrix4();
		this._position = new Vector3(0);
		this._rotation = 0;
		this.viewProjectionMatrix = new Matrix4();
	}

	get position() {
		return this._position;
	}

	get viewProjection(): Matrix4 {
		return this.viewProjectionMatrix;
	}

	get view(): Matrix4 {
		return this.viewMatrix;
	}

	get projection(): Matrix4 {
		return this.projectionMatrix;
	}

	setPosition(v: Vector3): void {
		this._position = v;
		this.recalculateViewProjection();
	}

	setRotation(a: number): void {
		this._rotation = a;
		this.recalculateViewProjection();
	}

	updateProjection(
		left: number,
		right: number,
		top: number,
		bottom: number,
		near: number = -1.0,
		far: number = 1.0
	): void {
		this.projection.makeOrthographic(left, right, top, bottom, near, far);
		this.recalculateViewProjection();
	}

	private recalculateViewProjection() {
		const translation = Matrix4.Translate(this._position).multiply(
			Matrix4.Rotate(this._rotation, new Vector3(0, 0, 1))
		);

		this.viewMatrix = translation.invert();

		this.viewProjectionMatrix = new Matrix4().multiplyMat(
			this.projectionMatrix,
			this.viewMatrix
		);
	}
}
