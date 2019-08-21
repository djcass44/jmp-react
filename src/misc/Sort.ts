export function sortItems(items: Array<any>, sort: string) {
	switch (sort) {
		case '-name':
			return items.sort((a, b) => {
				if(a.name != null)
					return a.name.localeCompare(b.name) * -1;
				else if(a.username != null)
					return a.username.localeCompare(b.username) * -1;
				else return a;
			});
		case 'usage':
			return items.sort((a, b) => b.metaUsage - a.metaUsage);
		case 'creation':
			return items.sort((a, b) => b.metaCreation - a.metaCreation);
		case 'updated':
			return items.sort((a, b) => b.metaUpdate - a.metaUpdate);
		default:
			return items.sort((a, b) => {
				if(a.name != null)
					return a.name.localeCompare(b.name);
				else if(a.username != null)
					return a.username.localeCompare(b.username);
				else return a;
			});
	}
}

export interface Sort {
	id: string,
	value: string
}

export const defaultSorts = new Array<Sort>(
	{id: 'name', value: "Name"},
	{id: '-name', value: "Name Desc"},
	{id: 'creation', value: "Creation"},
	{id: 'updated', value: "Last edited"}
);
