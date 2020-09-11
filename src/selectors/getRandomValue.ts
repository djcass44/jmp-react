export default (): number => {
	const array = new Uint32Array(1);
	// @ts-ignore
	(window.crypto || window.msCrypto).getRandomValues(array);
	return array[0];
}
