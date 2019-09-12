export default () => {
	const array = new Uint32Array(1);
	(window.crypto || window.msCrypto).getRandomValues(array);
	return array[0];
}