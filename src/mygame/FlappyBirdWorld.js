import { Sprite } from "../game";
import { World } from "../game/World";
import { FlappyBird } from "./FlappyBird";

export class FlappyBirdWorld extends World
{
    constructor()
    {
        super();

        this.pipes = [];
        this.pipeSpawnHandler = null;
        this.pipeSpawnDelay = 2500;

        this.backgroundSprite = new Sprite("./images/background_0.png");
        this.grounds = [
            new Sprite("./images/ground.png"),
            new Sprite("./images/ground.png"),
            new Sprite("./images/ground.png"),
        ]

        this.bird = new FlappyBird();

        this.gameover = false;
        this.score = 0;

        this.PushPipe = this.PushPipe.bind(this);
    }

    SetUp(glContext)
    {
        super.SetUp(glContext);

		this.backgroundSprite.Scale([2, 2, 2]);
		this.AddEntity(this.backgroundSprite);

        this.backgroundSprite.AddAnimation([
            "./images/background_0.png",
            "./images/background_1.png",
        ], 10);

        for (let index = 0; index < this.grounds.length; index++)
        {
            this.grounds[index].Scale([0.4, 0.4, 0.4]);
            this.grounds[index].TranslateY(-1.05);
            this.grounds[index].SetZOrder(10);

            if (index > 0)
            {
                this.grounds[index].TranslateX(
                    this.grounds[index - 1].position.x + 
                    1.1
                );
            }

            this.AddEntity(this.grounds[index]);
        }

        this.bird.TranslateX(-0.3);
        this.AddEntity(this.bird);

        this.pipeSpawnHandler = setInterval(this.PushPipe, this.pipeSpawnDelay);

        this.PushPipe();
    }

    Update()
    {
        super.Update();

        if (this.gameover)
        {
            this.StopTime();

            clearInterval(this.pipeSpawnHandler);
        }

        // Move pipe
        for (const pipe of this.pipes) 
        {
            const pipeUp = pipe[0];
            const pipeDown = pipe[1];

            pipeUp.TranslateX(pipeUp.position.x - (0.4 * this.time.deltaTime));
            pipeDown.TranslateX(pipeDown.position.x - (0.4 * this.time.deltaTime));

            if (pipeUp.position.x < -1)
            {
                this.RemoveEntity(pipe[0]);
                this.RemoveEntity(pipe[1]);

                this.pipes.splice(0, 1);

                this.score++;
            }
        }

        // Ground movement update
        for (let index = 0; index < this.grounds.length; index++)
        {
            this.grounds[index].TranslateX(this.grounds[index].position.x - (0.4 * this.time.deltaTime));

            if (this.grounds[index].position.x < -1.1)
            {
                this.grounds[index].TranslateX(
                    this.grounds[(index + 1) % this.grounds.length].position.x + 
                    1.1
                );
            }
        }

        // Check Bird is die
        // If bird out of sight
        if (this.bird.position.y < -1.05)
        {
            this.gameover = true;
        }

        // If bird collide with pipes
        for (const pipe of this.pipes) 
        {
            if (
                pipe[0].collisionBox.IsCollide(this.bird.collisionBox) ||
                pipe[1].collisionBox.IsCollide(this.bird.collisionBox)
            )
            {
                this.gameover = true;
            }
        }
    }

    PushPipe()
    {
        const pipeColor = this.score > 10 ? 1 : 0;

        let pipeUp = new Sprite(`./images/pipe_${pipeColor}_up.png`);
        let pipeDown = new Sprite(`./images/pipe_${pipeColor}_down.png`);

        pipeUp.Scale([1.5, 1.5, 1.5]);
        pipeDown.Scale([1.5, 1.5, 1.5]);

        pipeUp.TranslateX(1.5);
        pipeDown.TranslateX(1.5);

        const r = this.getRandomArbitrary(-0.3, 0.3);

        pipeUp.TranslateY(-1.1 + r);
        pipeDown.TranslateY(1.1 + r);

        this.AddEntity(pipeUp);
        this.AddEntity(pipeDown);

        this.pipes.push([pipeUp, pipeDown]);
    }

    // https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    getRandomArbitrary(min, max) 
    {
        return Math.random() * (max - min) + min;
    }
}