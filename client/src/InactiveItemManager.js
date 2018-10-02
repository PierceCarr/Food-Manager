import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
	Button,
	Card,
	Elevation,
	FormGroup,
	Menu,
	MenuItem,
	Popover,
	Position,
	Toaster
} from "@blueprintjs/core";

import './OptionsPanel.css';

//TODO:
//-Add items that do not have period items in selected period
//-AddToPeriod button should create a period item for selected period
//-Reactivate button should update an item's isActive property to 'true'

class InactiveItemManager extends Component {
	constructor(props) {
		super(props);

		this.defaultMenuText = "Click Here to Select";

		this.state = {
			//Item data
			category: null,
			item: null,
			tag: null,

			//Visual state
			categoryMenuText: this.defaultMenuText,
			itemMenuText: this.defaultMenuText,
			tagMenuText: this.defaultMenuText,

		};
	}

	onCategoryMenuItemClick(chosenCategory) {
		this.setState({
			category: chosenCategory,
			categoryMenuText: chosenCategory.name,
			tag: null,
			tagMenuText: this.defaultMenuText
		});
	}

	onTagMenuItemClick(chosenTag) {
		this.setState({
			tag: chosenTag,
			tagMenuText: chosenTag
		});
	}

	onItemMenuItemClick(chosenItem, menuText) {
		this.setState({
			item: chosenItem,
			itemMenuText: menuText
		});
	}

	render(){
		const categoryMenuArray = [];
		const inactiveCountByTagHash = {};

		if(this.state.category !== null) {
			this.state.category.tags.forEach((tag) => {
				inactiveCountByTagHash[tag] = 0;
			})
		}

		this.props.categoryList.forEach((category) => {

			let numberOfInactiveItemsInCategory = 0;
			this.props.itemList.forEach((item) => {
				if(item.category === category.name && item.isActive === false) {
					numberOfInactiveItemsInCategory++;
					
					if(inactiveCountByTagHash[item.tag] !== undefined){
						inactiveCountByTagHash[item.tag]++;
					}
				}
			});

			if(numberOfInactiveItemsInCategory > 0) {
				const nameInMenu = category.name + ' - ' + numberOfInactiveItemsInCategory;
				const menuItem =
					<MenuItem
						text={nameInMenu}
						key={nameInMenu}
						onClick={() => this.onCategoryMenuItemClick(category)} />

				categoryMenuArray.push(menuItem);
			}
		});

		const tagMenuArray = [];
		if(this.state.category !== null) {
			this.state.category.tags.forEach((tag) => {
				if(inactiveCountByTagHash[tag] > 0) {
					const nameInMenu = tag + ' - ' + inactiveCountByTagHash[tag];
					const menuItem = 
						<MenuItem
							text={nameInMenu}
							key={nameInMenu}
							onClick={() => this.onTagMenuItemClick(tag)} />

					tagMenuArray.push(menuItem);
				}
			})
		}

		let itemsToModify = [];
		const itemMenuArray = [];
		if(this.state.category !== null) {
			const sortConditions = (item) => {
				const isActive = item.isActive;
				const isCategoryMember = item.category === this.state.category.name;
				
				let isTagFine = true;
				if(this.state.tag !== null){
					if(item.tag !== this.state.tag) isTagFine = false;
				}

				return !isActive && isCategoryMember && isTagFine;
			}

			itemsToModify = this.props.itemList.filter(sortConditions);

			itemsToModify.forEach((item) => {
				const nameInMenu = item.name + "; per " + item.unitOfMeasurement;
				itemMenuArray.push(
					<MenuItem
						text={nameInMenu}
						key={nameInMenu}
						onClick={() => this.onItemMenuItemClick(item, nameInMenu)} />
				);
			})
		}

		const categoryMenu = 
			<Menu>
				{categoryMenuArray}
			</Menu>;

		const tagMenu =
			<Menu>
				{tagMenuArray}
			</Menu>;

		const itemMenu =
			<Menu>
				{itemMenuArray}
			</Menu>;

		const categorySelection = 
			<FormGroup
				label="Category"
				labelFor="category-input">
				<Popover content={categoryMenu} position={Position.RIGHT}>
					<Button 
						className="standard-input"
						id="category-input"
						icon="share"
						text={this.state.categoryMenuText} />
				</Popover>
			</FormGroup>;

		const tagSelection = 
			<FormGroup
				label="Tag"
				labelFor="tag-input">
				<Popover content={tagMenu} position={Position.RIGHT}>
					<Button 
						className="standard-input"
						disabled={this.state.category === null}
						id="tag-input"
						icon="share"
						text={this.state.tagMenuText} />
				</Popover>
			</FormGroup>;

		const itemSelection =
			<FormGroup
				label="Inactive Items"
				labelFor="item-input">
				<Popover content={itemMenu} position={Position.RIGHT}>
					<Button 
						className="standard-input"
						disabled={this.state.category === null}
						id="item-input"
						icon="share"
						text={this.state.itemMenuText} />
				</Popover>
			</FormGroup>;

		const editButton = 
			<Button
				className="standard-input"
				disabled={this.state.item === null}
				intent="warning"
				onClick={() => this.props.onEditButtonClick(this.state.item)}
				text="Edit" />;

		const addToPeriodButton =
			<Button 
				className="standard-input"
				disabled={
					this.props.selectedPeriod === null 
					|| this.state.item === null
				}
				intent="primary"
				text="Add to Selected Period" />;

		const reactivateButton = 
			<Button
				className="standard-input"
				disabled={this.state.item === null}
				intent="primary"
				text="Reactivate"/>;

		const inactiveItemManager = 
			<div className="wrapper" >
				<Card elevation={Elevation.TWO} className="bp3-dark">
					{categorySelection}
					{tagSelection}
					{itemSelection}
					{editButton}
					{addToPeriodButton}
					{reactivateButton}
				</Card>
			</div>;

		return inactiveItemManager;
	};
}

export default InactiveItemManager;

InactiveItemManager.propTypes = {
	itemList: PropTypes.arrayOf(PropTypes.object),
	categoryList: PropTypes.arrayOf(PropTypes.object),
	onEditButtonClick: PropTypes.func,
	selectedPeriod: PropTypes.object
};