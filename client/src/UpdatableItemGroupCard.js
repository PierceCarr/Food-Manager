import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Card} from "@blueprintjs/core";

class UpdatableItemGroupCard extends Component {
	constructor(props) {
		super(props);

		this.state = {

		}
	}

	render() {
		return;
	}
}

UpdatableItemGroupCard.propTypes = {
	updatableFields: PropTypes.array,
	objectsToUpdate: PropTypes.arrayOf(PropTypes.object),
}

export default UpdatableItemBar;