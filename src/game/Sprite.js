import { AABB } from "./AABB";
import { Entity } from "./Entity";
import { SpriteShaderProgram } from "./SpriteShaderProgram"
import { Texture } from "./Texture";

export class Sprite extends Entity
{
    constructor(imgSrc)
    {
        super();

        this.verticies = [
			0.5, 0.5, 0, // right top
			0.5, -0.5, 0, // right bottom
			-0.5, 0.5, 0, // left top
			-0.5, -0.5, 0 // left bottom
        ];
		this.indices = [2, 1, 0, 2, 3, 1];

        this.texCoord = [
            1, 1,
            1, 0,
            0, 1,
            0, 0
        ];
        this.texCoordBuffer = null;
        this.texCoordAttrLocation = null;

        this.textureUniformLocation = null;
        this.texture = new Texture(imgSrc);

        this.animTimer = 0;
        this.curAnimIndex = 0;
        this.animDelay = 0;
        this.animationFrame = [];

        this.collisionBox = new AABB(this, -0.5, -0.5, 1, 1, this.scale);
        this.debugCollisionBox = false;
    }

    InitMesh(glContext)
    {
        this.program = new SpriteShaderProgram(glContext).program;

        super.InitMesh(glContext);

        this.texCoordAttrLocation = this.glContext.getAttribLocation(this.program, "vTexCoord");

        this.texCoordBuffer = this.glContext.createBuffer();
        this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, this.texCoordBuffer);
        this.glContext.bufferData(this.glContext.ARRAY_BUFFER, new Float32Array(this.texCoord), this.glContext.STATIC_DRAW);

        this.texture.imageLoadHanlder = () => {
            const imageWidth = this.texture.width;
            const imageHeight = this.texture.height;
            const imageRatio = imageWidth / imageHeight;

            // Move vertex to correct position
            let w = ((imageWidth / 2) / imageWidth) * imageRatio;
            let h = (imageHeight / 2) / imageHeight;

            this.verticies = [
                w, h, 0, // right top
                w, -h, 0, // right bottom
                -w, h, 0, // left top
                -w, -h, 0 // left bottom
            ];

            this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, this.vertexBuffer);
            this.glContext.bufferData(this.glContext.ARRAY_BUFFER, new Float32Array(this.verticies), this.glContext.STATIC_DRAW);

            // Resetting collision box
            this.collisionBox.x = -w;
            this.collisionBox.y = -h;
            this.collisionBox.width = 2 * w;
            this.collisionBox.height = 2 * h;
        };
        this.texture.InitTexture(glContext);

        this.textureUniformLocation = this.glContext.getUniformLocation(this.program, "texture");

        // Init for debugging collision box
        if (this.debugCollisionBox)
        {
            this.collisionBox.debugEntity.InitMesh(this.glContext);
            this.world.AddEntity(this.collisionBox.debugEntity);
        }
    }

    AddAnimation(srcList, delayPerFrame)
    {
        this.animDelay = delayPerFrame;

        for (const src of srcList) 
        {
            const frame = new Texture(src);
            frame.InitTexture(this.glContext);

            this.animationFrame.push(frame);
        }
    }

    Update()
    {
        super.Update();

        if (this.world)
        {
            if (this.animationFrame.length)
            {
                this.animTimer += this.world.time.deltaTime;
                if (this.animTimer > this.animDelay)
                {
                    this.animTimer = 0;
                    this.curAnimIndex = (this.curAnimIndex + 1) % this.animationFrame.length;
                }
            }
        }
    }

    Render()
    {
        this._SetRenderAttributes();

        const texCoordSize = 2;

        this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, this.texCoordBuffer);
        this.glContext.vertexAttribPointer(this.texCoordAttrLocation, texCoordSize, this.glContext.FLOAT, false, 0, 0);
        this.glContext.enableVertexAttribArray(this.texCoordAttrLocation);

        this.glContext.activeTexture(this.glContext.TEXTURE0);
        if (this.animationFrame.length)
        {
            const currentFrame = this.animationFrame[this.curAnimIndex];
            currentFrame.BindTexture();
        }
        else
        {
            this.texture.BindTexture();
        }
        this.glContext.uniform1i(this.textureUniformLocation, 0);

        this._Draw();
    }

    Release()
    {
        super.Release();

        if (this.texCoordBuffer)
        {
            this.glContext.deleteBuffer(this.texCoordBuffer);
        }

        if (this.texture)
        {
            this.texture.Release();
        }

        if(this.animationFrame.length)
        {
            for (const frame of this.animationFrame) 
            {
                frame.Release();
            }
        }
    }

    Scale(newScale)
    {
        super.Scale(newScale);

        this.collisionBox.scale = this.scale;
    }

    ScaleX(newScaleX)
    {
        super.ScaleX(newScaleX);

        this.collisionBox.scale = this.scale;
    }

    ScaleY(newScaleY)
    {
        super.ScaleY(newScaleY);

        this.collisionBox.scale = this.scale;
    }
}