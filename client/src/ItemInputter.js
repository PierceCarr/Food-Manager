import React, { Component } from 'react';
import currencyFormatter from 'currency-formatter';
import axios from 'axios';
import AddToListButton from './AddToListButton.js';
import "./OptionsPanel.css";
// import TwoUniqueForm from "./TwoUniqueForm.js";
import { 
	Button, 
	Card,
  Checkbox,
	ControlGroup,
	Elevation,
	FormGroup, 
	InputGroup, 
	Menu,
	MenuItem, 
	Popover,
	Position,  
  Radio,
  RadioGroup,   
	Toaster,  
} from "@blueprintjs/core";

class ItemInputter extends Component {
  constructor(props) {
    super(props);

    this.defaultMenuText = "Click Here to Select";
    this.justInsertInSelectedDefaultText 
      = "Only include in selected day + AM/PM of selected period";
    this.insertInAllOfPeriodDefaultText
      = "Include in every day + AM/PM of selected period";

    this.state = {
    	//Item data to submit
    	category: null,
      initialQuantity: 0,
      isItemActive: true,
      itemName: "",
      itemPrice: "",
      tag: null,
    	unitOfMeasurement: "",
    	
    	//Visual state
      categoryItems: this.props.categoryItems,
      categoryMenuText: this.defaultMenuText,
      displayItemName: "",
      displayPrice: currencyFormatter.format(0.00, {code: 'USD'}),
      formattedItemName: "",
      hasCategoryMenuLoaded: false,
      inputKey: new Date(),
      isCategoryChosen: false,
      isEveryInputValid: true,
      isIncludedInCurrentPeriod: true,
      isNameComboValid: false,
      nameFormValue: "",
      nameUnitChecked: false,
      periodInsertionOption: this.justInsertInSelectedDefaultText,
      tagsFromCategory: [],
      tagMenuText: this.defaultMenuText,
    }

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
    	initialQuantity: 0,
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
    	inputKey: new Date(),
      periodInsertionOption: this.justInsertInSelectedDefaultText,
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
      formattedItemName: this.itemName,
  		category: chosenCategory,
  		chosenTag: null,
  		tagMenuText: "Click Here to Select"
  	}, updateTags(), this.onNameFocus());
  }

  onTagMenuItemClick(chosenTag) {
    let formattedName = chosenTag + ' - ' + this.state.itemName;
  	this.setState({
      tag: chosenTag,
      tagMenuText: chosenTag,
      displayItemName: formattedName,
      formattedItemName: formattedName,
    });
  }

  onNameFocus() {
    this.setState({displayItemName: this.state.itemName});
  }

  onNameBlur() {
    this.setState({displayItemName: this.state.formattedItemName});
  }

  handleNameInput(event) {
  	let trueName = event.target.value;
  	let formattedName = this.state.tag + ' - ' + trueName;
  	if(this.state.tag === null) formattedName = trueName;
  	
  	this.setState({
      displayItemName: trueName,
  		itemName: trueName,
  		formattedItemName: formattedName,
  		// isNameComboValid: false
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

  handlePeriodInsertionChange(event) {
    this.setState({periodInsertionOption: event.target.value});
  }

  handlePriceInput(event) {
  	const formattedPrice = 
  		currencyFormatter.format(event.target.value, {code: 'USD'});
  	this.setState({
  		itemPrice: event.target.value,
  		displayPrice: formattedPrice,
  	});
  }

  handleQuantityInput(event) {
  	this.setState({initialQuantity: event.target.value});
  }

  async handleSubmit() {
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

    let tagCatch = "Etc.";
    if(this.state.tag !== null) tagCatch = this.state.tag;

    let toastMessage = null;
    let intent = null;

    const isPeriodSelected = !(this.props.selectedPeriod === null) && this.state.isIncludedInCurrentPeriod;
    let periodCatch = null;
    if(isPeriodSelected) periodCatch = this.props.selectedPeriod;

    let isUpdatingAllOfPeriod = 
      isPeriodSelected === true 
      && this.state.periodInsertionOption === this.insertInAllOfPeriodDefaultText;

    console.log("isUpdatingAllOfPeriod: " + isUpdatingAllOfPeriod);

  	const itemPromise = await axios({
  		method: 'post',
  		url: 'http://localhost:3001/item',
  		headers: {
  			'Content-Type': 'application/json'
  		},
  		data: {
	  		category: this.state.category.name,
        isActive: this.state.isItemActive,
        isUpdatingAllOfPeriod: isUpdatingAllOfPeriod,
        name: this.state.itemName,
        periodToUpdate: periodCatch,
        price: priceCatch,
        quantity: this.state.initialQuantity,
	  		tag: tagCatch,
        unitOfMeasurement: this.state.unitOfMeasurement,
  		}
  	})
    .catch((error) => {
      toastMessage = "Unexpected response from server, the ingredient may not have been added or already exists.";
      intent = "danger";
      const toaster = Toaster.create({position: Position.TOP});
      toaster.show({message: toastMessage, intent: intent});
    });

    if(itemPromise.status === 201) {
      const newItem = {
        category: this.state.category,
        name: this.state.itemName,
        tag: this.state.tag,
      }

      let prettyTag = newItem.tag + " - ";
      if(newItem.tag === null) prettyTag = "";
      toastMessage = prettyTag + newItem.name + " was added to " + newItem.category.name;
      intent = "success";
      this.resetComponent();

    } else {

      toastMessage = "Unexpected response from server, the ingredient might not have been added and possibly already exists.";
      intent = "danger";
      
    }

    const toaster = Toaster.create({position: Position.TOP});
    toaster.show({message: toastMessage, intent: intent});

    const isCreatingPeriodItems = isPeriodSelected && itemPromise !== undefined;
    const isItemInputSuccessful = itemPromise.status === 200 || itemPromise.status === 201;
    if(isItemInputSuccessful && isCreatingPeriodItems) {
      // eslint-disable-next-line
      const reload = await this.props.loadItems();
      this.props.updatePeriodItemLists(itemPromise.data.periodItems);
    }
  }

  render() {
  	const categoryLabel = "Category:";
  	const optionalText = "(optional)";
  	const requiredText = "(required)";
  	const inUseExplaination = "Include in future periods. If unchecked, the item will not be used but will be saved for later.";
  	// let isTagListDisabled = false;

  	let submitText = "Submit";
  	const isSubmitAvailable = this.state.isCategoryChosen;
  	if(isSubmitAvailable === false) submitText = "Select a category to submit";

  	const tagsDontExist = 
  		this.state.category !== null && 
  		this.state.tagsFromCategory.length === 0 &&
  		this.state.tagMenuText === this.defaultMenuText;

  	let tagMenuText = this.state.tagMenuText;

  	if(tagsDontExist) {
  		tagMenuText = "No tags in chosen category";
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
              className="selection-button"
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

      const nameInput =
      <FormGroup
        label="Name:"
        labelFor="first-input"
        labelInfo={requiredText}>
        <InputGroup 
          id="first-input" 
          className="standard-input"
          placeholder="ex. Pumpkin"
          onChange={(event) => {
            this.handleNameInput(event);
          }}
          value={this.state.displayItemName}
          onFocus={() => this.onNameFocus()}
          onBlur={() => this.onNameBlur()}/>
      </FormGroup>;

      const unitInput = 
      <FormGroup
        label="Unit of Measurement:"
        labelFor="second-input"
        labelInfo={requiredText}>
        <InputGroup 
          id="second-input" 
          className="standard-input"
          placeholder="ex. Slice"
          onChange={(event) => this.handleUnitInput(event)}
          value={this.state.unitOfMeasurement}/>
      </FormGroup>;

      const priceSubmitPanel = 
      <div>
        <FormGroup 
          label={`Default Price Per ${this.state.unitOfMeasurement}:`} 
          labelFor="price-input"
          labelInfo={optionalText}>
          <InputGroup 
            className="standard-input"
            id="price-input" 
            placeholder="$0.00" 
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
            className="standard-input"
            placeholder="0" 
            onChange={(event) => this.handleQuantityInput(event)}
            value={this.state.initialQuantity}/>
        </FormGroup>

        <Card className="card-includePeriod">
          <Checkbox
            checked={this.state.isIncludedInCurrentPeriod}
            disabled={this.props.selectedPeriod === null}
            label="Include in selected period"
            onChange={() => this.setState({
              isIncludedInCurrentPeriod: !this.state.isIncludedInCurrentPeriod
            })}/>
          
          <RadioGroup
            disabled={
              this.props.selectedPeriod === null 
              || this.state.isIncludedInCurrentPeriod === false
            }
            onChange={(event) => this.handlePeriodInsertionChange(event)}
            selectedValue={this.state.periodInsertionOption}>
            <Radio 
              label={this.justInsertInSelectedDefaultText} 
              value={this.justInsertInSelectedDefaultText}/>
            <Radio 
              label={this.insertInAllOfPeriodDefaultText} 
              value={this.insertInAllOfPeriodDefaultText}/>
          </RadioGroup>
        </Card>

        <Checkbox 
          label={inUseExplaination}
          checked={this.state.isItemActive} 
          onChange={() => this.toggleIsItemActive()}/>
        
        <Button 
          className="submit" 
          onClick={() => this.handleSubmit()}
          disabled={isSubmitAvailable === false || this.state.isEveryInputValid === false}>
          {submitText}
        </Button>
      </div>;

			let itemInputterClass = 'bp3-skeleton';
      if(this.props.isReadyToLoad === true) itemInputterClass = 'bp3-dark';

      const revisedItemInputter =
      <div className="theComponent">
        <Card elevation={Elevation.TWO} className={itemInputterClass}>
          {categorySelection}
          {itemTagSelection}
          <p/>
            {nameInput}
            {unitInput}
          <p/>
          {priceSubmitPanel}
        </Card>
      </div>;

    return revisedItemInputter;
  }
}

export default ItemInputter;