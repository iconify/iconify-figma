<script lang="typescript">
	import UIIcon from './UIIcon.svelte';

	// List of options: key -> value
	export let options: Record<string, string>;

	// Currently selected option
	export let selected: string;

	// Icon to show before text
	export let icon: string = '';

	// Extra custom classes, such as 'iif-input--up'
	export let extra: string = '';

	type SelectBorder = '' | 'full-border' | 'no-border';
	export let border: SelectBorder = 'no-border';

	// Action
	export let onChange: (value: string) => void;

	// Options to array
	interface OptionItem {
		key: string;
		text: string;
		onChange: () => void;
	}
	let optionsList: OptionItem[];
	$: {
		optionsList = [];
		for (const key in options) {
			optionsList.push({
				key,
				text: options[key],
				onChange: () => {
					if (document.activeElement) {
						(document.activeElement as HTMLElement).blur();
					}
					onChange(key);
				},
			});
		}
	}

	// Get class name
	const baseClass = 'iif-input';
	let className: string;
	$: {
		className =
			baseClass +
			// Border
			(border === '' ? '' : ' ' + baseClass + '--' + border) +
			// Placeholder
			' ' +
			baseClass +
			'--without-placeholder' +
			// Custom stuff
			(extra ? ' ' + extra : '') +
			// Icon
			(icon !== '' ? ' ' + baseClass + '--with-icon' : '');
	}

	// Handle click
	function toggleOptions() {
		//
	}
</script>

<div class="iif-input-wrapper iif-input-wrapper--select">
	<div class={className}>
		{#if icon !== ''}
			<div class="iif-input-icon">
				<UIIcon {icon} />
			</div>
		{/if}
		<a
			href="# "
			class="iif-input-content"
			on:click|preventDefault={toggleOptions}>{options[selected]}</a>
		<span class="iif-input-reset"><UIIcon icon="down" /></span>
		<ul>
			{#each optionsList as item, i (item.key)}
				<li>
					<a
						href="# "
						on:click|preventDefault={item.onChange}>{#if selected === item.key}
							<UIIcon icon="check" />
						{/if}
						{item.text}</a>
				</li>
			{/each}
		</ul>
	</div>
</div>
