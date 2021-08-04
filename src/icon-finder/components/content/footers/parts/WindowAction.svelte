<script lang="typescript">
	import { onDestroy } from 'svelte';
	import type { ActionAfterImport } from '../../../../../common/options';
	import { phrases } from '../../../../config/phrases';
	import { setOptions, watchedOptions } from '../../../../figma/options';
	import Block from './FooterBlock.svelte';
	import OptionRow from '../../../ui/OptionRow.svelte';
	import Select from '../../../ui/Select.svelte';

	export let count: number;

	// Options
	const optionsText = phrases.figma.importAction;
	const options: Record<ActionAfterImport, string> = {
		none: optionsText.none,
		minimize: optionsText.minimize,
		close: optionsText.close,
	};

	// Text
	let text: string;
	$: {
		text = phrases.figma.importActionTitle[count > 1 ? 'icons' : 'icon'];
	}

	// Get action
	let currentAction: ActionAfterImport;
	const unsubscribe = watchedOptions.subscribe((options) => {
		currentAction = options.windowAction;
	});
	onDestroy(unsubscribe);

	// Change
	function onChange(value: string) {
		setOptions({
			windowAction: value as ActionAfterImport,
		});
	}
</script>

{#if count}
	<Block name="window-action" title="">
		<OptionRow {text}>
			<Select {options} selected={currentAction} {onChange} up={true} />
		</OptionRow>
	</Block>
{/if}
