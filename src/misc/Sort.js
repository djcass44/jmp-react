export function sortItems(items, sort) {
	switch (sort) {
		// case 'name':
		// 	return jumps.sort((a, b) => a.localeCompare(b));
		case '-name':
			return items.sort((a, b) => a.name.localeCompare(b.name) * -1);
		case 'usage':
			return items.sort((a, b) => b.metaUsage - a.metaUsage);
		case 'creation':
			return items.sort((a, b) => b.metaCreation - a.metaCreation);
		case 'updated':
			return items.sort((a, b) => b.metaUpdate - a.metaUpdate);
		default:
			return items.sort((a, b) => a.name.localeCompare(b.name));
	}
}