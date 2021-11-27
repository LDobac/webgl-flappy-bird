<script>
	import { onMount } from "svelte";
	import { Entity, SpriteShaderProgram, World } from "./game";

	let canvas;

	onMount(() => {
		const glContext = canvas.getContext("webgl");
		if (!glContext)
		{
			console.log("GL Context가 없음!");
		}

		const shaderProgram = new SpriteShaderProgram(glContext).program;

		const myWorld = new World();
		myWorld.SetUp(glContext);

		const entity = new Entity();
		entity.verticies = [0, 0, 0, 0.5, 0.7, 0,];
		entity.program = shaderProgram;

		myWorld.AddEntity(entity);

		myWorld.Render();
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