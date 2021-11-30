<script>
    import { onMount } from "svelte";
	import { Sprite, World } from "./game";

    let canvas;

	onMount(() => {
		const glContext = canvas.getContext("webgl");
		if (!glContext)
		{
			console.log("GL Context가 없음!");
		}

		const myWorld = new World();
		myWorld.SetUp(glContext);

		const sprite = new Sprite("./f-texture.png");
		sprite.TranslateX(0.3);
		sprite.Scale([0.7, 0.7, 0.7]);

		const sprite2 = new Sprite("./clown_export-buff_2_0.png");
		sprite2.TranslateX(-0.3);
		sprite2.Scale([0.7, 0.7, 0.7]);

		sprite2.SetParent(sprite);

		myWorld.AddEntity(sprite);
		myWorld.AddEntity(sprite2);

		const render = () => {
			if (myWorld.input.IsKeyDown("e"))
			{
				sprite.Rotate(sprite.angle - 0.05);
			}

			if (myWorld.input.IsMouseClick())
			{
				sprite2.Rotate(sprite2.angle + 0.05);
			}

			myWorld.Update();

			myWorld.Render();

			requestAnimationFrame(render);
		}

		render();
	});
</script>

<!-- {@debug} -->
<div class="game-canvas">
    <canvas bind:this={canvas} width="500" height="500"></canvas>
</div>

<style>
    .game-canvas {
        display: block;
        width: 100%;
        height: 100%;

        text-align: center;
    }

    .game-canvas canvas {
        border: 1px solid black;
    }
</style>