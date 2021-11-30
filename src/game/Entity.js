import { Matrix4, Vector3 } from "@math.gl/core";
import { GraphableObject } from "./GraphableObject";

export class Entity extends GraphableObject
{
    constructor() 
    {
        super();

        this.world = null;
        this.parent = null;

        /**
         * @type WebGLRenderingContext
         */
        this.glContext = null;
        this.program = null;

        this.verticies = [];
        this.vertexBuffer = null;
        this.vertexAttrLocation = null;

        this.indices = [];
        this.indexBuffer = null;

        this.mvpUniformLocation = null;

        this.position = new Vector3();
        this.angle = 0.0;
        this.scale = new Vector3(1, 1, 1);

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
        this._SetRenderAttributes = this._SetRenderAttributes.bind(this);
        this._Draw = this._Draw.bind(this);
        this.Release = this.Release.bind(this);
    }

    SetWorld(newWorld)
    {
        this.world = newWorld;
    }

    SetParent(newParent)
    {
        this.parent = newParent;
    }

    InitMesh(glContext)
    {
        // Initialize mesh and render data;
        this.glContext = glContext;

        // Set vertex buffer
        this.vertexAttrLocation = this.glContext.getAttribLocation(this.program, "vPosition");

        this.vertexBuffer = this.glContext.createBuffer();
        this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, this.vertexBuffer);
        this.glContext.bufferData(this.glContext.ARRAY_BUFFER, new Float32Array(this.verticies), this.glContext.STATIC_DRAW);

        // Set index buffer
        this.indexBuffer = this.glContext.createBuffer();
        this.glContext.bindBuffer(this.glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.glContext.bufferData(this.glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.glContext.STATIC_DRAW);

        // Set MVP uniform location
        this.mvpUniformLocation = this.glContext.getUniformLocation(this.program, "MVP");
    }

    Translate(newPosition)
    {
        if (newPosition.constructor == Vector3) throw new TypeError("newPosition is not Vector3!");

        this.position = newPosition;
    }

    TranslateX(newX)
    {
        this.position.x = newX;
    }

    TranslateY(newY)
    {
        this.position.y = newY;
    }

    Rotate(newAngle)
    {
        this.angle = newAngle;
    }

    Scale(newScale)
    {
        if (newScale.constructor == Vector3) throw new TypeError("newPosition is not Vector3!");

        this.scale = newScale;
    }

    ScaleX(newScaleX)
    {
        this.scale.x = newScaleX;   
    }

    ScaleY(newScaleY)
    {
        this.scale.y = newScaleY;
    }

    SetZOrder(newZOrder)
    {
        this.zOrder = newZOrder;
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

        this._SetRenderAttributes();

        this._Draw();
    }

    Release()
    {
        if (this.vertexBuffer)
        {
            this.glContext.deleteBuffer(this.vertexBuffer);
        }

        if (this.indexBuffer)
        {
            this.glContext.deleteBuffer(this.indexBuffer);
        }

        if (this.program)
        {
            this.glContext.deleteProgram(this.program);
        }
    }

    _SetRenderAttributes()
    {
        if (this.program && this.glContext && this.world)
        {
            this.glContext.useProgram(this.program);

            this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, this.vertexBuffer);
            
            this.glContext.enableVertexAttribArray(this.vertexAttrLocation);

            const vertexSize = 3;

            this.glContext.vertexAttribPointer(this.vertexAttrLocation, vertexSize, this.glContext.FLOAT, false, 0, 0);

            const projMat = this.world.projectionMatrix.clone();
            const viewMat = this.world.camera.CalculateTransform().clone();
            const modelMat = this.CalculateTransform().clone();

            const MVP = projMat.multiplyRight(viewMat.multiplyRight(modelMat));

            this.glContext.uniformMatrix4fv(this.mvpUniformLocation, false, MVP);
        }
    }

    _Draw()
    {
        this.glContext.bindBuffer(this.glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        this.glContext.drawElements(this.glContext.TRIANGLES, this.indices.length, this.glContext.UNSIGNED_SHORT, 0);
    }

    CalculateTransform()
    {
        let newTransform = new Matrix4().identity();

        newTransform = newTransform.translate(this.position);
        newTransform = newTransform.rotateZ(this.angle);
        newTransform = newTransform.scale(this.scale);

        if (this.parent)
        {
            const parentTransform = this.parent.CalculateTransform().clone();

            this.transform = parentTransform.multiplyRight(newTransform);
        }
        else
        {
            this.transform = newTransform;
        }

        return this.transform;
    }
}