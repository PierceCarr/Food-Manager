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
import ItemInputter from './ItemInputter.js';
import './App.css';

FocusStyleManager.onlyShowFocusOnTabs();

//Todo:

//--High priority:
//-Remove impossible weekday menu items depending on the period
//-The server should manage periods automatically, adding and deleting as
//the date changes
//-Ability to edit/delete generic item classes in client (can currently add)
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
//-Pry out shallow copy from UpdatableItemBar.js

class App extends Component {
 constructor() {
  super();

  this.state = {
    categoryHashAccess: null,
    categoryList: [],
    wasteForm: "",
    isAM: true,
    isCategoryListPopulated: false,
    isDisplayingPeriodItems: false,
    isItemInputterReadyToLoad: false,
    isItemInputterUpToDate: false,
    isItemPanelOpen: true,
    itemHashAccess: null,
    itemList: [],
    itemPanelForm: "itemInputter",
    periodHashAccess: null,
    periodList: [],
    selectedPeriod: null,
    selectedPeriodMenuText: "Select a Period",
    selectedWeekday: 1,
    selectedWeekdayMenuText: "Select a Weekday",
  }
  this.keySeed = 0;
  this.generateWasteForm = this.generateWasteForm.bind(this);
  this.onPeriodMenuClick = this.onPeriodMenuClick.bind(this);
  this.updatePeriodItemLists = this.updatePeriodItemLists.bind(this);
 }

 componentDidMount() {
	this.loadCategoriesPeriodsAndItems();

	const timeToLoadItemInputter = 
  	this.state.isCategoryListPopulated === true && 
  	this.state.isItemInputterUpToDate === false;

  if(timeToLoadItemInputter){
    this.setState({
      isItemInputterReadyToLoad: true,
      isItemInputterUpToDate: true
    });
	}
 }

 componentDidUpdate() {
  const timeToLoadItemInputter = 
    this.state.isCategoryListPopulated === true && 
    this.state.isItemInputterUpToDate === false;

  if(timeToLoadItemInputter){
    this.setState({
      isItemInputterReadyToLoad: true,
      isItemInputterUpToDate: true
    });
  }
 }

 async loadCategoriesPeriodsAndItems() {
  const CategoryHashAccess = {};
  const categoryList = [];

  const ItemHashAccess = {};
  const itemList = [];

  const PeriodHashAccess = {};
  const periodList = [];

  const dataFromServer = await axios({
    method: 'post',
    url: 'http://localhost:3001',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      isReceive: true,
      isReceivingCategoriesPeriodsAndItems: true
    }
  });

  dataFromServer.data.categories.forEach((category) => {
    CategoryHashAccess[category.name] = category;
    categoryList.push(category);
  });

  dataFromServer.data.items.forEach((item) => {
    ItemHashAccess[item.id] = item; 
    itemList.push(item);
  });

  dataFromServer.data.periods.forEach((period) => {
    PeriodHashAccess[period.id] = period;
    periodList.push(period);
  });

  this.setState({
    categoryHashAccess: CategoryHashAccess,
    categoryList: categoryList, 
    isCategoryListPopulated: true,
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
  axios({
    method: 'post',
    url: 'http://localhost:3001',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      day: this.state.selectedWeekday,
      isAM: this.state.isAM,
      isReceive: true,
      isReceivingPeriodItems: true,
      periodId: this.state.selectedPeriod.id
    }
  })
  .then((response) => {

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
 	newPeriodItemHashAccess[updatedItem.id] = updatedItem;
 	this.setState({newPeriodItemHashAccess: newPeriodItemHashAccess},
 		() => this.generateWasteForm());
 }

  render() {

  	let itemPanelForm = null;
  	if(this.state.isItemPanelOpen === false){}
  	else if(this.state.itemPanelForm === "itemInputter"){
  		itemPanelForm = 
  			<ItemInputter 
			    className="itemInputter"
			    isReadyToLoad={this.state.isItemInputterReadyToLoad}
			    categoryItems={this.state.categoryList}/>
  	}

    const itemPanel = 
      <div className="item-panel">
        <Card elevation={Elevation.TWO} className="panel-card" >
          {itemPanelForm}
          <p/>
        </Card>
      </div>;

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
        selectedValue={this.state.isAM}
        >
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