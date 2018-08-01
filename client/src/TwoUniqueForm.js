import React, { Component } from 'react';
import {Button, FormGroup, InputGroup, Card, Elevation} from "@blueprintjs/core";
import './TwoUniqueForm.css';

class TwoUniqueForm extends Component {
	constructor(){
		super();

		this.state = {
			validCombo: null
		}
	}

	validateCombo() {
		const newValidity = !this.state.validCombo;
		this.setState({validCombo: newValidity},
			this.props.validateNameUnitCombo(newValidity));
	}

	render(){
		const labelOneTitle = "Name:";
		const labelOnePlaceholder = "ex. Pumpkin";

		const labelTwoTitle = "Unit of Measurement:";
		const labelTwoPlaceholder = "ex. Slice";

		const validationButtonText = "Check if Name/UOM Combo Exists";
		const warningMessage = "This Item already exists with given UOM";


		let message = <div/>
		if(this.state.validCombo === false){
			message = 
			<div>
				<br/>
				<em style={{color: "red"}}>
					{warningMessage}
				</em>
			</div>;
			
		}

		let validationButtonIcon = "circle";
		if(this.state.validCombo !== null){
			if(this.state.validCombo){
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
			    			label={labelOneTitle}
			    			labelFor="first-input"
			    			labelInfo="(required)">
			    			<InputGroup 
			    				id="first-input" 
			    				placeholder= {labelOnePlaceholder}/>
			    		</FormGroup>

			    		<FormGroup
			    			label={labelTwoTitle}
			    			labelFor="second-input"
			    			labelInfo="(required)">
			    			<InputGroup 
			    				id="second-input" 
			    				placeholder={labelTwoPlaceholder}/>
			    		</FormGroup>

			    		<div className="validCheck">
				    		<Button 
				    			icon={validationButtonIcon} 
				    			onClick={() => this.validateCombo()}>
				    			{validationButtonText}
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