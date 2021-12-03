<script>
    import { onMount } from "svelte";
	import { FlappyBirdWorld } from "./mygame/FlappyBirdWorld";

    let canvas;

	// Fit to background image size
	const canvasWidth = 143 * 2;
	const canvasHeight = 256 * 2;

	const myWorld = new FlappyBirdWorld();

	onMount(() => {
		const webglContext = [ "webgl", "experimental-webgl", "webkit-3d", "moz-webgl" ];

		let glContext = null;

		for (const context of webglContext) 
		{
			glContext = canvas.getContext(context);	
			if (glContext)
			{
				break;
			}
		}

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
	<div class="control">
		<p>Mouse Left Click or</p>
		<p>Keyboard Enter(Return) or</p>
		<p>Keyboard Space is Jump!</p>
	</div>
    <canvas bind:this={canvas} width={canvasWidth} height={canvasHeight}></canvas>
	<div class="dummy"></div>
</div>

<style>
	p {
		margin: 0;
	}

    .game-canvas {
        display: flex;
        width: 100%;
        height: 100%;

        text-align: center;
		justify-content: center;
		align-items: center;
    }

    .game-canvas canvas {
        border: 1px solid black;
    }

	.control {
		position: absolute;
		left: 10%;
	}
</style>