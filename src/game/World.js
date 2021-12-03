import { Matrix4 } from "@math.gl/core";
import { Camera } from "./Camera";
import { GameObject } from "./GameObject";
import { Input } from "./Input";
import { Time } from "./Time";

export class World extends GameObject
{
    constructor()
    {
        super();

        this.time = new Time();
        this.input = new Input();

        this.stopTime = false;

        this.projectionMatrix = null;

        this.glContext = null;

        this.entities = [];
        this.camera = new Camera();

        this.AddEntity = this.AddEntity.bind(this);
        this.RemoveEntity = this.RemoveEntity.bind(this);
        this.SortEntities = this.SortEntities.bind(this);
        this.StopTime = this.StopTime.bind(this);
        this.ResumeTime = this.ResumeTime.bind(this);
    }

    SetUp(glContext)
    {
        this.glContext = glContext;

        this.projectionMatrix = new Matrix4().orthographic({
            fovy : 90 * (Math.PI / 180),
            aspect : this.glContext.canvas.width / this.glContext.canvas.height,
            focalDistance : 1,
            near : 0.1,
            far : 100    
        });

        this.time.Initailize();
        this.input.Initailize();
    }

    Start()
    {
        super.Start();
    }

    Update()
    {
        super.Update();

        if (!this.stopTime)
        {
            this.time.Update();
        }

        this.input.Update();

        for (const entity of this.entities) 
        {
            entity.Update();    
        }
    }

    Render()
    {
        super.Render();

        this.glContext.viewport(0, 0, this.glContext.canvas.width, this.glContext.canvas.height);

        this.glContext.clearColor(0, 0, 0, 0);
        this.glContext.clear(this.glContext.COLOR_BUFFER_BIT);
        this.glContext.enable(this.glContext.BLEND);
        this.glContext.blendFunc(this.glContext.SRC_ALPHA, this.glContext.ONE_MINUS_SRC_ALPHA);

        this.glContext.enable(this.glContext.CULL_FACE);

        for (const entity of this.entities) 
        {
            entity.Render();    
        }
    }

    AddEntity(newEntity)
    {
        newEntity.SetWorld(this);
        newEntity.InitMesh(this.glContext);

        this.entities.push(newEntity);

        this.SortEntities();
    }

    RemoveEntity(entity)
    {
        let index = this.entities.findIndex((element) => element == entity);

        if (index > -1)
        {
            this.entities.splice(index, 1);
        }

        entity.Release();
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

    StopTime()
    {
        this.stopTime = true;
        this.time.deltaTime = 0;
    }

    ResumeTime()
    {
        this.stopTime = false;
    }
}