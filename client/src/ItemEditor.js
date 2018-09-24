import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';
import CurrencyFormatter from 'currency-formatter';
import {
	Button,
	Card,
	ControlGroup,
	Elevation,
	FormGroup,
	InputGroup,
	Menu,
	MenuItem, 
	Popover,
	Position,
	Switch,
} from "@blueprintjs/core";

import AddToListButton from './AddToListButton.js';
import './ItemEditor.css';

class ItemEditor extends Component {
	constructor(props){
		super(props);

		this.state = {
			categoryItems: this.props.categoryItems,
			dataImpactMenuText: "Click Here to Choose a Scheme",
			displayPrice: CurrencyFormatter.format(this.props.item.price, {code: 'USD'}),
			isEdited: false,

			//Editable data
			category: this.props.category,
			isActive: this.props.item.isActive,
			isToBeDeleted: false,
			itemName: this.props.item.name,
			price: CurrencyFormatter.format(this.props.item.price, {code: 'USD'}),
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
	  	const categoryObject = {name: newCategory, tags: []}
	  	this.state.categoryItems.push(categoryObject);
	  	this.onCategoryMenuItemClick(categoryObject);
  	}
  }

  addNewTag(newTag) {
  	let noDuplicateTags = true;
  	this.state.category.tags.forEach((tag) => {
  		if(tag === newTag) noDuplicateTags = false;
  	});

  	if(noDuplicateTags) {
	  	this.state.category.tags.push(newTag);
	  	this.onTagMenuItemClick(newTag);
  	}
  	
  }

  displayFormattedPrice() {
  	this.setState({price: this.state.displayPrice})
  }

  handleNameInput(event) {
  	this.setState({itemName: event.target.value});
  }

  handlePriceInput(event) {
  	const formattedPrice =
  		CurrencyFormatter.format(event.target.value, {code: 'USD'});

  	this.setState({
  		displayPrice: formattedPrice,
  		price: event.target.value
  	});
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

  onDataImpactMenuClick(selection) {
  	this.setState({dataImpactMenuText: selection});
  }

  onSubmit() {

  	const newItem = {
  		category: this.state.category.name,
			isActive: this.state.isActive,
			name: this.state.itemName,
			price: CurrencyFormatter.unformat(this.state.price, {code: 'USD'}),
			quantity: this.state.quantity,
			tag: this.state.tag,
			unitOfMeasurement: this.state.unitOfMeasurement,
  	}

  	if(this.state.isToBeDeleted === true){
  		// do the deed
  		console.log("Delete not configured yet");
  	} else {//update
	  	
	  	Axios({
				method: 'patch',
				url: 'https://localhost:3001',
				headers: {
					'Content-Type': 'application/json'
				},
				data: {
					everyInstance: true,
					id: this.props.item.id,
					isUpdateItem: true,
					item: newItem
				}
			})
			.then((response) => console.log(response));
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

		// const dataImpactMenu = 
		// <Menu>
		// 	<MenuItem
		// 		key={1}
		// 		onClick={() => this.onDataImpactMenuClick("Every Instance")}
		// 		text="Every Instance"/>
		// 	<MenuItem				
		// 		key={2}
		// 		onClick={() => this.onDataImpactMenuClick("All Future Instances")}
		// 		text="All Future Instances"/>
		// 	<MenuItem				
		// 		key={3}
		// 		onClick={() => this.onDataImpactMenuClick("All Future Instances, and Today")}
		// 		text="All Future Instances, and Today"/>
		// 	<MenuItem
		// 		key={4}
		// 		onClick={() => this.onDataImpactMenuClick("All Past Instances")}
		// 		text="All Past Instances"/>
		// 	<MenuItem				
		// 		key={5}
		// 		onClick={() => this.onDataImpactMenuClick("All Past Instances, and Today")}
		// 		text="All Past Instances, and Today"/>
		// </Menu>

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

  // 	const dataImpactSelection =
  // 	<FormGroup
  // 		label="Data Impact:"
  // 		labelInfo="(required)"
  // 		labelFor="dataImpact-button">
  // 		<Popover content={dataImpactMenu} position={Position.RIGHT}>
		// 		<Button icon="share" id="dataImpact-button">
		// 			{this.state.dataImpactMenuText}
		// 		</Button>
		// 	</Popover>
		// </FormGroup>;

		const categorySelection = 
		<FormGroup
			label="Category:"
			labelFor="category-input"
			labelInfo="(Affects Past Reports)">
  		<ControlGroup vertical={false} >
				<Popover content={categoryMenu} position={Position.RIGHT} >
					<Button 
            id="category-input" 
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
					value={this.state.itemName}
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
					onBlur={() => this.displayFormattedPrice()}
					value={this.state.price}
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
			<Switch
				checked={this.state.isActive}
				label="Currently in use? If toggled off the item won't be included the currently selected period."
				onClick={() => this.toggleIsActiveSwitch()}
			/>;

		const deleteSwitch = 
			<Switch
				checked={this.state.isToBeDeleted}
				intent="dangerous"
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
				intent="primary">
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
	categoryItems: PropTypes.arrayOf(PropTypes.object),
	item: PropTypes.object,
}