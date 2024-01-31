# MistShader

The Mist Shader file is a shader file processed by the `Mist.ShaderLibrary.Preload` function, which parses and converts the Mist shader into a GLSL shader file.

Currently in the development stage, this serves as a prototype. It is expected to evolve into a fully independent language for shaders in the Mist framework.

The Mist Shader provides automatic common uniform settings such as:
- `u_ViewProjection` - Projection Matrix
- `u_Transform` - Model Projection

...with more features to be added in the future.

## Syntax

Mist Shader utilizes `@decorators` to allow the setting of various values.

### Shader Version
```cpp
@MistShaderVersion(1)
Sets the Mist shader version.
```

### Shader Begin
```cpp
@MistShaderBegin(@param shader_name)
```

Begins a Mist shader with the given name. This is the identifier through which you can access your shader from the application. For example, if you preload a shader with `Mist.ShaderLibrary.Preload('your-app', 'myShader.mist.glsl')` and name your shader basicShader with `@MistShaderBegin(basicShader)`, you would access the shader file like this in TypeScript:
```ts
Copy code
Mist.ShaderLibrary.Load('myShader.mist.glsl/#basicShader');
// preloaded_filepath/#shaderName
```

### Shader Type
```cpp
@MistShaderType(vertex)
Specifies the type of Mist shader - whether it is a vertex or fragment shader.

Shader End
cpp
Copy code
@MistShaderEnd(@param shader_name)
Ends the Mist shader with the given name.
### Three Shader Programs
```glsl
@MistShaderVersion(1.1)

//! TexturedSquare
@MistShaderBegin(texturedSquare)
@MistShaderType(vertex)

layout ( location = 0 ) in  vec3 a_Position;
layout( location = 1 ) in vec2 a_TexCoord; 

out vec2 TexCoord;
void main()
{		
  TexCoord = a_TexCoord;
  TexCoord.y = 1.0 - TexCoord.y; // Flip the y coordinate
  gl_Position = u_ViewProjection * u_Transform * vec4(a_Position, 1.0);
}

@MistShaderType(fragment)
in vec2 TexCoord; 
uniform vec3 u_Color;
uniform sampler2D u_Texture;
out vec4 fragColor; 
void main()
{
  fragColor = texture(u_Texture, TexCoord);
}

@MistShaderEnd(texturedSquare)
// Texture Square End 

//! Triangle
@MistShaderBegin(triangleShader)

@MistShaderType(vertex)
layout ( location = 0 ) in  vec3 a_Position;
layout(location = 1) in vec4 a_Color; 
out vec4 color;

void main()
{		
  color = a_Color; 
  gl_Position = u_ViewProjection * u_Transform * vec4(a_Position, 1.0);
}


@MistShaderType(fragment)
in vec4 color; 
out vec4 fragColor; 
void main()
{
  fragColor = color;
}

@MistShaderEnd(triangleShader)
// Triangle End

//! Blue square
@MistShaderBegin(blueSquare)
@MistShaderType(vertex)

layout ( location = 0 ) in  vec3 a_Position;

void main()
{		
  gl_Position = u_ViewProjection * u_Transform * vec4(a_Position, 1.0);
}

@MistShaderType(fragment)

out vec4 fragColor; 
void main()
{
  fragColor = vec4(0.0, 0.0, 1.0, 1.0);
}

@MistShaderEnd(blueSquare)

```

