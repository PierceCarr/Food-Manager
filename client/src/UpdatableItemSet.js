import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Card} from "@blueprintjs/core";

import UpdatableItemBar from './UpdatableItemBar.js';
import './UpdatableItemSet.css';

class UpdatableItemSet extends Component {
	constructor(props) {
		super(props);

		this.state = {

		}
	}

	render() {
		const setName = 
		<div className="setName-container">
			<h3>{this.props.setName}</h3>
		</div>;

		let arbitraryKey = 0;

		const itemBars = this.props.itemsToUpdate.map((item) => {
			const genericReference = item[this.props.instanceItemGenericKey];
			const generic = this.props.genericItemHashAccess[genericReference];
			const itemTitle = generic[this.props.genericItemTitleIdentifier];
			console.log("New item bar title: " + itemTitle);
			arbitraryKey++;
			return React.createElement(UpdatableItemBar, {
				item: item,
				title: itemTitle,
				updateTimestamp: this.props.itemsToUpdateTimestamp,
				key: arbitraryKey
			})
		})

		const itemBarContainer =
		<div className="itemBars-container">
			{itemBars}
		</div>

		const set =
		<Card className="set">
			{setName}{itemBarContainer}
		</Card>

		return set;
	}
}

UpdatableItemSet.propTypes = {
	genericItemHashAccess: PropTypes.object,
	genericItemTitleIdentifier: PropTypes.node,
	instanceItemGenericKey: PropTypes.node,
	itemsToUpdate: PropTypes.arrayOf(PropTypes.object),
	itemsToUpdateTimestamp: PropTypes.node,
	setName: PropTypes.string,
	// updatableFields: PropTypes.array,
}

export default UpdatableItemSet;