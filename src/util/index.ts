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
 *
 */

import {mdiAccountOutline, mdiDatabase, mdiGithub, mdiGitlab, mdiGoogle, mdiShieldAccount} from "@mdi/js";
import {Theme} from "@material-ui/core";
import {AuthHeaders, SimpleMap, Token} from "../types";

/**
 * Converts an object to JSON and back
 * Fastest way to clone an object in JS
 */
export const clone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj)) as T;

export const plural = (count: number, text: string): string => {
	if (count === 1)
		return text;
	else
		return `${text}s`;
};

export const getInitials = (str: string): string => {
	let text = str;
	// handle usernames such as oauth2/john.doe
	if (str.includes("/")) {
		text = str.split("/")[1];
	}
	let separator = " ";
	if (!str.includes(" ")) {
		separator = ".";
	}
	return text.split(separator).map(s => s[0].toLocaleUpperCase()).join("");
};

export const getHeaders = (token: Token): AuthHeaders => getHeadersFromRaw(token.request, token.source || null);

export const getHeadersFromRaw = (request: string | null, source: string | null): AuthHeaders => {
	return {
		"Authorization": request ? `Bearer ${request}` : "",
		"X-Auth-Source": source || ""
	};
};

export interface Provider {
	name: string;
	icon: string;
	colour: string;
}

export const getProviderData = (theme: Theme): SimpleMap<Provider> => {
	return {
		ldap: {
			name: "LDAP",
			icon: mdiAccountOutline,
			colour: theme.palette.success.main
		},
		local: {
			name: "Internal Database",
			icon: mdiDatabase,
			colour: theme.palette.primary.main
		},
		"oauth2/github": {
			name: "GitHub (OAuth2)",
			icon: mdiGithub,
			colour: theme.palette.text.secondary
		},
		"oauth2/google": {
			name: "Google (OAuth2)",
			icon: mdiGoogle,
			colour: theme.palette.primary.main
		},
		"oauth2/keycloak": {
			name: "Keycloak (OIDC)",
			icon: mdiShieldAccount,
			colour: "#568bf4"
		},
		"oauth2/gitlab": {
			name: "GitLab (OAuth2)",
			icon: mdiGitlab,
			colour: "#E2432A"
		}
	}
};