import { Entity } from "./Entity";
import { SpriteShaderProgram } from "./SpriteShaderProgram"

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

        this.texture = null;
        this.textureUniformLocation = null;

        this.image = null;
        this.src = imgSrc;
    }

    InitMesh(glContext)
    {
        this.program = new SpriteShaderProgram(glContext).program;

        super.InitMesh(glContext);

        this.texCoordAttrLocation = this.glContext.getAttribLocation(this.program, "vTexCoord");

        this.texCoordBuffer = this.glContext.createBuffer();
        this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, this.texCoordBuffer);
        this.glContext.bufferData(this.glContext.ARRAY_BUFFER, new Float32Array(this.texCoord), this.glContext.STATIC_DRAW);

        this.texture = this.glContext.createTexture();
        this.glContext.bindTexture(this.glContext.TEXTURE_2D, this.texture);

        // Create temporary image
        this.glContext.texImage2D(
            this.glContext.TEXTURE_2D,
            0,
            this.glContext.RGBA,
            1,
            1,
            0,
            this.glContext.RGBA,
            this.glContext.UNSIGNED_BYTE,
            new Uint8Array([63, 16, 127, 86])
        );

        this.image = new Image();
        this.image.src = this.src;
        this.image.addEventListener("load", () => {
            const imageWidth = this.image.width;
            const imageHeight = this.image.height;
            const imageRatio = imageWidth / imageHeight;

            this.glContext.bindTexture(this.glContext.TEXTURE_2D, this.texture);

            this.glContext.pixelStorei(this.glContext.UNPACK_FLIP_Y_WEBGL, true);

            this.glContext.texImage2D(
                this.glContext.TEXTURE_2D, 
                0, 
                this.glContext.RGBA, 
                this.glContext.RGBA, 
                this.glContext.UNSIGNED_BYTE, 
                this.image
            );

            const IsPowerOfTwo = (x) => {
                return (x & (x - 1)) == 0;
            }

            if ( IsPowerOfTwo(imageWidth) && IsPowerOfTwo(imageHeight)) 
            {
                // If texture power of two
                this.glContext.generateMipmap(this.glContext.TEXTURE_2D);

                this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_MIN_FILTER, this.glContext.NEAREST);
                this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_MAG_FILTER, this.glContext.NEAREST);
            }
            else
            {
                // If texture not power of two
                this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_MAG_FILTER, this.glContext.LINEAR);
                this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_MIN_FILTER, this.glContext.LINEAR);
    
                this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_WRAP_S, this.glContext.CLAMP_TO_EDGE);
                this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_WRAP_T, this.glContext.CLAMP_TO_EDGE);
            }

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
        });

        this.textureUniformLocation = this.glContext.getUniformLocation(this.program, "texture");
    }

    Render()
    {
        this._SetRenderAttributes();

        const texCoordSize = 2;

        this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, this.texCoordBuffer);
        this.glContext.vertexAttribPointer(this.texCoordAttrLocation, texCoordSize, this.glContext.FLOAT, false, 0, 0);
        this.glContext.enableVertexAttribArray(this.texCoordAttrLocation);

        this.glContext.activeTexture(this.glContext.TEXTURE0);
        this.glContext.bindTexture(this.glContext.TEXTURE_2D, this.texture);
        this.glContext.uniform1i(this.textureUniformLocation, 0);

        this._Draw();
    }
}