/*
 *    Copyright 2020 Django Cass
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

import {Button, LinearProgress, Theme, Typography, useTheme} from "@material-ui/core";
import React, {useEffect} from "react";
import {U2F_CHALLENGE, u2fChallenge} from "../../../../store/actions/settings/general/GetU2FChallenge";
import {useDispatch, useSelector} from "react-redux";
import {TState} from "../../../../store/reducers";
import {AuthState} from "../../../../store/reducers/auth";
import {MiscState} from "../../../../store/reducers/misc";
import {u2fCreateResponse} from "../../../../store/actions/settings/general/U2FCreateResponse";
import {u2FStatus} from "../../../../store/actions/settings/general/GetU2FStatus";
import {u2fChallengeFailure} from "../../../../store/actions/settings/general";

var WebAuthHelpers = require("webauth-helpers");

const Security: React.FC = () => {
	const dispatch = useDispatch();
	const theme = useTheme<Theme>();

	// @ts-ignore
	const loading = useSelector<TState, boolean>(state => state.loading[U2F_CHALLENGE] ?? false);
	const {headers, userProfile} = useSelector<TState, AuthState>(state => state.auth);
	const {publicKey, status} = useSelector<TState, MiscState>(state => state.misc);

	useEffect(() => {
		u2FStatus(dispatch, headers);
	}, [headers, dispatch]);

	useEffect(() => {
		if (publicKey == null)
			return;
		// @ts-ignore
		const decodedPublicKey = WebAuthHelpers.formatRequest(publicKey);
		console.dir(decodedPublicKey);
		// @ts-ignore
		navigator.credentials.create({publicKey: decodedPublicKey}).then((creds: PublicKeyCredential) => {
			if (creds == null)
				return;
			const safeCreds = WebAuthHelpers.formatResponse(creds);
			// patch the field names to be what Java is expecting
			safeCreds.clientExtensionResults = safeCreds.getClientExtensionResults;
			safeCreds.getClientExtensionResults = undefined;
			safeCreds.rawId = undefined;
			u2fCreateResponse(dispatch, headers, safeCreds);
		}).catch((err: Error) => {
			u2fChallengeFailure(dispatch, err);
		});
	}, [dispatch, headers, publicKey]);

	const onEnable = () => {
		u2fChallenge(dispatch, headers);
	};

	return (<div>
		<Typography>Universal 2nd Factor authentication (U2F)</Typography>
		{userProfile?.provided ? <div>
				<Typography color="error">U2F is not available for federated identities.</Typography>
			</div>
			:
			<div>
				<Typography
					style={{color: status ? theme.palette.success.main : theme.palette.error.main}}>{status ? "Enabled" : "Disabled"}</Typography>
				{!status &&
				<Button disabled={loading} variant="text" color="primary" onClick={() => onEnable()}>Enable</Button>}
			</div>}
		{loading && <LinearProgress/>}
	</div>);
};

export default Security;
