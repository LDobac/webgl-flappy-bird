import { ShaderProgram } from "./ShaderProgram";

export class SpriteShaderProgram extends ShaderProgram
{
    constructor(glContext)
    {
        super(glContext, "", "");

        this.rawVertexShader = `
        // attribute는 buffer에서 데이터를 받음
        attribute vec4 vPosition;
        
        // 모든 셰이더는 main 함수를 가짐
        void main() {
        
            // gl_Position은 정점 셰이더가 설정을 담당하는 특수 변수
            gl_Position = vPosition;
        }
        `;

        this.rawFragShader = `
        // 프래그먼트 셰이더는 기본 정밀도를 가지고 있지 않으므로 하나를 선택해야 합니다.
        // mediump은 좋은 기본값으로 "중간 정밀도"를 의미합니다.
        precision mediump float;
        
        void main() {
            // gl_FragColor는 프래그먼트 셰이더가 설정을 담당하는 특수 변수
            gl_FragColor = vec4(1, 0, 0.5, 1); // 붉은 보라색 반환
        }
        `; 

        this.CompileShader();
    }
}