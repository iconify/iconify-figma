import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import type { IconListType, IconListData } from '../../common/icon-lists';

/**
 * Lists
 */
export const customIconsData: Record<IconListType, IconListData> = {
	recent: [],
	bookmarks: [],
};

export const iconListsStorage: Record<IconListType, Writable<IconListData>> = {
	recent: writable(customIconsData.recent),
	bookmarks: writable(customIconsData.bookmarks),
};

/**
 * Update data
 */
export function updateCustomIcons(list: IconListType, icons: IconListData) {
	iconListsStorage[list].set((customIconsData[list] = icons));
}
