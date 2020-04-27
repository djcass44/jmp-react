import React, {useEffect} from "react";
import {withSnackbar} from "notistack";
import {useDispatch, useSelector} from "react-redux";
import PropTypes from "prop-types";
import {closeSnackbar, removeSnackbar} from "../actions/Snackbar";

const Snackbar = (props) => {

	const notify = useSelector(state => state.snackbar.notify);
	const dispatch = useDispatch();

	let displayed = [];
	const storeDisplayed = (id) => {
		displayed = [...displayed, id];
	};

	const shouldComponentUpdate = ({notify: newSnacks = []}) => {
		if (!newSnacks.length) {
			displayed = [];
			return false;
		}
		let notExists = false;
		for (let i = 0; i < newSnacks.length; i += 1) {
			const newSnack = newSnacks[i];
			if (newSnack.dismissed) {
				dispatch(closeSnackbar(newSnack.key));
				dispatch(removeSnackbar(newSnack.key));
			}
			notExists = notExists || !notify.filter(({key}) => newSnack.key === key).length;
		}
		return notExists;
	};

	useEffect(() => {
		notify.forEach(({key, message, options = {}}) => {
			// Do nothing if snackbar is already displayed
			if (displayed.includes(key)) return;
			// Display snackbar using notistack
			props.enqueueSnackbar(message, {
				...options,
				onClose: (event, reason, k) => {
					if (options.onClose)
						options.onClose(event, reason, k);
					// Dispatch action to remove snackbar from redux store
					dispatch(removeSnackbar(k));
				}
			});
			// Keep track of snackbars that we've displayed
			storeDisplayed(key);
		});
	}, [dispatch, displayed, notify, props, shouldComponentUpdate, storeDisplayed]);
	// we don't actually render anything, so just return null
	return React.Fragment;
};
Snackbar.propTypes = {
	notify: PropTypes.array
};
Snackbar.defaultProps = {
	notify: []
};

export default withSnackbar(Snackbar);
