<script lang="typescript">
	import { onDestroy } from 'svelte';
	import type { WindowAfterImport } from '../../../../../common/options';
	import { phrases } from '../../../../config/phrases';
	import { setOptions, watchedOptions } from '../../../../figma/options';
	import Block from './FooterBlock.svelte';
	import OptionRow from '../../../ui/OptionRow.svelte';
	import Select from '../../../ui/Select.svelte';

	export let count: number;

	// Text
	let text: string;
	$: {
		text = phrases.figma.windowActionTitle[count > 1 ? 'icons' : 'icon'];
	}

	// Get action
	let currentAction: WindowAfterImport;
	const unsubscribe = watchedOptions.subscribe((options) => {
		currentAction = options.windowAction;
	});
	onDestroy(unsubscribe);

	// Change
	function onChange(value: string) {
		setOptions({
			windowAction: value as WindowAfterImport,
		});
	}
</script>

{#if count}
	<Block name="window-action" title="">
		<OptionRow {text}>
			<Select
				options={phrases.figma.windowAction}
				selected={currentAction}
				{onChange}
				extra="iif-input--up" />
		</OptionRow>
	</Block>
{/if}
