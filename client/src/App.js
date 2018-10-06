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
import InactiveItemManager from './InactiveItemManager.js';
import './App.css';

FocusStyleManager.onlyShowFocusOnTabs();

//Todo:

//--High priority:
//-Remove impossible weekday menu items depending on the period
//-The server should manage periods automatically, adding and deleting as
//the date changes
//-Limit form inputs and check them for safety
//-Produce basic reports on the client
//-Output excel reports
//-Accounts and sessions
//-Understand how to migrate and backup database remotely
//-Formal testing

//--Low priority:
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
    isItemInputterReadyToLoad: false,
    isItemPanelOpen: true,
    itemHashAccess: null,
    itemList: [],
    itemPanelForm: "Add New Ingredient",
    itemToEdit: null,
    periodHashAccess: null,
    periodItemsForSelectedPeriod: null,
    periodList: [],
    selectedPeriod: null,
    selectedPeriodMenuText: "Select a Period",
    selectedWeekday: 1,
    selectedWeekdayMenuText: "Selected Weekday: Monday",
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
  });

  const periodData = await axios({
    mothod: 'get',
    url: 'http://localhost:3001/period'
  });
  
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
    isItemInputterReadyToLoad: true,
    itemHashAccess: ItemHashAccess,
    itemList: itemList,
    periodHashAccess: PeriodHashAccess,
    periodList: periodList
  });
  
 }

 generateWasteForm() {
 	if(this.state.selectedPeriod === null || this.state.selectedWeekday === null){
 		this.setState({wasteForm: "Select a period & weekday"});
 		return;
 	}

  const period = this.state.selectedPeriod.id;

  axios({
    method: 'get',
    url: 'http://localhost:3001/periodItem/' + period,
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

      this.setState({wasteForm: wasteForm, periodItemsForSelectedPeriod: response.data});
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
  	() => this.updateSelectedPeriod());
 }

 onEditButtonClick(item) {
  let genericItem = item;
  if(item.itemId !== undefined) { //Edit button in period item only knows id
    genericItem = this.state.itemHashAccess[item.itemId];
  }

  this.setState({
    itemToEdit: genericItem,
    itemPanelForm: "Edit Selected Ingredient",
    isItemPanelOpen: true
  });
 }

 onIngredientOptionRadioClick(event) {
  this.setState({itemPanelForm: event.currentTarget.value});
 }

 onPeriodMenuClick(periodTitle) {
  const periodLocation = periodTitle.indexOf('.');
  const firstSpace = periodTitle.indexOf(' ');

  const primaryPeriod = Number(periodTitle.substr(0, periodLocation));
  const quarterPeriod = Number(periodTitle[periodLocation + 1]);

  this.setState({
    selectedPeriodMenuText: "Selected Period: " + primaryPeriod + "." + quarterPeriod,
  }, () => this.updateSelectedPeriod());
  
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
  }, () => this.updateSelectedPeriod());
 }

 toggleItemPanel() {
 	const currentState = this.state.isItemPanelOpen;
 	this.setState({isItemPanelOpen: !currentState});
 }

 updatePeriodItemLists(updatedItem) {
 	let newPeriodItemList = this.state.periodItemsForSelectedPeriod;

  if(updatedItem.constructor === Array) {
    updatedItem.forEach((periodItem) => {
      newPeriodItemList.push(periodItem);
    })
  } else {
    newPeriodItemList.push(updatedItem);
  }

 	this.setState({periodItemsForSelectedPeriod: newPeriodItemList},
 		() => this.generateWasteForm());
 }

 updateSelectedPeriod() {
  if(this.state.selectedPeriodMenuText === "Select a Period"
     || this.state.selectedWeekday === null) {
    return;
  }

  const periodLocation = this.state.selectedPeriodMenuText.indexOf('.');
  const colonLocation = this.state.selectedPeriodMenuText.indexOf(':');

  const primaryStart = colonLocation + 2;

  const primaryPeriod = Number(this.state.selectedPeriodMenuText.slice(primaryStart, periodLocation));
  const quarterPeriod = Number(this.state.selectedPeriodMenuText[periodLocation + 1]);

  console.log("Primary: " + primaryPeriod);
  console.log("Quarter: " + quarterPeriod);

  let desiredPeriod = undefined;
  this.state.periodList.forEach((period) => {
    const isDesiredAM = period.isAM === this.state.isAM;
    const isDesiredDay = period.day === this.state.selectedWeekday;
    const isDesiredPrimary = primaryPeriod === period.primaryPeriod;
    const isDesiredQuarter = quarterPeriod === period.quarterPeriod;
  

    if(isDesiredAM && isDesiredDay && isDesiredPrimary && isDesiredQuarter) {
      desiredPeriod = period;
    }
  });
  
  if(desiredPeriod === undefined) {
    console.log("The period finding algorithm in onPeriodMenuClick is bunk.");
  } else {
    this.setState({selectedPeriod: desiredPeriod},
      () => this.generateNewPeriodWasteForm());
  }
 }

  render() {

  	let itemPanelForm = null;
  	if(this.state.isItemPanelOpen === true){
      if(this.state.itemPanelForm === "Add New Ingredient") {
        itemPanelForm = 
          <ItemInputter 
            className="itemInputter"
            categoryItems={this.state.categoryList} 
            isReadyToLoad={this.state.isItemInputterReadyToLoad}
            loadItems={this.loadCategoriesPeriodsAndItems}
            selectedPeriod={this.state.selectedPeriod}
            updatePeriodItemLists={this.updatePeriodItemLists} />
      } 
      else if (this.state.itemPanelForm === "Edit Selected Ingredient") {
        const initialCategory = this.state.categoryHashAccess[this.state.itemToEdit.category];
        console.log("INITIAL EDIT CATEGORY: " + JSON.stringify(initialCategory));
        itemPanelForm =
          <ItemEditor
            category={initialCategory}
            categoryHashAccess={this.state.categoryHashAccess}
            categoryItems={this.state.categoryList}
            generateWasteForm={this.generateWasteForm}
            item={this.state.itemToEdit} 
            key={this.state.itemToEdit.name}
            loadItems={this.loadCategoriesPeriodsAndItems}
            selectedPeriod={this.state.selectedPeriod} />
      }
      else if (this.state.itemPanelForm === "Manage Ingredients Not Included In Selected Period") {
        itemPanelForm = 
          <InactiveItemManager 
            categoryList={this.state.categoryList}
            itemList={this.state.itemList}
            loadItems={this.loadCategoriesPeriodsAndItems}
            onEditButtonClick={this.onEditButtonClick}
            periodItemsForSelectedPeriod={this.state.periodItemsForSelectedPeriod}
            selectedPeriod={this.state.selectedPeriod} />
      }
    } 

    const radiosToDisable = [];
    if(this.state.itemToEdit === null) radiosToDisable.push("Edit Selected Ingredient");
    if(this.state.selectedPeriod === null) radiosToDisable.push("Manage Ingredients Not Included In Selected Period");

    const formSelectionCard =
      <FormSelectionCard
        changeFunction={(event) => this.onIngredientOptionRadioClick(event)}
        radiosToDisable={radiosToDisable}
        radioTitles={[
          "Add New Ingredient", 
          "Edit Selected Ingredient", 
          "Manage Ingredients Not Included In Selected Period"
        ]}
        selected={this.state.itemPanelForm}
        title="Ingredient Options:" />

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
      </Tabs>;

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

    const periodMenuOptions = [];
    this.state.periodList.forEach((period) => {
      const menuTitle = 
        period.primaryPeriod + '.' + period.quarterPeriod + ' - ' + period.year; 

      if(periodMenuOptions.includes(menuTitle) === false) {
        periodMenuOptions.push(menuTitle);
      }
    });

    const periodMenu =
      <Menu>
        {
          periodMenuOptions.map((periodTitle) => 
            <MenuItem
              text={periodTitle}
              key={periodTitle}
              onClick={() => this.onPeriodMenuClick(periodTitle)}
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
    </Button>;

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