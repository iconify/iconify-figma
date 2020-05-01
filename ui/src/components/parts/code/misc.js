export function camelCase(iconName) {
	let name = '';
	let parts = iconName.split('-');
	parts.forEach(function (part, index) {
		name += index ? part.slice(0, 1).toUpperCase() + part.slice(1) : part;
	});
	if (name.charCodeAt(0) < 97 || name.charCodeAt(0) > 122) {
		// Not a-z - add "icon" at start
		name = 'icon' + name.slice(0, 1).toUpperCase() + name.slice(1);
	} else if (parts.length < 2) {
		// Add "Icon" to avoid reserved keywords
		name += 'Icon';
	}
	return name;
}
