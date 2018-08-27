import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Card} from "@blueprintjs/core";

class ContainerOfUpdatableItemSets extends Component {
	constructor(props) {
		super(props);

		this.state = {

			title: this.props.title,
			numberOfItems: 0,
			numberOfUpdatedItems: 0,

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

	render() {
		const title = 
		<h1>
			{"> " + this.state.title + " " + this.state.numberOfUpdatedItems + "/" + this.state.numberOfItems}
		</h1>;

		return title;
	}
}

ContainerOfUpdatableItemSets.propTypes = {
	genericItemHashAccess: PropTypes.object,
	// genericItemList: PropTypes.arrayOf(PropTypes.object),
	genericItemSetKey: PropTypes.node,
	instanceItemGenericKey: PropTypes.node,
	// instanceItemIdentifier: PropTypes.node,
	instanceItemList: PropTypes.arrayOf(PropTypes.object),
	// setIdentifier: PropTypes.node,
	// setList: PropTypes.arrayOf(PropTypes.string),
	title: PropTypes.string,
}

export default ContainerOfUpdatableItemSets;