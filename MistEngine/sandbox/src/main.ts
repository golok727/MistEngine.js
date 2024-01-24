import { WebGL2Context, MistBuffer, MistShader } from "@mist-engine/renderers";

import "./style.css";

import {
	CreateMist,
	Layer,
	MistApp,
	MistRendererAPI,
} from "@mist-engine/index";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

class TestLayer extends Layer {
	constructor() {
		super("TestLayer");
	}

	override onAttach(app: SandboxApp): void {
		console.log("Layer Attach: ", this.name);
		const renderer = app.getRenderer();
		const gl = (renderer.GetContext() as WebGL2Context).inner;

		// SHADER
		const vs = `
			#version 300 es
			layout ( location = 0 ) in  vec3 a_Pos;
			void main()
			{	
				gl_Position = vec4(a_Pos, 1.0);
			}
		`;

		const fs = `
			#version 300 es
			precision mediump float;
			out vec4 fragColor;
			uniform vec3 u_Color;
			void main()
			{
				fragColor = vec4(u_Color, 1.0);
			}
		`;
		const basicShader = MistShader.Create(app.getRenderer(), vs, fs);

		const triangle = new Float32Array([
			-0.5, -0.5, 0.0 /* Bottom left */,

			0.5, -0.5, 0.0 /* Bottom right */,

			0.5, 0.5, 0.0 /* Top Right */,

			-0.5, 0.5, 0.0 /* Top Left */,
		]);

		const indices = new Uint32Array([0, 1, 2, 2, 3, 0]);

		const vao = gl.createVertexArray();
		if (!vao) throw "Error creating vertex arrays";
		gl.bindVertexArray(vao);

		const vb = MistBuffer.Vertex(renderer, triangle);
		const ibo = MistBuffer.Index(renderer, indices);

		/*	
		Layout Design
			attributes: [
				{
					shaderLocation: number
					offset: number
					format: (DATA_TYPE)
				}
			]
			stride: number,
		}
		*/

		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(
			0,
			3,
			gl.FLOAT,
			false,
			3 * Float32Array.BYTES_PER_ELEMENT,
			0
		);

		gl.bindVertexArray(null);
		vb.unBind();
		ibo.unBind();

		basicShader.use();
		basicShader.setUniform3f("u_Color", 0.7, 0.2, 0.1);
		// Begin
		gl.bindVertexArray(vao);
	}

	override onUpdate(app: SandboxApp, _delta: number): void {
		// Each Frame
		const renderer = app.getRenderer();
		const context = app.getRenderingContext();

		const gl = (context as WebGL2Context).inner;

		/* should be handled by the renderer */
		context.setViewport(0, 0, renderer.getWidth(), renderer.getHeight());

		context.clearColor(0.1, 0.1, 0.1, 1.0);
		context.clear();
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
	}

	override onDetach(_app: SandboxApp): void {}
}

class SandboxApp extends MistApp {
	constructor() {
		super({ name: "SandboxApp", canvas, rendererAPI: MistRendererAPI.WebGL2 });
		this.pushLayer(TestLayer);
	}
}

CreateMist(() => {
	return new SandboxApp();
});
