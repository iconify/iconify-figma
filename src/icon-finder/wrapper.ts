import {
	getIcon,
	addCollection,
	_api,
	addAPIProvider,
	disableCache,
} from '@iconify/svelte';
import type { SvelteComponent } from 'svelte';
import { get } from 'svelte/store';
import {
	setIconify,
	compareObjects,
	stringToIcon,
	validateIcon,
	customisedConfig,
	IconFinderCore,
	setComponentsConfig,
	objectToRoute,
	iconToString,
} from '@iconify/search-core';
import type {
	Icon,
	PartialRoute,
	IconFinderCoreParams,
	RouterEvent,
	CoreIconifyFunctions,
} from '@iconify/search-core';
import type {
	IconCustomisations,
	PartialIconCustomisations,
} from '@iconify/search-core/lib/misc/customisations';
import {
	defaultCustomisations,
	filterCustomisations,
	mergeCustomisations,
} from '@iconify/search-core/lib/misc/customisations';
import type { IconFinderWrapperParams } from './wrapper/params';
import type { IconFinderRouteType, IconFinderState } from './wrapper/state';
import type { WrapperStatus } from './wrapper/status';
import type { IconFinderEvent } from './wrapper/events';
import type {
	UIEvent,
	UICustomisationEvent,
	UIFooterButtonEvent,
	UISelectionEvent,
	UIDeleteIconEvent,
	UIWindowEvent,
	UIImportSVGEvent,
} from './events/types';
import type { WrappedRegistry } from './wrapper/registry';
import type { ContainerProps } from './wrapper/container';
import { defaultComponentsConfig } from './config/wrapper';
import type { SelectedIcons, SelectIcon } from './wrapper/icons';
import {
	addToSelection,
	removeFromSelection,
	isIconSelected,
	selectionToArray,
} from './wrapper/icons';
import { addCustomAPIProviders } from './config/api';
import {
	getDragMessage,
	OnDragParams,
	WrapperDragStartData,
} from './figma/drag';
import { importThemeIcons } from './config/theme';
import { defaultNavigation, isIconFinderNavigation } from './figma/navigation';
import type { PluginUINavigation } from '../common/navigation';
import {
	customIconsData,
	iconListsStorage,
	updateCustomIcons,
} from './figma/icon-lists';
import type { IconListType } from '../common/icon-lists';
import { sendMessageToFigma } from './figma/messages';
import { getOptions, setOptions } from './figma/options';
import { defaultPluginOptions } from '../common/options';

// Change import to change container component
import Container from './components/Container.svelte';
import { pluginUIEnv } from './figma/env';

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-unused-vars-experimental, @typescript-eslint/no-empty-function
function assertNever(s: never) {}

// Set SVG framework
// getVersion() will will use hardcoded version number generated when building core
const functions: Omit<Required<CoreIconifyFunctions>, 'getVersion'> = {
	getIcon,
	addCollection,
	getAPI: _api.getAPI,
	addAPIProvider,
};
setIconify(functions);

// Import theme icons
importThemeIcons();

// Add components configuration to config object
setComponentsConfig(defaultComponentsConfig);

/**
 * Wrapper class
 */
export class Wrapper {
	// Parameters
	protected _params: IconFinderWrapperParams;

	// Current state, always up to date
	protected _state: IconFinderState = {
		navigation: defaultNavigation,
		icons: [],
		currentRouteType: 'iconify',
		routes: Object.create(null),
		customisations: {},
		minimized: false,
	};

	// Selected icons as nested object
	protected _selection: SelectedIcons = Object.create(null);

	// Number of selected icons
	protected _selectionLength: number = 0;

	// Status
	protected _status: WrapperStatus = 'loading';

	// Core instance and registry
	protected readonly _core: IconFinderCore;
	protected readonly _registry: WrappedRegistry;

	// Container component, added on first render
	protected _container: SvelteComponent | null = null;

	// Drag/drop data
	protected _dragging: WrapperDragStartData | null = null;

	/**
	 * Constructor
	 */
	constructor(params: IconFinderWrapperParams) {
		this._params = params;
		let customState = params.state;

		// Set core parameters
		const coreParams: IconFinderCoreParams = {
			callback: this._coreCallback.bind(this),
		};
		if (customState && customState.config) {
			coreParams.config = customState.config;
		}
		if (params.iconSets) {
			coreParams.iconSets =
				params.iconSets instanceof Array
					? {
							iconSets: params.iconSets,
					  }
					: params.iconSets;

			// console.log('Params.iconSets:', coreParams.iconSets);
		}

		// Disable Iconify cache
		disableCache('all');

		// Init core
		const core = (this._core = new IconFinderCore(coreParams));
		const registry = (this._registry = core.registry as WrappedRegistry);

		// Callback
		registry.setCustom('callback', this._internalCallback.bind(this));

		// External link callback
		registry.setCustom('link', this._externalLinkCallback.bind(this));

		// Navigation
		registry.setCustom('navigate', this.navigate.bind(this));

		// Custom icons
		const events = registry.events;
		for (let iconsListType in customIconsData) {
			const key = iconsListType as IconListType;

			// Set data on demand
			events.subscribe('load-' + key, (callback) => {
				if (typeof callback === 'function') {
					const iconsList = customIconsData[key];
					callback(iconsList);
				}
			});

			// Update data when it changes
			iconListsStorage[key].subscribe((value) => {
				if (this._state.currentRouteType === key) {
					core.router.action('set', value);
				}
			});
		}

		// Add API providers
		addCustomAPIProviders(registry);

		// Set initial state
		const state = this._state;
		state.config = customisedConfig(registry.config);

		// Store partial route in state
		const route = registry.partialRoute;
		if (route) {
			state.routes[state.currentRouteType] = route;
		}

		// Check command
		switch (params.command) {
			case 'replace':
			case 'code': {
				// Select icon
				const selection = get(pluginUIEnv.layers);
				if (selection.icon) {
					const data = selection.icon.data;
					const icon = stringToIcon(data.name);
					if (icon) {
						// Valid icon: select it and copy data
						if (!customState) {
							customState = {};
						}
						customState.icons = [icon];

						// Set customisations
						if (data.props) {
							customState.customisations = data.props;
						}

						// Set route
						if (data.route) {
							if (!customState.routes) {
								customState.routes = Object.create(null);
							}
							customState.routes!.iconify = data.route;
						}
					}
				}
			}
		}

		if (customState) {
			// console.log('customState:', JSON.stringify(customState, null, 4));
			// Set custom stuff
			if (customState.icons) {
				customState.icons.forEach((icon) => {
					let iconValue: Icon | null =
						typeof icon === 'string' ? stringToIcon(icon) : icon;
					if (validateIcon(iconValue)) {
						addToSelection(this._selection, iconValue!);
					}
				});
				state.icons = selectionToArray(this._selection);
				this._selectionLength = state.icons.length;
			}
			if (customState.customisations) {
				state.customisations = customState.customisations;
			}

			if (customState.routes) {
				// Copy routes
				const routes = customState.routes;
				const currentRouteType = state.currentRouteType;
				for (const key in routes) {
					const attr = key as keyof typeof routes;
					const route = routes[attr];
					if (route) {
						if (attr === currentRouteType) {
							setTimeout(() => {
								// Set on next tick
								if (state.currentRouteType === attr) {
									registry.partialRoute = route;
								} else {
									state.routes[attr] = route;
								}
							});
						} else {
							state.routes[attr] = route;
						}
					}
				}
			}

			// Minimize window on start?
			// if (customState.minimized) {
			// 	state.minimized = customState.minimized;
			// }
		}

		// Add onDrag callback
		registry.setCustom('ondrag', this._onDrag.bind(this));

		// Toggle classes for window
		this._updatePluginWindow();
	}

	/**
	 * Get container status
	 */
	getStatus(): WrapperStatus {
		return this._status;
	}

	/**
	 * Get current state
	 */
	getState(): IconFinderState {
		return this._state;
	}

	/**
	 * Hide or destroy
	 */
	_hide(newStatus: WrapperStatus) {
		switch (this._status) {
			case 'hidden':
			case 'destroyed':
				// Cannot hide
				return;

			case 'loading':
			case '':
				// Hide
				break;

			default:
				assertNever(this._status);
		}

		this._status = newStatus;
		if (this._container) {
			this._container.$set({
				hidden: true,
			});
		}
	}

	/**
	 * Hide
	 */
	hide(): void {
		this._hide('hidden');
	}

	/**
	 * Destroy
	 */
	destroy(): void {
		if (this._status !== 'destroyed') {
			this._hide('destroyed');
			this._container = null;
			this._registry.destroy();
		}
	}

	/**
	 * Show
	 */
	show(): void {
		switch (this._status) {
			// Cannot show or loading
			case 'destroyed':
			// Already visible or loading
			case 'loading':
			case '':
				return;

			case 'hidden':
				// Show
				break;

			default:
				assertNever(this._status);
		}

		this._status = '';
		if (this._container) {
			this._container.$set({
				hidden: false,
			});
		}
	}

	/**
	 * Create Container component
	 */
	_initContainer(data: RouterEvent): SvelteComponent {
		const state = this._state;

		// Check if container should be visible
		let hidden = false;
		switch (this._status) {
			case 'hidden':
			case 'destroyed':
				hidden = true;

			case '':
			case 'loading':
				break;

			default:
				assertNever(this._status);
		}

		// Properties
		const props: ContainerProps = {
			// From RouterEvent
			viewChanged: data.viewChanged,
			error: data.error,
			blocks: data.blocks,

			// Convert to full route
			route: data.route ? objectToRoute(data.route) : null,

			// Selected icons
			selection: this._selection,
			selectionLength: this._selectionLength,

			// Full icon customisations
			customisations: mergeCustomisations(
				defaultCustomisations,
				state.customisations ? state.customisations : {}
			),

			// Registry
			registry: this._core.registry as WrappedRegistry,

			// Status
			hidden,

			// Navigation
			currentPage: state.navigation,
		};

		// Constructor parameters
		const params = {
			target: this._params.container,
			props,
		};

		return new Container(params);
	}

	/**
	 * Trigger event
	 */
	_triggerEvent(event: IconFinderEvent): void {
		if (this._status !== 'destroyed' && this._params.callback) {
			this._params.callback(event);
		}
	}

	/**
	 * Callback from core
	 */
	_coreCallback(data: RouterEvent): void {
		if (!this._container) {
			// Create new container on first render
			this._container = this._initContainer(data);

			// Mark as loaded
			if (this._status === 'loading') {
				this._status = '';
				this._triggerEvent({
					type: 'load',
				});
			}

			// Save route
			if (data.route) {
				this._setRoute(data.route);
			}
			return;
		}

		// Update container
		const container = this._container;

		// Convert partial route to full route.
		// Use full route in components, partial route in state and callback
		const partialRoute = data.route;
		const fullRoute = partialRoute ? objectToRoute(partialRoute) : null;
		data.route = fullRoute;

		// Check for changes
		if (
			data.viewChanged ||
			!compareObjects(data.route, container.$$.props.route)
		) {
			// Change everything
			container.$set(data);

			// Save route
			if (partialRoute) {
				this._setRoute(partialRoute);
			}
		} else {
			// Route is the same, so if error has changed, only error and blocks need update
			if (data.error === '' || data.error !== container.$$.props.error) {
				container.$set({
					error: data.error,
					blocks: data.blocks,
				});
			}
		}
	}

	/**
	 * Select icon
	 */
	_internalCallback(event: UIEvent): void {
		// console.log('Internal event:', event);

		let icon: Icon | null;
		let selectionEvent: UISelectionEvent;

		const type = event.type;
		switch (type) {
			case 'selection':
				// Selected icon changed: trigger event and update container (this event does not automatically update container)
				selectionEvent = event as UISelectionEvent;
				if (typeof selectionEvent.icon === 'string') {
					icon = stringToIcon(selectionEvent.icon);
				} else {
					icon = selectionEvent.icon;
				}
				this._selectIcon(
					icon,
					typeof selectionEvent.selected === 'boolean'
						? selectionEvent.selected
						: 'force',
					true
				);
				return;

			case 'customisation':
				// Customisation was clicked: trigger event
				this._setCustomisations(
					(event as UICustomisationEvent).customisations
				);
				return;

			case 'button':
				// Button was clicked: trigger event
				this._triggerEvent({
					type: 'button',
					button: (event as UIFooterButtonEvent).button,
					state: this._state,
				});
				return;

			case 'config':
				// Configuration changed: trigger event
				this._state.config = customisedConfig(this._registry.config);
				this._triggerEvent({
					type: 'config',
					config: this._state.config,
				});
				return;

			case 'delete': {
				// Delete icon in custom view
				const customType = (event as UIDeleteIconEvent)
					.customType as IconListType;
				const icon = (event as UIDeleteIconEvent).icon;

				// Filter
				const icons = customIconsData[customType].filter(
					(item) => item !== icon
				);

				// Update list
				this._updateCustomIconsList(customType, icons);
				return;
			}

			case 'window': {
				// Window control clicked
				const e = event as UIWindowEvent;

				switch (e.control) {
					case 'compact': {
						// Toggle compact layout
						setOptions({
							compactWidth: !getOptions().compactWidth,
						});
						break;
					}

					case 'minimize': {
						// Minimize window
						const state = this._state;
						state.minimized = !state.minimized;
						sendMessageToFigma({
							type: 'minimize',
							minimized: state.minimized,
						});
						break;
					}
				}

				this._updatePluginWindow();
				return;
			}

			case 'import-svg': {
				// Forward event to index
				this._triggerEvent(event as UIImportSVGEvent);
				return;
			}

			default:
				// Should never reach this code
				assertNever(type);
		}
	}

	/**
	 * Update custom icons list
	 */
	_updateCustomIconsList(storage: IconListType, icons: string[]) {
		// Update storage
		updateCustomIcons(storage, icons);

		// Update Figma
		sendMessageToFigma({
			type: 'custom-icons',
			storage,
			icons,
		});

		// Change route or update view
		if (!icons.length) {
			// Return to import
			this.navigate({
				section: 'import',
				submenu: 'iconify',
			});
		} else {
			this._core.router.action('set', icons);
		}
	}

	/**
	 * External link was clicked
	 */
	_externalLinkCallback(event: MouseEvent): void {
		if (event && event.target) {
			const target = event.target as HTMLLinkElement;
			const href = target.getAttribute('href');
			if (typeof href === 'string') {
				this._triggerEvent({
					type: 'link',
					href,
					event,
				});
			}
		}
	}

	/**
	 * Set route
	 */
	_setRoute(route: PartialRoute, routeType?: IconFinderRouteType): boolean {
		const state = this._state;
		const routes = state.routes;

		if (!routeType) {
			routeType = state.currentRouteType;
		}

		// Check if route has changed
		if (
			routes[routeType] === void 0 ||
			!compareObjects(route, routes[routeType])
		) {
			routes[routeType] = route;
			if (routeType === 'iconify') {
				// Send message only for iconify route
				this._triggerEvent({
					type: 'route',
					route,
				});
			}

			return true;
		}
		return false;
	}

	/**
	 * Set route
	 */
	setRoute(route: PartialRoute | null, routeType?: IconFinderRouteType) {
		if (this._status === 'destroyed') {
			return;
		}

		const state = this._state;
		if (!routeType) {
			routeType = state.currentRouteType;
		}

		if (routeType === state.currentRouteType) {
			const router = this._core.router;
			function loadRoute() {
				router.partialRoute = route;
			}

			if (!this._container) {
				// Load on next tick
				setTimeout(loadRoute);
			} else {
				loadRoute();
			}
		} else if (route) {
			state.routes[routeType] = route;
		}
	}

	/**
	 * Select icon
	 */
	_selectIcon(
		icon: Icon | null,
		select: SelectIcon,
		updateContainer: boolean
	): boolean {
		const state = this._state;

		const done = () => {
			this._selectionLength = state.icons.length;
			if (updateContainer && this._container) {
				const update: Partial<ContainerProps> = {
					selection: this._selection,
					selectionLength: this._selectionLength,
				};
				this._container.$set(update);
			}
			this._triggerEvent({
				type: 'selection',
				icons: state.icons,
			});
		};

		if (!icon) {
			// De-select everything?
			if (select === true || state.icons.length !== 1) {
				return false;
			}

			// Reset selection
			this._selection = Object.create(null);
			state.icons = [];
			done();
			return true;
		}

		// Check if icon is selected
		const selected: boolean =
			!!this._selectionLength && isIconSelected(this._selection, icon);
		if (selected === select || (selected && select === 'force')) {
			return false;
		}

		if (
			(!selected && select === 'force') ||
			!this._registry.config.components.multiSelect
		) {
			// Clear selection if multiple icons cannot be selected and icon is not selected
			this._selection = Object.create(null);
		}

		// Toggle icon
		if (selected) {
			removeFromSelection(this._selection, icon);
		} else {
			addToSelection(this._selection, icon);
		}

		// Update stuff
		state.icons = selectionToArray(this._selection);
		done();

		// Reset customisations for multiple icons
		if (state.icons.length > 1) {
			let changed = false;
			const customisations = mergeCustomisations(
				defaultCustomisations,
				state.customisations
			);
			if (customisations.inline) {
				customisations.inline = false;
				changed = true;
			}
			if (changed) {
				this._setCustomisations(customisations);
			}
		}

		return true;
	}

	/**
	 * Select icon(s)
	 */
	selectIcons(icons: (Icon | string)[] | null): void {
		if (this._status === 'destroyed') {
			return;
		}

		const state = this._state;

		// Reset icons
		this._selection = Object.create(null);
		const selection = this._selection;

		// Add all icons (only last icon if multiple icons cannot be selected)
		if (icons) {
			(this._registry.config.components.multiSelect
				? icons
				: icons.slice(-1)
			).forEach((icon) => {
				const converted =
					typeof icon === 'string' ? stringToIcon(icon) : icon;
				if (converted) {
					addToSelection(selection, converted);
				}
			});
		}

		// Update variables
		state.icons = selectionToArray(selection);
		this._selectionLength = state.icons.length;

		// Update container
		if (this._container) {
			const update: Partial<ContainerProps> = {
				selection: selection,
				selectionLength: this._selectionLength,
			};
			this._container.$set(update);
		}

		// Trigger event
		this._triggerEvent({
			type: 'selection',
			icons: state.icons,
		});
	}

	/**
	 * Change customisations
	 */
	_setCustomisations(customisations: IconCustomisations): boolean {
		const state = this._state;
		if (
			state.customisations !== void 0 &&
			compareObjects(state.customisations, customisations)
		) {
			return false;
		}

		// Save partial customisations in state
		state.customisations = filterCustomisations(customisations);

		// Update container
		if (this._container) {
			this._container.$set({
				customisations,
			});
		} else {
			if (!this._params.state) {
				this._params.state = {};
			}
			this._params.state.customisations = customisations;
		}

		// Trigger evemt
		this._triggerEvent({
			type: 'customisations',
			customisations,
		});
		return true;
	}

	/**
	 * Change customisations
	 */
	setCustomisations(customisations: PartialIconCustomisations): void {
		if (this._status === 'destroyed') {
			return;
		}

		this._setCustomisations(
			mergeCustomisations(defaultCustomisations, customisations)
		);
	}

	/**
	 * Drag event
	 */
	_onDrag(start: boolean, event: DragEvent, item: OnDragParams) {
		// Start dragging
		if (start) {
			try {
				const rect = (event.target as Element).getBoundingClientRect();
				this._dragging = {
					...item,
					diff: {
						x:
							rect.width / 2 -
							event.offsetX +
							(item.offset ? item.offset.x : 0),
						y:
							rect.height / 2 -
							event.offsetY +
							(item.offset ? item.offset.y : 0),
					},
					min: {
						x: event.screenX - event.clientX,
						y: event.screenY - event.clientY,
					},
					max: {
						x: event.screenX - event.clientX + window.innerWidth,
						y: event.screenY - event.clientY + window.innerHeight,
					},
				};
				/*
				console.log(
					'_dragging = ',
					JSON.stringify(this._dragging, null, 4)
				);
				*/
			} catch (err) {}
			return;
		}

		// End dragging
		if (!this._dragging) {
			return;
		}

		// Copy, reset and validate data
		const data = this._dragging;
		this._dragging = null;

		const currentItem = item.icon ? iconToString(item.icon) : item.item;
		const oldItem = data.icon ? iconToString(data.icon) : data.item;
		if (currentItem !== oldItem) {
			// Wrong icon or SVG
			this._dragging = null;
			return;
		}

		// Check if mouse event is inside plugin window
		if (
			event.screenX > data.min.x &&
			event.screenX < data.max.x &&
			event.screenY > data.min.y &&
			event.screenY < data.max.y
		) {
			// console.log('Dropped inside window');
			return;
		}

		// Get import message
		const message = getDragMessage(data, this._state.customisations, event);
		if (message) {
			sendMessageToFigma(message);
		}
	}

	/**
	 * Change current page
	 */
	navigate(navigation: PluginUINavigation) {
		const state = this._state;
		if (
			state.navigation.section === navigation.section &&
			state.navigation.submenu === navigation.submenu
		) {
			return;
		}

		// Reset options
		if (navigation.submenu === 'reset') {
			// Default navigation
			navigation = {
				section: 'import',
				submenu: 'iconify',
			};

			// Default route
			state.routes.iconify = {
				type: 'collections',
			};

			// Default customisations
			this.setCustomisations({});

			// Selection
			this.selectIcons([]);

			// Default options
			setOptions(defaultPluginOptions);
		}

		// Set navigation in state
		state.navigation = navigation;

		// Update route
		let newRoute: PartialRoute | undefined;
		const routeType = isIconFinderNavigation(navigation);

		switch (routeType) {
			case 'iconify':
				newRoute = state.routes.iconify
					? state.routes.iconify
					: {
							type: 'collections',
					  };
				this._setRoute(newRoute);
				break;

			case 'bookmarks':
			case 'recent':
				newRoute = {
					type: 'custom',
					params: {
						customType: routeType,
					},
				};
				break;

			case false:
				break;

			default:
				assertNever(routeType);
		}

		// Change current page
		if (this._container) {
			const changes: Partial<ContainerProps> = {
				currentPage: navigation,
			};
			if (routeType) {
				this._state.currentRouteType = routeType;
			}
			if (newRoute) {
				this._core.router.partialRoute = newRoute;
			}
			this._container.$set(changes);
		} else {
			if (!this._params.state) {
				this._params.state = {};
			}
			const customState = this._params.state;
			customState.navigation = navigation;
			if (newRoute && routeType) {
				if (!customState.routes) {
					customState.routes = Object.create(null);
				}
				customState.currentRouteType = routeType;
				customState.routes![routeType] = newRoute;
			}
		}

		// Trigger event
		this._triggerEvent({
			type: 'navigation',
			navigation,
		});
	}

	/**
	 * Check if current page is Icon Finder main page
	 */
	isIconFinderMainPage(navigation?: PluginUINavigation): boolean {
		return (
			isIconFinderNavigation(
				navigation ? navigation : this._state.navigation
			) === 'iconify'
		);
	}

	/**
	 * Update plugin window
	 */
	_updatePluginWindow() {
		const compact = getOptions().compactWidth;
		const minimized = this._state.minimized;
		const container = document.body;

		container.classList[compact ? 'add' : 'remove']('plugin-compact');
		container.classList[compact ? 'remove' : 'add']('plugin-full');
		container.classList[minimized ? 'add' : 'remove']('plugin-minimized');
	}

	/**
	 * Minimize window, message from plugin
	 */
	minimizeFromPlugin(value: boolean) {
		const state = this._state;
		if (state.minimized !== value) {
			state.minimized = value;
			this._updatePluginWindow();
		}
	}
}
