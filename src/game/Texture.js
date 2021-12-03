export class Texture
{
    constructor(imgSrc)
    {
        this.texture = null;

        this.image = null;
        this.src = imgSrc;
        this.imageLoadHanlder = null;

        this.width = 0;
        this.height = 0;

        this.glContext = null;

        this.InitTexture = this.InitTexture.bind(this);
        this.BindTexture = this.BindTexture.bind(this);
    }

    InitTexture(glContext)
    {
        this.glContext = glContext;

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
            this.width = this.image.width;
            this.height = this.image.height;

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

            if ( IsPowerOfTwo(this.width) && IsPowerOfTwo(this.height)) 
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

            if (this.imageLoadHanlder)
            {
                this.imageLoadHanlder();
            }
        });
    }

    BindTexture()
    {
        this.glContext.bindTexture(this.glContext.TEXTURE_2D, this.texture);
    }

    Release()
    {
        if (this.texture)
        {
            this.glContext.deleteTexture(this.texture);
        }
    }
}