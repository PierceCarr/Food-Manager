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
			numberOfItems: 0,
			numberOfUpdatedItems: 0,
			title: this.props.title,
		}
	}

	componentDidMount() {
		let numberOfItems = 0;
		this.props.instanceItemList.forEach((instanceItem) => {
			const genericItem = this.props.genericItemHashAccess[instanceItem[this.props.instanceItemGenericKey]];
			const set = genericItem[this.props.genericItemSetKey];
	
			if(set === this.state.title){
				numberOfItems++;
			}
		});

		this.setState({numberOfItems: numberOfItems});
	}

	updateContainerUpdateCount(setSize) {
		this.setState(prevState => ({
			numberOfUpdatedItems: prevState.numberOfUpdatedItems + setSize
		}));
	}

	onTitleClick() {
		const toggleDisplay = !this.state.isSetListDisplayed;
		this.setState({isSetListDisplayed: toggleDisplay});
	}

	render() {
		const chevronSize = 50;
		const chevronDirection = 
			this.state.isSetListDisplayed ? "chevron-down" : "chevron-right";
		const titleChevron = 
			<Icon icon={chevronDirection} iconSize={chevronSize}/>;

		const title = 
		<button className="headerButton" onClick={() => this.onTitleClick()}>
			<h1>
				{titleChevron}{this.state.title + " " + this.state.numberOfUpdatedItems + "/" + this.state.numberOfItems}
			</h1>
		</button>;

		const content = this.props.setList.map((set) => {
			const itemsInThisSet = [];

			this.props.instanceItemList.forEach((instanceItem) => {
				const genericReference = instanceItem[this.props.instanceItemGenericKey]
				const generic = this.props.genericItemHashAccess[genericReference];
				const setOfInstanceItem = generic[this.props.setIdentifier];
				
				if(setOfInstanceItem === set) itemsInThisSet.push(instanceItem);
			})

			return React.createElement(UpdatableItemSet, {
				additionalItemTitle: this.props.additionalItemTitle,
				genericItemHashAccess: this.props.genericItemHashAccess,
				genericItemTitleIdentifier: this.props.genericItemTitleIdentifier,
				instanceItemGenericKey: this.props.instanceItemGenericKey,
				itemsToUpdate: itemsInThisSet,
				itemsToUpdateTimestamp: this.props.instanceItemUpdateTimestampIdentifier,
				key: set,
				setName: set,
				updateContainerUpdateCount: this.updateContainerUpdateCount,
				updatableProperties: this.props.updatableInstanceItemProperties
			});
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
	// genericItemList: PropTypes.arrayOf(PropTypes.object),
	genericItemSetKey: PropTypes.node,
	genericItemTitleIdentifier: PropTypes.node,
	instanceItemGenericKey: PropTypes.node,
	// instanceItemIdentifier: PropTypes.node,
	instanceItemList: PropTypes.arrayOf(PropTypes.object),
	instanceItemUpdateTimestampIdentifier: PropTypes.node,
	setIdentifier: PropTypes.node,
	setList: PropTypes.arrayOf(PropTypes.string),
	title: PropTypes.string,
	updatableInstanceItemProperties: PropTypes.arrayOf(PropTypes.node)
}

export default ContainerOfUpdatableItemSets;