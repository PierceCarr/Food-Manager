import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Card, Elevation, Icon} from "@blueprintjs/core";

import UpdatableItemBar from './UpdatableItemBar.js';
import './UpdatableItemSet.css';

class UpdatableItemSet extends Component {
	constructor(props) {
		super(props);

		this.state = {

		}
	}

	render() {
		const crossCheckSize = 35;

		const setName = 
		<div className="setName-container">
			<Icon icon="cross" color="red" iconSize={crossCheckSize}/>
			<h3>{this.props.setName}</h3>
		</div>;

		let arbitraryKey = 0;

		const itemBars = this.props.itemsToUpdate.map((item) => {
			const genericReference = item[this.props.instanceItemGenericKey];
			const generic = this.props.genericItemHashAccess[genericReference];
			let itemTitle = generic[this.props.genericItemTitleIdentifier];

			if(this.props.additionalItemTitle.use) {

				this.props.additionalItemTitle.titleAdditions.forEach((addition) => {
					if(addition.type === "string") {
						itemTitle += addition.content;

					} else if (addition.type === "node") {
						let content = "";

						if(addition.isGenericProperty) {
							content = generic[addition.node];

						} else { //Instance item property
							content = item[addition.node];

						}
						itemTitle += content;
					}
				})
			}

			console.log("New item bar title: " + itemTitle);
			arbitraryKey++;
			return React.createElement(UpdatableItemBar, {
				item: item,
				key: arbitraryKey,
				title: itemTitle,
				updatableProperties: this.props.updatableProperties,
				updateTimestamp: this.props.itemsToUpdateTimestamp,	
			})
		})

		const itemBarContainer =
		<div className="itemBars-container" >
			{itemBars}
		</div>

		const set =
		<Card className="set" elevation={Elevation.TWO}>
			{setName}{itemBarContainer}
		</Card>;

		return set;
	}
}

UpdatableItemSet.propTypes = {
	additionalItemTitle: PropTypes.object,
	genericItemHashAccess: PropTypes.object,
	genericItemTitleIdentifier: PropTypes.node,
	instanceItemGenericKey: PropTypes.node,
	itemsToUpdate: PropTypes.arrayOf(PropTypes.object),
	itemsToUpdateTimestamp: PropTypes.node,
	setName: PropTypes.string,
	updatableProperties: PropTypes.arrayOf(PropTypes.node),
}

export default UpdatableItemSet;