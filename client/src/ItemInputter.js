import React, { Component } from 'react';
import { Button, FormGroup, ControlGroup, Collapse, InputGroup, Card, Elevation, Switch, Menu, MenuItem, Popover } from "@blueprintjs/core";
import AddToListButton from './AddToListButton.js';
// import { Select, ItemRenderer } from "@blueprintjs/select";
import "./ItemInputter.css";
import TwoUniqueForm from "./TwoUniqueForm.js";

let pretendCategoryObjects = [
	{name: "Entre", tags: ["Steak", "Duck", "Really big salad"]},
	{name: "Sauce", tags: ["Mustard", "Vinegar", "BBQ"]},
	{name: "Dessert", tags: ["Cheesecake", "Ice Cream", "Treacle"]}
];

class ItemInputter extends Component {
  constructor() {
    super();

    this.defaultMenuText = "Click Here to Select";

    this.state = {
    //Item data to submit
    	itemName: "",
    	unitOfMeasurement: "",
    	category: null,
    	tag: null,
    	itemPrice: 0.00,
    	initialQuantity: 0,
    	isItemActive: true,

    	//Visual state
    	categoryItems: pretendCategoryObjects,
    	tagsFromCategory: [],
    	isCategoryChosen: false,
    	isNameComboValid: false,
    	categoryMenuText: this.defaultMenuText,
    	tagMenuText: this.defaultMenuText 
    }

    this.onCategoryMenuItemClick = this.onCategoryMenuItemClick.bind(this);
    this.handleNameInput = this.handleNameInput.bind(this);
    this.handleUnitInput = this.handleUnitInput.bind(this);
    this.handlePriceInput = this.handlePriceInput.bind(this);
    this.handleQuantityInput = this.handleQuantityInput.bind(this);
  }

  resetComponent() {
  	this.setState({
  		//Item data to submit
    	itemName: "",
    	unitOfMeasurement: "",
    	category: null,
    	tag: null,
    	itemPrice: 0.00,
    	initialQuantity: 0,
    	isItemActive: true,

    	//Visual state
    	categoryItems: pretendCategoryObjects,
    	tagsFromCategory: [],
    	isCategoryChosen: false,
    	isNameComboValid: false,
    	categoryMenuText: this.defaultMenuText,
    	tagMenuText: this.defaultMenuText
  	});
  }

  onCategoryMenuItemClick(chosenCategory) {
  	let tagsInCategory = [];
  	let updateTags = () => {
	  	chosenCategory.tags.forEach((tag) => tagsInCategory.push(tag));
	  	this.setState({tagsFromCategory: tagsInCategory});
  	}

  	this.setState({categoryMenuText: chosenCategory.name});
  	this.setState({isCategoryChosen: true});

  	this.setState({category: chosenCategory}, updateTags());

  	this.setState({chosenTag: null});
  	this.setState({tagMenuText: "Click Here to Select"});
  }

  onTagMenuItemClick(chosenTag) {
  	this.setState({tag: chosenTag});
  	this.setState({tagMenuText: chosenTag});
  }

  handleNameInput(event) {
  	this.setState({itemName: event.target.value});
  	this.setState({isNameComboValid: false});
  }

  handleUnitInput(event) {
  	this.setState({unitOfMeasurement: event.target.value});
  	this.setState({isNameComboValid: false});
  }

  toggleIsItemActive() {
  	this.setState({isItemActive: !this.state.isItemActive});
  }

  validateNameUnitCombo(isValid) {
  	this.setState({isNameComboValid: isValid});
  }

  addNewCategory(newCategory) {
  	let noDuplicateCategories = true;
  	this.state.categoryItems.forEach((cat) => {
  		if(cat.name === newCategory) noDuplicateCategories = false;
  	});

  	if(noDuplicateCategories) {
	  	const categoryObject = {name: newCategory, tags: []}
	  	this.state.categoryItems.push(categoryObject);
	  	this.onCategoryMenuItemClick(categoryObject);
  	}
  }

  addNewTag(newTag) {
  	let noDuplicateTags = true;
  	this.state.tagsFromCategory.forEach((tag) => {
  		if(tag === newTag) noDuplicateTags = false;
  	});

  	if(noDuplicateTags) {
	  	this.state.tagsFromCategory.push(newTag);
	  	this.onTagMenuItemClick(newTag);
  	}
  	
  }

  handlePriceInput(event) {
  	this.setState({itemPrice: event.target.value});
  }

  handleQuantityInput(event) {
  	this.setState({initialQuantity: event.target.value});
  }

  handleSubmit() {
  	//Add tag to category if it's newly inputted
  	let isTagNew = true;
  	this.state.category.tags.forEach((tag) => {
  		if(tag === this.state.tag) isTagNew = false;
  	});

  	if(isTagNew) this.state.category.tags.push(this.state.tag);
  		
  	const newItem = {
  		name: this.state.itemName,
  		unitOfMeasurement: this.state.unitOfMeasurement,
  		category: this.state.category,
  		tag: this.state.tag,
  		price: this.state.itemPrice,
  		quantity: this.state.initialQuantity,
  		isActive: this.state.isItemActive
  	}

  	console.log(newItem);

  	//return state to its default form
  	this.resetComponent();
  }

  render() {
  	const categoryLabel = "Category:"
  	const optionalText = "(optional)";
  	const requiredText = "(required)";
  	const inUseExplaination = "Currently in use? If toggled off, the item will be removed from lists but saved for later.";
  	let isTagListDisabled = false;

  	let submitText = "Submit";
  	const isSubmitAvailable = this.state.isCategoryChosen;
  	if(!isSubmitAvailable) submitText = "Select a category to submit";

  	const tagsDontExist = 
  		this.state.category !== null && 
  		this.state.tagsFromCategory.length === 0 &&
  		this.state.tagMenuText === this.defaultMenuText;

  	let tagMenuText = this.state.tagMenuText;

  	if(tagsDontExist) {
  		tagMenuText = "No tags in chosen category";
  	}

  	if(this.state.tagsFromCategory.length === 0) {
  		isTagListDisabled = true;
  	}

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
  					this.state.tagsFromCategory.map((tag) =>
  						<MenuItem
  							text={tag}
  							key={tag}
  							onClick={() => this.onTagMenuItemClick(tag)} />
  						)
  				}
  			</Menu>
  	}

  	const categorySelection = 
			<FormGroup
  			label={categoryLabel}
  			labelFor="category-input"
  			labelInfo={requiredText}>
    		<ControlGroup vertical={false} >
					<Popover content={categoryMenu} position={"auto"} >
							<Button id="category-input" icon="share" text={this.state.categoryMenuText} />
					</Popover>
					<AddToListButton 
						text="Add New"
						label="New Category: "
						labelInfo="(unused categories will be deleted on item submission)"
						placeholder="ex. Bar"
						onSubmit={(newCategory) => this.addNewCategory(newCategory)}/>
				</ControlGroup>
  		</FormGroup>;

  	let itemTagSelection = 
  		<Collapse isOpen={this.state.isCategoryChosen} >
  			<FormGroup 
  				label="Item Tag:" 
  				labelFor="name-input" 
  				labelInfo={optionalText+"(recommended)"}>
	    		<ControlGroup  vertical={false}>
				    <Popover content={tagMenu} position={"auto"} >
							<Button 
								id="name-input" 
								icon="share" 
								disabled={isTagListDisabled}
								text={tagMenuText} />
						</Popover>
				    <AddToListButton 
				    	text="Add New"
				    	label="New Tag: "
							labelInfo="(unused tags will be deleted on item submission)"
							placeholder="ex. Cheesecake"
							onSubmit={(newTag) => this.addNewTag(newTag)}/>
					</ControlGroup>
				</FormGroup>
			</Collapse>;

		const hiddenPriceSubmitPanel = 
			<div>
				<Collapse isOpen={this.state.isNameComboValid}>

					<FormGroup 
						label={`Price Per ${this.state.unitOfMeasurement}:`} 
						labelFor="price-input"
						labelInfo={optionalText}>
						<InputGroup 
							id="price-input" 
							placeholder="$0.00" 
							onChange={(event) => this.handlePriceInput(event)}/>
					</FormGroup>

					<FormGroup
						label="Initial Quantity:"
						labelFor="quantity-input"
						labelInfo={optionalText}>
						<InputGroup 
							id="quantity-input" 
							placeholder="0" 
							onChange={(event) => this.handleQuantityInput(event)}/>
					</FormGroup>

						<Switch 
							label={inUseExplaination}
							checked={this.state.isItemActive} 
							onChange={() => this.toggleIsItemActive()}/>
					<Button 
					className="submit" 
					onClick={() => this.handleSubmit()}
					disabled={!isSubmitAvailable}>
						{submitText}
					</Button>

				</Collapse>
			</div>;

			

    return(
    		<div className="theComponent">
		    	<Card elevation={Elevation.TWO} className="bp3-dark ">

		    		{categorySelection}
		    		{itemTagSelection}

		    		<p/>
			    		<TwoUniqueForm 
			    			labelOneTitle="Name:"
			    			labelOneInfo={requiredText}
			    			labelOnePlaceholder="ex. Pumpkin"
			    			labelTwoTitle="Unit of Measurement:"
			    			labelTwoInfo={requiredText}
			    			labelTwoPlaceholder="ex. Slice"
			    			formOneText={this.state.itemName}
			    			formTwoText={this.state.unitOfMeasurement}
			    			validationButtonText="Check if Name/UOM Combo Exists"
			    			warningMessage="This Item already exists with given UOM"
			    			handleFirstInput={(event) => this.handleNameInput(event)}
			    			handleSecondInput={(event) => this.handleUnitInput(event)}
			    			validCombo={this.state.isNameComboValid}
			    			validateNameUnitCombo=
			    				{(isValid, name, unit) => this.validateNameUnitCombo(isValid, name, unit)}
			    		/>
		    		<p/>

		    		{hiddenPriceSubmitPanel}

		  		</Card>
	  		</div>
    );
  }
}

export default ItemInputter;