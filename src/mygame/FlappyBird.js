import { Vector3 } from "@math.gl/core";
import { Sprite } from "../game";

export class FlappyBird extends Sprite
{
    constructor()
    {
        // https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Math/random
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
        }
        let birdColor = getRandomInt(0, 3);

        super(`./images/bird_${birdColor}_1.png`);
        
        this.birdColor = birdColor;
        
        this.velocity = new Vector3(0, 0, 0);
        this.gravity = -4;
        this.jumpPower = 3;
        this.canJump = true;
    }

    InitMesh(glContext)
    {
        super.InitMesh(glContext);

        this.Scale([0.1, 0.1, 0.1]);

        this.AddAnimation([
            `./images/bird_${this.birdColor}_1.png`,
            `./images/bird_${this.birdColor}_2.png`,
            `./images/bird_${this.birdColor}_3.png`,
        ], 0.05);
    }

    Update()
    {
        super.Update();

        // Update Bird velocity
        this.velocity.y += (this.gravity * this.world.time.deltaTime);

        // Update Bird jump
        if ( (this.world.input.IsMouseClick() || this.world.input.IsKeyDown("Enter") || this.world.input.IsKeyDown(" ")) && this.canJump )
        {
            if (this.velocity.y > (this.jumpPower / 10))
            {
                const powerDispersion = ((this.jumpPower / 10) / this.velocity.y);

                this.velocity.y += (this.jumpPower * powerDispersion);
            }
            else
            {
                this.velocity.y += this.jumpPower;
            }

            this.canJump = false;
        }
        else if (!(this.world.input.IsMouseClick() || this.world.input.IsKeyDown("Enter") || this.world.input.IsKeyDown(" ")))
        {
            this.canJump = true;
        }

        // Update bird position;
        this.TranslateY(this.position.y + (this.velocity.y * this.world.time.deltaTime));

        // Update Bird rotation;
        let angle = this.Lerp(-(Math.PI/3), (Math.PI/3), this.velocity.y);
        angle = Math.min((Math.PI/3), Math.max(-(Math.PI/3), angle));

        this.Rotate(angle);
    }

    Lerp (start, end, step)
    {
        return (1 - step) * start + (step * end);
    }
}