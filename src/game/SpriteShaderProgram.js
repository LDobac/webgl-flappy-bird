import { ShaderProgram } from "./ShaderProgram";

export class SpriteShaderProgram extends ShaderProgram
{
    constructor(glContext)
    {
        super(glContext, "", "");

        this.rawVertexShader = `
        attribute vec4 vPosition;
        attribute vec4 vTexCoord;

        uniform mat4 MVP;

        varying vec4 fTexCoord;
        
        void main() {
        
            gl_Position = MVP * vPosition;
        }
        `;

        this.rawFragShader = `
        precision mediump float;

        varying vec4 fTexCoord;
        
        void main() {
            gl_FragColor = vec4(0, 1, 0.5, 1);
        }
        `; 

        this.CompileShader();
    }
}