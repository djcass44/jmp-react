import React, {useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import {useDispatch, useSelector} from "react-redux";
import {TState} from "../store/reducers";
import {SnackbarState} from "../store/reducers/snackbar";
import {closeSnackbar, removeSnackbar} from "../store/actions/snackbar";

const Snackbar: React.FC = () => {
	// hooks
	const {notify} = useSelector<TState, SnackbarState>(state => state.snackbar);
	const dispatch = useDispatch();
	const {enqueueSnackbar} = useSnackbar();

	// local state
	const [displayed, setDisplayed] = useState<Array<string | number>>([]);

	const storeDisplayed = (id: string | number): void => {
		setDisplayed([...displayed, id]);
	};

	const shouldComponentUpdate = (): boolean => {
		if (!notify.length) {
			setDisplayed([]);
			return false;
		}
		let notExists = false;
		for (let i = 0; i < notify.length; i += 1) {
			const newSnack = notify[i];
			if (newSnack.dismissed) {
				dispatch(closeSnackbar(newSnack.key));
				dispatch(removeSnackbar(newSnack.key));
			}
			notExists = notExists || !notify.filter(({key}) => newSnack.key === key).length;
		}
		return notExists;
	};

	useEffect(() => {
		shouldComponentUpdate();
		notify.forEach(({key, message, options = {}}) => {
			// Do nothing if snackbar is already displayed
			if (displayed.includes(key)) return;
			// Display snackbar using notistack
			enqueueSnackbar(message, {
				...options,
				onClose: (event, reason, k) => {
					if (options.onClose)
						options.onClose(event, reason, k);
					// Dispatch action to remove snackbar from redux store
					k && dispatch(removeSnackbar(k));
				}
			});
			// Keep track of snackbars that we've displayed
			storeDisplayed(key);
		});
	}, [notify]);
	// we don't actually render anything, so just return null
	return null;
};
export default Snackbar;
