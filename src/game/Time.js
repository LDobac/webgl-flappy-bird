export class Time
{
    constructor()
    {
        this.previousTime = 0;
        this.deltaTime = 0;

        this.Initailize = this.Initailize.bind(this);
        this.Update = this.Update.bind(this);
    }

    Initailize()
    {
        this.previousTime = Date.now();
        this.deltaTime = 0;
    }

    Update()
    {
        this.deltaTime = (Date.now() - this.previousTime) / 1000;

        this.previousTime = Date.now();
    }
}