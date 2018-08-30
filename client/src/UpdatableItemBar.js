import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Card, ControlGroup, FormGroup, Icon, InputGroup} from "@blueprintjs/core";
import axios from 'axios';
import './UpdatableItemBar.css';

class UpdatableItemBar extends Component {
	constructor(props){
		super(props);

		this.initialUpdateState = 
			(this.props.item[this.props.updateTimestamp] !== null);

		this.state = {
			isUpdated: this.initialUpdateState,
			isWaitingToUpdate: false
		}
	}

	componentDidMount() {
		this.props.updatableProperties.forEach((property) => {
			this.setState({[property]: this.props.item[property]});
		});
	}

	async onUpdateButtonClick() {

		const shallowCopy = JSON.parse(JSON.stringify(this.props.item));
		let propertiesToUpdate = {};
		let newProperties = 0;

		this.props.updatableProperties.forEach((property) => {
			if(this.state[property] !== this.props.item[property]){
				const objectWithNewProperty = {[property]: this.state[property]};
				propertiesToUpdate = Object.assign(objectWithNewProperty, propertiesToUpdate);
				newProperties++;
			}
		})

		if(newProperties > 0){
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

			// console.log(JSON.stringify(response));

			if(response.status === 200) {
				console.log("worked");
				this.props.item = response.data;
			}
		} else {
			console.log("No new properties");
		}
	}

	render() {
		const crossCheck = (this.state.isUpdated) ? "check" : "cross";
		const crossCheckColor = (this.state.isUpdated) ? "green" : "red";

		const propertyFields = this.props.updatableProperties.map((property) => {
			const label = property + ": ";
			const upperLabel = label[0].toUpperCase() + label.slice(1);

			const handleFormUpdate = (event) => {
				this.setState({[property]: event.target.value});
				this.setState({isWaitingToUpdate: true});
			}

			const form = 
				<FormGroup
					label={upperLabel}
					labelFor={label}
					key={label}
				>
					<InputGroup className="form"
						id={label}
						onChange={(event) => handleFormUpdate(event)}
						value={this.state[property]}
					/>
				</FormGroup>;

			return form;
		});

		const submissionButton =
		<Button className="button-bar" onClick={() => this.onUpdateButtonClick()}>
			{"Update"}
		</Button>;

		const control =
			<ControlGroup vertical={false}>
				{propertyFields}
			</ControlGroup>;

		const titlePortion =
		<div className="container container-title">
			<Icon icon={crossCheck} color={crossCheckColor}/>
			<h4>{this.props.title}</h4>
		</div>;

		const uiPortion = 
		<div className="container container-ui">
			{control}{submissionButton}
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
	title: PropTypes.string,
	updatableProperties: PropTypes.arrayOf(PropTypes.node),
	updateTimestamp: PropTypes.node
}

export default UpdatableItemBar;