import {Matrix4, Vector3} from '@mist/math'
export interface Camera {
  setPosition(pos: Vector3): void
  setRotation(a: number): void

  get position(): Vector3

  get viewProjection(): Matrix4
  get projection(): Matrix4
  get view(): Matrix4
}
