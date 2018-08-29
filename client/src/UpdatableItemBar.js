import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Card, ControlGroup, FormGroup, Icon, InputGroup} from "@blueprintjs/core";

import './UpdatableItemBar.css';

class UpdatableItemBar extends Component {
	constructor(props){
		super(props);

		this.initialUpdateState = (this.props.item[this.props.updateTimestamp] !== null);

		this.state = {
			isUpdated: this.initialUpdateState
		}
	}

	componentDidMount() {
		this.props.updatableProperties.map((property) => {
			this.setState({[property]: this.props.item[property]});
		});
	}

	render() {
		console.log("Is updated? " + this.state.isUpdated);
		const crossCheck = (this.state.isUpdated) ? "check" : "cross";
		const crossCheckColor = (this.state.isUpdated) ? "green" : "red";
		console.log("Crosscheck: " + crossCheck);

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
					<InputGroup className="form"
						id={label}
						onChange={(event) => handleFormUpdate(event)}
						value={this.state[property]}
					/>
				</FormGroup>;

			return form;
		});

		const submissionButton =
		<Button>
			{"Update"}
		</Button>

		const control =
			<ControlGroup vertical={false}>
				{propertyFields}
			</ControlGroup>

		const bar =
		<Card className="bar bp3-dark">

			<Icon icon={crossCheck} color={crossCheckColor}/>
			<h4>{this.props.title}</h4>
			{control}{submissionButton}

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