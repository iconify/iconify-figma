<script lang="typescript">
	export let text: string;
	export let hint: string = '';

	export let checked: boolean;
	export let onClick: () => void;
</script>

<div class="iif-checkbox-row">
	<label><input
			type="checkbox"
			{checked}
			on:change={onClick} /><span>{text}</span></label>
	{#if hint}
		<p>{hint}</p>
	{/if}
</div>
