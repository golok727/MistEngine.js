import { MistAPIUsable, MistRendererAPI, Renderer } from "./Renderer";
import {
	WebGL2IndexBuffer,
	MistWebGL2VertexBuffer,
} from "./api/WebGL2/WebGL2Buffer";

export enum ShaderDataType {
	Float = 0,
	Bool,
	Float2,
	Float3,
	Float4,

	Int,
	Int2,
	Int3,
	Int4,

	Mat3,
	Mat4,
}

type BufferLayoutConstructor = {
	type: ShaderDataType;
	name: string;
	location: number;
	normalized?: boolean;
};

class BufferElement {
	name: string;
	type: ShaderDataType;
	location: number;
	offset: number;
	componentCount: number;
	size: number;
	normalized: boolean;

	constructor({ name, type, location, normalized }: BufferLayoutConstructor) {
		this.name = name;
		this.type = type;
		this.location = location;
		this.offset = 0;
		this.componentCount = getComponentCountForDataType(type);
		this.size = getShaderDataTypeSize(type);
		this.normalized = !!normalized;
	}
}

export class BufferLayout {
	private bufferElements: BufferElement[];
	private _stride = 0;

	constructor(layout: BufferLayoutConstructor[]) {
		if (layout.length === 0) throw new Error("Layout cannot be empty");

		this.bufferElements = this.constructBufferElements(layout);
		this.calculateOffsetsAndStrides();
	}

	private calculateOffsetsAndStrides() {
		let offset = 0;
		// Calculate the offset and stride
		this.bufferElements.forEach((element) => {
			element.offset = offset;
			offset += element.size;
			this._stride += element.size;
		});
	}

	get stride() {
		return this._stride;
	}
	get elements() {
		return this.bufferElements;
	}

	private constructBufferElements(
		layout: BufferLayoutConstructor[]
	): BufferElement[] {
		const locationsSet = new Set<number>();
		return layout.map((layout) => {
			if (locationsSet.has(layout.location)) {
				console.error(
					`Location '${location}' is already set in layout`,
					layout
				);
				throw "";
			}
			locationsSet.add(layout.location);
			return new BufferElement(layout);
		});
	}

	[Symbol.iterator](): Iterator<BufferElement> {
		let idx = 0;
		return {
			next: () => {
				return idx < this.elements.length
					? { value: this.elements[idx++], done: false }
					: { value: undefined, done: true };
			},
		};
	}
}

/*
	Interfaces for Making API specific Buffer
 */

interface MistBufferBase extends MistAPIUsable {}

export interface MistVertexBuffer extends MistBufferBase {
	setLayout(layout: BufferLayout): void;
	getLayout(): BufferLayout;
}

export interface MistIndexBuffer extends MistBufferBase {
	getCount(): number;
}

export class MistVertexBufferFactory {
	/**
	 * Creates a vertex buffer based on the given renderer API
	 */
	public static Create(
		renderer: Renderer,
		data: Float32Array
	): MistVertexBuffer {
		switch (renderer.GetApiType()) {
			case MistRendererAPI.WebGL2:
				return new MistWebGL2VertexBuffer(renderer, data);
			case MistRendererAPI.WebGPU:
				throw new Error(
					`Renderer API ${renderer.GetApiType()} is under construction`
				);
			default:
				throw new Error(
					`Renderer API ${renderer.GetApiType()} is not supported`
				);
		}
	}
}

export class MistIndexBufferFactory {
	/**
	 * Creates a index buffer based on the given renderer API
	 */
	public static Create(renderer: Renderer, data: Uint32Array): MistIndexBuffer {
		switch (renderer.GetApiType()) {
			case MistRendererAPI.WebGL2:
				return new WebGL2IndexBuffer(renderer, data);

			case MistRendererAPI.WebGPU:
				throw new Error(
					`Renderer API ${renderer.GetApiType()} is under construction`
				);

			default:
				throw new Error(
					`Renderer API ${renderer.GetApiType()} is not supported`
				);
		}
	}
}

export function getComponentCountForDataType(type: ShaderDataType) {
	switch (type) {
		case ShaderDataType.Float:
			return 1;
		case ShaderDataType.Float2:
			return 2;
		case ShaderDataType.Float3:
			return 3;
		case ShaderDataType.Float4:
			return 4;
		case ShaderDataType.Int:
			return 1;
		case ShaderDataType.Int2:
			return 2;
		case ShaderDataType.Int3:
			return 3;
		case ShaderDataType.Int4:
			return 4;
		case ShaderDataType.Mat3:
			return 3 * 3;
		case ShaderDataType.Mat4:
			return 4 * 4;
		case ShaderDataType.Bool:
			return 1;
		default:
			throw new Error("Unsupported shader data type");
	}
}

export function getShaderDataTypeSize(type: ShaderDataType) {
	switch (type) {
		case ShaderDataType.Float:
			return 4;
		case ShaderDataType.Float2:
			return 4 * 2;
		case ShaderDataType.Float3:
			return 4 * 3;
		case ShaderDataType.Float4:
			return 4 * 4;
		case ShaderDataType.Int:
			return 4;
		case ShaderDataType.Int2:
			return 4 * 2;
		case ShaderDataType.Int3:
			return 4 * 3;
		case ShaderDataType.Int4:
			return 4 * 4;
		case ShaderDataType.Mat3:
			return 4 * 3 * 3;
		case ShaderDataType.Mat4:
			return 4 * 4 * 4;
		case ShaderDataType.Bool:
			return 1;
		default:
			throw new Error("Unknown shader data type");
	}
}
namespace GLDataTypes {
	export const BYTE = 0x1400;
	export const UNSIGNED_BYTE = 0x1401;
	export const SHORT = 0x1402;
	export const UNSIGNED_SHORT = 0x1403;
	export const INT = 0x1404;
	export const UNSIGNED_INT = 0x1405;
	export const FLOAT = 0x1406;

	export const BOOL = 0x8b56;
}
export function shaderDataTypeToGLBaseDataType(type: ShaderDataType) {
	switch (type) {
		case ShaderDataType.Float:
		case ShaderDataType.Float2:
		case ShaderDataType.Float3:
		case ShaderDataType.Float4:
		case ShaderDataType.Mat3:
		case ShaderDataType.Mat4:
			return GLDataTypes.FLOAT;

		case ShaderDataType.Int:
		case ShaderDataType.Int2:
		case ShaderDataType.Int3:
		case ShaderDataType.Int4:
			return GLDataTypes.INT;

		case ShaderDataType.Bool:
			return GLDataTypes.BOOL;

		default:
			throw new Error("Unknown shader data type");
	}
}
