import {
	WebGL2Context,
	MistBuffer,
	MistShader,
	BufferLayout,
	ShaderDataType,
	MistVertexArray,
} from "@mist-engine/renderers";

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
			layout ( location = 0 ) in  vec3 a_Position;
			layout(location = 1) in vec2 a_TexCoord; 
			out vec2 TexCoord;
			void main()
			{		
				TexCoord = a_TexCoord;
				gl_Position = vec4(a_Position, 1.0);
			}
		`;

		const fs = `
			#version 300 es
			precision mediump float;
			
			in vec2 TexCoord; 
			uniform vec3 u_Color;

			out vec4 fragColor; 
			void main()
			{
				fragColor = vec4(TexCoord.x, TexCoord.y, 0.0, 1.0);
			}
		`;
		const basicShader = MistShader.Create(app.getRenderer(), vs, fs);

		const triangle = new Float32Array([
			-0.5, -0.5, 0.0, 0.0, 0.0 /* Bottom left */,

			0.5, -0.5, 0.0, 1.0, 0.0 /* Bottom right */,

			0.5, 0.5, 0.0, 1.0, 1.0 /* Top Right */,

			-0.5, 0.5, 0.0, 0.0, 1.0 /* Top Left */,
		]);

		const layout = new BufferLayout([
			{ name: "a_Position", type: ShaderDataType.Float3, location: 0 },
			{ name: "a_TexCoord", type: ShaderDataType.Float2, location: 1 },
		]);

		const indices = new Uint32Array([0, 1, 2, 2, 3, 0]);
		const vao = MistVertexArray.Create(renderer);

		const vb = MistBuffer.Vertex(renderer, triangle);
		vb.setLayout(layout);

		const ib = MistBuffer.Index(renderer, indices);

		vao.setVertexBuffer(vb);
		vao.setIndexBuffer(ib);
		vao.detach();

		basicShader.use();
		vao.use();
		// basicShader.setUniform3f("u_Color", 0.7, 0.2, 0.1);
		// Begin
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
