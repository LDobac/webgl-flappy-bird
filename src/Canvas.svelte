<script>
    import { onMount } from "svelte";
	import { FlappyBirdWorld } from "./mygame/FlappyBirdWorld";

    let canvas;

	// Fit to background image size
	const canvasWidth = 143 * 2;
	const canvasHeight = 256 * 2;

	const myWorld = new FlappyBirdWorld();

	onMount(() => {
		const glContext = canvas.getContext("webgl");
		if (!glContext)
		{
			console.log("GL Context가 없음!");
		}

		myWorld.SetUp(glContext);

		const render = () => {
			myWorld.Update();

			myWorld.Render();

			score = myWorld.score;
			gameover = myWorld.gameover;

			requestAnimationFrame(render);
		}

		render();
	});

	export let score = 0;
	export let gameover = false;
</script>

<!-- {@debug} -->
<div class="game-canvas">
    <canvas bind:this={canvas} width={canvasWidth} height={canvasHeight}></canvas>
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