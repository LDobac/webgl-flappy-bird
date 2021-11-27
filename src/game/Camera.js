import { Entity } from "./Entity";

export class Camera extends Entity
{
    CalculateTransform()
    {
        if (this.isTransformDirty)
        {
            // To do
        }

        this.isTransformDirty = false;

        return this.transform;
    }
}