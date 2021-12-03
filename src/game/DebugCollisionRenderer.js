import { CollisionBoxShaderProgram } from "./CollisionBoxShaderProgram";
import { Entity } from "./Entity";

export class DebugCollisionRenderer extends Entity
{
    constructor(collisionBox)
    {
        super();

        this.verticies = [
			0.5, 0.5, 0, // right top
			0.5, -0.5, 0, // right bottom
			-0.5, 0.5, 0, // left top
			-0.5, -0.5, 0 // left bottom
        ];
		this.indices = [2, 1, 0, 2, 3, 1];

        this.collisionBox = collisionBox;
    }

    InitMesh(glContext)
    {
        this.program = new CollisionBoxShaderProgram(glContext).program;

        super.InitMesh(glContext);

        this.zOrder = 1000;
    }

    Render()
    {
        const {scaledX1, scaledX2, scaledY1, scaledY2} = this.collisionBox.GetScaledPoints();
        this.verticies = [
			scaledX2, scaledY2, 0, // right top
			scaledX2, scaledY1, 0, // right bottom
			scaledX1, scaledY2, 0, // left top
			scaledX1, scaledY1, 0 // left bottom
        ];

        this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, this.vertexBuffer);
        this.glContext.bufferData(this.glContext.ARRAY_BUFFER, new Float32Array(this.verticies), this.glContext.STATIC_DRAW);

        this._SetRenderAttributes();

        this._Draw();
    }
}