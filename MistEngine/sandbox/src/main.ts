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
	Vector2,
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

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

type DrawableObject = {
	va: MistVertexArray;
	shader: MistShader;
	position: Vector3;
	scale: Vector3;
	angle: number;
};

class TestLayer extends Layer {
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
	onKeyDown(ev: KeyboardEvent) {
		const angleV = 0.1;
		const speed = 0.01;

		switch (ev.key) {
			case "ArrowLeft":
			case "A":
			case "a":
				this.triangleObj.angle -= angleV;
				break;

			case "ArrowRight":
			case "D":
			case "d":
				this.triangleObj.angle += angleV;
				break;

			case "ArrowUp":
			case "W":
			case "w": {
				const angle = this.triangleObj.angle;
				this.triangleObj.position.add([
					speed * Math.sin(angle),
					speed * Math.cos(angle),
					0,
				]);
				break;
			}

			case "ArrowDown":
			case "S":
			case "s": {
				const angle = this.triangleObj.angle;
				this.triangleObj.position.add([
					-speed * Math.sin(angle),
					-speed * Math.cos(angle),
					0,
				]);
				break;
			}
		}
	}

	override onAttach(app: SandboxApp): void {
		const renderer = app.getRenderer();
		const aspect = renderer.getWidth() / renderer.getHeight();

		this.trainTexture = Texture.Create(renderer, "/train.png");

		// prettier-ignore
		this.projection = Matrix4.Ortho(-1.0 * aspect, 1.0 *aspect, -1.0 , 1.0, -1.0, 1.0 )
		window.addEventListener("keydown", this.onKeyDown.bind(this));
		// Square Shader
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
			renderer,
			triVertexShader,
			triFragmentShader
		);

		this.squareObj.shader = Shader.Create(
			renderer,
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

		squareObj.va = VertexArray.Create(renderer);
		const squareObjVb = VertexBuffer.Create(renderer, squareVertices);
		squareObjVb.setLayout(squareLayout);

		const squareObjIb = IndexBuffer.Create(renderer, squareIndices);

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

		triangleObj.va = VertexArray.Create(renderer);

		const triangleObjVb = VertexBuffer.Create(renderer, triangleVertices);
		triangleObjVb.setLayout(triangleLayout);

		const triangleObjIb = IndexBuffer.Create(renderer, triangleIndices);

		triangleObj.va.addVertexBuffer(triangleObjVb);
		triangleObj.va.setIndexBuffer(triangleObjIb);

		squareObj.shader.use();
		squareObj.shader.setUniform1i("u_Texture", 0);
		this.trainTexture.use(0);
	}

	override onUpdate(app: SandboxApp, _delta: number): void {
		// Each Frame
		const renderer = app.getRenderer();
		const renderAPI = renderer.GetRenderAPI();

		renderAPI.Resize(() => {
			const aspect = renderer.getWidth() / renderer.getHeight();

			// recalculates the projection matrix with the new aspect
			// prettier-ignore
			this.projection.makeOrthographic(-1.0 * aspect, 1.0 *aspect, -1.0 , 1.0, -1.0, 1.0 )
		});

		/* should be handled by the renderer */
		renderAPI.SetViewport(0, 0, renderer.getWidth(), renderer.getHeight());

		renderAPI.SetClearColor(0.1, 0.1, 0.1, 1.0);
		renderAPI.Clear();

		renderer.BeginScene();

		this.squareObj.shader.use();
		const squareProj = this.projection
			.clone()
			.multiplyMat(
				Matrix4.Translate(this.squareObj.position),
				Matrix4.Scale(this.squareObj.scale),
				Matrix4.Rotate(this.squareObj.angle, this.axis)
			);
		this.squareObj.shader.setUniformMat4("u_Projection", squareProj);
		renderer.Submit(this.squareObj.va);

		const triProj = this.projection
			.clone()
			.multiplyMat(
				Matrix4.Translate(this.triangleObj.position),
				Matrix4.Scale(this.triangleObj.scale),
				Matrix4.Rotate(this.triangleObj.angle, this.axis)
			);

		this.triangleObj.shader.use();
		this.triangleObj.shader.setUniformMat4("u_Projection", triProj);
		renderer.Submit(this.triangleObj.va);

		renderer.EndScene();
	}

	override onDetach(_app: SandboxApp): void {}
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
