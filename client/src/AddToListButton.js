import React, { Component } from 'react';
import {Button, Classes, Popover, FormGroup, InputGroup, ControlGroup} from "@blueprintjs/core";
import "./AddToListButton.css";

class AddToListButton extends Component {
	constructor() {
		super();

		this.state = {
			userInput: "",
			isPopoverOpen: false
		}

		this.handleUserInput = this.handleUserInput.bind(this);
	}

	handleUserInput(event) {
		this.setState({userInput: event.target.value});
	}


	handleSubmit() {
		if(this.state.userInput.length > 0){
			this.props.onSubmit(this.state.userInput);
			this.setState({userInput: ""});
		}
	}

	render() {

		const popoverContent = 
			<div className="popWrapper">
					<FormGroup
						label={this.props.label}
						labelFor="the-form"
						labelInfo={this.props.labelInfo}>
						<ControlGroup vertical={false}>
							<InputGroup
								id="the-form" 
								placeholder={this.props.placeholder}
								onChange={(event) => this.handleUserInput(event)}/>
							<Button 
								className={Classes.POPOVER_DISMISS}
								onClick={() => this.handleSubmit()}>
								Add
							</Button>
						</ControlGroup>
					</FormGroup>
			</div>;

		return(
			<div>
				<Popover 
					content={popoverContent} 
					popoverClassName="bp3-popover-content-sizing">
					<Button disabled={this.props.disabled}>
						{this.props.text}
					</Button>
				</Popover>
			</div>
		);
	}
}

export default AddToListButton;