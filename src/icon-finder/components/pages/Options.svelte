<script lang="typescript">
	import { onDestroy } from 'svelte';
	import { phrases } from '../../config/phrases';
	import PageContainer from './parts/PageContainer.svelte';
	import CheckboxRow from '../ui/CheckboxRow.svelte';
	import OptionRow from '../ui/OptionRow.svelte';
	import Select from '../ui/Select.svelte';
	import { setOptions, watchedOptions } from '../../figma/options';
	import type { PluginOptions } from '../../../common/options';

	const text = phrases.figma;

	// Options
	let options: PluginOptions;
	const unsubscribe = watchedOptions.subscribe((value) => {
		options = value;
	});
	onDestroy(unsubscribe);

	/**
	 * Toggle boolean option
	 */
	function onToggle(key: keyof PluginOptions) {
		const newOptions: Partial<PluginOptions> = {};
		(newOptions as Record<string, boolean>)[key] = !options[key];
		setOptions(newOptions);
	}

	/**
	 * Change string option
	 */
	function setOption(key: keyof PluginOptions, value: string) {
		const newOptions: Record<string, string> = {
			[key]: value,
		};
		setOptions(newOptions as Partial<PluginOptions>);
	}
</script>

<PageContainer type="options">
	<section class="iif-options-section">
		<h1>{text.optionSections.layout}</h1>
		<CheckboxRow
			checked={options.compactWidth}
			text={text.options.compact}
			hint={text.options.compactHint}
			onClick={() => onToggle('compactWidth')} />
		<CheckboxRow
			checked={options.scrollToIcon}
			text={text.options.scroll}
			onClick={() => onToggle('scrollToIcon')} />
		<CheckboxRow
			checked={options.stickyFooter}
			text={text.options.stickyFooter}
			onClick={() => onToggle('stickyFooter')} />
	</section>
	<section class="iif-options-section">
		<h1>{text.optionSections.drop}</h1>
		<p>{text.optionSections.dropIntro}</p>
		<CheckboxRow
			checked={options.customizeDrop}
			text={text.options.customizeDrop}
			onClick={() => onToggle('customizeDrop')} />
		<CheckboxRow
			checked={options.dropToFrame}
			text={text.options.dropToFrame}
			onClick={() => onToggle('dropToFrame')} />
	</section>
	<section class="iif-options-section">
		<h1>{text.optionSections.import}</h1>
		<OptionRow text={text.windowActionTitle.icons}>
			<Select
				options={text.windowAction}
				selected={options.windowAction}
				onChange={(value) => setOption('windowAction', value)}
				extra="iif-input--up"
				border="" />
		</OptionRow>
		<OptionRow text={text.options.select}>
			<Select
				options={text.selectAction}
				selected={options.selectAfterImport}
				onChange={(value) => setOption('selectAfterImport', value)}
				extra="iif-input--up"
				border="" />
		</OptionRow>
	</section>
</PageContainer>
