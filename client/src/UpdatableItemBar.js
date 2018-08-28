import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ControlGroup} from "@blueprintjs/core";

class UpdatableItemBar extends Component {
	constructor(props){
		super(props);

		this.state = {
			isUpdated: this.props.updateTimestamp !== null
		}

	}

	render(){
		const bar =
		<div >
			<h4>{this.props.title}</h4>
		</div>;

		return bar;
	}
}

UpdatableItemBar.propTypes = {
	item: PropTypes.object,
	title: PropTypes.string,
	// updatableProperties: PropTypes.arrayOf(PropTypes.node),
	updateTimestamp: PropTypes.node
}

export default UpdatableItemBar;