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
//-Display period items
//-Allow period items to be updated
//-Display period menu skeleton before it's populated
//-Grey out impossible weekday tabs depending on the period

class App extends Component {
 constructor() {
  super();

  this.state = {
    categoryHashAccess: null,
    categoryList: [],
    wasteForm: "I am content",
    isAM: true,
    isCategoryListPopulated: false,
    isDisplayingPeriodItems: false,
    isItemInputterReadyToLoad: false,
    isItemInputterUpToDate: false,
    itemHashAccess: null,
    itemList: [],
    periodItemList: [],
    periodHashAccess: null,
    periodList: [],
    selectedPeriod: null,
    selectedPeriodMenuText: "Select a Period",
    selectedWeekday: 1,
    selectedWeekdayMenuText: "Select a Weekday",
  }

  this.onPeriodMenuClick = this.onPeriodMenuClick.bind(this);
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
  let wasteForm = "";

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
    console.log("Received period items: " + JSON.stringify(response));
    console.log("Number of period items: " + response.data.length);

    if(response.status === 200 && response.data.length > 0) {
      wasteForm = this.state.categoryList.map((set) => {
        return React.createElement(ContainerOfUpdatableItemSets, {
          genericItemHashAccess: this.state.itemHashAccess,
          genericItemSetKey: "category",
          instanceItemGenericKey: "itemId",
          instanceItemList: response.data,
          setList: set.tags,
          title: set.name
        }) 
      });

      this.setState({wasteForm: wasteForm});
    } else {
      this.setState({wasteForm: "No items found for that period."});
    }
    
  });
 }

 setWeekday(newId) {
  console.log("Changed to: " + newId);
  this.setState({selectedWeekday: newId});
 }

 changeAMPM() {
  const toggledState = !this.state.isAM;
  this.setState({isAM: toggledState});
 }

 onPeriodMenuClick(period) {
  this.setState({
    selectedPeriod: period,
    selectedPeriodMenuText: "Selected Period: " + period.month + "." + period.week
  }, () => this.generateWasteForm());
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
  });
 }

  render() {

    const itemPanel = 
      <div className="item-panel">
        <Card elevation={Elevation.TWO} className="panel-card" >
          <ItemInputter 
          className="itemInputter"
          isReadyToLoad={this.state.isItemInputterReadyToLoad}
          categoryItems={this.state.categoryList}/>
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

    // const weekTabs =
    //   <Tabs 
    //   id="weekTabs" 
    //   onChange={(TabId) => this.setWeekday(TabId)} 
    //   className="bp3-tabs">
    //     <Tab id="1" title="Monday" className="singleTab"/>
    //     <Tab id="2" title="Tuesday" className="singleTab"/>
    //     <Tab id="3" title="Wednesday" className="singleTab"/>
    //     <Tab id="4" title="Thursday" className="singleTab"/>
    //     <Tab id="5" title="Friday" className="singleTab"/>
    //     <Tab id="6" title="Saturday" className="singleTab"/>
    //     <Tab id="7" title="Sunday" className="singleTab"/>
    //   </Tabs>;

    //weekTabs were under periodSelector
    const contentPanel =
      <div className="content-panel">
        <div className="header">
          {panelTabs}
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