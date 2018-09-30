import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
	Button,
	Card,
	Elevation,
	Menu,
	MenuItem,
	Popover,
	Position,
	Toaster
} from "@blueprintjs/core";

import './OptionsPanel.css';

class InactiveItemManager extends Component {
	constructor(props) {
		super(props);

		this.defaultMenuText = "Click Here to Select";

		this.state = {
			//Item data
			category: null,
			item: null,
			tag: null,

			//Visual state
			categoryMenuText: this.defaultMenuText,
			tagMenuText: this.defaultMenuText,

		};
	}

	render(){
		const editButton = 
		<Button>
			Edit 
		</Button>;

		const reactivateButton = 
		<Button>
			Reactivate 
		</Button>;

		const inactiveItemManager = 
		<div className="wrapper" >
			<Card elecation={Elevation.TWO} className="bp3-dark">

			</Card>
		</div>;

		return inactiveItemManager;
	};
}

export default InactiveItemManager;

InactiveItemManager.propTypes = {
	itemHashAccess: PropTypes.object,
	categoryHashAccess: PropTypes.object,
};