<script lang="typescript">
	import IconComponent, { getIcon } from '@iconify/svelte';
	import type { Icon } from '@iconify/search-core';
	import type { IconifyIcon } from '@iconify/types';
	import { phrases } from '../../../../config/phrases';
	import type { IconDragEvent } from '../../../../wrapper/drag';
	import type { IconsListFilter } from '../../../types';
	import UIIcon from '../../../ui/UIIcon.svelte';
	import Filter from '../../../ui/Filter.svelte';

	// Icon name
	export let name: string;

	// Tooltip
	export let tooltip: string;

	// Text
	export let text: string;

	// Icon
	export let icon: Icon;

	// Loaded
	export let exists: boolean;

	// Selected
	export let selected: boolean;

	// Link
	export let link: string;

	// Callback (Router action)
	export let onClick: (event: string, value: string | Icon) => void;

	// onDrag
	export let onDrag: IconDragEvent;

	// Selecting multiple icons
	export let isSelecting: boolean;

	// List of filters
	export let filters: IconsListFilter[];

	// onDelete
	export let onDelete: () => void;

	// showTrash
	export let showTrash: boolean;

	// Get class name
	const baseClass = 'iif-icon-list';
	let className: string;
	$: {
		className =
			baseClass +
			' ' +
			baseClass +
			(exists ? '--loaded' : '--loading') +
			(selected ? ' ' + baseClass + '--selected' : '');
	}

	// Get size
	let size: IconifyIcon | null = null;
	$: {
		const newSize = exists ? getIcon(name) : null;
		if (newSize !== size) {
			size = newSize;
		}
	}

	// Select icon
	function handleClick() {
		onClick(
			isSelecting ? (selected ? 'deselect' : 'select') : 'toggle',
			icon
		);
	}
</script>

<li class={className}>
	<div class="iif-icon-sample">
		<a
			href={link}
			target="_blank"
			title={tooltip}
			draggable={true}
			on:dragstart={(event) => {
				onDrag(true, event, icon, false);
			}}
			on:dragend={(event) => {
				onDrag(false, event, icon, false);
			}}
			on:click|preventDefault={handleClick}>
			{#if exists}
				<IconComponent icon={name} width="1em" height="1em" />
				{#if isSelecting}
					<UIIcon
						icon={selected ? 'selecting-selected' : 'selecting-unselected'} />
				{/if}
			{/if}
		</a>
	</div>

	<div class={'iif-icon-data iif-icon-data--filters--' + filters.length}>
		<a
			class="iif-icon-name"
			href={link}
			title={tooltip}
			on:click|preventDefault={handleClick}>
			{text}
		</a>
		{#if size}
			<div class="iif-icon-size">{size.width} x {size.height}</div>
		{/if}
		{#if filters}
			{#each filters as filter}
				<Filter
					filter={filter.item}
					title={filter.item.title === '' ? phrases.filters.uncategorised : filter.item.title}
					onClick={() => onClick(filter.action, filter.value)} />
			{/each}
		{/if}
		{#if showTrash}
			<a href="# " class="iif-icon-trash" on:click={onDelete}><UIIcon
					icon="trash" /></a>
		{/if}
	</div>
</li>
