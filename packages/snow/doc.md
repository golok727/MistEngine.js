# Snow

Snow is a custom shading language for mist engine

```shader

@Version(100)

@Shader basic {

  @vertex()
  {

    @attributes
    {
      @vec4 position [[ location = 0 ]]
    }

    @uniforms {
      @vec4 viewProjection
    }

    @position: viewProjection * position
  }

  @fragment()
  {

    @uniforms {
      @vec4 color
    }

    @position: color
  }
}

```
