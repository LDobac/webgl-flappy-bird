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

		myWorld.AddEntity(sprite);
		myWorld.AddEntity(sprite2);

		const render = () => {
			sprite.Rotate(sprite.angle - 0.05);
			sprite2.Rotate(sprite2.angle + 0.05);

			if (myWorld.input.IsKeyDown("e"))
			{
				console.log("E has pressed");
			}

			if (myWorld.input.IsMouseClick())
			{
				console.log("Left mouse clicked");
			}

			myWorld.Update();

			myWorld.Render();

			requestAnimationFrame(render);
		}

		render();
	})

	export let name;
</script>

<!-- {@debug name} -->
<main>
	<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>

	<canvas bind:this={canvas} width="300" height="300" style="border: 1px solid black;"></canvas>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>