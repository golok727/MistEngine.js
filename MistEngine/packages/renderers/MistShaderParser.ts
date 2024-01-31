/* 
  This api will be rewritten with custom MistShaders with more functionality
  This is just for testing purposed more robust one will be made later 

  We will take care of version later
*/

// const MIST_SHADER_DECORATOR_BASE_REGEX =
// 	/^@(?<decorator>Mist\w+)\((?<value>.+)?\)+(?:\s+)?$/;

type ValidatorFunction = (arg: string) => { error?: string; ok: boolean };

type ValidationConfig = {
	minRequired: number;
	decoName: string;
	requiredArgsName: string[];
	validate: Record<
		number,
		{ required: boolean; validator?: ValidatorFunction }
	>;
};
const MIST_SHADER_DECORATOR_BASE_REGEX = createMistDecoratorRegex("");

function createMistDecoratorRegex(name: string, exact = false) {
	const wp = exact ? "" : "\\w+";
	return new RegExp(
		`^@(?<decorator>Mist${name}(?:${wp})?)\\s*?\\((?<value>.+)?\\)\\s*;*\\s*$`
	);
}

const MIST_SHADER_DECORATOR_REGEX = createMistDecoratorRegex("Shader");
const MIST_ATTRIBUTE_REGEX = createMistDecoratorRegex("Attribute", true);
const MIST_UNIFORM_REGEX = createMistDecoratorRegex("Uniform", true);
const MIST_IN_REGEX = createMistDecoratorRegex("In", true);
const MIST_OUT_REGEX = createMistDecoratorRegex("Out", true);

const MistShaderDecorators: Record<string, number> = {
	MistShaderVersion: 1,
	MistShaderBegin: 2,
	MistShaderEnd: 3,
	MistShaderType: 4,
} as const;

type Parsed = {
	version: number | null;
	shaders: Record<string, { fragment: string; vertex: string }>;
};

export type ShaderSource = {
	name: string;
	vertex: string;
	fragment: string;
};

enum MistShaderType {
	NONE = "NONE",
	VERTEX = "vertex",
	FRAGMENT = "fragment",
	PIXEL = "pixel",
}

export default class MistShaderParser {
	private parsed: Parsed;
	private currentShaderType: MistShaderType = MistShaderType.NONE;
	private currentShaderName: string | null = null;
	private currentLineNumber = 0;
	private isVersionSet = false;

	constructor(private source: string) {
		this.parsed = {
			version: null,
			shaders: {},
		};
	}
	public reset() {
		this.currentShaderName = null;
		this.currentLineNumber = 0;
		this.isVersionSet = false;
		this.parsed = {
			version: null,
			shaders: {},
		};
	}
	public parse(source?: string): Promise<ShaderSource[]> {
		if (source) this.source = source;

		return new Promise((resolve, reject) => {
			try {
				this.parseMistShader();
				const sources: ShaderSource[] = Object.keys(this.parsed.shaders).map(
					(name) => {
						const shader = this.parsed.shaders[name];
						return {
							name,
							vertex: shader.vertex,
							fragment: shader.fragment,
						};
					}
				);
				resolve(sources);
			} catch (error) {
				reject(error);
			}
		});
	}

	private matchDecorator(line: string) {
		const shaderDecoratorMatch = line.match(MIST_SHADER_DECORATOR_REGEX);
		if (shaderDecoratorMatch) {
			this.setShaderDecoratorValue(shaderDecoratorMatch);
			return;
		}

		const attributeDecoratorMatch = line.match(MIST_ATTRIBUTE_REGEX);
		if (attributeDecoratorMatch) {
			this.setAttributeDecoratorValue(attributeDecoratorMatch);
			return;
		}

		const uniformDecoratorMatch = line.match(MIST_UNIFORM_REGEX);
		if (uniformDecoratorMatch) {
			this.setUniformDecoratorValue(uniformDecoratorMatch);
			return;
		}

		const inDecoratorMatch = line.match(MIST_IN_REGEX);
		if (inDecoratorMatch) {
			this.setInOrOutDecorator(inDecoratorMatch, "in");
			return;
		}

		const outDecoratorMatch = line.match(MIST_OUT_REGEX);
		if (outDecoratorMatch) {
			this.setInOrOutDecorator(outDecoratorMatch, "out");
			return;
		}

		throw new Error(`Invalid MistDecorator: ${line}`);
	}
	private appendToCurrentShader(s: string) {
		if (
			this.currentShaderName !== null &&
			this.currentShaderType !== MistShaderType.NONE &&
			this.parsed.shaders[this.currentShaderName] !== undefined
		) {
			const currentShader = this.parsed.shaders[this.currentShaderName];

			const currentShaderType = this.currentShaderType as "fragment" | "vertex";
			currentShader[currentShaderType] += s + "\n";
		}
	}
	private parseMistShader() {
		const lines = this.source.split("\n");
		for (const line of lines) {
			this.currentLineNumber++;

			if (line === "") continue;

			if (MIST_SHADER_DECORATOR_BASE_REGEX.test(line)) {
				this.matchDecorator(line);
				continue;
			}

			this.appendToCurrentShader(line);
		}
	}
	private setAttributeDecoratorValue(match: RegExpMatchArray) {
		if (!match.groups)
			throw new Error(`Mist.MistShaderParser: Error parsing ${match[0]}`);

		const args = (match.groups.value ?? "").split(",").map((arg) => arg.trim());
		this.validateArgs(args, {
			decoName: "MistAttribute",
			minRequired: 3,
			requiredArgsName: ["location", "dataType", "name"],
			validate: {
				0: {
					required: true,
					validator: (arg) => ({
						ok: !isNaN(parseInt(arg)),
						error: "should be a number",
					}),
				},
				1: {
					required: true,
				},

				2: {
					required: true,
					validator: (arg) => ({ ok: arg !== "", error: "cannot be empty" }),
				},
			},
		});

		const location = parseInt(args[0]);
		const name = args[2];
		const dataType = this.mistShaderDataTypeToGLDataType(args[1]);

		const glsl = `layout (location = ${location}) in ${dataType} ${name};`;
		this.appendToCurrentShader(glsl);
	}

	private setUniformDecoratorValue(match: RegExpMatchArray) {
		if (!match.groups)
			throw new Error(`Mist.MistShaderParser: Error parsing ${match[0]}`);

		const args = (match.groups.value ?? "").split(",").map((arg) => arg.trim());
		this.validateArgs(args, {
			decoName: "MistUniform",
			minRequired: 2,
			requiredArgsName: ["type", "name"],
			validate: {
				0: {
					required: true,
				},
				1: {
					required: true,
					validator: (arg) => ({ ok: arg !== "", error: "cannot be empty" }),
				},
			},
		});

		const dataType = this.mistShaderDataTypeToGLDataType(args[0]);
		const name = args[1];

		const glsl = `uniform ${dataType} ${name};`;
		this.appendToCurrentShader(glsl);
	}
	private setInOrOutDecorator(match: RegExpMatchArray, t: "out" | "in") {
		if (!match.groups)
			throw new Error(
				`Mist.MistShaderParser::MistIn() Error parsing ${match[0]}`
			);

		const args = (match.groups.value ?? "").split(",").map((arg) => arg.trim());
		this.validateArgs(args, {
			decoName: "MistUniform",
			minRequired: 2,
			requiredArgsName: ["type", "name"],
			validate: {
				0: {
					required: true,
				},
				1: {
					required: true,
					validator: (arg) => ({ ok: arg !== "", error: "cannot be empty" }),
				},
			},
		});
		const dataType = this.mistShaderDataTypeToGLDataType(args[0]);
		const name = args[1];
		const glsl = `${t} ${dataType} ${name}; `;
		this.appendToCurrentShader(glsl);
	}

	private validateArgs(args: string[], validate: ValidationConfig) {
		if (!args) {
			throw new Error(
				`Mist.MistShaderParser::MistUniform: Required ${
					validate.minRequired
				} arguments (${validate.requiredArgsName.join(",")}), provided ${
					args ?? "None"
				}`
			);
		}

		if (args.length !== validate.minRequired)
			throw new Error(
				`Mist.MistShaderParser::${validate.decoName}: Required ${
					validate.minRequired
				} arguments, provided ${
					args.length
				}, Required Args: (${validate.requiredArgsName.join(",")})`
			);

		args.forEach((arg, idx) => {
			if (!arg && validate.validate[idx].required === true) {
				throw new Error(
					`Mist.MistShaderParser::${validate.decoName}: Required argument ${validate.requiredArgsName[idx]} cannot be empty`
				);
			}
			const validatorFn = validate.validate[idx].validator;
			if (validatorFn) {
				const res = validatorFn(arg);
				if (!res.ok)
					throw new Error(
						`Mist.MistShaderParser::${validate.decoName}: ${res.error}`
					);
			}
		});
	}
	private mistShaderDataTypeToGLDataType(type: string) {
		switch (type) {
			case "Mat4":
				return "mat4";

			case "Float":
				return "float";

			case "Vec2":
				return "vec2";

			case "Vec3":
				return "vec3";

			case "Vec4":
				return "vec4";

			case "Texture":
				return "sampler2D";

			default:
				throw new Error(
					`Invalid MistShader DataType: Provided => ${type}; \nExpected => Float | Vec2 | Vec3 | Vec4 | Mat4 | Texture`
				);
		}
	}
	private setShaderDecoratorValue(match: RegExpMatchArray) {
		if (!match.groups) throw new Error("Error parsing shader...");
		const decorator = match.groups["decorator"];
		const value = match.groups["value"];

		switch (MistShaderDecorators[decorator]) {
			case MistShaderDecorators.MistShaderVersion: {
				if (this.isVersionSet)
					throw new Error("Mist.MistShaderParser: Version Already set");

				const version = parseInt(value);

				// Check if the version provided is a number or not
				if (isNaN(version))
					throw new Error(
						`Mist.MistShaderParser: Version is not valid\n version: ${value}`
					);

				this.isVersionSet = true;
				this.parsed.version = version;

				break;
			}

			case MistShaderDecorators.MistShaderBegin: {
				if (this.currentShaderName !== null)
					throw new Error(
						"Mist.MistShaderParser: Please End a shader before beginning a new shader"
					);

				if (this.parsed.shaders[value] !== undefined)
					throw new Error(
						`Mist.MistShaderParser: Shader with name '${value}' already exists`
					);

				this.currentShaderName = value;
				this.parsed.shaders[this.currentShaderName] = {
					vertex: this.getDefaultVertexShader(),
					fragment: this.getDefaultFragmentShader(),
				};
				break;
			}

			case MistShaderDecorators.MistShaderType: {
				if (this.currentShaderName === null)
					throw new Error(
						"Please Begin a new Shader before setting the shader type"
					);

				switch (value) {
					case MistShaderType.VERTEX:
						this.currentShaderType = MistShaderType.VERTEX;
						break;
					case MistShaderType.FRAGMENT:
					case MistShaderType.PIXEL:
						this.currentShaderType = MistShaderType.FRAGMENT;
						break;
				}
				break;
			}

			case MistShaderDecorators.MistShaderEnd: {
				if (value != this.currentShaderName)
					throw new Error(
						`Mist.MistShaderParse: Error ending shader. shader ${value} haven't begin`
					);
				this.currentShaderType = MistShaderType.NONE;
				this.currentShaderName = null;
				break;
			}

			default:
				throw new Error(`Unknown shader decorator '${decorator}' `);
		}
	}

	private getDefaultVertexShader() {
		return `#version 300 es
    uniform mat4 u_Transform;
    uniform mat4 u_ViewProjection;`;
	}

	private getDefaultFragmentShader() {
		return `#version 300 es
    precision highp float; 
    `;
	}
}
