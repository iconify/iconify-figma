import type {
	CodeSampleMode,
	CodeSampleTab,
	CodeSampleKey,
} from '@iconify/search-core/lib/code-samples/types';
import type { ComponentCodeOutput } from '@iconify/search-core/lib/code-samples/code';
import type { IconsListMode } from '../components/types';
import type { APIProviderError } from '../provider/add-provider';
import type {
	PluginUINavigationSection,
	PluginUIWindowControls,
} from '../../common/navigation';
import type {
	SelectAfterImport,
	WindowAfterImport,
} from '../../common/options';

export interface UITranslationAddForm {
	title?: string;
	placeholder: string;
	submit: string;
	invalid?: string;
}

export interface UITranslation {
	lang: string;
	search: {
		placeholder: Record<string, string>;
		defaultPlaceholder: string;
		button: string;
	};
	errors: {
		noCollections: string;
		noIconsFound: string;
		defaultError: string;
		custom: Record<string, string>;
	};
	icons: {
		header: {
			full: string;
			more: string;
			modes: Record<IconsListMode, string>;
			select: string;
			swap: string;
		};
		headerWithCount: Record<number, string>;
		tooltip: {
			size: string;
			colorless: string;
			colorful: string;
			char: string;
			length: string;
		};
		more: string;
		moreAsNumber: boolean;
	};
	pagination: {
		prev: string;
		next: string;
	};
	filters: Record<string, string>;
	collectionInfo: {
		total: string;
		height: string;
		author: string;
		license: string;
		palette: string;
		colorless: string;
		colorful: string;
		link: string;
	};
	parent: Record<string, string>;
	collection: {
		by: string;
	};
	footer: {
		iconName: string;
		iconNamePlaceholder: string;
		remove: string;
		select: string;
		about: string;
	};
	footerButtons: Record<string, string>;
	footerBlocks: Record<string, string>;
	figma: {
		menu: Record<PluginUINavigationSection, string>;
		submenu: Record<string, string>;
		window: Record<PluginUIWindowControls, string>;
		minimized: {
			maximize: string;
			close: string;
		};
		windowActionTitle: {
			icon: string;
			icons: string;
		};
		windowAction: Record<WindowAfterImport, string>;
		selectAction: Record<SelectAfterImport, string>;
		layers: {
			title: string;
		};
		optionSections: {
			layout: string;
			import: string;
			drop: string;
			dropIntro: string;
		};
		options: {
			compact: string;
			compactHint: string;
			scroll: string;
			select: string;
			stickyFooter: string;
			customizeDrop: string;
			dropToFrame: string;
		};
		colorPicker: {
			document: string;
			recent: string;
			gray: string;
			figjam: string;
		};
		// Also see src/figma/data/phrases.ts
		notices: {
			failed_icon: string;
			failed_icons: string;
		};
	};
	svg: {
		text: string;
		subtext: string;
		sample: string;
		sampleAlt: string;
		import: string;
		clear: string;
		// Errors
		invalid: string;
		foreignObject: string;
		font: string;
		animated: string;
	};
}
