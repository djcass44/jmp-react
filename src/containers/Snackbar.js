import React, {useEffect} from "react";
import {bindActionCreators} from "redux";
import {removeSnackbar} from "../actions/Snackbar";
import {withSnackbar} from "notistack";
import {connect} from "react-redux";
import PropTypes from "prop-types";

const Snackbar = (props) => {
	let displayed = [];

	const storeDisplayed = (id) => {
		displayed = [...displayed, id];
	};

	const shouldComponentUpdate = ({notify: newSnacks = []}) => {
		if (!newSnacks.length) {
			displayed = [];
			return false;
		}

		const {notify: currentSnacks} = props;
		let notExists = false;
		for (let i = 0; i < newSnacks.length; i += 1) {
			const newSnack = newSnacks[i];
			if (newSnack.dismissed) {
				props.closeSnackbar(newSnack.key);
				props.removeSnackbar(newSnack.key);
			}
			notExists = notExists || !currentSnacks.filter(({ key }) => newSnack.key === key).length;
		}
		return notExists;
	};

	useEffect(() => {
		const {notify = []} = props;
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
					props.removeSnackbar(k);
				}
			});
			// Keep track of snackbars that we've displayed
			storeDisplayed(key);
		});
	}, [shouldComponentUpdate]);
	// we don't actually render anything, so just return null
	return null;
};
Snackbar.propTypes = {
	notify: PropTypes.array
};
Snackbar.defaultProps = {
	notify: []
};
const mapStateToProps = store => ({
	notify: store.snackbar.notify,
});

const mapDispatchToProps = dispatch => bindActionCreators({removeSnackbar}, dispatch);

export default withSnackbar(connect(
	mapStateToProps,
	mapDispatchToProps,
)(Snackbar));
