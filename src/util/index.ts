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

import {Token} from "../types";
import {mdiAccountBadgeOutline, mdiDatabase, mdiGithubCircle, mdiGoogle, mdiShieldAccount} from "@mdi/js";
import {Theme} from "@material-ui/core";

export const clone = (obj: any): any => JSON.parse(JSON.stringify(obj));

export const plural = (count: number, text: string): string => {
	if (count === 1)
		return text;
	else
		return `${text}s`
};

export const getHeaders = (token: Token) => {
	return {
		"Authorization": `Bearer ${token.request}`,
		"X-Auth-Source": token.source
	}
};

export const getProviderData = (theme: Theme) => {
	return {
		ldap: {
			name: "LDAP",
			icon: mdiAccountBadgeOutline,
			colour: theme.palette.success.main
		},
		local: {
			name: "Internal Database",
			icon: mdiDatabase,
			colour: theme.palette.primary.main
		},
		"oauth2/github": {
			name: "GitHub (OAuth2)",
			icon: mdiGithubCircle,
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
		}
	}
};