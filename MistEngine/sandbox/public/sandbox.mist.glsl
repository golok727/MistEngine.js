@MistShaderVersion(1.1)

//! TexturedSquare
@MistShaderBegin(texturedSquare)

@MistShaderType(vertex)

@MistAttribute(0, Vec3, a_Position)
@MistAttribute(1, Vec2, a_TexCoord)

@MistOut(Vec2, TexCoord)

void main()
{		
  TexCoord = a_TexCoord;
  TexCoord.y = 1.0 - TexCoord.y; // Flip the y coordinate
  gl_Position = u_ViewProjection * u_Transform * vec4(a_Position, 1.0);
}


@MistShaderType(fragment)

@MistUniform (Vec3, u_Color)
@MistUniform  (Texture, u_Texture)

@MistIn(Vec2, TexCoord)
@MistOut(Vec4, fragColor)

void main()
{
  fragColor = texture(u_Texture, TexCoord);
}

@MistShaderEnd(texturedSquare)
// Texture Square End 

//! Triangle
@MistShaderBegin(triangleShader)

@MistShaderType(vertex)

@MistAttribute(0, Vec3, a_Position)
@MistAttribute(1, Vec4, a_Color)
@MistOut(Vec4, color)

void main()
{		
  color = a_Color; 
  gl_Position = u_ViewProjection * u_Transform * vec4(a_Position, 1.0);
}


@MistShaderType(fragment)

@MistIn(Vec4, color)
@MistOut(Vec4, fragColor)

void main()
{
  fragColor = color;
}

@MistShaderEnd(triangleShader)
// Triangle End

//! Blue square
@MistShaderBegin(blueSquare)
@MistShaderType(vertex)

@MistAttribute(0, Vec3, a_Position)


void main()
{		
  gl_Position = u_ViewProjection * u_Transform * vec4(a_Position, 1.0);
}

@MistShaderType(fragment)
@MistOut(Vec4, fragColor)

void main()
{
  fragColor = vec4(0.0, 0.0, 1.0, 1.0);
}

@MistShaderEnd(blueSquare)
