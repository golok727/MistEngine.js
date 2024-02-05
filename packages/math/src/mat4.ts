import Vector3 from './vec3'
import { V3 } from './vector'

// prettier-ignore
type Matrix4Elements =  [ m11: number, m12: number , m13: number , m14: number , m21: number , m22: number , m23: number , m24: number , m31: number , m32: number , m33: number , m34: number , m41: number , m42: number , m43: number , m44: number ]

export class Matrix4 {
  private elements: Matrix4Elements

  constructor(...values: Matrix4Elements | []) {
    //  prettier-ignore
    this.elements = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ];

    if (values.length) {
      this.set(...values)
    }
  }

  public static Ortho(
    ...args: Parameters<Matrix4['makeOrthographic']>
  ): Matrix4 {
    const m = new Matrix4()
    m.makeOrthographic(...args)
    return m
  }
  /**
   * Returns a Translation Matrix
   */
  public static Translate(v: Vector3) {
    const m = new Matrix4()

    m.setPosition(v)

    return m
  }

  /**
   * Returns a Scale Matrix
   */
  public static Scale(s: Vector3) {
    const m = new Matrix4()

    m.toScaleMat(s)

    return m
  }
  /**
   * Returns a translation matrix
   */
  public static Rotate(angle: number, axis: Vector3) {
    // https://en.wikipedia.org/wiki/Rotation_matrix
    const m = new Matrix4()
    const c = Math.cos(angle),
      s = Math.sin(angle)

    const i = 1 - c
    const x = axis.x,
      y = axis.y,
      z = axis.z

    const ix = i * x,
      iy = i * y

    // prettier-ignore
    m.set(

			ix * x + c, ix * y - s * z, ix * z + s * y, 0,
			ix * y + s * z, iy * y + c, iy * z - s * x, 0,
			ix * z - s * y, iy * z + s * x, i * z * z + c, 0,
			0, 0, 0, 1

		);

    return m
  }

  public static PrettyPrint(m: Matrix4) {
    let out = ''
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        out += m.elements[i * 4 + j] + '\t'
      }
      out += '\n'
    }
    console.log(out)
  }
  // prettier-ignore
  public set(...m: Matrix4Elements) {
		const el = this.elements;
		el[0] = m[0]; el[1] = m[1]; el[2] = m[2]; el[3] = m[3];
		el[4] = m[4]; el[5] = m[5]; el[6] = m[6]; el[7] = m[7];
		el[8] = m[8]; el[9] = m[9]; el[10] = m[10]; el[11] = m[11];
		el[12] = m[12]; el[13] = m[13]; el[14] = m[14]; el[15] = m[15];
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
    return this
  }

  public multiply(m: Matrix4) {
    return this.multiplyAndApply(this, m)
  }

  public multiplyMat(...matrices: Matrix4[]) {
    for (const m of matrices) this.multiply(m)
    return this
  }

  // prettier-ignore
  private multiplyAndApply(A: Matrix4, B: Matrix4) {
		const a = A.elements
		const b = B.elements
		const m = this.elements

		const a11 = a[ 0 ], a12 = a[ 4 ], a13 = a[ 8 ], a14 = a[ 12 ];
		const a21 = a[ 1 ], a22 = a[ 5 ], a23 = a[ 9 ], a24 = a[ 13 ];
		const a31 = a[ 2 ], a32 = a[ 6 ], a33 = a[ 10 ], a34 = a[ 14 ];
		const a41 = a[ 3 ], a42 = a[ 7 ], a43 = a[ 11 ], a44 = a[ 15 ];

		const b11 = b[ 0 ], b12 = b[ 4 ], b13 = b[ 8 ], b14 = b[ 12 ];
		const b21 = b[ 1 ], b22 = b[ 5 ], b23 = b[ 9 ], b24 = b[ 13 ];
		const b31 = b[ 2 ], b32 = b[ 6 ], b33 = b[ 10 ], b34 = b[ 14 ];
		const b41 = b[ 3 ], b42 = b[ 7 ], b43 = b[ 11 ], b44 = b[ 15 ];

		m[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		m[ 4 ] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		m[ 8 ] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		m[ 12 ] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

		m[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		m[ 5 ] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		m[ 9 ] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		m[ 13 ] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

		m[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		m[ 6 ] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		m[ 10 ] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		m[ 14 ] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

		m[ 3 ] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		m[ 7 ] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		m[ 11 ] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		m[ 15 ] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

		return this;
	}

  // prettier-ignore
  public multiplyScalar(s: number) {
		const m = this.elements;

		m[0] *= s; m[4] *= s; m[8] *= s; m[12] *= s;
		m[1] *= s; m[5] *= s; m[9] *= s; m[13] *= s;
		m[2] *= s; m[6] *= s; m[10] *= s; m[14] *= s;
		m[3] *= s; m[7] *= s; m[11] *= s; m[15] *= s;

		return this;
	}

  public setPosition(...v: [Vector3] | V3) {
    const el = this.elements
    if (v.length === 1) {
      el[12] = v[0].x
      el[13] = v[0].y
      el[14] = v[0].z
    } else {
      el[12] = v[0]
      el[13] = v[1]
      el[14] = v[2]
    }
    return this
  }

  public toScaleMat(...v: [Vector3] | V3) {
    let x, y, z

    v.length === 1 ? ({ x, y, z } = v[0]) : ([x, y, z] = v)
    // prettier-ignore
    this.set(
						x, 0, 0, 0,
						0, y, 0, 0, 
						0, 0, z, 0, 
						0, 0, 0, 1
						);

    return this
  }

  // prettier-ignore
  public scale(v: Vector3) {
		const el = this.elements;

		el[0] *= v.x; el[1] *= v.x; el[2] *= v.x; el[3] *= v.x;
		el[4] *= v.y; el[5] *= v.y; el[6] *= v.y; el[7] *= v.y;
		el[8] *= v.z; el[9] *= v.z; el[10] *= v.z; el[11] *= v.z;

		return this;
	}

  public setFromArray(elms: Matrix4Elements) {
    for (let i = 0; i < 16; i++) this.elements[i] = elms[i]
    return this
  }

  // prettier-ignore
  public copyFrom(m: Matrix4) {
		const te = this.elements;
		const me = m.elements;

		te[0] = me[0]; te[1] = me[1]; te[2] = me[2]; te[3] = me[3];
		te[4] = me[4]; te[5] = me[5]; te[6] = me[6]; te[7] = me[7];
		te[8] = me[8]; te[9] = me[9]; te[10] = me[10]; te[11] = me[11];
		te[12] = me[12]; te[13] = me[13]; te[14] = me[14]; te[15] = me[15];

		return this;
	}

  public clone() {
    const m = new Matrix4()
    m.copyFrom(this)
    return m
  }

  public copyPosition(m: Matrix4) {
    const te = this.elements,
      me = m.elements

    te[12] = me[12]
    te[13] = me[13]
    te[14] = me[14]

    return this
  }
  // prettier-ignore
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

		el[0] = 2 * w; el[1] = 0; el[2] = 0; el[3] = -x;

		el[4] = 0; el[5] = 2 * h; el[6] = 0; el[7] = -y;

		el[8] = 0; el[9] = 0; el[10] = -2 * p; el[11] = -z;

		el[12] = 0; el[13] = 0; el[14] = 0; el[15] = 1;

		return this;
	}
  // prettier-ignore
  invert() {
		// https://github.com/mrdoob/three.js/blob/dev/src/math/Matrix4.js
		const te = this.elements,

			n11 = te[ 0 ], n21 = te[ 1 ], n31 = te[ 2 ], n41 = te[ 3 ],
			n12 = te[ 4 ], n22 = te[ 5 ], n32 = te[ 6 ], n42 = te[ 7 ],
			n13 = te[ 8 ], n23 = te[ 9 ], n33 = te[ 10 ], n43 = te[ 11 ],
			n14 = te[ 12 ], n24 = te[ 13 ], n34 = te[ 14 ], n44 = te[ 15 ],

			t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
			t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
			t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
			t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

		const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

		if ( det === 0 ) return this.set( 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 );

		const detInv = 1 / det;

		te[ 0 ] = t11 * detInv;
		te[ 1 ] = ( n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44 ) * detInv;
		te[ 2 ] = ( n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44 ) * detInv;
		te[ 3 ] = ( n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43 ) * detInv;

		te[ 4 ] = t12 * detInv;
		te[ 5 ] = ( n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44 ) * detInv;
		te[ 6 ] = ( n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44 ) * detInv;
		te[ 7 ] = ( n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43 ) * detInv;

		te[ 8 ] = t13 * detInv;
		te[ 9 ] = ( n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44 ) * detInv;
		te[ 10 ] = ( n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44 ) * detInv;
		te[ 11 ] = ( n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43 ) * detInv;

		te[ 12 ] = t14 * detInv;
		te[ 13 ] = ( n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34 ) * detInv;
		te[ 14 ] = ( n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34 ) * detInv;
		te[ 15 ] = ( n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33 ) * detInv;

		return this;

	}

  public toArray() {
    return [...this.elements]
  }
}
