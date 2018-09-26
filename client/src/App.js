import React, { Component } from 'react';
import axios from 'axios';
import {
  Button,
  Card, 
  ControlGroup, 
  Elevation, 
  FocusStyleManager, 
  Menu,
  MenuItem,
  Popover,
  Position, 
  RadioGroup,
  Radio,
  Tabs, 
  Tab
} from "@blueprintjs/core";
import ContainerOfUpdatableItemSets from './ContainerOfUpdatableItemSets.js';
import FormSelectionCard from './FormSelectionCard.js';
import ItemEditor from './ItemEditor.js';
import ItemInputter from './ItemInputter.js';
import './App.css';

FocusStyleManager.onlyShowFocusOnTabs();

//Todo:

//--High priority:
//-Remove impossible weekday menu items depending on the period
//-The server should manage periods automatically, adding and deleting as
//the date changes
//-Ability to edit/delete generic item classes in client (can currently add)
//-Limit form inputs and check them for safety
//-Produce basic reports on the client
//-Output excel reports
//-Accounts and sessions
//-Understand how to migrate and backup database remotely
//-Formal testing

//--Low priority:
//-Display period menu skeleton before it's populated
//-Replace categories with a 'loading' loop while waste form is generating
//-Replace check with a 'loading' loop while server is updating database with
//period item change
//-Produce descriptive toast on period item updates
//-Pry out shallow copy from UpdatableItemBar.js, and make it generalizable
//-Decouple the options menu and the period menu from the Waste page, and
//turn them into generalized components

class App extends Component {
 constructor() {
  super();

  this.state = {
    categoryHashAccess: null,
    categoryList: [],
    isAM: true,
    isCategoryListPopulated: false,
    isDisplayingPeriodItems: false, //Could remove?
    isItemInputterReadyToLoad: false,
    isItemInputterUpToDate: false, //Could remove?
    isItemPanelOpen: true,
    itemHashAccess: null,
    itemList: [],
    itemPanelForm: "Add New Ingredient",
    itemToEdit: null,
    periodHashAccess: null,
    periodList: [],
    selectedPeriod: null,
    selectedPeriodMenuText: "Select a Period",
    selectedWeekday: 1,
    selectedWeekdayMenuText: "Select a Weekday",
    wasteForm: "",
  }
  this.keySeed = 0;
  this.loadCategoriesPeriodsAndItems = this.loadCategoriesPeriodsAndItems.bind(this);
  this.generateWasteForm = this.generateWasteForm.bind(this);
  this.onEditButtonClick = this.onEditButtonClick.bind(this);
  this.onPeriodMenuClick = this.onPeriodMenuClick.bind(this);
  this.updatePeriodItemLists = this.updatePeriodItemLists.bind(this);
 }

 componentDidMount() {
	this.loadCategoriesPeriodsAndItems();
 }

 async loadCategoriesPeriodsAndItems() {
  const CategoryHashAccess = {};
  const categoryList = [];

  const ItemHashAccess = {};
  const itemList = [];

  const PeriodHashAccess = {};
  const periodList = [];

  const categoryData = await axios({
    mothod: 'get',
    url: 'http://localhost:3001/category'
  });

  const itemData = await axios({
    mothod: 'get',
    url: 'http://localhost:3001/item'
  })

  const periodData = await axios({
    mothod: 'get',
    url: 'http://localhost:3001/period'
  })
  
  categoryData.data.forEach((category) => {
    CategoryHashAccess[category.name] = category;
    categoryList.push(category);
  });

  itemData.data.forEach((item) => {
    ItemHashAccess[item.id] = item; 
    itemList.push(item);
  });

  periodData.data.forEach((period) => {
    PeriodHashAccess[period.id] = period;
    periodList.push(period);
  });

  this.setState({
    categoryHashAccess: CategoryHashAccess,
    categoryList: categoryList, 
    isCategoryListPopulated: true,
    isItemInputterReadyToLoad: true,
    isItemInputterUpToDate: false,
    itemHashAccess: ItemHashAccess,
    itemList: itemList,
    periodHashAccess: PeriodHashAccess,
    periodList: periodList
  });
  
 }

 generateWasteForm() {
 	if(this.state.selectedPeriod === null){
 		this.setState({wasteForm: "Select a period"});
 		return;
 	}

  const day = this.state.selectedWeekday;
  const isAM = this.state.isAM;
  const period = this.state.selectedPeriod.id;

  const url = 'http://localhost:3001/periodItem/'+day+'&'+isAM+'&'+period;
  axios({
    method: 'get',
    url: url,
  })
  .then((response) => {
    // console.log("RESPONSE DATA: " + JSON.stringify(response));
    if(response.status === 200 && response.data.length > 0) {
      let containerKey = this.keySeed;
      const wasteForm = this.state.categoryList.map((set) => {
        containerKey++;
        return React.createElement(ContainerOfUpdatableItemSets, {
          additionalItemTitle: 
          	{
          		use: true, 
          		titleAdditions: [
	          		{
	          			type: "string", 
	          			content: "; per "
	          		}, 
	          		{
	          			type: "node", 
	          			isGenericProperty: true, 
	          			node: "unitOfMeasurement"
	          		},
	          		{
	          			type: "string", 
	          			content: ": "
	          		}, 
          		]
          	},
            editItemClick: this.onEditButtonClick,
	          genericItemHashAccess: this.state.itemHashAccess,
	          genericItemSetKey: "category",
	          genericItemTitleIdentifier: "name",
	          instanceItemGenericIdentifier: "itemId",
	          instanceItemGenericKey: "itemId",
	          instanceItemList: response.data,
	          instanceItemSubmissionIndicator: "isSubmitted",
	          key: containerKey,
	          setIdentifier: "tag",
	          setList: set.tags,
	          title: set.name,
	          updatableInstanceItemProperties: ["quantity", "price"],
	          updateInstanceItemLists: this.updatePeriodItemLists
        }) 
      });

      this.setState({wasteForm: wasteForm});
    } else {
      this.setState({wasteForm: "No items found for that period."});
    }
    
  });
 }

 generateNewPeriodWasteForm() {
 	this.keySeed += this.state.categoryList.length;
 	this.generateWasteForm();
 }

 changeAMPM() {
  const toggledState = !this.state.isAM;
  this.setState({isAM: toggledState}, 
  	() => this.generateNewPeriodWasteForm());
 }

 onEditButtonClick(item) {
  const genericItem = this.state.itemHashAccess[item.itemId];

  this.setState({
    itemToEdit: genericItem,
    itemPanelForm: "Edit Selected Ingredient",
    isItemPanelOpen: true
  })
 }

 onIngredientOptionRadioClick(event) {
  console.log("Radio change: " + event.currentTarget.value);
  this.setState({itemPanelForm: event.currentTarget.value});
 }

 onPeriodMenuClick(period) {
  this.setState({
    selectedPeriod: period,
    selectedPeriodMenuText: "Selected Period: " + period.month + "." + period.week
  }, () => this.generateNewPeriodWasteForm());
 }

 onWeekdayMenuClick(weekday) {
  const weekdayEnums = {
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6,
    "Sunday": 7
  }

  const menuText = "Selected Weekday: " + weekday;

  this.setState({
    selectedWeekday: weekdayEnums[weekday],
    selectedWeekdayMenuText: menuText
  }, () => this.generateNewPeriodWasteForm());
 }

 toggleItemPanel() {
 	const currentState = this.state.isItemPanelOpen;
 	this.setState({isItemPanelOpen: !currentState});
 }

 updatePeriodItemLists(updatedItem) {
 	let newPeriodItemHashAccess = this.state.periodHashAccess;

  if(updatedItem.constructor === Array) {
    updatedItem.forEach((periodItem) => {
      newPeriodItemHashAccess[periodItem.id] = periodItem;
    })
  } else {
    newPeriodItemHashAccess[updatedItem.id] = updatedItem;
  }

 	this.setState({newPeriodItemHashAccess: newPeriodItemHashAccess},
 		() => this.generateWasteForm());
 }

  render() {

  	let itemPanelForm = null;
  	if(this.state.isItemPanelOpen === true){
      if(this.state.itemPanelForm === "Add New Ingredient") {
        itemPanelForm = 
        <ItemInputter 
          className="itemInputter"
          categoryItems={this.state.categoryList} 
          loadItems={this.loadCategoriesPeriodsAndItems}
          updatePeriodItemLists={this.updatePeriodItemLists}
          isReadyToLoad={this.state.isItemInputterReadyToLoad}
          reloadItems={this.loadCategoriesPeriodsAndItems}
          selectedPeriod={this.state.selectedPeriod}/>
      } 
      else if (this.state.itemPanelForm === "Edit Selected Ingredient") {
        const initialCategory = this.state.categoryHashAccess[this.state.itemToEdit.category];
        
        itemPanelForm =
        <ItemEditor
          category={initialCategory}
          categoryItems={this.state.categoryList}
          item={this.state.itemToEdit} 
          key={this.state.itemToEdit.name} />
      }
    } 
  	
    let disableItemEdit = ["Edit Selected Ingredient"];
    if(this.state.itemToEdit !== null) disableItemEdit = [];

    const formSelectionCard =
    <FormSelectionCard
      changeFunction={(event) => this.onIngredientOptionRadioClick(event)}
      radiosToDisable={disableItemEdit}
      radioTitles={["Add New Ingredient", "Edit Selected Ingredient"]}
      selected={this.state.itemPanelForm}
      title="Ingredient Options:"/>

    let itemPanel = 
      <div className="item-panel">
        <Card elevation={Elevation.TWO} className="panel-card" >
          {formSelectionCard}
          {itemPanelForm}
          <p/>
        </Card>
      </div>;

    if(this.state.isItemPanelOpen === false) itemPanel = null;

    const panelTabs =
      <Tabs
        id="panelTabs"
        className="bp3-tabs">
        <Tab id="waste" title="Waste" className="singleTab"/>
        <Tab id="reports" title="Reports" className="singleTab"/>
        <Tab id="admin" title="Admin" className="singleTab"/>
      </Tabs> ;

    const weekdayMenu =
      <Menu>
        <MenuItem 
          text="Monday" key="Monday" 
          onClick={() => this.onWeekdayMenuClick("Monday")} />
        <MenuItem 
          text="Tuesday" key="Tuesday" 
          onClick={() => this.onWeekdayMenuClick("Tuesday")} />
        <MenuItem 
          text="Wednesday" key="Wednesday" 
          onClick={() => this.onWeekdayMenuClick("Wednesday")} />
        <MenuItem 
          text="Thursday" key="Thursday" 
          onClick={() => this.onWeekdayMenuClick("Thursday")} />
        <MenuItem 
          text="Friday" key="Friday" 
          onClick={() => this.onWeekdayMenuClick("Friday")} />
        <MenuItem 
          text="Saturday" key="Saturday" 
          onClick={() => this.onWeekdayMenuClick("Saturday")} />
        <MenuItem 
          text="Sunday" key="Sunday" 
          onClick={() => this.onWeekdayMenuClick("Sunday")} />
      </Menu>;

    const weekdayMenuButton = 
      <Popover content={weekdayMenu} position={Position.BOTTOM}>
        <Button icon="share">
          {this.state.selectedWeekdayMenuText}
        </Button>
      </Popover>;

    const periodMenu =
      <Menu>
        {
          this.state.periodList.map((period) => 
            <MenuItem
            text={period.month + "." + period.week}
            key={period.id}
            onClick={() => this.onPeriodMenuClick(period)}
            />
          )
        }
      </Menu>;

    const periodSelector =
      <div className="period-selector bp3-dark">
      <ControlGroup >
        <Popover content={periodMenu} position={Position.BOTTOM}>
          <Button icon="share" text={this.state.selectedPeriodMenuText}/>
        </Popover>
        <Button text="Add Period"/>
        <RadioGroup
        inline="true"
        onChange={() => this.changeAMPM()}
        selectedValue={this.state.isAM}>
          <Radio label="AM" value={true}/>
          <Radio label="PM" value={false}/>
        </RadioGroup>
        {weekdayMenuButton}
      </ControlGroup>
      </div>;

    const toggleItemPanelButton =
    <Button 
    intent="warning" 
    icon="menu-closed"
    className="header-itemPanelButton"
    onClick={() => this.toggleItemPanel()}>
    	{"Toggle Ingredient Options Panel"}
    </Button>

    const contentPanel =
      <div className="content-panel">
        <div className="header">
          {toggleItemPanelButton}{panelTabs}
        </div>
        <div className="period-panel">
          {periodSelector}
        </div>
        {this.state.wasteForm}
      </div>;
      
    return (
      <div className="app">
        {itemPanel}{contentPanel}
      </div>
    );
  }
}

export default App;