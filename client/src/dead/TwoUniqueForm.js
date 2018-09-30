import React, { Component } from 'react';
import {Button, FormGroup, InputGroup, Card, Elevation} from "@blueprintjs/core";
import './TwoUniqueForm.css';

class TwoUniqueForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			warningMessage: "",
			formOneValue: "",
		}
	}

	//CHANGE TO componentDidUpdate()!!!
	componentWillReceiveProps(nextProps) {
		if(this.props.updateFormOneFormat){
			this.setState({formOneValue: ""});
		}
	}

	validateCombo() {
		let bothFieldsEntered = true;
		if(this.props.formOneFocusValue.length === 0 ||
		   this.props.formTwoText.length === 0) {
			bothFieldsEntered = false;
		}

		let isValid = true;
		if(bothFieldsEntered){
			this.props.validateNameUnitCombo(isValid);
			this.setState({warningMessage: ""});
		} else {
			isValid = false;
			this.props.validateNameUnitCombo(isValid);
			this.setState({warningMessage: "Please fill in both fields"})
		}

		this.setState({submitted: true});
	}

	onFormOneFocus() {
		this.setState({formOneValue: this.props.formOneFocusValue});
	}

	onFormOneBlur() {
		this.setState({formOneValue: this.props.formOneBlurValue});
	}

	onFormOneChange(event) {
		this.setState({formOneValue: event.target.value});
		this.props.handleFirstInput(event);
	}

	render(){

		let message = <div/>;

		if(this.state.warningMessage.length > 0){
			message = 
			<div>
				<br/>
				<b style={{color: "red"}}>
					{this.state.warningMessage}
				</b>
			</div>;
		}
			
		let validationButtonIcon = "circle";
		if(this.props.submitted === true){
			if(this.props.validCombo){
				validationButtonIcon = "confirm";
			} else {
				validationButtonIcon = "repeat";
			}
		}

		return(
			<div>
		    	<div className="thisComponent">
		    		<Card elevation={Elevation.TWO}>
			    		<FormGroup
			    			label={this.props.labelOneTitle}
			    			labelFor="first-input"
			    			labelInfo={this.props.labelOneInfo}>
			    			<InputGroup 
			    				id="first-input" 
			    				placeholder= {this.props.labelOnePlaceholder}
			    				onChange={(event) => {
			    					this.onFormOneChange(event);
			    				}}
			    				value={this.state.formOneValue}
			    				onFocus={() => this.onFormOneFocus()}
			    				onBlur={() => this.onFormOneBlur()}/>
			    		</FormGroup>

			    		<FormGroup
			    			label={this.props.labelTwoTitle}
			    			labelFor="second-input"
			    			labelInfo={this.props.labelTwoInfo}>
			    			<InputGroup 
			    				id="second-input" 
			    				placeholder={this.props.labelTwoPlaceholder}
			    				onChange={(event) => {
			    					this.props.handleSecondInput(event);
			    				}}
			    				value={this.props.formTwoText}/>
			    		</FormGroup>

			    		<div className="validCheck">
				    		<Button 
				    			icon={validationButtonIcon} 
				    			onClick={() => this.validateCombo()}>
				    			{this.props.validationButtonText}
				    		</Button>

				    		{message}
				    		
				    	</div>
		    		</Card>
		      </div>
	      </div>
	    );
	}
}

export default TwoUniqueForm;