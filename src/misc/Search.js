import Fuse from "fuse.js";

/**
 * creates a FuseJs object for searching using default parameters
 * @param fields: an array of fields to be used
 * @param items: array of objects to be indexed
 * @returns Fuse
 */
export const createIndex = (fields, items) => {
	const options = {
		shouldSort: true,
		threshold: 0.4,
		keys: fields
	};
	return new Fuse(items, options);
};