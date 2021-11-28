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
            this.viewMatrix = (new Matrix4().rotateZ(this.angle)).invert().multiplyRight(new Matrix4().translate(this.position).invert());
        }

        this.isTransformDirty = false;

        return this.viewMatrix;
    }
}