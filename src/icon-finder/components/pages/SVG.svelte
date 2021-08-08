<script lang="typescript">
	import { getContext, onMount } from 'svelte';
	import { replaceIDs } from '@iconify/svelte';
	import { phrases } from '../../config/phrases';
	import type { WrappedRegistry } from '../../wrapper/registry';
	import PageContainer from './parts/PageContainer.svelte';
	import Layers from '../content/footers/parts/Layers.svelte';
	import WindowAction from '../content/footers/parts/WindowAction.svelte';

	// Registry
	const registry = getContext('registry') as WrappedRegistry;

	const text = phrases.svg;

	let content: string = '';
	let isInvalid: boolean = false;
	interface SampleSVG {
		code: string;
		src: string;
	}
	let svg: SampleSVG | null = null;

	// Errors
	interface Notice {
		type: 'warning' | 'error';
		text: string;
	}
	let notices: Notice[] = [];

	function cleanup(content: string): string {
		let code = content;

		// Remove junk for URI
		['url(', ';', ')', '"', "'"].forEach((str) => {
			if (code.slice(0, str.length) === str) {
				code = code.slice(str.length).trim();
			}
			if (code.slice(0 - str.length) === str) {
				code = code.slice(0, code.length - str.length);
			}
		});

		// Decode URI
		if (code.slice(0, 5) === 'data:') {
			// Remove data:
			code = code.slice(5);

			// Remove content-type, without testing it (content will be validated later)
			let parts = code.split(',');
			let contentType = parts.shift()!;
			code = parts.join(',');

			// Decode URI
			const contentTypeParts = contentType.split(';');
			if (contentTypeParts.pop()!.toLowerCase() === 'base64') {
				try {
					code = window.atob(code);
				} catch (err) {
					code = '';
				}
			} else if (code.toLowerCase().indexOf('%3c') !== -1) {
				code = window.decodeURIComponent(code);
			}

			// Check it
			if (code.indexOf('<svg') !== -1 && code.indexOf('</svg>') !== -1) {
				content = code;
			}
		}

		// Remove junk
		function remove(str1: string, str2: string, append: string) {
			let start = 0,
				end;

			while ((start = content.indexOf(str1, start)) !== -1) {
				end = content.indexOf(str2, start + str1.length);
				if (end === -1) {
					return;
				}
				content =
					content.slice(0, start) +
					append +
					content.slice(end + str2.length);
				start = start + append.length;
			}
		}

		// Remove comments
		remove('<!--', '-->', '');

		// Remove doctype and XML declaration
		remove('<?xml', '?>', '');
		remove('<!DOCTYPE svg', '<svg', '<svg');

		// Remove Adobe Illustrator junk
		remove(
			'xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;"',
			'',
			''
		);
		remove('xml:space="preserve"', '', '');
		remove('<foreignObject', '</foreignObject>', '');

		remove('<i:pgf', '</i:pgf>', '');

		// Entypo stuff
		remove('enable-background="', '"', '');

		return content.trim();
	}

	/**
	 * Test content
	 */
	function testContent() {
		let value = content.trim();
		if (value === '') {
			// Empty
			isInvalid = false;
			svg = null;
			notices = [];
			return;
		}

		const valueLC = value.toLowerCase();

		// Test for bad code
		if (
			valueLC.indexOf('<foreignobject') !== -1 ||
			valueLC.indexOf('<script') !== -1
		) {
			notices = [
				{
					type: 'error',
					text: text.foreignObject,
				},
			];
			isInvalid = true;
			svg = null;
			return;
		}

		// Clean up
		value = cleanup(value);

		// Check for valid SVG
		if (value.indexOf('<svg') === -1 || value.indexOf('</svg>') === -1) {
			isInvalid = true;
			notices = [
				{
					type: 'error',
					text: text.invalid,
				},
			];
			svg = null;
			return;
		}

		// Passed
		svg = {
			code: value,
			src: 'data:image/svg+xml;base64,' + window.btoa(replaceIDs(value)),
		};
		isInvalid = false;
		notices = [];

		// Check for font
		if (
			value.indexOf('<font') !== -1 &&
			value.indexOf('<missing-glyph') !== -1
		) {
			notices.push({
				type: 'warning',
				text: text.font,
			});
		}

		// Check for animations
		if (
			value.indexOf('<animate') !== -1 ||
			value.indexOf('<set') !== -1 ||
			value.indexOf('<discard') !== -1
		) {
			notices.push({
				type: 'warning',
				text: text.animated,
			});
		}
	}

	/**
	 * Buttons
	 */
	function onSubmit() {
		if (!svg) {
			return;
		}

		registry.callback({
			type: 'import-svg',
			svg: svg.code,
		});
	}

	function onClear() {
		content = '';
		testContent();
	}

	/**
	 * Focus on mount
	 */
	onMount(() => {
		const node = document.querySelector('.iif-content--svg textarea');
		if (node) {
			(node as HTMLTextAreaElement).focus();
		}
	});

	// Drag
	function onDrag(start: boolean, event: MouseEvent) {
		if (svg) {
			registry.ondrag(start, event, {
				itemType: 'svg',
				item: svg.code,
			});
		}
	}
</script>

<PageContainer type="svg">
	<p>{text.text}</p>
	<p class="plugin-page-comment">{text.subtext}</p>

	<textarea
		class="iif-textarea iif-textarea--outlined{isInvalid ? ' iif-textarea--invalid' : ''}"
		bind:value={content}
		on:change={testContent}
		on:blur={testContent}
		spellcheck={false}
		autocomplete="off"
		autocorrect="off"
		autocapitalize="off" />

	{#if notices.length}
		<div class="plugin-paste-notices">
			{#each notices as item}
				<p class="plugin-paste-notice plugin-paste-notice--{item.type}">
					{item.text}
				</p>
			{/each}
		</div>
	{/if}

	{#if svg}
		<div class="iif-footer-full iif-footer-full--paste">
			<div
				class="iif-footer-sample iif-footer-sample--block iif-footer-sample--loaded">
				<a
					href="# "
					on:click|preventDefault={() => {}}
					draggable={true}
					on:dragstart={(event) => {
						onDrag(true, event);
					}}
					on:dragend={(event) => {
						onDrag(false, event);
					}}>
					<img src={svg.src} alt={text.sampleAlt} />
				</a>
			</div>
			<div class="iif-footer-full-content">
				<Layers />
				<WindowAction count={1} />
				<div class="iif-footer-buttons">
					<button
						class="iif-form-button iif-form-button--primary"
						on:click|preventDefault={onSubmit}>
						{text.import}
					</button>

					<button
						class="iif-form-button iif-form-button--secondary"
						on:click|preventDefault={onClear}>
						{text.clear}
					</button>
				</div>
			</div>
		</div>
	{:else if isInvalid}
		<div class="iif-footer-buttons">
			<button
				class="iif-form-button iif-form-button--secondary"
				on:click|preventDefault={onClear}>
				{text.clear}
			</button>
		</div>
	{/if}
</PageContainer>
