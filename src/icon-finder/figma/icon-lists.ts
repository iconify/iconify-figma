import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import type { IconListType, IconListData } from '../../common/icon-lists';

/**
 * Create store, set default value
 */
export const iconLists: Record<IconListType, Writable<IconListData>> = {
	recent: writable([]),
	bookmarks: writable([]),
};
