import { Vector3 } from "@math.gl/core";
import { DebugCollisionRenderer } from "./DebugCollisionRenderer";

export class AABB
{
    constructor(entity, x, y, width, height, scale = null)
    {
        this.entity = entity;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        /**
         * @type {Vector3}
         */
        this.scale = scale || new Vector3(1, 1, 1);

        this.IsCollide = this.IsCollide.bind(this);
        this.GetScaledPoints = this.GetScaledPoints.bind(this);

        this.debugEntity = new DebugCollisionRenderer(this);
    }

    /**
     * 
     * @param {AABB} other 
     */
    IsCollide(other)
    {
        const box = this.GetScaledPoints();
        const otherBox = other.GetScaledPoints();

        const scaledX1 = box.scaledX1;
        const scaledX2 = box.scaledX2;
        const scaledY1 = box.scaledY1;
        const scaledY2 = box.scaledY2;

        const otherScaledX1 = otherBox.scaledX1;
        const otherScaledX2 = otherBox.scaledX2;
        const otherScaledY1 = otherBox.scaledY1;
        const otherScaledY2 = otherBox.scaledY2;

        if (
            scaledX1 <= otherScaledX2 && scaledX2 >= otherScaledX1 &&
            scaledY1 <= otherScaledY2 && scaledY2 >= otherScaledY1
        )
        {
            return true;
        }

        return false;
    }

    GetScaledPoints()
    {
        const scaledX1 = this.entity.position[0] + (this.x * this.scale[0]);
        const scaledX2 = scaledX1 + (this.width * this.scale[0]);

        const scaledY1 = this.entity.position[1] + (this.y * this.scale[1]);
        const scaledY2 = scaledY1 + (this.height * this.scale[1]);

        return {scaledX1, scaledX2, scaledY1, scaledY2};
    }
}