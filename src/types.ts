/*
 *    Copyright 2019 Django Cass
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

export interface Jump {
	id: number;
	name: string;
	location: string;
	title?: string;
	image?: string;
	public: boolean;
	owner?: User | null;
	ownerGroup?: Group | null;
	alias: Array<Alias>;
	meta: Meta;
	usage: number;
}

export interface Meta {
	id: number;
	created: number;
	edited: number;
	createdBy: string;
	editedBy: string
}

export interface Alias {
	id?: number | null;
	name: string;
}

export interface User {
	id: string;
	username: string;
	displayName?: string;
	avatarUrl?: string;
	admin: boolean;
	source: string;
}

export interface Group {
	id: string;
	name: string;
	source: string;
	public: boolean;
	defaultFor?: string | null;
}

export interface ValidatedData {
	value: string;
	error: string;
	regex: RegExp;
}

export interface Page<T> {
	content: Array<T>;
	size: number; // page size
	number: number; // page count
	totalElements: number; // total items
	numberOfElements: number; // elements on page
}

export interface FaviconPayload {
	id: number;
	url: string;
}

export interface AuthHeaders {
	Authorization: string | null;
	"X-Auth-Source"?: string | null;
}

export interface Token {
	request: string;
	refresh: string;
	source?: string | null;
}

export interface BasicAuth {
	username: string;
	password: string;
}

export interface Pair<K, V> {
	first: K;
	second: V;
}

export interface Action {
	type: string;
	payload?: any | null;
}