import { ShaderProgram } from "./ShaderProgram";

export class SpriteShaderProgram extends ShaderProgram
{
    constructor(glContext)
    {
        super(glContext, "", "");

        this.rawVertexShader = `
        attribute vec4 vPosition;
        attribute vec2 vTexCoord;

        uniform mat4 MVP;

        varying vec2 fTexCoord;
        
        void main() {
        
            gl_Position = MVP * vPosition;

            fTexCoord = vTexCoord;
        }
        `;

        this.rawFragShader = `
        precision mediump float;

        varying vec2 fTexCoord;
        uniform sampler2D texture;
        
        void main() {
            gl_FragColor = texture2D(texture, fTexCoord);
        }
        `; 

        this.CompileShader();
    }
}