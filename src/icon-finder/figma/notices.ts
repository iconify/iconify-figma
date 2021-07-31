import { writable, Writable } from 'svelte/store';
import type { UINotice, UINoticeLayout } from '../../common/messages';

/**
 * Delay for visible notices, should match css entries
 *
 * Also see _notices.scss
 */
const noticeDelay: Record<UINoticeLayout, number> = {
	error: 10000,
	warning: 10000,
	success: 3000,
};

/**
 * Notices interface
 */
export interface UINoticeWithTimer extends UINotice {
	counter: number;
	start: number;
	end: number;
}

/**
 * Data
 */
let counter = 0;
let noticesList: UINoticeWithTimer[] = [];
export const notices: Writable<UINoticeWithTimer[]> = writable(noticesList);

/**
 * Clean up
 */
const timers: Set<number> = new Set();
function cleanup() {
	const time = Date.now();
	const oldLength = noticesList.length;

	noticesList = noticesList.filter((item) => item.end > time);
	if (noticesList.length !== oldLength) {
		notices.set(noticesList);
	}
}

/**
 * Functions to add notice (also cleans up old notices)
 */
export function addNotice(notice: UINotice | UINotice[]) {
	const start = Date.now();
	const delays: Set<number> = new Set();

	const newNotices: UINoticeWithTimer[] = (notice instanceof Array
		? notice
		: [notice]
	).map((item) => {
		const delay = noticeDelay[item.layout];
		const end = start + delay;

		counter++;
		delays.add(delay);

		const result: UINoticeWithTimer = {
			...item,
			counter,
			start,
			end,
		};
		return result;
	});

	// Remove outdated notices and add new notices
	noticesList = noticesList.concat(newNotices);
	notices.set(noticesList);

	// Set timers for cleanup
	delays.forEach((delay) => {
		const timer = setTimeout(() => {
			timers.delete(timer);
			cleanup();
		}, delay + 100);
		timers.add(timer);
	});
}

/**
 * Remove all notices
 */
export function removeNotices() {
	noticesList = [];
	notices.set(noticesList);
	Array.from(timers).forEach((timer) => {
		timers.delete(timer);
		clearTimeout(timer);
	});
}
