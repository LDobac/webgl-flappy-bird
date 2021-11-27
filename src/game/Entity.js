import { Matrix4, Vector3 } from "@math.gl/core";
import { GraphableObject } from "./GraphableObject";

export class Entity extends GraphableObject
{
    constructor() 
    {
        super();

        this.isTransformDirty = true;

        this.world = null;

        /**
         * @type WebGLRenderingContext
         */
        this.glContext = null;
        this.program = null;

        this.verticies = [];
        this.vertexBuffer = null;
        this.vertexAttrLocation = null;

        this.position = new Vector3();
        this.angle = 0.0;
        this.scale = new Vector3();

        this.transform = new Matrix4().identity();

        this.zOrder = 0;
        
        this.SetWorld = this.SetWorld.bind(this);
        this.InitMesh = this.InitMesh.bind(this);
        this.Translate = this.Translate.bind(this);
        this.TranslateX = this.TranslateX.bind(this);
        this.TranslateY = this.TranslateY.bind(this);
        this.Rotate = this.Rotate.bind(this);
        this.Scale = this.Scale.bind(this);
        this.ScaleX = this.ScaleX.bind(this);
        this.ScaleY = this.ScaleY.bind(this);
        this.SetZOrder = this.SetZOrder.bind(this);
        this.CalculateTransform = this.CalculateTransform.bind(this);
    }

    SetWorld(newWorld)
    {
        this.world = newWorld;
    }

    InitMesh(glContext)
    {
        // Initialize mesh and render data;
        this.glContext = glContext;

        this.vertexAttrLocation = this.glContext.getAttribLocation(this.program, "vPosition");

        this.vertexBuffer = this.glContext.createBuffer();
        this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, this.vertexBuffer);
        this.glContext.bufferData(this.glContext.ARRAY_BUFFER, new Float32Array(this.verticies), this.glContext.STATIC_DRAW);
    }

    Translate(newPosition)
    {
        if (newPosition.constructor == Vector3) throw new TypeError("newPosition is not Vector3!");

        this.position = newPosition;

        this.isTransformDirty = true;
    }

    TranslateX(newX)
    {
        this.position.x = newX;

        this.isTransformDirty = true;
    }

    TranslateY(newY)
    {
        this.position.y = newY;

        this.isTransformDirty = true;
    }

    Rotate(newAngle)
    {
        this.angle = newAngle;

        this.isTransformDirty = true;
    }

    Scale(newScale)
    {
        if (newScale.constructor == Vector3) throw new TypeError("newPosition is not Vector3!");

        this.scale = newScale;

        this.isTransformDirty = true;
    }

    ScaleX(newScaleX)
    {
        this.scale.x = newScaleX;   

        this.isTransformDirty = true;
    }

    ScaleY(newScaleY)
    {
        this.scale.y = newScaleY;

        this.isTransformDirty = true;
    }

    SetZOrder(newZOrder)
    {
        this.zOrder = newZOrder;

        this.isTransformDirty = true;
    }

    Start()
    {
        super.Start();
    }

    Update()
    {
        super.Update();
    }

    Render()
    {
        super.Render();

        if (this.program && this.glContext && this.world)
        {
            this.glContext.useProgram(this.program);

            this.glContext.enableVertexAttribArray(this.vertexAttrLocation);

            this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, this.vertexBuffer);

            const vertexSize = 2;

            this.glContext.vertexAttribPointer(this.vertexAttrLocation, vertexSize, this.glContext.FLOAT, false, 0, 0);

            this.glContext.drawArrays(this.glContext.TRIANGLES, 0, 3);
        }
    }

    CalculateTransform()
    {
        if (this.isTransformDirty)
        {
            let newTransform = new Matrix4().identity();

            newTransform = newTransform.rotateZ(angle);
            newTransform = newTransform.translate(this.position);
            newTransform = newTransform.scale(this.scale);

            this.transform = newTransform;
        }

        this.isTransformDirty = false;

        return this.transform;
    }
}