/**
 * Language pack
 *
 * Change import to swap language pack
 */
import { phrases } from '../phrases/en';
export { phrases };

/**
 * Replace text in phrases
 */
export function replacePhrases(search: string, replace: string) {
	function test(list: Record<string, unknown>) {
		for (const key in list) {
			const value = list[key];
			switch (typeof value) {
				case 'string': {
					if (value.indexOf(search) !== -1) {
						const parts = value.split(search);
						list[key] = parts.join(replace);
					}
					break;
				}

				case 'object':
					if (value && !(value instanceof Array)) {
						test(value as Record<string, unknown>);
					}
			}
		}
	}

	test((phrases as unknown) as Record<string, unknown>);
}
