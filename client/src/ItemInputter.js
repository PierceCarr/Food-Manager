import React, { Component } from 'react';
import { Button, FormGroup, ControlGroup, InputGroup, Card, Elevation, Menu, MenuItem, Popover } from "@blueprintjs/core";
// import { Select, ItemRenderer } from "@blueprintjs/select";
import "./ItemInputter.css";
import UnitPriceSetter from "./UnitPriceSetter.js";

class ItemInputter extends Component {
  constructor() {
    super();

    this.state = {
    	//Item data to submit
    	itemName: null,
    	unitOfMeasurement: null,
    	category: null,
    	itemPrice: 0.00,
    	initialQuantity: 0,
    	isItemActive: false,

    	// isCategoryToggled: false,
    	categoryMenuText: "Click Here to Select"
    }

    this.onCategoryMenuItemClick = this.onCategoryMenuItemClick.bind(this);
  }

  onCategoryMenuItemClick(newText){
  	this.setState({categoryMenuText: newText});
  }

  render(){
  	const categoryLabel = "Category:"
  	const entre = "Entre";
  	const CategoryMenu = 
			<Menu>
				<MenuItem text="Entre" onClick={() => this.onCategoryMenuItemClick(entre)} />
				<MenuItem text="Sauce" onClick={() => this.onCategoryMenuItemClick("Sauce")} />
				<MenuItem text="Dessert" onClick={() => this.onCategoryMenuItemClick("Dessert")} />
			</Menu>;


    return(
    		<div className="theComponent">
		    	<Card  elevation={Elevation.TWO}>

		    		<FormGroup label="Item Name:" labelFor="nameInput">
			    		<ControlGroup  vertical={false}>
							    <InputGroup id="nameInput" placeholder="ex. Snow Peas" />
							    <Button>Check if in use</Button>
							</ControlGroup>
						</FormGroup><p/>

		    		<UnitPriceSetter/><p/>

			    		<FormGroup
			    			label={categoryLabel}
			    			labelFor="category-input"
				    	>
								<Popover content={CategoryMenu} position={"auto"}>
	 								<Button id="category-input" icon="share" text={this.state.categoryMenuText} />
								</Popover>
			    		</FormGroup>

		  		</Card>
	  		</div>
    );
  }
}

export default ItemInputter;