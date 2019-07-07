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
const codes = {
	"400": "BadRequest: server refused to process the request",
	"401": "Unauthorised: authentication credentials are invalid",
	"403": "Forbidden: you are not allowed to access this resource",
	"404": "Not Found: the requested resource could not be found",
	"409": "Conflict: the resource already exists",
	"500": "Internal server error. Something's wrong on our side",
	"502": "Bad gateway: failed to reach the API",
	"503": "Service unavailable: the API appears to be overloaded",
	"504": "Gateway timeout: the API it taking too long to respond"
};
export default function processHTTPCode(status) {
	if(status == null) return status;
	let maybeCode = 0;
	try {
		maybeCode = parseInt(status.substring(status.length - 3, status.length));
	}
	catch (e) {
		return status;
	}
	console.log(maybeCode);
	if(isNaN(maybeCode)) return status;

	let resp = codes[maybeCode.toString()];
	console.log(resp);
	if(resp == null) resp = status;
	return resp;
}
