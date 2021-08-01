<script lang="typescript">
	import { getContext } from 'svelte';
	import type { WrappedRegistry } from '../../wrapper/registry';
	import { phrases } from '../../config/phrases';

	// Registry
	const registry = getContext('registry') as WrappedRegistry;

	function maximizeClicked() {
		registry.callback({
			type: 'window',
			control: 'minimize',
		});
	}

	function closeClicked() {
		registry.callback({
			type: 'button',
			button: 'close',
		});
	}
</script>

<div class="plugin-mini">
	<a
		href="# "
		on:click|preventDefault={maximizeClicked}>{phrases.figma.minimized.maximize}</a>
	<a
		href="# "
		class="plugin-mini-close"
		on:click|preventDefault={closeClicked}>{phrases.figma.minimized.close}</a>
</div>
