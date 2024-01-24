// prettier-ignore
type Matrix4Args =  [ n11: number, n12: number , n13: number , n14: number , n21: number , n22: number , n23: number , n24: number , n31: number , n32: number , n33: number , n34: number , n41: number , n42: number , n43: number , n44: number ]

export class Matrix4 {
	private elements: number[];

	constructor(...values: Matrix4Args | []) {
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
	set(...m: Matrix4Args) {
		// prettier-ignore
		const t = this.elements
		for (let i = 0; i < m.length; i++) {
			t[i] = m[i] ?? t[i];
		}
	}

	identity() {
		this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);

		return this;
	}
  copy( m: Matrix4 ) {

		const te = this.elements;
		const me = m.elements;

		te[ 0 ] = me[ 0 ]; te[ 1 ] = me[ 1 ]; te[ 2 ] = me[ 2 ]; te[ 3 ] = me[ 3 ];
		te[ 4 ] = me[ 4 ]; te[ 5 ] = me[ 5 ]; te[ 6 ] = me[ 6 ]; te[ 7 ] = me[ 7 ];
		te[ 8 ] = me[ 8 ]; te[ 9 ] = me[ 9 ]; te[ 10 ] = me[ 10 ]; te[ 11 ] = me[ 11 ];
		te[ 12 ] = me[ 12 ]; te[ 13 ] = me[ 13 ]; te[ 14 ] = me[ 14 ]; te[ 15 ] = me[ 15 ];

		return this;

	}

  copyPosition( m: Matrix4 ) {

		const te = this.elements, me = m.elements;

		te[ 12 ] = me[ 12 ];
		te[ 13 ] = me[ 13 ];
		te[ 14 ] = me[ 14 ];

		return this;

	}


}

// prettier-ignore
