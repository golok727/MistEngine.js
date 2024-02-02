/// <reference types="@webgpu/types" />

declare type ApplicationConstructorProps = {
    name: string;
    canvas: HTMLCanvasElement;
    rendererAPI: MistRendererAPI;
};

declare class BufferElement {
    name: string;
    type: ShaderDataType;
    location: number;
    offset: number;
    componentCount: number;
    size: number;
    normalized: boolean;
    constructor({ name, type, location, normalized }: BufferLayoutConstructor);
}

declare class BufferLayout {
    private bufferElements;
    private _stride;
    constructor(layout: BufferLayoutConstructor[]);
    private calculateOffsetsAndStrides;
    get stride(): number;
    get elements(): BufferElement[];
    private constructBufferElements;
    [Symbol.iterator](): Iterator<BufferElement>;
}

declare type BufferLayoutConstructor = {
    type: ShaderDataType;
    name: string;
    location: number;
    normalized?: boolean;
};

declare interface Camera {
    setPosition(pos: Vector3): void;
    setRotation(a: number): void;
    get position(): Vector3;
    get viewProjection(): Matrix4;
    get projection(): Matrix4;
    get view(): Matrix4;
}

declare interface Context {
    readonly App: MistApp;
    readonly Renderer: Renderer;
    readonly RenderAPI: RenderingAPI;
    readonly Input: MistInput;
}

declare const CreateMistApp: (setup: () => Promise<MistApp> | MistApp) => Promise<void>;

declare abstract class Layer {
    private _name;
    onKeyDown?(ev: MistKeyDownEvent): boolean;
    onKeyUp?(ev: MistKeyUpEvent): boolean;
    onMouseMove?(ev: MistMouseMoveEvent): boolean;
    onMouseDown?(ev: MistMouseDownEvent): boolean;
    onMouseUp?(ev: MistMouseUpEvent): boolean;
    onMouseWheel?(ev: MistMouseWheelEvent): boolean;
    constructor(name: string);
    get name(): string;
    protected getContext(): Context;
    onAttach(): void;
    onUpdate(_deltaTime: number): void;
    onDetach(): void;
}

declare class LayerStack {
    private layerStack;
    constructor();
    pushLayer(layer: Layer): void;
    pushOverlay(overlay: Layer): void;
    popLayer(layer: Layer): void;
    popOverlay(overlay: Layer): void;
    [Symbol.iterator](): Iterator<Layer>;
    reversed(): IterableIterator<Layer>;
}

export declare class Matrix4 {
    private elements;
    constructor(...values: Matrix4Elements | []);
    static Ortho(...args: Parameters<Matrix4["makeOrthographic"]>): Matrix4;
    /**
     * Returns a Translation Matrix
     */
    static Translate(v: Vector3): Matrix4;
    /**
     * Returns a Scale Matrix
     */
    static Scale(s: Vector3): Matrix4;
    /**
     * Returns a translation matrix
     */
    static Rotate(angle: number, axis: Vector3): Matrix4;
    static PrettyPrint(m: Matrix4): void;
    set(...m: Matrix4Elements): this;
    identity(): this;
    multiply(m: Matrix4): this;
    multiplyMat(...matrices: Matrix4[]): this;
    private multiplyAndApply;
    multiplyScalar(s: number): this;
    setPosition(...v: [Vector3] | V3): this;
    toScaleMat(...v: [Vector3] | V3): this;
    scale(v: Vector3): this;
    setFromArray(elms: Matrix4Elements): this;
    copyFrom(m: Matrix4): this;
    clone(): Matrix4;
    copyPosition(m: Matrix4): this;
    makeOrthographic(left: number, right: number, top: number, bottom: number, near: number, far: number): this;
    invert(): this;
    toArray(): number[];
}

declare type Matrix4Elements = [m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number];

declare namespace Mist {
    export {
        MistInput,
        MistKey as Key,
        MistApp as Application,
        CreateMistApp as CreateApp,
        Layer,
        MistWebGL2Shader,
        MistApp,
        MistRendererAPI as RendererAPI,
        MistVertexBufferFactory as VertexBuffer,
        MistIndexBufferFactory as IndexBuffer,
        BufferLayout,
        ShaderDataType,
        VertexArrayFactory as VertexArray,
        ShaderFactory as Shader,
        TextureFactory as Texture,
        MistShaderLibrary as ShaderLibrary,
        MistTextureLibrary as TextureLibrary,
        MistWebGL2RenderingAPI,
        MistWebGL2Renderer,
        MistIndexBuffer,
        MistVertexBuffer,
        MistVertexArray,
        MistShader,
        MistTexture,
        Camera,
        OrthographicCamera
    }
}
export { Mist }

declare interface MistAPIUsable {
    use(): void;
    use(slot: number): void;
    detach(): void;
    delete(): void;
}

declare class MistApp extends MistAppBase {
    constructor(props: ApplicationConstructorProps);
    protected onAttach(): void;
    protected onTick(delta: number): void;
    protected onDetach(): void;
}

declare abstract class MistAppBase extends MistEventDispatcher {
    protected _allowPerformanceMetrics: boolean;
    protected appName: string;
    protected input: MistInput;
    protected layerStack: LayerStack;
    protected renderer: Renderer;
    protected isRunning: boolean;
    protected lastTime: number;
    protected currentFrameId?: number;
    constructor({ name, canvas, rendererAPI }: ApplicationConstructorProps);
    get name(): string;
    get performance(): {
        averageFps: number;
    };
    getRenderer(): Renderer<unknown>;
    getRenderingAPI(): RenderingAPI<unknown>;
    protected setRunning(enable: boolean): void;
    Run(): void;
    Pause(): void;
    ShutDown(): void;
    Restart(): void;
    protected onAttach(): void;
    protected onTick(_delta: number): void;
    protected onDetach(): void;
    private loop;
    private updatePerformanceMatrices;
    private _run;
    private _stop;
    private _restartApp;
    private initRenderer;
    protected pushLayer<T extends new (...args: any[]) => Layer>(layerConstructor: T, ...args: ConstructorParameters<T>): void;
    protected pushOverlay<T extends new (...args: any[]) => Layer>(overlayConstructor: T, ...args: ConstructorParameters<T>): void;
    private provideContextToLayer;
    private initPerformanceMatrices;
    private addInputEventListeners;
    private onInputKeyDown;
    private onInputKeyUp;
    private onInputMouseDown;
    private onInputMouseUp;
    private onInputMouseMove;
    private onInputMouseWheel;
}

declare interface MistBufferBase extends MistAPIUsable {
}

declare class MistEventDispatcher implements MistEventDispatcherBase {
    private __listeners__;
    addEventListener<K extends keyof MistEventMap>(type: K, listener: MistEventListenerCallback<MistEventMap[K]>): void;
    hasEventListener<K extends keyof MistEventMap>(type: K, listener: MistEventListenerCallback<MistEventMap[K]>): boolean;
    removeEventListener<K extends keyof MistEventMap>(type: K, listener: MistEventListenerCallback<MistEventMap[K]>): void;
    dispatchEvent<E extends MistEvent>(event: E): void;
    destroyDispatcher(): void;
    protected makeEvent<K extends keyof MistEventMap>(type: K, event: Omit<MistEventMap[K], "type">): MistEventMap[K];
}

declare interface MistEventDispatcherBase {
    addEventListener(type: string, listener: MistEventListenerCallback): void;
    removeEventListener(type: string, listener: MistEventListenerCallback): void;
    hasEventListener(type: string, listener: MistEventListenerCallback): boolean;
}

declare interface MistIndexBuffer extends MistBufferBase {
    getCount(): number;
}

declare class MistIndexBufferFactory {
    /**
     * Creates a index buffer based on the given renderer API
     */
    static Create(data: Uint32Array, renderer?: Renderer): MistIndexBuffer;
}

/**
 global and local input system for mist
 */
declare class MistInput extends MistEventDispatcher {
    static globalDispatch: MistEventDispatcher;
    private static _isInitialized;
    private static GlobalInputState;
    private state;
    constructor(element: HTMLElement);
    destroy(): void;
    /** Returns if a key is pressed or not */
    isPressed(key: MistKey): boolean;
    isKeyDown(): boolean;
    arePressed(...keys: MistKey[]): boolean;
    anyPressed(...keys: MistKey[]): boolean;
    get mouseX(): number;
    get mouseY(): number;
    get isMouseDown(): boolean;
    get wheel(): {
        isActive: boolean;
        deltaX: number;
        deltaY: number;
        dirX: number;
        dirY: number;
    };
    get mouseBtn(): {
        left: boolean;
        right: boolean;
        middle: boolean;
        b4: boolean;
        b5: boolean;
    };
    private addEventListeners;
    private onWheelHandleConstructor;
    private onMouseDown;
    private onMouseMove;
    private onMouseUp;
    private reset;
    /**
     * Initializes the global input
     * Does nothing if already initialized
     */
    static Init(): void;
    static isInitialized(): typeof MistInput.isInitialized;
    private static Reset;
    static Destroy(): void;
    static isKeyDown(): boolean;
    static isPressed(key: MistKey): boolean;
    static arePressed(...keys: MistKey[]): boolean;
    static anyPressed(...keys: MistKey[]): boolean;
    private static addGlobalEventListeners;
    private static onGlobalKeyDown;
    private static onGlobalKeyUp;
}

declare enum MistKey {
    Backspace = "Backspace",
    Tab = "Tab",
    Enter = "Enter",
    Shift = "Shift",
    Control = "Control",
    Meta = "Meta",
    Alt = "Alt",
    CapsLock = "CapsLock",
    Escape = "Escape",
    Space = " ",
    PageUp = "PageUp",
    PageDown = "PageDown",
    End = "End",
    Home = "Home",
    ArrowLeft = "ArrowLeft",
    ArrowUp = "ArrowUp",
    ArrowRight = "ArrowRight",
    ArrowDown = "ArrowDown",
    Insert = "Insert",
    Delete = "Delete",
    A = "A",
    B = "B",
    C = "C",
    D = "D",
    E = "E",
    F = "F",
    G = "G",
    H = "H",
    I = "I",
    J = "J",
    K = "K",
    L = "L",
    M = "M",
    N = "N",
    O = "O",
    P = "P",
    Q = "Q",
    R = "R",
    S = "S",
    T = "T",
    U = "U",
    V = "V",
    W = "W",
    X = "X",
    Y = "Y",
    Z = "Z",
    a = "a",
    b = "b",
    c = "c",
    d = "d",
    e = "e",
    f = "f",
    g = "g",
    h = "h",
    i = "i",
    j = "j",
    k = "k",
    l = "l",
    m = "m",
    n = "n",
    o = "o",
    p = "p",
    q = "q",
    r = "r",
    s = "s",
    t = "t",
    u = "u",
    v = "v",
    w = "w",
    x = "x",
    y = "y",
    z = "z",
    Num0 = "0",
    Num1 = "1",
    Num2 = "2",
    Num3 = "3",
    Num4 = "4",
    Num5 = "5",
    Num6 = "6",
    Num7 = "7",
    Num8 = "8",
    Num9 = "9"
}

declare enum MistRendererAPI {
    WebGL2 = "WebGL2",
    WebGPU = "WebGPU",
    None = "None"
}

declare interface MistShader extends MistAPIUsable {
    is<T extends MistShader>(): this is T;
}

declare class MistShaderLibrary {
    private static loadedShaders;
    /**
     * @param url  Preloaded url of the shader file preloaded_filepath#shaderName\
     * For example, if you used `Mist.ShaderLibrary.Preload('your-app', 'myShader.mist.glsl')`
     to load a shader and you named your shader `basicShader` with `@MistShaderBegin(basicShader)`  then you would access the shader file like this

     @example

     ```ts
     Mist.ShaderLibrary.Load('myShader.mist.glsl/#basicShader');
     // preloaded_filepath/#shaderName
     ```

     */
    static Load(url: string): MistShader;
    static Add(name: string, shader: MistShader): void;
    static Preload(app: MistApp, url: string): Promise<void>;
}

declare interface MistTexture extends MistAPIUsable {
}

declare class MistTextureLibrary {
    private static preloadedImages;
    private static mistTextures;
    /**
     * This API is fairly new which will be changed later
     * @param url Url of the image to load
     */
    static AddTextureFromElement(name: string, image: HTMLImageElement): void;
    static PreloadImage(src: string): Promise<void>;
    /**
     *
     * @param tImageUrl  the name or url in which the image is loaded as
     * @description Creates the api specific texture from the given image url for the app
     */
    static Create(app: MistApp, tImageUrl: string): Promise<MistTexture>;
    /**
     * Returns the `Mist.Texture` loaded
     */
    static Get(name: string): MistTexture;
    static GetImageForTexture(preloadedImageUrl: string): HTMLImageElement | undefined;
}

declare interface MistVertexArray extends MistAPIUsable {
    addVertexBuffer(vertexBuffer: MistVertexBuffer): void;
    setIndexBuffer(indexBuffer: MistIndexBuffer): void;
    getVertexBuffers(): MistVertexBuffer[];
    getIndexBuffer(): MistIndexBuffer;
}

declare interface MistVertexBuffer extends MistBufferBase {
    setLayout(layout: BufferLayout): void;
    getLayout(): BufferLayout;
}

declare class MistVertexBufferFactory {
    /**
     * Creates a vertex buffer based on the given renderer API
     */
    static Create(data: Float32Array, renderer?: Renderer): MistVertexBuffer;
}

declare class MistWebGL2Renderer extends MistEventDispatcher implements Renderer<WebGL2RenderingContext> {
    private canvas;
    private readonly API;
    private renderAPI;
    private currentViewProjection?;
    constructor(canvas: HTMLCanvasElement);
    get width(): number;
    get aspect(): number;
    get height(): number;
    get canvasWidth(): number;
    get canvasHeight(): number;
    Is<T extends Renderer<unknown>>(): this is T;
    BeginScene(camera: Camera): void;
    Submit(vertexArray: MistVertexArray, shader: MistShader, transform: Matrix4): void;
    EndScene(): void;
    Resize(): void;
    getNativeContext(): WebGL2RenderingContext;
    GetRenderAPI(): MistWebGL2RenderingAPI;
    GetApiType(): MistRendererAPI;
}

declare class MistWebGL2RenderingAPI implements RenderingAPI<WebGL2RenderingContext> {
    private canvas;
    context: WebGL2RenderingContext;
    constructor(canvas: HTMLCanvasElement);
    get inner(): WebGL2RenderingContext;
    SetClearColor(r: number, g: number, b: number, a: number): void;
    Clear(): void;
    DrawIndexed(vertexArray: MistVertexArray): void;
    SetViewport(x: number, y: number, width: number, height: number): void;
}

declare class MistWebGL2Shader implements MistShader {
    _gl: WebGL2RenderingContext;
    private program;
    private uniformCache;
    constructor(renderer: Renderer, vertexShaderSource: string, fragmentShaderSource: string);
    is<T extends MistShader>(): this is T;
    use(): void;
    detach(): void;
    delete(): void;
    setUniform1i(name: string, v: number): void;
    setUniform3f(name: string, x: number, y: number, z: number): void;
    setUniformMat4(name: string, m: Matrix4): void;
    private getUniformLocation;
    private createProgram;
    private createShader;
    private getGLShaderType;
}

export declare class MthX {
    static PI: number;
    static TAU: number;
    static HALF_PI: number;
    static DEG_TO_RAD: number;
    static RAD_TO_DEG: number;
    static degToRad(degrees: number): number;
    static radToDeg(radians: number): number;
    static lerp(start: number, stop: number, t: number): number;
    static map(value: number, inMin: number, inMax: number, outMin: number, outMax: number, clamp?: boolean): number;
    static clamp(value: number, min: number, max: number): number;
    static isBetween(value: number, l: number, r: number): boolean;
    static min: (...values: number[]) => number;
    static max: (...values: number[]) => number;
    static floor: (x: number) => number;
    static random: () => number;
    static ceil: (x: number) => number;
    static round: (x: number) => number;
    static cos: (x: number) => number;
    static sin: (x: number) => number;
    static tan: (x: number) => number;
    static atan: (x: number) => number;
    static atan2: (y: number, x: number) => number;
    static sqrt: (x: number) => number;
    static pow: (x: number, y: number) => number;
    static log: (x: number) => number;
    static sign: (x: number) => number;
}

declare class OrthographicCamera extends MistEventDispatcher implements Camera {
    private projectionMatrix;
    private viewMatrix;
    private viewProjectionMatrix;
    private _position;
    private _rotation;
    constructor(left: number, right: number, top: number, bottom: number, near?: number, far?: number);
    get position(): Vector3;
    get viewProjection(): Matrix4;
    get view(): Matrix4;
    get projection(): Matrix4;
    setPosition(v: Vector3): void;
    setRotation(a: number): void;
    updateProjection(left: number, right: number, top: number, bottom: number, near?: number, far?: number): void;
    private recalculateViewProjection;
}

declare interface Renderer<API = unknown> extends MistEventDispatcher {
    GetRenderAPI(): RenderingAPI<API>;
    GetApiType(): MistRendererAPI;
    Resize(): void;
    get width(): number;
    get height(): number;
    get canvasWidth(): number;
    get canvasHeight(): number;
    get aspect(): number;
    getNativeContext(): API;
    BeginScene(camera: Camera): void;
    Submit(vertexArray: MistVertexArray, shader: MistShader, transform: Matrix4): void;
    EndScene(): void;
    Is<T extends Renderer>(): this is T;
}

declare interface RenderingAPI<Ctx = unknown> {
    get inner(): Ctx;
    SetClearColor(r: number, g: number, b: number, a: number): void;
    Clear(): void;
    SetViewport(x: number, y: number, width: number, height: number): void;
    DrawIndexed(vertexArray: MistVertexArray): void;
}

declare type ScalarArg = [v: number];

declare enum ShaderDataType {
    Float = 0,
    Bool = 1,
    Float2 = 2,
    Float3 = 3,
    Float4 = 4,
    Int = 5,
    Int2 = 6,
    Int3 = 7,
    Int4 = 8,
    Mat3 = 9,
    Mat4 = 10
}

declare class ShaderFactory {
    static Create(vertexShaderSrc: string, fragmentShaderSrc: string, renderer?: Renderer): MistShader;
    private static cleanShaderCode;
}

declare class TextureFactory {
    /**
     * @param renderer
     * @param name The preloaded file name
     */
    static Create(mistUrl: string, renderer?: Renderer): MistTexture;
}

declare type V2 = [x: number, y: number];

declare type V3 = [x: number, y: number, z: number];

declare type V4 = [x: number, y: number, z: number, w: number];

/**
 * @description A helper function to construct a new `Vector2`
 */
export declare const vec2: (...args: ConstructorParameters<typeof Vector2>) => Vector2;

declare type Vec2Args = ScalarArg | V2;

/**
 * @description A helper function to construct a new `Vector3`
 */
export declare const vec3: (...args: ConstructorParameters<typeof Vector3>) => Vector3;

declare type Vec3Args = ScalarArg | V3;

/**
 * @description A helper function to construct a new `Vector4`
 */
export declare const vec4: (...args: ConstructorParameters<typeof Vector4>) => Vector4;

declare type Vec4Args = ScalarArg | V4;

/**
 * Vector 2
 */
export declare class Vector2 extends VectorBase<V2> {
    x: number;
    y: number;
    constructor(...args: Vec2Args);
    static new(...args: Vec2Args): Vector2;
    setX(x: number): this;
    setY(y: number): this;
    set(...args: V2): void;
    clone(): Vector2;
    copyFrom(v: Vector2): this;
    add(v: Vector2 | V2): this;
    sub(v: Vector2 | V2): this;
    mul(v: number | Vector2 | V2): this;
    div(v: Vector2 | V2): this;
    floor(): this;
    mag(): number;
    magSq(): number;
    heading(): number;
    normalize(): Vector2;
    dot(v: Vector2 | V2): number;
    cross(v: Vector2 | V2): number;
    limit(max: number): Vector2;
    setMag(magnitude: number): Vector2;
    rotate(angle: number): Vector2;
    private parseArgs;
}

/**
 * Vector 3
 */
export declare class Vector3 extends VectorBase<V3> {
    x: number;
    y: number;
    z: number;
    constructor(...args: Vec3Args);
    static new(...args: Vec3Args): Vector3;
    setX(x: number): this;
    setY(y: number): this;
    setZ(z: number): this;
    set(...args: V3): void;
    clone(): Vector3;
    copyFrom(v: Vector3): this;
    add(v: Vector3 | V3): this;
    sub(v: Vector3 | V3): this;
    mul(v: number | Vector3 | V3): this;
    div(v: Vector3 | V3): this;
    floor(): this;
    mag(): number;
    magSq(): number;
    normalize(): Vector3;
    dot(v: Vector3 | V3): number;
    cross(v: Vector3 | V3): Vector3;
    limit(max: number): Vector3;
    setMag(magnitude: number): Vector3;
    rotate(angle: number, axis: Vector3 | V3): Vector3;
    private parseArgs;
}

/**
 * Vector 4
 */
export declare class Vector4 extends VectorBase<V4> {
    x: number;
    y: number;
    z: number;
    w: number;
    constructor(...args: Vec4Args);
    static new(...args: Vec4Args): Vector4;
    setX(x: number): this;
    setY(y: number): this;
    setZ(z: number): this;
    setW(w: number): this;
    set(...args: V4): void;
    clone(): Vector4;
    copyFrom(v: Vector4): this;
    add(v: Vector4): this;
    sub(v: Vector4): this;
    mul(v: number | Vector4 | V4): this;
    div(v: Vector4): this;
    dot(v: Vector4 | V4): number;
    floor(): this;
    mag(): number;
    magSq(): number;
    normalize(): Vector4;
    private parseArgs;
}

declare abstract class VectorBase<T extends V2 | V3 | V4> {
    protected static readonly Components: string[];
    get componentCount(): number;
    toFloat32(): Float32Array;
    toArray(): T;
    toString(): string;
    protected static ConstructVectorFromArguments: <T_1 extends V2 | V3 | V4>(vec: VectorBase<T_1>, args: Vec2Args | Vec3Args | Vec4Args) => void;
    [Symbol.iterator](): Generator<number, void, void>;
}

declare class VertexArrayFactory {
    static Create(renderer?: Renderer): MistVertexArray;
}

export { }
