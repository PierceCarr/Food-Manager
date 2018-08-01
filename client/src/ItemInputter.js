import React, { Component } from 'react';
import { Button, FormGroup, ControlGroup, Collapse, InputGroup, Card, Elevation, Switch, Menu, MenuItem, Popover } from "@blueprintjs/core";
// import { Select, ItemRenderer } from "@blueprintjs/select";
import "./ItemInputter.css";
import TwoUniqueForm from "./TwoUniqueForm.js";

let pretendCatagoryObjects =[
	{name: "Entre", tags: ["Steak", "Duck", "Really big salad"]},
	{name: "Sauce", tags: ["Mustard", "Vinegar", "BBQ"]},
	{name: "Dessert", tags: ["Cheesecake", "Ice Cream", "Treacle"]}
]

class ItemInputter extends Component {
  constructor() {
    super();

    this.state = {
    	//Item data to submit
    	itemName: null,
    	unitOfMeasurement: null,
    	category: null,
    	tag: null,
    	itemPrice: 0.00,
    	initialQuantity: 0,
    	isItemActive: true,

    	//Visual state
    	categoryItems: pretendCatagoryObjects,
    	tagsFromCatagory: [],
    	isCategoryChosen: false,
    	isNameComboValid: false,
    	categoryMenuText: "Click Here to Select",
    	tagMenuText: "Click Here to Select"
    }

    this.onCategoryMenuItemClick = this.onCategoryMenuItemClick.bind(this);

  }

  onCategoryMenuItemClick(chosenCategory){
  	this.setState({categoryMenuText: chosenCategory.name});
  	this.setState({isCategoryChosen: true});

  	this.setState({category: chosenCategory});

  	this.setState({chosenTag: null});
  	this.setState({tagMenuText: "Click Here to Select"});
  }

  onTagMenuItemClick(chosenTag){
  	this.setState({tag: chosenTag});
  	this.setState({tagMenuText: chosenTag});
  }

  toggleIsItemActive(){
  	this.setState({isItemActive: !this.state.isItemActive});
  }

  validateNameUnitCombo(isValid) {
  	this.setState({isNameComboValid: isValid});
  }

  render(){
  	const categoryLabel = "Category:"
  	const optionalText = "(optional)";
  	const requiredText = "(required)";
  	const inUseExplaination = "Currently in use? If toggled off, the item will be removed from lists but saved for later.";
  	
  	let submitText = "Submit";
  	const isSubmitAvailable = this.state.isCategoryChosen;
  	if(!isSubmitAvailable) submitText = "Select a category to submit";

  	let categoryMenu =
  		<Menu>
  		{
  			this.state.categoryItems.map((item) => 
  				<MenuItem 
  				text={item.name} 
  				key={item.name} 
  				onClick={() => this.onCategoryMenuItemClick(item)}/>
  			)
  		}
  		</Menu>;

  	let tagMenu = null;
  	if(this.state.category !== null) {
  		tagMenu =
  			<Menu>
  				{
  					this.state.category.tags.map((tag) =>
  						<MenuItem
  							text={tag}
  							key={tag}
  							onClick={() => this.onTagMenuItemClick(tag)} />
  						)
  				}
  			</Menu>
  	}

		const hiddenPriceSubmitPanel = 
			<div>
				<Collapse isOpen={this.state.isNameComboValid}>

					<FormGroup 
						label={`Price Per ${this.state.unitOfMeasurement}:`} 
						labelFor="price-input"
						labelInfo={optionalText}>
						<InputGroup id="price-input" placeholder="$0.00" />
					</FormGroup>

					<FormGroup
						label="Initial Quantity:"
						labelFor="quantity-input"
						labelInfo={optionalText}>
						<InputGroup id="quantity-input" placeholder="0" />
					</FormGroup>

						<Switch 
							label={inUseExplaination}
							checked={this.state.isItemActive} 
							onChange={() => this.toggleIsItemActive()}/>
					<Button 
					className="submit" 
					disabled={!isSubmitAvailable}>
						{submitText}
					</Button>

				</Collapse>
			</div>;

			const categorySelection = 
				<FormGroup
    			label={categoryLabel}
    			labelFor="category-input"
    			labelInfo={requiredText}>
	    		<ControlGroup vertical={false} >
					<Popover content={categoryMenu} position={"auto"} >
							<Button id="category-input" icon="share" text={this.state.categoryMenuText} />
					</Popover>
					<Button>Add New</Button>
					</ControlGroup>
    		</FormGroup>;

    	let itemTagSelection = 
	    		<Collapse isOpen={this.state.isCategoryChosen} >
	    			<FormGroup 
	    				label="Item Tag:" 
	    				labelFor="name-input" 
	    				labelInfo={optionalText}>
			    		<ControlGroup  vertical={false}>
						    <Popover content={tagMenu} position={"auto"} >
									<Button id="name-input" icon="share" text={this.state.tagMenuText} />
								</Popover>
						    <Button>Add New</Button>
							</ControlGroup>
						</FormGroup>
					</Collapse>;

    return(
    		<div className="theComponent">
		    	<Card elevation={Elevation.TWO} className="bp3-dark ">

		    		{categorySelection}
		    		{itemTagSelection}

		    		<p/>
			    		<TwoUniqueForm 
			    			validateNameUnitCombo=
			    				{(isValid) => this.validateNameUnitCombo(isValid)}
			    		/>
		    		<p/>

		    		{hiddenPriceSubmitPanel}

		  		</Card>
	  		</div>
    );
  }
}

export default ItemInputter;