import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Card, Elevation, Icon} from "@blueprintjs/core";

import UpdatableItemBar from './UpdatableItemBar.js';
import './UpdatableItemSet.css';

class UpdatableItemSet extends Component {
	constructor(props) {
		super(props);

		this.state = {}
		this.keySeed = 0;
	}

	isEveryItemUpdated() {
		let answer = false;

		let updatedItems = 0;
		this.props.itemsToUpdate.forEach((item) => {
			if(item[this.props.instanceItemSubmissionIndicator]) updatedItems++;
		})

		if(updatedItems === this.props.itemsToUpdate.length){
			answer = true;
		} 

		return answer;
	}

	getItemTitle(item) {
		const generic = this.props.genericItemHashAccess[item[this.props.instanceItemGenericKey]];
		const genericName = generic[this.props.genericItemTitleIdentifier];
		let itemTitle = genericName;

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
		return itemTitle;
	}

	makeArrayOfItemBars(items) {
		const itemBars = items.map((item) => {
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

			this.keySeed++;
			return React.createElement(UpdatableItemBar, {
				item: item,
				incrementContainerUpdateCount: this.props.incrementContainerUpdateCount,
				instanceItemSubmissionIndicator: this.props.instanceItemSubmissionIndicator,
				key: this.keySeed,
				title: itemTitle,
				updatableProperties: this.props.updatableProperties,
				updateInstanceItemLists: this.props.updateInstanceItemLists
			})
		})
		return itemBars;
	}

	sortItemsAlphabeticallyByTitle(items) {
		let itemsSortedByName = [].concat(items)
			.sort((a, b) => {
				const aTitle = this.getItemTitle(a).toLowerCase();
				const bTitle = this.getItemTitle(b).toLowerCase();
				// console.log("Name A: " + aTitle);
				// console.log("Name B: " + bTitle);
				if (aTitle > bTitle) return 1;
				if (aTitle < bTitle) return -1;
				return 0;
			});

			return itemsSortedByName;
	}

	//For debugging
	logEveryItemByName(items) {
		items.forEach((item) => {
			const generic = this.props.genericItemHashAccess[item.itemId];
			console.log(generic.name);
		})
	}

	render() {
		const isEveryItemUpdated = this.isEveryItemUpdated();
		const crossTickSize = 35;
		const crossTick = (isEveryItemUpdated) ? "tick" : "cross";
		const crossTickColor = (isEveryItemUpdated) ? "green" : "red";

		const setName = 
		<div className="setName-container">
			<Icon icon={crossTick} color={crossTickColor} iconSize={crossTickSize}/>
			<h3><span title={this.props.setName}>{this.props.setName}</span></h3>
		</div>;

		let submittedItems = [];
		let unsubmittedItems = [];

		this.props.itemsToUpdate.forEach((item) => {
			if(item[this.props.instanceItemSubmissionIndicator]){
				submittedItems.push(item);
			} else {
				unsubmittedItems.push(item);
			}
		});

		let sortedSubmittedItems = this.sortItemsAlphabeticallyByTitle(submittedItems);
		let sortedUnsubmittedItems = this.sortItemsAlphabeticallyByTitle(unsubmittedItems);

		let submittedItemBars = this.makeArrayOfItemBars(sortedSubmittedItems);
		let unsubmittedItemBars = this.makeArrayOfItemBars(sortedUnsubmittedItems);

		const allItemBars = unsubmittedItemBars.concat(submittedItemBars);

		const itemBarContainer =
		<div  className="itemBars-container">
			{allItemBars}
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
	instanceItemSubmissionIndicator: PropTypes.node,
	itemsToUpdate: PropTypes.arrayOf(PropTypes.object),
	setName: PropTypes.string,
	updatableProperties: PropTypes.arrayOf(PropTypes.node),
	updateInstanceItemLists: PropTypes.func
}

export default UpdatableItemSet;