import "./style.css";
import Mist, { Vector3, vec3 } from "@mist-engine/index";
import MistKey from "@mist-engine/core/Input/MistKey";
import { OrthographicCamera } from "@mist-engine/cameras";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const fpsSpan = document.getElementById("fps-text") as HTMLSpanElement;

type DrawableObject = {
	va: Mist.MistVertexArray;
	shader: Mist.MistShader;
	position: Vector3;
	scale: Vector3;
	angle: number;
};

function updateFPSText(fps: number) {
	fpsSpan.textContent = fps.toFixed(2);
}

class TestLayer extends Mist.Layer {
	private trainTexture!: Mist.MistTexture;
	private squareObj!: DrawableObject;
	private triangleObj!: DrawableObject & {
		velocity: number;
		acceleration: number;
	};
	private camera!: Mist.OrthographicCamera;
	private cameraPosition: Vector3;
	private cameraRotation: number;

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
			position: vec3(-0.3, 0, 1.0),
			scale: vec3(0.4, 0.4, 1),
			angle: 0,
		};

		this.cameraPosition = vec3(0, 0, 0);
		this.cameraRotation = 0;
	}

	updateCamera(delta: number) {
		const { Input } = this.getContext();

		this.camera.setPosition(this.cameraPosition);
		this.camera.setRotation(this.cameraRotation);

		const CAMERA_SPEED = 0.002;
		const CAMERA_ROT_SPEED = 0.008;

		if (
			Input.wheel.isActive &&
			Input.arePressed(MistKey.Control, MistKey.Alt)
		) {
			this.cameraRotation += CAMERA_ROT_SPEED * delta * Input.wheel.dirY;
		}

		if (Input.arePressed(MistKey.Control, MistKey.Num0)) {
			this.cameraPosition = new Vector3(0);
			this.cameraRotation = 0;
		}

		if (Input.anyPressed(MistKey.w, MistKey.W)) {
			this.cameraPosition.y += CAMERA_SPEED * delta;
		} else if (Input.anyPressed(MistKey.s, MistKey.S)) {
			this.cameraPosition.y -= CAMERA_SPEED * delta;
		}

		if (Input.anyPressed(MistKey.d, MistKey.D)) {
			this.cameraPosition.x += CAMERA_SPEED * delta;
		} else if (Input.anyPressed(MistKey.a, MistKey.A)) {
			this.cameraPosition.x -= CAMERA_SPEED * delta;
		}
	}

	override onAttach(): void {
		const { Renderer } = this.getContext();
		// prettier-ignore
		this.camera = new OrthographicCamera(-1 * Renderer.aspect, 1 * Renderer.aspect, -1, 1);
		Renderer.addEventListener(
			MistEventType.RendererResize,
			this.onRendererResize
		);

		this.trainTexture = Mist.Texture.Create(Renderer, "/train.png");

		const sqVertexShader = `
			#version 300 es
			layout ( location = 0 ) in  vec3 a_Position;
			layout(location = 1) in vec2 a_TexCoord; 
			uniform mat4 u_ViewProjection;
			out vec2 TexCoord;
			void main()
			{		
				TexCoord = a_TexCoord;
				TexCoord.y = 1.0 - TexCoord.y; // Flip the y coordinate
				vec4 position = vec4(a_Position, 1.0);
				gl_Position = u_ViewProjection * position;
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

			uniform mat4 u_ViewProjection;
			void main()
			{		
				color = a_Color; 
				vec4 position = vec4(a_Position, 1.0);
				gl_Position = u_ViewProjection * position;
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

		this.triangleObj.shader = Mist.Shader.Create(
			Renderer,
			triVertexShader,
			triFragmentShader
		);

		this.squareObj.shader = Mist.Shader.Create(
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

		const squareLayout = new Mist.BufferLayout([
			{ name: "a_Position", type: Mist.ShaderDataType.Float3, location: 0 },
			{ name: "a_TexCoord", type: Mist.ShaderDataType.Float2, location: 1 },
		]);
		const squareObj = this.squareObj;

		squareObj.va = Mist.VertexArray.Create(Renderer);
		const squareObjVb = Mist.VertexBuffer.Create(Renderer, squareVertices);
		squareObjVb.setLayout(squareLayout);

		const squareObjIb = Mist.IndexBuffer.Create(Renderer, squareIndices);

		squareObj.va.addVertexBuffer(squareObjVb);
		squareObj.va.setIndexBuffer(squareObjIb);

		// Triangle
		const triangleVertices = new Float32Array([
			-0.5, -0.5, 0.0, 1.0, 1.0, 0.0, 0.0 /* Bottom left */,

			0.5, -0.5, 0.0, 1.0, 0.0, 1.0, 0.0 /* Bottom right */,

			0.0, 0.5, 0.0, 1.0, 0.0, 0.0, 1.0 /* Top Right */,
		]);

		const triangleIndices = new Uint32Array([0, 1, 2]);

		const triangleLayout = new Mist.BufferLayout([
			{ name: "a_Position", type: Mist.ShaderDataType.Float3, location: 0 },
			{ name: "a_Color", type: Mist.ShaderDataType.Float4, location: 1 },
		]);
		const { triangleObj } = this;

		triangleObj.va = Mist.VertexArray.Create(Renderer);

		const triangleObjVb = Mist.VertexBuffer.Create(Renderer, triangleVertices);
		triangleObjVb.setLayout(triangleLayout);

		const triangleObjIb = Mist.IndexBuffer.Create(Renderer, triangleIndices);

		triangleObj.va.addVertexBuffer(triangleObjVb);
		triangleObj.va.setIndexBuffer(triangleObjIb);

		squareObj.shader.use();

		if (squareObj.shader.is<Mist.MistWebGL2Shader>())
			squareObj.shader.setUniform1i("u_Texture", 0);

		this.trainTexture.use(0);
	}

	onRendererResize: MistEventListenerCallback<MistRendererResizeEvent> = (
		ev
	) => {
		const aspect = ev.target.aspect;
		// prettier-ignore
		this.camera.updateProjection(-1 * aspect, 1 * aspect, -1, 1)
	};

	override onKeyDown(ev: MistKeyDownEvent): boolean {
		if (ev.key == MistKey.Num0 && ev.target.isPressed(MistKey.Control))
			ev.preventDefault();

		return false;
	}
	public onMouseWheel(ev: MistMouseWheelEvent): boolean {
		if (ev.target.isPressed(MistKey.Control)) ev.preventDefault();
		return false;
	}

	override onUpdate(delta: number): void {
		// Each Frame
		const { RenderAPI, Renderer, App } = this.getContext();

		updateFPSText(App.performance.averageFps);
		this.updateCamera(delta);
		/* should be handled by the renderer */
		RenderAPI.SetViewport(0, 0, Renderer.width, Renderer.height);

		RenderAPI.SetClearColor(0.1, 0.1, 0.1, 1.0);
		RenderAPI.Clear();

		Renderer.BeginScene(this.camera);

		Renderer.Submit(this.squareObj.va, this.squareObj.shader);
		Renderer.Submit(this.triangleObj.va, this.triangleObj.shader);

		Renderer.EndScene();
	}

	override onDetach(): void {
		const { Renderer } = this.getContext();
		Renderer.removeEventListener(
			MistEventType.RendererResize,
			this.onRendererResize
		);
	}
}

class SandboxApp extends Mist.MistApp {
	constructor() {
		super({
			name: "SandboxApp",
			canvas,
			rendererAPI: Mist.MistRendererAPI.WebGL2,
		});
		this.pushLayer(TestLayer);
	}
}

Mist.CreateMistApp(async () => {
	await Mist.preloadTexture("/train.png");
	const app = new SandboxApp();
	return app;
});
