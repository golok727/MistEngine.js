import {
	WebGL2Context,
	VertexArray,
	IndexBuffer,
	VertexBuffer,
	Shader,
	BufferLayout,
	ShaderDataType,
	MistShader,
	MistVertexArray,
} from "@mist-engine/index";

import "./style.css";

import {
	CreateMistApp,
	Layer,
	MistApp,
	MistRendererAPI,
} from "@mist-engine/index";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

type DrawableObject = {
	va: MistVertexArray;
	shader: MistShader;
};

class TestLayer extends Layer {
	private gl!: WebGL2RenderingContext;

	private squareObj!: DrawableObject;
	private triangleObj!: DrawableObject;

	constructor() {
		super("TestLayer");
		this.squareObj = { ...this.squareObj };
		this.triangleObj = { ...this.triangleObj };
	}

	override onAttach(app: SandboxApp): void {
		console.log("Layer Attach: ", this.name);
		const renderer = app.getRenderer();
		this.gl = (renderer.GetContext() as WebGL2Context).inner;

		// Square Shader
		const sqVertexShader = `
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

		const sqFragmentShader = `
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

		const triVertexShader = `
			#version 300 es
			layout ( location = 0 ) in  vec3 a_Position;
			layout(location = 1) in vec4 a_Color; 

			out vec4 color;
			void main()
			{		
				color = a_Color; 
				gl_Position = vec4(a_Position, 1.0);
			}
		`;

		const triFragmentShader = `
			#version 300 es
			precision mediump float;
			
			in vec4 color; 
			out vec4 fragColor; 
			void main()
			{
				fragColor = color;
			}
		`;
		this.triangleObj.shader = Shader.Create(
			renderer,
			triVertexShader,
			triFragmentShader
		);

		this.squareObj.shader = Shader.Create(
			renderer,
			sqVertexShader,
			sqFragmentShader
		);

		const squareVertices = new Float32Array([
			-0.5, -0.5, 0.0, 0.0, 0.0 /* Bottom left */,

			0.5, -0.5, 0.0, 1.0, 0.0 /* Bottom right */,

			0.5, 0.5, 0.0, 1.0, 1.0 /* Top Right */,

			-0.5, 0.5, 0.0, 0.0, 1.0 /* Top Left */,
		]);
		const squareIndices = new Uint32Array([0, 1, 2, 2, 3, 0]);

		const squareLayout = new BufferLayout([
			{ name: "a_Position", type: ShaderDataType.Float3, location: 0 },
			{ name: "a_TexCoord", type: ShaderDataType.Float2, location: 1 },
		]);
		const squareObj = this.squareObj;

		squareObj.va = VertexArray.Create(renderer);
		const squareObjVb = VertexBuffer.Create(renderer, squareVertices);
		squareObjVb.setLayout(squareLayout);

		const squareObjIb = IndexBuffer.Create(renderer, squareIndices);

		squareObj.va.addVertexBuffer(squareObjVb);
		squareObj.va.setIndexBuffer(squareObjIb);

		// Triangle
		const triangleVertices = new Float32Array([
			-1.0, -0.5, 0.0, 1.0, 1.0, 1.0, 1.0 /* Bottom left */,

			0.0, -0.5, 0.0, 1.0, 1.0, 1.0, 1.0 /* Bottom right */,

			-0.5, 0.5, 0.0, 1.0, 1.0, 1.0, 1.0 /* Top Right */,
		]);

		const triangleIndices = new Uint32Array([0, 1, 2]);

		const triangleLayout = new BufferLayout([
			{ name: "a_Position", type: ShaderDataType.Float3, location: 0 },
			{ name: "a_Color", type: ShaderDataType.Float4, location: 1 },
		]);
		const { triangleObj } = this;

		triangleObj.va = VertexArray.Create(renderer);

		const triangleObjVb = VertexBuffer.Create(renderer, triangleVertices);
		triangleObjVb.setLayout(triangleLayout);

		const triangleObjIb = IndexBuffer.Create(renderer, triangleIndices);

		triangleObj.va.addVertexBuffer(triangleObjVb);
		triangleObj.va.setIndexBuffer(triangleObjIb);
	}

	override onUpdate(app: SandboxApp, _delta: number): void {
		// Each Frame
		const gl = this.gl;
		const renderer = app.getRenderer();
		const context = app.getRenderingContext();

		/* should be handled by the renderer */
		context.setViewport(0, 0, renderer.getWidth(), renderer.getHeight());

		context.clearColor(0.1, 0.1, 0.1, 1.0);
		context.clear();

		this.squareObj.shader.use();
		const squareVa = this.squareObj.va;
		squareVa.use();
		gl.drawElements(
			gl.TRIANGLES,
			squareVa.getIndexBuffer().getCount(),
			gl.UNSIGNED_INT,
			0
		);

		this.triangleObj.shader.use();
		const triangleVa = this.triangleObj.va;
		triangleVa.use();
		gl.drawElements(
			gl.TRIANGLES,
			triangleVa.getIndexBuffer().getCount(),
			gl.UNSIGNED_INT,
			0
		);
	}

	override onDetach(_app: SandboxApp): void {}
}

class SandboxApp extends MistApp {
	constructor() {
		super({ name: "SandboxApp", canvas, rendererAPI: MistRendererAPI.WebGL2 });
		this.pushLayer(TestLayer);
	}
}

CreateMistApp(() => {
	return new SandboxApp();
});
