export class Input
{
    constructor()
    {
        this.isMouseClick = false;
        this.isRightMouseClick = false;
        this.keyHold = {};

        this.Initailize = this.Initailize.bind(this);
        this.Update = this.Update.bind(this);
    }

    Initailize()
    {
        // Prevent right click contextmenu
        window.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        });
      
        window.addEventListener("mousedown", (e) => {
            if (e.button == 0)
            {
                this.isMouseClick = true;
            }
            else if (e.button == 2)
            {
                this.isRightMouseClick = true;
            }
        });
      
        window.addEventListener("mouseup", (e) => {
            if (e.button == 0)
            {
                this.isMouseClick = false;
            }
            else if (e.button == 2)
            {
                this.isRightMouseClick = false;
            }
        });
    
        window.addEventListener("keydown", (e) => {
            this.keyHold[e.key] = true;
        });
    
        window.addEventListener("keyup", (e) => {
            this.keyHold[e.key] = false;
        });
    }

    Update()
    {
    }

    IsMouseClick(right = false)
    {
        return right ? this.isRightMouseClick : this.isMouseClick;
    }

    IsKeyDown(key)
    {
        if (!this.keyHold[key])
        {
            return false;
        }

        return this.keyHold[key];
    }
}