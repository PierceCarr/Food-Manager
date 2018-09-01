import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Card, ControlGroup, FormGroup, Icon, InputGroup} from "@blueprintjs/core";
import axios from 'axios';
import './UpdatableItemBar.css';

class UpdatableItemBar extends Component {
	constructor(props){
		super(props);

		this.state = {}
	}

	componentDidMount() {
		// this.props.updatableProperties.forEach((property) => {
		// 	this.setState({[property]: this.props.item[property]});
		// });
	}

	async onUpdateButtonClick() {
		console.log("Property passed: " + this.props.instanceItemSubmissionIndicator);
    console.log("Is submitted: " + this.props.item[this.props.instanceItemSubmissionIndicator]);
		const shallowCopy = JSON.parse(JSON.stringify(this.props.item));
		let propertiesToUpdate = {isSubmitted: true};
		let newProperties = 0;

		this.props.updatableProperties.forEach((property) => {
			if(this.state[property] !== this.props.item[property]){
				const objectWithNewProperty = {[property]: this.state[property]};
				propertiesToUpdate = Object.assign(objectWithNewProperty, propertiesToUpdate);
				newProperties++;
			}
		})
		
		const updatedShallowItem = Object.assign(shallowCopy, propertiesToUpdate);

		console.log("Old item: " + JSON.stringify(this.props.item));
		console.log("Shallow updated item: " + JSON.stringify(updatedShallowItem));
		console.log("propertiesToUpdate: " + JSON.stringify(propertiesToUpdate));

		const response = await axios({
			method: 'patch',
			url: 'http://localhost:3001',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	    data: {
	    	isUpdateSinglePeriodItem: true,
	    	originalItem: this.props.item,
	    	propertiesToUpdate: propertiesToUpdate,
	    }
		})

		if(response.status === 200) {
			console.log("worked");
			this.props.updateInstanceItemLists(response.data);
		} else {
			console.log("Problem with submission from UpdatableItemBar");
		}
		 
	}

	render() {
		const isSubmitted = this.props.item[this.props.instanceItemSubmissionIndicator];
		// console.log("Is item " + this.props.item["id"] + " submitted: " + this.props.item["isSubmitted"]);
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
		<Button className="button-bar" onClick={() => this.onUpdateButtonClick()}>
			{"Update"}
		</Button>;

		const editButton =
		<Button className="button-bar">
			{"Edit"}
		</Button>;

		const uncheckButton =
		<Button className="button-bar">
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
	item: PropTypes.object,
	instanceItemSubmissionIndicator: PropTypes.node,
	title: PropTypes.string,
	updatableProperties: PropTypes.arrayOf(PropTypes.node),
	updateInstanceItemLists: PropTypes.func
}

export default UpdatableItemBar;