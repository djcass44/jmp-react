export default providers => {
	let count = 0;
	Object.entries(providers).forEach(([k, v]) => {
		if (v === true)
			count++;
	});
	return count;
}