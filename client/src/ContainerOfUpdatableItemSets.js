import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Collapse, Icon} from "@blueprintjs/core";

import "./ContainerOfUpdatableItemSets.css";
import UpdatableItemSet from './UpdatableItemSet.js';

class ContainerOfUpdatableItemSets extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isSetListDisplayed: false,
		}
	}

	onTitleClick() {
		const toggleDisplay = !this.state.isSetListDisplayed;
		this.setState({isSetListDisplayed: toggleDisplay});
	}

	render() {
		let numberOfItems = 0;
		let numberOfSubmittedItems = 0;
		this.props.instanceItemList.forEach((instanceItem) => {
			const genericItem = this.props.genericItemHashAccess[instanceItem[this.props.instanceItemGenericKey]];
			const set = genericItem[this.props.genericItemSetKey];
	
			if(set === this.props.title){
				numberOfItems++;

				if(instanceItem[this.props.instanceItemSubmissionIndicator]){
					numberOfSubmittedItems++;
				}
			}
		});

		const chevronSize = 50;
		const chevronDirection = 
			this.state.isSetListDisplayed ? "chevron-down" : "chevron-right";
		const titleChevron = 
			<Icon icon={chevronDirection} iconSize={chevronSize}/>;

		const title = 
		<button className="headerButton" onClick={() => this.onTitleClick()}>
			<h1>
				{titleChevron}{this.props.title + " " + numberOfSubmittedItems + "/" + numberOfItems}
			</h1>
		</button>;

		const content = this.props.setList.map((set) => {
			const itemsInThisSet = [];

			this.props.instanceItemList.forEach((instanceItem) => {
				const genericReference = instanceItem[this.props.instanceItemGenericKey]
				const generic = this.props.genericItemHashAccess[genericReference];
				const setOfInstanceItem = generic[this.props.setIdentifier];
				const itemIsCategoryMember = this.props.title === generic[this.props.genericItemSetKey]
				
				if(setOfInstanceItem === set && itemIsCategoryMember) itemsInThisSet.push(instanceItem);
			})

			if(itemsInThisSet.length > 0){
				return React.createElement(UpdatableItemSet, {
					additionalItemTitle: this.props.additionalItemTitle,
					genericItemHashAccess: this.props.genericItemHashAccess,
					genericItemTitleIdentifier: this.props.genericItemTitleIdentifier,
					instanceItemGenericKey: this.props.instanceItemGenericKey,
					instanceItemSubmissionIndicator: this.props.instanceItemSubmissionIndicator,
					itemsToUpdate: itemsInThisSet,
					key: set,
					setName: set,
					updatableProperties: this.props.updatableInstanceItemProperties,
					updateInstanceItemLists: this.props.updateInstanceItemLists
				});
			}
			return null;
		})

		const component = 
		<div>
			{title}
			<Collapse isOpen={this.state.isSetListDisplayed}>
				{content}
			</Collapse>
		</div>;

		return component;
	}
}

ContainerOfUpdatableItemSets.propTypes = {
	additionalItemTitle: PropTypes.object,
	genericItemHashAccess: PropTypes.object,
	genericItemSetKey: PropTypes.node,
	genericItemTitleIdentifier: PropTypes.node,
	instanceItemGenericKey: PropTypes.node,
	instanceItemList: PropTypes.arrayOf(PropTypes.object),
	instanceItemSubmissionIndicator: PropTypes.node,
	setIdentifier: PropTypes.node,
	setList: PropTypes.arrayOf(PropTypes.string),
	title: PropTypes.string,
	updatableInstanceItemProperties: PropTypes.arrayOf(PropTypes.node),
	updateInstanceItemLists: PropTypes.func
}

export default ContainerOfUpdatableItemSets;