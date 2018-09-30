import React, { Component } from 'react';
import {Button, FormGroup, InputGroup, Card, Elevation, Popover, Menu, MenuItem} from "@blueprintjs/core";
import './UnitPriceSetter.css';

const flank = {unit: "2 Cheeks", price: 88.37};

class UnitPriceSetter extends Component {
	constructor(){
		super();

		this.state = {
			submittedUOMitems: [flank],
			menuText: "Nothing Selected"
		}

		this.buildPriceUnitDropdown = this.buildPriceUnitDropdown.bind(this);
	}

	buildPriceUnitDropdown(){
		let itemList;
		for(let item = 0; item < this.state.submittedUOMitems.length; item++){

			const currentItem = this.state.submittedUOMitems[item];
			const itemText = currentItem.unit + " @ " + currentItem.price;
			console.log("Unit combo: " + itemText);
			itemList += <MenuItem text={itemText} />;
			
		}

		const theMenu = <Menu>{itemList}</Menu>;

		return theMenu;
	}

	render(){
		const labelOneTitle = "Unit of Measurement:";
		const labelOnePlaceholder = "ex. 3200g Bag";

		const labelTwoTitle = "Price Per Unit:";
		const labelTwoPlaceholder = "$";

		const inputButtonText = "Add Input";
		const deleteButtonText = "Delete Selected";
		const listPlaceHolderText = "Click to see list";

		const popoverContent = this.buildPriceUnitDropdown();
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
			    		<Button fill={true}>
			    			{inputButtonText}
		    			</Button>

		    			<Popover content={popoverContent} position={"auto"}>
							<Button id="UOM-list" icon="share" text={this.state.menuText} />
						</Popover>

		    		</Card>
		      </div>
	      </div>
	    );
	}
}

export default UnitPriceSetter;