import { Matrix4, Vector3 } from "@math.gl/core";
import { Entity } from "./Entity";

export class Camera extends Entity
{
    constructor()
    {
        super();

        this.position.z = 2;
        this.upVector = new Vector3(0, 1, 0);

        this.viewMatrix = new Matrix4();

        this.CalculateTransform = this.CalculateTransform.bind(this);
    }

    CalculateTransform()
    {
        if (this.isTransformDirty)
        {
            // let lookAt = this.position.clone();
            // lookAt.z = -1;
            // this.viewMatrix = new Matrix4().lookAt(this.position, lookAt, this.upVector);

            this.viewMatrix = (new Matrix4().rotateZ(this.angle)).invert().multiplyRight(new Matrix4().translate(this.position).invert());
        }

        this.isTransformDirty = false;

        return this.viewMatrix;
    }
}