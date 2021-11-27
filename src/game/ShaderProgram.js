export class ShaderProgram
{
    constructor(glContext, vertexShaderStr, fragShaderStr)
    {
        /**
         * @type WebGLRenderingContext
         */
        this.glContext = glContext;

        this.rawVertexShader = vertexShaderStr;
        this.rawFragShader = fragShaderStr;

        this.vertexShader = null;
        this.fragShader = null;
        this.program = null;

        this.CompileShader = this.CompileShader.bind(this);
        this.CreateShader = this.CreateShader.bind(this);
        this.CreateProgram = this.CreateProgram.bind(this);
    }

    CompileShader()
    {
        this.vertexShader = this.CreateShader(this.glContext.VERTEX_SHADER, this.rawVertexShader);
        this.fragShader = this.CreateShader(this.glContext.FRAGMENT_SHADER, this.rawFragShader);

        this.program = this.CreateProgram();
    }

    CreateShader(type, source)
    {
        let shader = this.glContext.createShader(type);
        this.glContext.shaderSource(shader, source);
        this.glContext.compileShader(shader);
        
        let success = this.glContext.getShaderParameter(shader, this.glContext.COMPILE_STATUS);
        if (success) 
        {
            return shader;
        }
        
        console.log(this.glContext.getShaderInfoLog(shader));
        this.glContext.deleteShader(shader);
    }

    CreateProgram()
    {
        let program = this.glContext.createProgram();

        this.glContext.attachShader(program, this.vertexShader);
        this.glContext.attachShader(program, this.fragShader);
        this.glContext.linkProgram(program);

        let success = this.glContext.getProgramParameter(program, this.glContext.LINK_STATUS);
        if (success) 
        {
            return program;
        }
        
        console.log(this.glContext.getProgramInfoLog(program));
        this.glContext.deleteProgram(program);
    }
}