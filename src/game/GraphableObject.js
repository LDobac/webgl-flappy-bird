export class GraphableObject
{
    constructor() 
    {
        this.Start = this.Start.bind(this);
        this.Update = this.Update.bind(this);
        this.Render = this.Render.bind(this);
    }

    Start() {}
    Update() {}
    Render() {}
}