import React, { Component } from 'react';
import currencyFormatter from 'currency-formatter';
import axios from 'axios';
import AddToListButton from './AddToListButton.js';
import "./ItemInputter.css";
import TwoUniqueForm from "./TwoUniqueForm.js";
import { 
	Button, 
	Card,
	Collapse,
	ControlGroup,
	Elevation,
	FormGroup, 
	InputGroup, 
	Menu,
	MenuItem, 
	Popover,
	Position,   
	Switch,    
	Toaster,  
} from "@blueprintjs/core";

//Known Bugs:
//None, they're clever and hiding from my wrath

//Pain points:
//>If a user accidently selects a tag when they want no tag,
//they must somehow refresh the entire component and start over to
//clear the tag slot.

class ItemInputter extends Component {
  constructor(props) {
    super(props);

    this.defaultMenuText = "Click Here to Select";

    this.state = {
    	//Item data to submit
    	itemName: "",
    	unitOfMeasurement: "",
    	category: null,
    	tag: null,
    	itemPrice: "",
    	initialQuantity: "",
    	isItemActive: true,

    	//Visual state
      title: null, //can probably remove this
    	nameUnitChecked: false,
    	formattedItemName: "",
    	displayItemName: "",
    	categoryItems: this.props.categoryItems,
    	displayPrice: currencyFormatter.format(0.00, {code: 'USD'}),
    	tagsFromCategory: [],
    	isCategoryChosen: false,
      hasCategoryMenuLoaded: false,
    	isNameComboValid: false,
    	categoryMenuText: this.defaultMenuText,
    	tagMenuText: this.defaultMenuText,
    	inputKey: new Date(),
      updateFormOneFormat: false
    }

    this.priceInput = React.createRef();

    this.onCategoryMenuItemClick = this.onCategoryMenuItemClick.bind(this);
    this.handleNameInput = this.handleNameInput.bind(this);
    this.handleUnitInput = this.handleUnitInput.bind(this);
    this.handlePriceInput = this.handlePriceInput.bind(this);
    this.handleQuantityInput = this.handleQuantityInput.bind(this);
  }

  componentDidUpdate() {
    if(this.state.categoryItems !== this.props.categoryItems){
      this.setState({categoryItems: this.props.categoryItems});
    }
  }

  displayFormattedItemName() {
  	this.setState({displayItemName: this.state.formattedItemName});
  }

  displayFormattedPrice() {
  	this.setState({itemPrice: this.state.displayPrice});
  }

  resetComponent() {
  	this.setState({
  		//Item data to submit
    	itemName: "",
    	unitOfMeasurement: "",
    	category: null,
    	tag: null,
    	itemPrice: "",
    	initialQuantity: "",
    	isItemActive: true,

    	//Visual state
    	nameUnitChecked: false,
    	formattedItemName: "",
    	displayItemName: "",
    	displayPrice: currencyFormatter.format(0.00, {code: 'USD'}),
    	isCategoryChosen: false,
    	isNameComboValid: false,
    	categoryMenuText: this.defaultMenuText,
    	tagMenuText: this.defaultMenuText,
    	inputKey: new Date()
  	});
  }

  onCategoryMenuItemClick(chosenCategory) {
  	let tagsInCategory = [];
  	let updateTags = () => {
	  	chosenCategory.tags.forEach((tag) => tagsInCategory.push(tag));
	  	this.setState({tagsFromCategory: tagsInCategory});
  	}

  	this.setState({
  		categoryMenuText: chosenCategory.name,
  		isCategoryChosen: true,
  		category: chosenCategory,
  		chosenTag: null,
  		tagMenuText: "Click Here to Select"
  	}, updateTags());
  }



  onTagMenuItemClick(chosenTag) {
    
  	this.setState({
      tag: chosenTag,
      tagMenuText: chosenTag,
      itemName: "",
      nameUnitChecked: false,
      isNameComboValid: false,
      displayItemName: "",
      updateFormOneFormat: true,
      unitOfMeasurement: ""
    }
    ,() => {
      this.setState({updateFormOneFormat: false}, () => console.log('Cleared form'));
    }
    );
  }

  handleNameInput(event) {
  	let trueName = event.target.value;
  	let formattedName = this.state.tag + ' - ' + trueName;
  	if(this.state.tag === null) formattedName = trueName;
  	
  	this.setState({
  		itemName: trueName,
  		displayItemName: formattedName,
  		isNameComboValid: false
  	});
  }

  handleUnitInput(event) {
  	this.setState({unitOfMeasurement: event.target.value});
  	this.setState({isNameComboValid: false});
  }

  toggleIsItemActive() {
  	this.setState({isItemActive: !this.state.isItemActive});
  }

  validateNameUnitCombo(isValid) {
  	this.setState({
  		isNameComboValid: isValid,
  		nameUnitChecked: true
  	});
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
  	const formattedPrice = 
  		currencyFormatter.format(event.target.value, {code: 'USD'});
  	this.setState({
  		itemPrice: event.target.value,
  		displayPrice: formattedPrice,
  		isPriceFormatted: false
  	});
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

    let priceCatch;
    if(this.state.itemPrice === ""){
      priceCatch = 0.00;
    } else {
      priceCatch = currencyFormatter.unformat(this.state.itemPrice, {code: 'USD'});
    }
  	
  	axios({
  		method: 'post',
  		url: 'http://localhost:3001',
  		headers: {
  			'Content-Type': 'application/json'
  		},
  		data: {
  			isRecieve: false,
  			newCategory: false,

  			name: this.state.itemName,
	  		unitOfMeasurement: this.state.unitOfMeasurement,
	  		category: this.state.category.name,
	  		tag: this.state.tag,
	  		price: priceCatch,
	  		quantity: this.state.initialQuantity,
	  		isActive: this.state.isItemActive
  		}
  	})
    .then((response) => {
      console.log(response);
    });


  	const newItem = {
  		name: this.state.itemName,
  		unitOfMeasurement: this.state.unitOfMeasurement,
  		category: this.state.category,
  		tag: this.state.tag,
  		price: currencyFormatter.unformat(this.state.itemPrice, {code: 'USD'}),
  		quantity: this.state.initialQuantity,
  		isActive: this.state.isItemActive
  	}

  	console.log(newItem);

  	let prettyTag = newItem.tag + " - ";
  	if(newItem.tag === null) prettyTag = "";
  	const toastMessage = 
  		prettyTag + newItem.name + " was added to " + newItem.category.name;
  	const toaster = Toaster.create({position: Position.TOP});
  	toaster.show({message: toastMessage, intent: "success"});
  	
    //return state to its default form
  	this.resetComponent();
  }

  render() {
  	const categoryLabel = "Category:";
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
  							onClick={() => this.onTagMenuItemClick(tag)} 
              />
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
					<Popover content={categoryMenu} position={Position.RIGHT} >
						<Button 
              id="category-input" 
              icon="share" 
              text={this.state.categoryMenuText} />
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
			<FormGroup 
				label="Item Tag:" 
				labelFor="name-input" 
				labelInfo={optionalText + "(recommended)"} >
    		<ControlGroup  vertical={false} >
			    <Popover content={tagMenu} position={Position.RIGHT} >
						<Button 
              className="selection-button"
							id="name-input" 
							icon="share" 
							disabled={!this.state.isCategoryChosen}
							text={tagMenuText} />
					</Popover>
			    <AddToListButton 
            disabled={!this.state.isCategoryChosen}
			    	text="Add New"
			    	label="New Tag: "
						labelInfo="(unused tags will be deleted on item submission)"
						placeholder="ex. Cheesecake"
						onSubmit={(newTag) => this.addNewTag(newTag)}/>
				</ControlGroup>
			</FormGroup>;

		

		const hiddenPriceSubmitPanel = 
			<div>
				<Collapse isOpen={this.state.isNameComboValid}>

					<FormGroup 
						label={`Default Price Per ${this.state.unitOfMeasurement}:`} 
						labelFor="price-input"
						labelInfo={optionalText}>
						<InputGroup 
              className="input"
							id="price-input" 
							placeholder="$0.00" 
							ref={this.priceInput}
							onChange={(event) => this.handlePriceInput(event)}
							onBlur={() => this.displayFormattedPrice()}
							value={this.state.itemPrice}/>
					</FormGroup>

					<FormGroup
						label="Default Quantity:"
						labelFor="quantity-input"
						labelInfo={optionalText}>
						<InputGroup 
							id="quantity-input" 
							placeholder="0" 
							onChange={(event) => this.handleQuantityInput(event)}
							value={this.state.initialQuantity}/>
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

			let itemInputterClass = 'bp3-skeleton';
      if(this.props.isReadyToLoad === true) itemInputterClass = 'bp3-dark';

      const twoUniqueForm = 
      <TwoUniqueForm 
        key={this.state.inputKey}
        labelOneTitle="Name:"
        labelOneInfo={requiredText}
        labelOnePlaceholder="ex. Pumpkin"
        labelTwoTitle="Unit of Measurement:"
        labelTwoInfo={requiredText}
        labelTwoPlaceholder="ex. Slice"
        formOneFocusValue={this.state.itemName}
        formOneBlurValue={this.state.displayItemName}
        updateFormOneFormat={this.state.updateFormOneFormat}
        formTwoText={this.state.unitOfMeasurement}
        validationButtonText="Check if Name/UOM Combo Exists"
        warningMessage="This Item already exists with given UOM"
        handleFirstInput={(event) => this.handleNameInput(event)}
        handleSecondInput={(event) => this.handleUnitInput(event)}
        submitted={this.state.nameUnitChecked}
        validCombo={this.state.isNameComboValid}
        validateNameUnitCombo=
          {(isValid, name, unit) => this.validateNameUnitCombo(isValid, name, unit)}
      />;

      const itemInputter = 
      <div className="theComponent">
        <Card elevation={Elevation.TWO} className={itemInputterClass}>
          {categorySelection}
          {itemTagSelection}
          <p/>
            {twoUniqueForm}
          <p/>
          {hiddenPriceSubmitPanel}
        </Card>
      </div>;

    return itemInputter;
  }
}

export default ItemInputter;