import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Button, Card, ControlGroup, FormGroup, Icon, InputGroup} from "@blueprintjs/core";

import './UpdatableItemBar.css';

class UpdatableItemBar extends Component {
	constructor(props){
		super(props);

		this.state = {}
	}

	//To generalize: make isSubmitted and id general props
	async onUpdateButtonClick() {
		const propertiesToUpdate = {"isSubmitted": true};

		this.props.updatableProperties.forEach((property) => {
			if(this.state[property] !== this.props.item[property] 
				&& this.state[property] !== undefined) {
				propertiesToUpdate[property] = this.state[property];
			}
		});
		
		const response = await axios({
			method: 'put',
			url: 'http://localhost:3001/periodItem',
		    headers: {
		      'Content-Type': 'application/json'
		    },
		    data: {
		    	id: this.props.item.id,
		    	propertiesToUpdate: propertiesToUpdate,
		    }
		});

		if(response.status === 200) {
			this.props.updateInstanceItemLists(response.data);
		} else {
			console.log("Problem with submission from UpdatableItemBar");
		}
		 
	}

	async handleUncheckButtonClick() {
		if(this.props.item.isSubmitted === true) {

			const response = await axios({
				method: 'put',
				url: 'http://localhost:3001/periodItem',
			    headers: {
			      'Content-Type': 'application/json'
			    },
			    data: {
			    	id: this.props.item.id,
			    	propertiesToUpdate: {isSubmitted: false}
			    }
			});

			if(response.status === 200) {
				this.props.updateInstanceItemLists(response.data);
			} else {
				console.log("Problem with uncheck in UpdatableItemBar");
			}
		}
	}

	render() {
		const isSubmitted = this.props.item[this.props.instanceItemSubmissionIndicator];
		const crossTick = (isSubmitted) ? "tick" : "cross";
		const crossTickColor = (isSubmitted) ? "green" : "red";

		const propertyFields = this.props.updatableProperties.map((property) => {
			const label = property + ": ";
			const upperLabel = label[0].toUpperCase() + label.slice(1);

			const handleFormUpdate = (event) => {
				this.setState({[property]: event.target.value});
			}

			const form = 
				<FormGroup
					label={upperLabel}
					labelFor={label}
					key={label}
				>
					<InputGroup 
						className="form"
						defaultValue={this.props.item[property]}
						id={label}
						onChange={(event) => handleFormUpdate(event)}
						// value={this.state[property]}
					/>
				</FormGroup>;

			return form;
		});

		const submissionButton =
		<Button 
		className="button-bar" 
		intent="primary"
		onClick={() => this.onUpdateButtonClick()}>
			{"Update"}
		</Button>;

		const editButton =
		<Button 
		className="button-bar" 
		intent="warning"
		onClick={() => this.props.editItemClick(this.props.item)}>
			{"Edit"}
		</Button>;

		const uncheckButton =
		<Button 
		className="button-bar"
		
		onClick={() => this.handleUncheckButtonClick()}>
			{"Uncheck"}
		</Button>;

		const control =
			<ControlGroup vertical={false}>
				{propertyFields}
			</ControlGroup>;

		const titlePortion =
		<div className="container container-title">
			<Icon icon={crossTick} color={crossTickColor}/>
			<h4>{this.props.title}</h4>
		</div>;

		const uiPortion = 
		<div className="container container-ui">
			{control}{submissionButton}{editButton}{uncheckButton}
		</div>;

		const bar =
		<Card className="bar bp3-dark">
			{titlePortion}{uiPortion}
		</Card>;

		return bar;
	}
}

UpdatableItemBar.propTypes = {
	editItemClick: PropTypes.func,
	item: PropTypes.object,
	instanceItemSubmissionIndicator: PropTypes.node,
	title: PropTypes.string,
	updatableProperties: PropTypes.arrayOf(PropTypes.node),
	updateInstanceItemLists: PropTypes.func
}

export default UpdatableItemBar;