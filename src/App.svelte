<script>
import { onMount } from "svelte";
	import Canvas from "./Canvas.svelte";

	let maxScore = 0;
	let score = 0;
	let gameover = false;

	onMount(() => {
		maxScore = parseInt(localStorage.getItem("maxScore") || "0");
	});

	$: if (gameover && (maxScore < score)) {
		localStorage.setItem("maxScore", score.toString());
	}
</script>

<main>
	<div class="max-score">
		<p>Max Score : {maxScore}</p>
	</div>
	<div class="score">
		<p>Score : {score}</p>
	</div>
	<div class="game-container">
		<Canvas bind:score={score} bind:gameover={gameover}/>
	</div>
	{#if gameover}
		<div class="gameover">
			<p>Gameover!</p>
		</div>
	{/if}
</main>

<style>
	p {
		margin: 1rem;
	}

	.max-score {
		text-align: center;
		font-size: 1rem;
	}

	.score {
		text-align: center;
		font-size: 2rem;
		font-weight: bold;
	}

	.gameover {
		text-align: center;
		font-size: 2rem;
		font-weight: bold;
	}
</style>