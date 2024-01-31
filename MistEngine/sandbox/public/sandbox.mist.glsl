@MistShaderVersion(1.1)

//! TexturedSquare
@MistShaderBegin(texturedSquare)
@MistShaderType(vertex)

layout ( location = 0 ) in  vec3 a_Position;
layout(location = 1) in vec2 a_TexCoord; 

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
