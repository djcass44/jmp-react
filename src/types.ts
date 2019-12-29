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
}

export interface Alias {
	id?: number | null;
	name: string;
}

export interface User {
	username: string;
	displayName?: string;
	avatarUrl?: string;
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