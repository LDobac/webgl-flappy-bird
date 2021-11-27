import { Matrix4 } from "@math.gl/core";
import { Camera } from "./Camera";
import { GraphableObject } from "./GraphableObject";

export class World extends GraphableObject
{
    constructor()
    {
        super();

        this.projectionMatrix = new Matrix4().ortho({left: -100, right: 100, bottom:-100, top:100});

        this.glContext = null;

        this.entities = [];
        this.camera = new Camera();

        this.AddEntity = this.AddEntity.bind(this);
        this.RemoveEntity = this.RemoveEntity.bind(this);
        this.SortEntities = this.SortEntities.bind(this);
    }

    SetUp(glContext)
    {
        this.glContext = glContext;
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

        this.glContext.viewport(0, 0, this.glContext.canvas.width, this.glContext.canvas.height);

        this.glContext.clearColor(0, 1, 0, 1);
        this.glContext.clear(this.glContext.COLOR_BUFFER_BIT);

        for (const entity of this.entities) 
        {
            entity.Render();    
        }
    }

    AddEntity(newEntity)
    {
        newEntity.InitMesh(this.glContext);
        newEntity.SetWorld(this);

        this.entities.push(newEntity);

        this.SortEntities();
    }

    RemoveEntity(entity)
    {
        let index = this.entities.findIndex(entity);

        if (index > -1)
        {
            this.entities.splice(index, 1);
        }
    }

    SortEntities()
    {
        this.entities.sort((a, b) => {
            if (a.zOrder < b.zOrder) 
            {
                return -1;
            }

            if (a.zOrder > b.zOrder) 
            {
                return 1;
            }
            
            return 0;
        });
    }
}