import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import CurrencyFormatter from 'currency-formatter';
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
	Toaster,
} from "@blueprintjs/core";

import AddToListButton from './AddToListButton.js';
import './OptionsPanel.css';

class ItemEditor extends Component {
	constructor(props){
		super(props);

		this.state = {
			categoryItems: this.props.categoryItems,
			displayPrice: CurrencyFormatter.format(this.props.item.price, {code: 'USD'}),
			isEdited: false,

			//Editable data
			category: this.props.category,
			isActive: this.props.item.isActive,
			isToBeDeleted: false,
			name: this.props.item.name,
			price: CurrencyFormatter.unformat(this.props.item.price, {code: 'USD'}),
			quantity: this.props.item.quantity,
			tag: this.props.item.tag,
			unitOfMeasurement: this.props.item.unitOfMeasurement,
		}
	}

	addNewCategory(newCategory) {
  	let noDuplicateCategories = true;

  	this.state.categoryItems.forEach((cat) => {
  		if(cat.name === newCategory) noDuplicateCategories = false;
  	});

  	if(noDuplicateCategories) {
	  	const categoryObject = {name: newCategory, tags: ["Etc."]};
	  	this.state.categoryItems.push(categoryObject);
	  	this.onCategoryMenuItemClick(categoryObject);
	  	this.setState({tag: "Etc."});
  	}
  }

  addNewTag(newTag) {
  	let noDuplicateTags = true;
  	this.state.category.tags.forEach((tag) => {
  		if(tag === newTag) noDuplicateTags = false;
  	});

  	if(noDuplicateTags) {
	  	this.onTagMenuItemClick(newTag);
  	}
  	
  }

  handleNameInput(event) {
  	this.setState({name: event.target.value});
  }

  handlePriceInput(event) {
  	this.setState({
  		displayPrice: event.target.value,
  		price: event.target.value
  	});
  }

  handlePriceFocus() {
  	this.setState({displayPrice: this.state.price});
  }

  handlePriceBlur() {
  	this.setState({displayPrice: CurrencyFormatter.format(this.state.price, {code: 'USD'})},
  		() => this.setState({price: CurrencyFormatter.unformat(this.state.displayPrice, {code: 'USD'})}));
  }

  handleQuantityInput(event) {
  	this.setState({quantity: event.target.value});
  }

  handleUnitOfMeasurementInput(event) {
  	this.setState({unitOfMeasurement: event.target.value});
  }

  onCategoryMenuItemClick(chosenCategory) {
  	let tagsInCategory = [];

  	let updateTags = () => {
	  	chosenCategory.tags.forEach((tag) => tagsInCategory.push(tag));
	  	this.setState({tagsFromCategory: tagsInCategory});
  	}

  	this.setState({
  		category: chosenCategory,
  		chosenTag: null,
  		// tagMenuText: "Click Here to Select"
  	}, updateTags());
  }

  async handleSubmitClick() {

  	let toastMessage = "Something unexpected happened, try refreshing.";
  	let intent = "warning";
  	const toaster = Toaster.create({position: Position.TOP});

  	if(this.state.isToBeDeleted === true){
  		// do the deed
  		console.log("Delete not configured yet");
  	} else {//update

  		const isUsingNewCategory =
  			this.props.categoryHashAccess[this.state.category.name] === undefined;

  		let isUsingNewTag = false;
  		if(!isUsingNewCategory){
  			isUsingNewTag =
  				!this.props.categoryHashAccess[this.state.category.name].tags.includes(this.state.tag);
  		}

  		if(isUsingNewCategory) {
  			const categoryPromise = await axios({
  				method: 'post',
  				url: 'http://localhost:3001/category',
					headers: {
						'Content-Type': 'application/json'
					},
					data: {
						name: this.state.category.name
					}
  			})
  			.catch((error) => {
					console.log(error.message);
					toastMessage = error + ". Failed to create new category. " 
						+ "Your edits might not have gone through, try refreshing.";
					intent = "danger";
					toaster.show({message: toastMessage, intent: intent});
				});

				const itemPromise = await axios({
					method: 'put',
  				url: 'http://localhost:3001/item',
					headers: {
						'Content-Type': 'application/json'
					},
					data: {
						id: this.props.item.id,
						fieldsToUpdate: [{category: this.state.category.name}]
					}
				})
				.catch((error) => {
					console.log(error.message);
					toastMessage = error + ". Failed to transfer the ingredient to your new category. " 
						+ "Your edits might not have gone through, try refreshing.";
					intent = "danger";
					toaster.show({message: toastMessage, intent: intent});
				});
  		}

  		if(isUsingNewTag) {
  			const tagPromise = await axios({
  				method: 'put',
  				url: 'http://localhost:3001/category',
					headers: {
						'Content-Type': 'application/json'
					},
					data: {
						categoryName: this.state.category.name,
						tagName: this.state.tag
					}
  			})
  			.catch((error) => {
					console.log(error.message);
					console.log("Tag error: " + JSON.stringify(error));
					toastMessage = error + ". Failed to create new tag. " 
						+ "Your edits might not have gone through, try refreshing.";
					intent = "danger";
					toaster.show({message: toastMessage, intent: intent});
				});
  		}

  		const fieldsToUpdate = {};
  	
			if(this.props.category.name !== this.state.category.name){
				fieldsToUpdate["category"] = this.state.category.name;
			}

			const unformattedPropPrice = 
				CurrencyFormatter.unformat(this.props.item.price, {code: 'USD'});

			if(unformattedPropPrice !== this.state.price) {
				fieldsToUpdate["price"] = this.state.price;
			}
			
			const remainingUpdatableFields = [
	  		"isActive", 
	  		"name",
	  		"quantity", 
	  		"tag",
	  		"unitOfMeasurement"
			];
	  	
	  	remainingUpdatableFields.forEach((field) => {
	  		if(this.props.item[field] !== this.state[field]){
	  			fieldsToUpdate[field] = this.state[field];
	  		}
	  	});
	  	
	  	let editPromise = await axios({
				method: 'put',
				url: 'http://localhost:3001/item',
				headers: {
					'Content-Type': 'application/json'
				},
				data: {
					id: this.props.item.id,
					fieldsToUpdate: fieldsToUpdate
				}
			})
			.catch((error) => {
				console.log(error.message);
				toastMessage = error + ". Failed to update the ingredient. Try refreshing.";
				intent = "danger";
				toaster.show({message: toastMessage, intent: intent});
			});

			console.log("Edit response: " + JSON.stringify(editPromise));

			if(editPromise.status === 200) {
				// eslint-disable-next-line
				const pause = await this.props.loadItems();
				this.props.generateWasteForm();

				toastMessage = "Edit successful";
				intent = "success";
				toaster.show({message: toastMessage, intent: intent});
			}
  	}
  }

  onTagMenuItemClick(chosenTag) {
  	this.setState({
      tag: chosenTag,
    });
  }

  toggleIsActiveSwitch() {
  	const oldState = this.state.isActive;
  	this.setState({isActive: !oldState});
  }

  toggleDeleteSwitch() {
  	const oldState = this.state.isToBeDeleted;
  	this.setState({isToBeDeleted: !oldState});
  }

	render() {
		const catArray = 
			this.state.categoryItems.map((item) => 
				<MenuItem 
					text={item.name} 
					key={item.name} 
					onClick={() => this.onCategoryMenuItemClick(item)}/>
			)

		const categoryMenu =
		<Menu>
			{catArray}
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
  							onClick={() => this.onTagMenuItemClick(tag)} 
              />
  					)
  				}
  			</Menu>
  	}

		const categorySelection = 
		<FormGroup
			label="Category:"
			labelFor="category-input"
			labelInfo="(Affects Past Reports)">
  		<ControlGroup vertical={false} >
				<Popover content={categoryMenu} position={Position.RIGHT} >
					<Button 
            id="category-input" 
            className="selection-button"
            icon="share" 
            text={this.state.category.name} />
				</Popover>
				<AddToListButton 
					text="Add New"
					label="New Category: "
					labelInfo="(unused categories will be deleted on item submission)"
					placeholder="ex. Bar"
					onSubmit={(newCategory) => this.addNewCategory(newCategory)}/>
			</ControlGroup>
		</FormGroup>;

		const tagSelection =
			<FormGroup 
				label="Item Tag:" 
				labelFor="name-input">
    		<ControlGroup vertical={false} >
			    <Popover content={tagMenu} position={Position.RIGHT} >
						<Button 
              className="selection-button"
							id="name-input" 
							icon="share" 
							text={this.state.tag} />
					</Popover>
			    <AddToListButton 
			    	text="Add New"
			    	label="New Tag: "
						labelInfo="(unused tags will be deleted on item submission)"
						placeholder="ex. Cheesecake"
						onSubmit={(newTag) => this.addNewTag(newTag)}/>
				</ControlGroup>
			</FormGroup>;

		const nameForm = 
			<FormGroup
				label="Item Name:"
				labelFor="name-input"
				labelInfo="(Affects Past Reports)">
				<InputGroup
					id="name-input"
					onChange={(event) => this.handleNameInput(event)}
					value={this.state.name}
					/>
			</FormGroup>;

		const uomForm = 
			<FormGroup
				label="Unit of Measurement:"
				labelFor="uom-input"
				labelInfo="(Affects Past Reports)">
				<InputGroup
					id="uom-input"
					onChange={(event) => this.handleUnitOfMeasurementInput(event)}
					value={this.state.unitOfMeasurement}
					/>
			</FormGroup>;

		const priceForm = 
			<FormGroup
				label="Default Price:"
				labelFor="price-input">
				<InputGroup
					id="price-input"
					onChange={(event) => this.handlePriceInput(event)}
					onBlur={() => this.handlePriceBlur()}
					onFocus={() => this.handlePriceFocus()}
					value={this.state.displayPrice}
					/>
			</FormGroup>;

		const quantityForm = 
			<FormGroup
				label="Default Quantity:"
				labelFor="quantity-input">
				<InputGroup
					id="quantity-input"
					onChange={(event) => this.handleQuantityInput(event)}
					value={this.state.quantity}
					/>
			</FormGroup>;

		const isActiveSwitch =
			<Checkbox
				checked={this.state.isActive}
				label="Use in future periods. If unchecked, item will be added to 'inactive' menu."
				onClick={() => this.toggleIsActiveSwitch()}
			/>;

		const deleteSwitch = 
			<Checkbox
				checked={this.state.isToBeDeleted}
				disabled={true}
				label="Delete? If toggled on the item will never be used in future periods."
				onClick={() => this.toggleDeleteSwitch()}
				
			/>

			let isSubmitDisabled = true;
			if(this.state.dataImpactMenuText !== "Click Here to Choose a Scheme") {
				isSubmitDisabled = false;
			}

			const submitButton =
			<Button 
				className="submit-button" 
				disabled={isSubmitDisabled}
				intent="primary"
				onClick={() => this.handleSubmitClick()}>
				Submit
			</Button>;
		
		const itemEditor = 
		<div className="wrapper">
			<Card elevation={Elevation.TWO} className="bp3-dark">
				{categorySelection}
				{tagSelection}
				{nameForm}
				{uomForm}
				{priceForm}
				{quantityForm}
				{isActiveSwitch}
				{deleteSwitch}
				{submitButton}
				
			</Card>
		</div>;

		return itemEditor;
	}
}

export default ItemEditor;

ItemEditor.propTypes = {
	category: PropTypes.object,
	categoryHashAccess: PropTypes.object,
	categoryItems: PropTypes.arrayOf(PropTypes.object),
	generateWasteForm: PropTypes.func,
	item: PropTypes.object,
	loadItems: PropTypes.func,
};