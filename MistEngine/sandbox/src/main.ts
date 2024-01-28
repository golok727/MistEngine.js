import {
	VertexArray,
	IndexBuffer,
	VertexBuffer,
	Shader,
	BufferLayout,
	ShaderDataType,
	MistShader,
	MistVertexArray,
	preloadTexture,
	Texture,
	MistTexture,
	vec3,
	Vector3,
} from "@mist-engine/index";

import "./style.css";

import {
	CreateMistApp,
	Layer,
	Matrix4,
	MistApp,
	MistRendererAPI,
} from "@mist-engine/index";

import MistKey from "@mist-engine/core/Input/MistKey";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const fpsSpan = document.getElementById("fps-text") as HTMLSpanElement;

type DrawableObject = {
	va: MistVertexArray;
	shader: MistShader;
	position: Vector3;
	scale: Vector3;
	angle: number;
};

function updateFPSText(fps: number) {
	fpsSpan.textContent = fps.toFixed(2);
}

class TestLayer extends Layer {
	private frameTimes: number[] = [];
	private lastTime = 0;
	private trainTexture!: MistTexture;
	private squareObj!: DrawableObject;
	private triangleObj!: DrawableObject;
	private projection!: Matrix4;

	private axis = vec3(0, 0, 1);
	constructor() {
		super("TestLayer");
		this.squareObj = {
			...this.squareObj,
			position: vec3(0, 0, 0),
			scale: vec3(1, 1, 1),
			angle: 0,
		};

		this.triangleObj = {
			...this.triangleObj,
			position: vec3(-0, 0, 1.0),
			scale: vec3(0.4, 0.4, 1),
			angle: 0,
		};
	}

	updateFPSDebugText(delta: number) {
		if (!delta) return;
		const fps = 1000 / delta;
		this.frameTimes.push(fps);

		const now = performance.now();

		if (now - this.lastTime > 1000) {
			if (this.frameTimes.length) {
				const averageFps =
					this.frameTimes.reduce((s, c) => s + c, 0) / this.frameTimes.length;
				updateFPSText(averageFps);
			}

			// Reset for the next second
			this.frameTimes = [];
			this.lastTime = now;
		}
	}

	updateObject(delta: number) {
		const { Input, Renderer } = this.getContext();
		// console.log((1000 / delta).toFixed(2) + " FPS");
		const angleV = 0.003;
		const speed = 0.001;

		if (Input.wheel.isActive) {
			this.triangleObj.angle += angleV * Input.wheel.dirY * 40;
		}

		// Test Mouse
		if (Input.isMouseDown && Input.isPressed(MistKey.Control)) {
			this.triangleObj.position.set(
				(Input.mouseX / Renderer.getWidth()) * 2.0 - 1.0,
				-((Input.mouseY / Renderer.getHeight()) * 2.0 - 1.0),
				1
			);
		}

		// Test Keyboard
		if (Input.anyPressed(MistKey.ArrowRight, MistKey.d)) {
			this.triangleObj.angle += angleV * delta;
		}

		if (Input.anyPressed(MistKey.ArrowLeft, MistKey.a)) {
			this.triangleObj.angle -= angleV * delta;
		}

		if (Input.anyPressed(MistKey.ArrowUp, MistKey.w)) {
			const angle = this.triangleObj.angle;
			this.triangleObj.position.add([
				speed * Math.sin(angle) * delta,
				speed * Math.cos(angle) * delta,
				0,
			]);
		}

		if (Input.anyPressed(MistKey.ArrowDown, MistKey.s)) {
			const angle = this.triangleObj.angle;
			this.triangleObj.position.add([
				-speed * Math.sin(angle) * delta,
				-speed * Math.cos(angle) * delta,
				0,
			]);
		}
	}

	override onAttach(): void {
		const { Renderer } = this.getContext();

		const aspect = Renderer.getWidth() / Renderer.getHeight();

		this.trainTexture = Texture.Create(Renderer, "/train.png");

		this.projection = Matrix4.Ortho(
			-1.0 * aspect,
			1.0 * aspect,
			-1.0,
			1.0,
			-1.0,
			1.0
		);
		const sqVertexShader = `
			#version 300 es
			layout ( location = 0 ) in  vec3 a_Position;
			layout(location = 1) in vec2 a_TexCoord; 
			uniform mat4 u_Projection;
			out vec2 TexCoord;
			void main()
			{		
				TexCoord = a_TexCoord;
				TexCoord.y = 1.0 - TexCoord.y; // Flip the y coordinate
				vec4 position = vec4(a_Position, 1.0);
				gl_Position = u_Projection * position;
			}
		`;

		const sqFragmentShader = `
			#version 300 es
			precision highp float;
			
			in vec2 TexCoord; 
			uniform vec3 u_Color;
			uniform sampler2D u_Texture;
			out vec4 fragColor; 
			void main()
			{
				fragColor = texture(u_Texture, TexCoord);
			}
		`;

		const triVertexShader = `
			#version 300 es
			layout ( location = 0 ) in  vec3 a_Position;
			layout(location = 1) in vec4 a_Color; 
			out vec4 color;

			uniform mat4 u_Projection;
			void main()
			{		
				color = a_Color; 
				vec4 position = vec4(a_Position, 1.0);
				gl_Position = u_Projection * position;
			}
		`;

		const triFragmentShader = `
			#version 300 es
			precision highp float;
			
			in vec4 color; 
			out vec4 fragColor; 
			void main()
			{
				fragColor = color;
			}
		`;

		this.triangleObj.shader = Shader.Create(
			Renderer,
			triVertexShader,
			triFragmentShader
		);

		this.squareObj.shader = Shader.Create(
			Renderer,
			sqVertexShader,
			sqFragmentShader
		);

		// prettier-ignore
		const squareVertices = new Float32Array([
			-0.75, -0.75, 0.0, 0.0, 0.0 /* Bottom left */,

			0.75, -0.75, 0.0, 1.0, 0.0 /* Bottom right */,

			0.75, 0.75, 0.0, 1.0, 1.0 /* Top Right */,

			-0.75, 0.75, 0.0, 0.0, 1.0 /* Top Left */,
		]);
		const squareIndices = new Uint32Array([0, 1, 2, 2, 3, 0]);

		const squareLayout = new BufferLayout([
			{ name: "a_Position", type: ShaderDataType.Float3, location: 0 },
			{ name: "a_TexCoord", type: ShaderDataType.Float2, location: 1 },
		]);
		const squareObj = this.squareObj;

		squareObj.va = VertexArray.Create(Renderer);
		const squareObjVb = VertexBuffer.Create(Renderer, squareVertices);
		squareObjVb.setLayout(squareLayout);

		const squareObjIb = IndexBuffer.Create(Renderer, squareIndices);

		squareObj.va.addVertexBuffer(squareObjVb);
		squareObj.va.setIndexBuffer(squareObjIb);

		// Triangle
		const triangleVertices = new Float32Array([
			-0.5, -0.5, 0.0, 1.0, 1.0, 0.0, 0.0 /* Bottom left */,

			0.5, -0.5, 0.0, 1.0, 0.0, 1.0, 0.0 /* Bottom right */,

			0.0, 0.5, 0.0, 1.0, 0.0, 0.0, 1.0 /* Top Right */,
		]);

		const triangleIndices = new Uint32Array([0, 1, 2]);

		const triangleLayout = new BufferLayout([
			{ name: "a_Position", type: ShaderDataType.Float3, location: 0 },
			{ name: "a_Color", type: ShaderDataType.Float4, location: 1 },
		]);
		const { triangleObj } = this;

		triangleObj.va = VertexArray.Create(Renderer);

		const triangleObjVb = VertexBuffer.Create(Renderer, triangleVertices);
		triangleObjVb.setLayout(triangleLayout);

		const triangleObjIb = IndexBuffer.Create(Renderer, triangleIndices);

		triangleObj.va.addVertexBuffer(triangleObjVb);
		triangleObj.va.setIndexBuffer(triangleObjIb);

		squareObj.shader.use();
		squareObj.shader.setUniform1i("u_Texture", 0);
		this.trainTexture.use(0);
	}

	override onUpdate(delta: number): void {
		// Each Frame
		const { RenderAPI, Renderer } = this.getContext();

		this.updateFPSDebugText(delta);

		RenderAPI.Resize(() => {
			const aspect = Renderer.getWidth() / Renderer.getHeight();
			// recalculates the projection matrix with the new aspect
			// prettier-ignore
			this.projection.makeOrthographic(-1.0 * aspect, 1.0 *aspect, -1.0 , 1.0, -1.0, 1.0 )
		});

		this.updateObject(delta);
		/* should be handled by the renderer */
		RenderAPI.SetViewport(0, 0, Renderer.getWidth(), Renderer.getHeight());

		RenderAPI.SetClearColor(0.1, 0.1, 0.1, 1.0);
		RenderAPI.Clear();

		Renderer.BeginScene();

		this.squareObj.shader.use();
		const squareProj = this.projection
			.clone()
			.multiplyMat(
				Matrix4.Translate(this.squareObj.position),
				Matrix4.Scale(this.squareObj.scale),
				Matrix4.Rotate(this.squareObj.angle, this.axis)
			);
		this.squareObj.shader.setUniformMat4("u_Projection", squareProj);
		Renderer.Submit(this.squareObj.va);

		const triProj = this.projection
			.clone()
			.multiplyMat(
				Matrix4.Translate(this.triangleObj.position),
				Matrix4.Scale(this.triangleObj.scale),
				Matrix4.Rotate(this.triangleObj.angle, this.axis)
			);

		this.triangleObj.shader.use();
		this.triangleObj.shader.setUniformMat4("u_Projection", triProj);
		Renderer.Submit(this.triangleObj.va);

		Renderer.EndScene();
	}

	override onDetach(): void {}
}

class SandboxApp extends MistApp {
	constructor() {
		super({ name: "SandboxApp", canvas, rendererAPI: MistRendererAPI.WebGL2 });
		this.pushLayer(TestLayer);
	}
}

CreateMistApp(async () => {
	await preloadTexture("/train.png");
	return new SandboxApp();
});
