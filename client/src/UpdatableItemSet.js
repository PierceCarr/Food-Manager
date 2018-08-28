import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Card} from "@blueprintjs/core";

class UpdatableItemSet extends Component {
	constructor(props) {
		super(props);

		this.state = {

		}
	}

	render() {
		const set =
		<Card>
			{this.props.setName}
		</Card>
		return set;
	}
}

UpdatableItemSet.propTypes = {
	// objectsToUpdate: PropTypes.arrayOf(PropTypes.object),
	setName: PropTypes.string,
	// updatableFields: PropTypes.array,
}

export default UpdatableItemSet;