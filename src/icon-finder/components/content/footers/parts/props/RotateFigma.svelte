<script lang="typescript">
	import type { IconCustomisations } from '@iconify/search-core/lib/misc/customisations';
	import { phrases } from '../../../../../config/phrases';
	import OptionsBlock from '../OptionsBlock.svelte';
	import Select from '../../../../ui/Select.svelte';

	// Current value
	export let value: number;

	// Callback
	export let customise: (
		key: keyof IconCustomisations,
		value: unknown
	) => void;

	// Get text
	const buttonPhrases = phrases.footerOptionButtons as Record<string, string>;

	// Get all options
	const text = buttonPhrases.rotate;
	const options: Record<string, string> = {
		'0': text.replace('{num}', '0'),
		'1': text.replace('{num}', '90'),
		'2': text.replace('{num}', '180'),
		'3': text.replace('{num}', '270'),
	};

	function onChange(newValue: string) {
		const count = parseInt(newValue);
		if (count !== value) {
			customise('rotate', count);
		}
	}
</script>

<OptionsBlock type="rotate">
	<Select
		icon="angle"
		{options}
		selected={value + ''}
		{onChange}
		extra="iif-input--small" />
</OptionsBlock>
