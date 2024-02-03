/* 
  This api will be rewritten with custom MistShaders with more functionality
  This is just for testing purposed more robust one will be made later 

  We will take care of version later
*/

// const MIST_SHADER_DECORATOR_BASE_REGEX =
// 	/^@(?<decorator>Mist\w+)\((?<value>.+)?\)+(?:\s+)?$/;
const MIST_SHADER_DECORATOR_BASE_REGEX = createMistDecoratorRegex('')

function createMistDecoratorRegex(name: string, exact = false) {
  const wp = exact ? '' : '\\w+'
  return new RegExp(
    `^@(?<decorator>Mist${name}(?:${wp})?)\\s*?\\((?<value>.+)?\\)\\s*;*\\s*$`,
  )
}

const MIST_SHADER_DECORATOR_REGEX = createMistDecoratorRegex('Shader')

const MistShaderDecorators: Record<string, number> = {
  MistShaderVersion: 1,
  MistShaderBegin: 2,
  MistShaderEnd: 3,
  MistShaderType: 4,
} as const

type Parsed = {
  version: number | null
  shaders: Record<string, {fragment: string; vertex: string}>
}

export type ShaderSource = {
  name: string
  vertex: string
  fragment: string
}

enum MistShaderType {
  NONE = 'NONE',
  VERTEX = 'vertex',
  FRAGMENT = 'fragment',
  PIXEL = 'pixel',
}

export default class MistShaderParser {
  private parsed: Parsed
  private currentShaderType: MistShaderType = MistShaderType.NONE
  private currentShaderName: string | null = null
  private currentLineNumber = 0
  private isVersionSet = false

  constructor(private source: string) {
    this.parsed = {
      version: null,
      shaders: {},
    }
  }
  public reset() {
    this.currentShaderName = null
    this.currentLineNumber = 0
    this.isVersionSet = false
    this.parsed = {
      version: null,
      shaders: {},
    }
  }
  public parse(source?: string): Promise<ShaderSource[]> {
    if (source) this.source = source

    return new Promise((resolve, reject) => {
      try {
        this.parseMistShader()
        const sources: ShaderSource[] = Object.keys(this.parsed.shaders).map(
          (name) => {
            const shader = this.parsed.shaders[name]
            return {
              name,
              vertex: shader.vertex,
              fragment: shader.fragment,
            }
          },
        )
        resolve(sources)
      } catch (error) {
        reject(error)
      }
    })
  }

  private matchDecorator(line: string) {
    const shaderDecoratorMatch = line.match(MIST_SHADER_DECORATOR_REGEX)
    if (shaderDecoratorMatch) {
      this.setShaderDecoratorValue(shaderDecoratorMatch)
      return
    }

    throw new Error(`Invalid MistDecorator: ${line}`)
  }
  private appendToCurrentShader(s: string) {
    if (
      this.currentShaderName !== null &&
      this.currentShaderType !== MistShaderType.NONE &&
      this.parsed.shaders[this.currentShaderName] !== undefined
    ) {
      const currentShader = this.parsed.shaders[this.currentShaderName]

      const currentShaderType = this.currentShaderType as 'fragment' | 'vertex'
      currentShader[currentShaderType] += s + '\n'
    }
  }
  private parseMistShader() {
    const lines = this.source.split('\n')
    for (const line of lines) {
      this.currentLineNumber++

      if (line === '') continue

      if (MIST_SHADER_DECORATOR_BASE_REGEX.test(line)) {
        this.matchDecorator(line)
        continue
      }

      this.appendToCurrentShader(line)
    }
  }

  private setShaderDecoratorValue(match: RegExpMatchArray) {
    if (!match.groups) throw new Error('Error parsing shader...')
    const decorator = match.groups['decorator']
    const value = match.groups['value']

    switch (MistShaderDecorators[decorator]) {
      case MistShaderDecorators.MistShaderVersion: {
        if (this.isVersionSet)
          throw new Error('Mist.MistShaderParser: Version Already set')

        const version = parseInt(value)

        // Check if the version provided is a number or not
        if (isNaN(version))
          throw new Error(
            `Mist.MistShaderParser: Version is not valid\n version: ${value}`,
          )

        this.isVersionSet = true
        this.parsed.version = version

        break
      }

      case MistShaderDecorators.MistShaderBegin: {
        if (this.currentShaderName !== null)
          throw new Error(
            'Mist.MistShaderParser: Please End a shader before beginning a new shader',
          )

        if (this.parsed.shaders[value] !== undefined)
          throw new Error(
            `Mist.MistShaderParser: Shader with name '${value}' already exists`,
          )

        this.currentShaderName = value
        this.parsed.shaders[this.currentShaderName] = {
          vertex: this.getDefaultVertexShader(),
          fragment: this.getDefaultFragmentShader(),
        }
        break
      }

      case MistShaderDecorators.MistShaderType: {
        if (this.currentShaderName === null)
          throw new Error(
            'Please Begin a new Shader before setting the shader type',
          )

        switch (value) {
          case MistShaderType.VERTEX:
            this.currentShaderType = MistShaderType.VERTEX
            break
          case MistShaderType.FRAGMENT:
          case MistShaderType.PIXEL:
            this.currentShaderType = MistShaderType.FRAGMENT
            break
        }
        break
      }

      case MistShaderDecorators.MistShaderEnd: {
        if (value != this.currentShaderName)
          throw new Error(
            `Mist.MistShaderParse: Error ending shader. shader ${value} haven't begin`,
          )
        this.currentShaderType = MistShaderType.NONE
        this.currentShaderName = null
        break
      }

      default:
        throw new Error(`Unknown shader decorator '${decorator}' `)
    }
  }

  private getDefaultVertexShader() {
    return `#version 300 es
    uniform mat4 u_Transform;
    uniform mat4 u_ViewProjection;`
  }

  private getDefaultFragmentShader() {
    return `#version 300 es
    precision highp float; 
    `
  }
}
