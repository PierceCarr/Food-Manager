import React, { Component } from 'react';
import {Button, FormGroup, InputGroup, Card, Elevation} from "@blueprintjs/core";
import './TwoUniqueForm.css';

class TwoUniqueForm extends Component {
	constructor(){
		super();

		this.state = {
			needsWarning: false
		}
	}

	render(){
		const labelOneTitle = "Name:";
		const labelOnePlaceholder = "ex. Snow Peas";

		const labelTwoTitle = "Unit of Measurement:";
		const labelTwoPlaceholder = "ex. 3200g Bag";

		const validationButtonText = "Check if Name/UOM Combo Exists";
		const warningMessage = "You need to check if the item exists before you can submit it";


		let message = <div/>
		if(this.state.needsWarning){
			message = 
			<p style={{color: "red"}}>
				{warningMessage}
			</p>
		}

		return(
			<div>
		    	<div className="thisComponent">
		    		<Card elevation={Elevation.TWO}>
			    		<FormGroup
			    			label={labelOneTitle}
			    			labelFor="first-input"
			    		>
			    			<InputGroup 
			    				id="first-input" 
			    				placeholder= {labelOnePlaceholder}
			    				
								/>
			    		</FormGroup>
			    		<FormGroup
			    			label={labelTwoTitle}
			    			labelFor="second-input"
			    		>
			    			<InputGroup 
			    				id="second-input" 
			    				placeholder={labelTwoPlaceholder}
								/>
			    		</FormGroup>
			    		<div className="validCheck">
				    		<Button>{validationButtonText}</Button>
				    		{message}
				    	</div>
		    		</Card>
		      </div>
	      </div>
	    );
	}
}

export default TwoUniqueForm;