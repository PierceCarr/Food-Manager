import React, {Component} from 'react';
import PropTypes from 'prop-types';
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
	Position} from "@blueprintjs/core";

import AddToListButton from './AddToListButton.js';
import './ItemEditor.css';

class ItemEditor extends Component {
	constructor(props){
		super(props);

		this.state = {
			categoryItems: this.props.categoryItems,
			isEdited: false,

			//Editable data
			category: this.props.category,
			isActive: this.props.item.isActive,
			itemName: this.props.item.name,
			price: this.props.item.price,
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

  onTagMenuItemClick(chosenTag) {
    
  	this.setState({
      tag: chosenTag,
    });

  }

	render() {
		const categoryLabel = "Category:";

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
			label={categoryLabel}
			labelFor="category-input">
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
				labelFor="name-input">
				<InputGroup
					id="name-input"
					value={this.state.itemName}
					/>
			</FormGroup>;

		const uomForm = 
			<FormGroup
				label="Unit of Measurement:"
				labelFor="name-input">
				<InputGroup
					id="name-input"
					value={this.state.unitOfMeasurement}
					/>
			</FormGroup>;

		const priceForm = 
			<FormGroup
				label="Default Price:"
				labelFor="name-input">
				<InputGroup
					id="name-input"
					value={this.state.price}
					/>
			</FormGroup>;

		const quantityForm = 
			<FormGroup
				label="Default Quantity:"
				labelFor="name-input">
				<InputGroup
					id="name-input"
					value={this.state.quantity}
					/>
			</FormGroup>;

		const submitButton =
			<Button className="submit-button" intent="primary">
				Submit
			</Button>
		

		const itemEditor = 
		<div className="wrapper">
			<Card elevation={Elevation.TWO} className="bp3-dark">
				{categorySelection}
				{tagSelection}
				{nameForm}
				{uomForm}
				{priceForm}
				{quantityForm}
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