import { Renderer, getGLContext } from "@mist-engine/renderers/Renderer";
import { Shader } from "@mist-engine/renderers/Shader";

type ShaderTypes = "VERTEX" | "FRAGMENT";
export class WebGL2Shader implements Shader {
	_gl: WebGL2RenderingContext;
	private program: WebGLProgram;
	private uniformCache: Map<string, number>;

	constructor(
		renderer: Renderer,
		vertexShaderSource: string,
		fragmentShaderSource: string
	) {
		this.uniformCache = new Map();
		this._gl = getGLContext(renderer);
		const vertexShader = this.createShader("VERTEX", vertexShaderSource);
		const fragmentShader = this.createShader("FRAGMENT", fragmentShaderSource);
		this.program = this.createProgram(vertexShader, fragmentShader);
	}
	use(): void {
		this._gl.useProgram(this.program);
	}
	detach(): void {
		this._gl.useProgram(null);
	}
	delete(): void {
		this._gl.deleteProgram(this.program);
	}

	setUniform3f(name: string, x: number, y: number, z: number): void {
		const location = this.getUniformLocation(name);
		this._gl.uniform3f(location, x, y, z);
	}

	private getUniformLocation(name: string): WebGLUniformLocation | null {
		const cache = this.uniformCache.get(name);
		if (cache !== undefined) return cache;

		const location = this._gl.getUniformLocation(this.program, name);
		//TODO  Make it only in development
		if (location === null) {
			console.warn(`Uniform ${name} not found`);
			return location;
		}

		return location;
	}

	private createProgram(...shaders: WebGLShader[]): WebGLProgram {
		const { _gl: gl } = this;
		const program = gl.createProgram();
		if (!program) throw new Error("Error Creating Shader Program");

		shaders.forEach((shader) => {
			gl.attachShader(program, shader);
		});

		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			const info = gl.getProgramInfoLog(program);
			throw new Error(`Error linking program :${info}`);
		}

		shaders.forEach((shader) => {
			gl.deleteShader(shader);
		});

		return program;
	}

	private createShader(type: ShaderTypes, source: string): WebGLShader {
		const shaderType = this.getGLShaderType(type);

		const { _gl: gl } = this;
		const shader = gl.createShader(shaderType);
		if (!shader) throw new Error(`Error creating Shader ${type}`);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			const info = gl.getShaderInfoLog(shader);
			throw new Error(`Error compiling shader ${type}:\n${info}`);
		}
		return shader;
	}

	private getGLShaderType(type: ShaderTypes) {
		switch (type) {
			case "VERTEX":
				return this._gl.VERTEX_SHADER;
			case "FRAGMENT":
				return this._gl.FRAGMENT_SHADER;
			default:
				return -1;
		}
	}
}
