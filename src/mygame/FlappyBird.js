import { Vector3 } from "@math.gl/core";
import { Sprite } from "../game";

export class FlappyBird extends Sprite
{
    constructor()
    {
        super("./images/bird_1.png");
        
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
            "./images/bird_1.png",
            "./images/bird_2.png",
            "./images/bird_3.png",
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
        return (1 - step) * start + (step * end)
    }
}