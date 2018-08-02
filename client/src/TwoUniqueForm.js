import React, { Component } from 'react';
import {Button, FormGroup, InputGroup, Card, Elevation} from "@blueprintjs/core";
import './TwoUniqueForm.css';

class TwoUniqueForm extends Component {
	constructor(props) {
		super(props);

		this.state = {

			submitted: false,
			warningMessage: ""
		}
	}

	validateCombo() {
		let bothFieldsEntered = true;
		if(this.props.formOneText.length === 0 ||
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
		if(this.state.submitted === true){
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
			    					this.props.handleFirstInput(event);
			    				}}
			    				value={this.props.formOneText}/>
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