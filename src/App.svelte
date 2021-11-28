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
		entity.verticies = [
			0, 0, 0,
			0, 0.5, 0,
			0.5, 0, 0,
			0.5, 0.5, 0];
		entity.indices = [2, 1, 0, 2, 3, 1];
		entity.program = shaderProgram;

		const entity2 = new Entity();
		entity2.verticies = [
			0, 0, 0,
			0, -0.5, 0,
			-0.5, 0, 0,
			-0.5, -0.5, 0];
		entity2.indices = [2, 1, 0, 2, 3, 1];
		entity2.program = shaderProgram;

		const entity3 = new Entity();
		entity3.verticies = [
			-0.5, -0.5, 0,
			-0.5, -1, 0,
			-1, -0.5, 0,
			-1, -1, 0];
		entity3.indices = [2, 1, 0, 2, 3, 1];
		entity3.program = shaderProgram;

		myWorld.AddEntity(entity);
		myWorld.AddEntity(entity2);
		myWorld.AddEntity(entity3);

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