import "./style.css";
import Mist from "@mist/engine";
import { Matrix4, Vector3, vec3 } from "@mist/math";

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
	private currentSampledTexture: number = 0;
	private trainTexture!: Mist.MistTexture;
	private radhaTexture!: Mist.MistTexture;
	private squareObj!: DrawableObject;
	private triangleObj!: DrawableObject;
	private selectedObj!: DrawableObject;
	private blueSquare!: DrawableObject;

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

		this.blueSquare = {
			...this.squareObj,
			position: vec3(1, 0, 0),
			scale: vec3(0.2, 0.2, 1),
			angle: 0,
		};

		this.triangleObj = {
			...this.triangleObj,
			position: vec3(-0.3, 0, 1.0),
			scale: vec3(0.4, 0.4, 1),
			angle: 0,
		};
		this.selectedObj = this.squareObj;
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
			Input.arePressed(Mist.Key.Control, Mist.Key.Alt)
		) {
			this.cameraRotation += CAMERA_ROT_SPEED * delta * Input.wheel.dirY;
		}

		if (Input.arePressed(Mist.Key.Control, Mist.Key.Num0)) {
			this.cameraPosition = new Vector3(0);
			this.cameraRotation = 0;
		}

		if (Input.anyPressed(Mist.Key.w, Mist.Key.W)) {
			this.cameraPosition.y += CAMERA_SPEED * delta;
		} else if (Input.anyPressed(Mist.Key.s, Mist.Key.S)) {
			this.cameraPosition.y -= CAMERA_SPEED * delta;
		}

		if (Input.anyPressed(Mist.Key.d, Mist.Key.D)) {
			this.cameraPosition.x += CAMERA_SPEED * delta;
		} else if (Input.anyPressed(Mist.Key.a, Mist.Key.A)) {
			this.cameraPosition.x -= CAMERA_SPEED * delta;
		}
	}

	updateSelectedObject(delta: number) {
		const { Input } = this.getContext();

		const OBJ_SPEED = 0.002;
		const OBJ_ROT_SPEED = 0.008;

		if (Input.wheel.isActive && Input.mouseBtn.left) {
			this.selectedObj.angle += OBJ_ROT_SPEED * delta * Input.wheel.dirY;
		}

		if (Input.isPressed(Mist.Key.ArrowUp)) {
			this.selectedObj.position.y += OBJ_SPEED * delta;
		} else if (Input.anyPressed(Mist.Key.ArrowDown)) {
			this.selectedObj.position.y -= OBJ_SPEED * delta;
		}

		if (Input.anyPressed(Mist.Key.ArrowRight)) {
			this.selectedObj.position.x += OBJ_SPEED * delta;
		} else if (Input.anyPressed(Mist.Key.ArrowLeft)) {
			this.selectedObj.position.x -= OBJ_SPEED * delta;
		}
	}

	override onUpdate(delta: number): void {
		// Each Frame
		const { RenderAPI, Renderer, App } = this.getContext();

		updateFPSText(App.performance.averageFps);

		this.updateCamera(delta);
		this.updateSelectedObject(delta);

		this.squareObj.shader.use();
		if (this.squareObj.shader.is<Mist.MistWebGL2Shader>())
			this.squareObj.shader.setUniform1i(
				"u_Texture",
				this.currentSampledTexture
			);

		/* should be handled by the renderer */
		RenderAPI.SetViewport(0, 0, Renderer.width, Renderer.height);

		RenderAPI.SetClearColor(0.1, 0.1, 0.1, 1.0);
		RenderAPI.Clear();

		const sq = this.squareObj;
		const sqBlue = this.blueSquare;
		const tri = this.triangleObj;

		const sqObjectTransform = Matrix4.Translate(sq.position).multiplyMat(
			Matrix4.Rotate(sq.angle, vec3(0, 0, 1)),
			Matrix4.Scale(sq.scale)
		);

		const triObjectTransform = Matrix4.Translate(tri.position).multiplyMat(
			Matrix4.Rotate(tri.angle, vec3(0, 0, 1)),
			Matrix4.Scale(tri.scale)
		);

		Renderer.BeginScene(this.camera);

		for (let j = 0; j < 10; j++) {
			for (let i = 0; i < 10; i++) {
				const blueSquareObjTransform = Matrix4.Translate(
					sqBlue.position.clone().add(vec3(0.4 * i, 0.4 * j, 1))
				).multiplyMat(
					Matrix4.Rotate(sqBlue.angle, vec3(0, 0, 1)),
					Matrix4.Scale(sqBlue.scale)
				);

				Renderer.Submit(
					this.blueSquare.va,
					this.blueSquare.shader,
					blueSquareObjTransform
				);
			}
		}

		// prettier-ignore
		Renderer.Submit(this.squareObj.va, this.squareObj.shader, sqObjectTransform);
		// prettier-ignore
		Renderer.Submit(this.triangleObj.va, this.triangleObj.shader, triObjectTransform);

		Renderer.EndScene();
	}

	override onMouseDown(ev: MistMouseDownEvent): boolean {
		const { Renderer } = this.getContext();
		if (ev.button.left && ev.target.isPressed(Mist.Key.Control)) {
			const normalizedX = ev.x / Renderer.canvasWidth;
			const normalizedY = ev.y / Renderer.canvasHeight;

			const newX = (normalizedX * 2.0 - 1.0) * Renderer.aspect;
			const newY = normalizedY * 2.0 - 1.0;

			this.selectedObj.position.x = newX + this.camera.position.x;
			this.selectedObj.position.y = -newY + this.camera.position.y;
		}
		return false;
	}

	override onKeyDown(ev: MistKeyDownEvent): boolean {
		if (ev.key == Mist.Key.Num0 && ev.target.isPressed(Mist.Key.Control))
			ev.preventDefault();
		else if (ev.key == Mist.Key.Num1 && ev.target.isPressed(Mist.Key.Alt))
			this.currentSampledTexture = 0;
		else if (ev.key == Mist.Key.Num2 && ev.target.isPressed(Mist.Key.Alt))
			this.currentSampledTexture = 1;
		else if (ev.key === Mist.Key.Num1) this.selectedObj = this.squareObj;
		else if (ev.key === Mist.Key.Num2) this.selectedObj = this.triangleObj;
		else if (ev.key === Mist.Key.Num3) this.selectedObj = this.blueSquare;

		return false;
	}

	public onMouseWheel(ev: MistMouseWheelEvent): boolean {
		if (ev.target.isPressed(Mist.Key.Control)) ev.preventDefault();
		return false;
	}

	override onAttach(): void {
		const { Renderer } = this.getContext();
		// prettier-ignore
		this.camera = new Mist.OrthographicCamera(-1 * Renderer.aspect, 1 * Renderer.aspect, -1, 1);
		Renderer.addEventListener(
			MistEventType.RendererResize,
			this.onRendererResize
		);

		this.trainTexture = Mist.TextureLibrary.Get("/train.png");
		this.radhaTexture = Mist.TextureLibrary.Get("/radha.png");

		this.setupAllShaders();
		this.setupTexturedSquare();
		this.setupTriangle();
		this.setupBlueSquare();

		this.squareObj.shader.use();

		this.radhaTexture.use(0);
		this.trainTexture.use(1);
	}

	setupTexturedSquare() {
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

		squareObj.va = Mist.VertexArray.Create();
		const squareObjVb = Mist.VertexBuffer.Create(squareVertices);
		squareObjVb.setLayout(squareLayout);

		const squareObjIb = Mist.IndexBuffer.Create(squareIndices);

		squareObj.va.addVertexBuffer(squareObjVb);
		squareObj.va.setIndexBuffer(squareObjIb);
	}

	setupTriangle() {
		// Triangle
		const triangleVertices = new Float32Array([
			-0.5, -0.5, 0.0, 1.0, 1.0, 0.0, 1.0 /* Bottom left */,

			0.5, -0.5, 0.0, 1.0, 0.0, 1.0, 1.0 /* Bottom right */,

			0.0, 0.5, 0.0, 1.0, 0.0, 0.0, 1.0 /* Top Right */,
		]);

		const triangleIndices = new Uint32Array([0, 1, 2]);

		const triangleLayout = new Mist.BufferLayout([
			{ name: "a_Position", type: Mist.ShaderDataType.Float3, location: 0 },
			{ name: "a_Color", type: Mist.ShaderDataType.Float4, location: 1 },
		]);
		const { triangleObj } = this;

		triangleObj.va = Mist.VertexArray.Create();

		const triangleObjVb = Mist.VertexBuffer.Create(triangleVertices);
		triangleObjVb.setLayout(triangleLayout);

		const triangleObjIb = Mist.IndexBuffer.Create(triangleIndices);

		triangleObj.va.addVertexBuffer(triangleObjVb);
		triangleObj.va.setIndexBuffer(triangleObjIb);
	}

	setupBlueSquare() {
		const blueSqVertices = new Float32Array([
			-0.75, -0.75, 0.0 /* Bottom left */,

			0.75, -0.75, 0.0 /* Bottom right */,

			0.75, 0.75, 0.0 /* Top Right */,

			-0.75, 0.75, 0.0 /* Top Left */,
		]);
		const blueSquareIndices = new Uint32Array([0, 1, 2, 2, 3, 0]);

		const blueSquareLayout = new Mist.BufferLayout([
			{ name: "a_Position", type: Mist.ShaderDataType.Float3, location: 0 },
		]);
		const blueSquareObj = this.blueSquare;

		blueSquareObj.va = Mist.VertexArray.Create();
		const blueSquareVb = Mist.VertexBuffer.Create(blueSqVertices);
		blueSquareVb.setLayout(blueSquareLayout);

		const blueSquareIb = Mist.IndexBuffer.Create(blueSquareIndices);

		blueSquareObj.va.addVertexBuffer(blueSquareVb);
		blueSquareObj.va.setIndexBuffer(blueSquareIb);
	}

	setupAllShaders() {
		this.triangleObj.shader = Mist.ShaderLibrary.Load(
			"/sandbox.mist.glsl/#triangleShader"
		);

		this.squareObj.shader = Mist.ShaderLibrary.Load(
			"/sandbox.mist.glsl/#texturedSquare"
		);
		this.blueSquare.shader = Mist.ShaderLibrary.Load(
			"/sandbox.mist.glsl/#blueSquare"
		);
	}

	onRendererResize: MistEventListenerCallback<MistRendererResizeEvent> = (
		ev
	) => {
		const aspect = ev.target.aspect;
		// prettier-ignore
		this.camera.updateProjection(-1 * aspect, 1 * aspect, -1, 1)
	};

	override onDetach(): void {
		const { Renderer } = this.getContext();
		Renderer.removeEventListener(
			MistEventType.RendererResize,
			this.onRendererResize
		);
	}
}

class SandboxApp extends Mist.Application {
	constructor() {
		super({
			name: "SandboxApp",
			canvas,
			rendererAPI: Mist.RendererAPI.WebGL2,
		});
		this.pushLayer(TestLayer);
	}
}

Mist.CreateApp(async () => {
	const app = new SandboxApp();

	await Mist.TextureLibrary.Create(app, "/radha.png");
	await Mist.TextureLibrary.Create(app, "/train.png");

	await Mist.ShaderLibrary.Preload(app, "/sandbox.mist.glsl");

	return app;
});
