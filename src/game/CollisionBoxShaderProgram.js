import { ShaderProgram } from "./ShaderProgram";

export class CollisionBoxShaderProgram extends ShaderProgram
{
    constructor(glContext)
    {
        super(glContext, "", "");

        this.rawVertexShader = `
        attribute vec4 vPosition;

        uniform mat4 MVP;

        void main() {
            gl_Position = MVP * vPosition;
        }
        `;

        this.rawFragShader = `
        precision mediump float;

        void main() {
            gl_FragColor = vec4(1, 0.6, 0.4, 0.3);
        }
        `; 

        this.CompileShader();
    }
}