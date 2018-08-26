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

import ItemInputter from './ItemInputter.js';
import './App.css';

FocusStyleManager.onlyShowFocusOnTabs();

class App extends Component {
 constructor() {
  super();

  this.state = {
    categoryHashAccess: null,
    categoryList: [],
    contentFromServer: "I am content",
    isAM: true,
    isCategoryListPopulated: false,
    isItemInputterReadyToLoad: false,
    isItemInputterUpToDate: false,
    periodHashAccess: null,
    periodList: [],
    selectedPeriod: null,
    selectedPeriodMenuText: "Select a Period",
    selectedWeekday: "1"
  }

  this.onPeriodMenuClick = this.onPeriodMenuClick.bind(this);
 }

 componentDidMount() {
  this.loadCategoriesAndPeriods();

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

 async loadCategoriesAndPeriods() {
  console.log("Loading categories");
  const categoryList = [];
  const periodList = [];
  const CategoryHashAccess = {};
  const PeriodHashAccess = {};

  let dataFromServer = await axios({
    method: 'post',
    url: 'http://localhost:3001',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      isReceive: true,
      isReceivingCategoriesAndPeriods: true
    }
  });

  console.log("Server response: " + JSON.stringify(dataFromServer.data));

  dataFromServer.data.categories.forEach((category) => {
    categoryList.push(category);
    CategoryHashAccess[category.name] = category;
  });

  dataFromServer.data.periods.forEach((period) => {
    periodList.push(period);
    PeriodHashAccess[period.id] = period;
  })

  this.setState({
    categoryHashAccess: CategoryHashAccess,
    categoryList: categoryList, 
    isCategoryListPopulated: true,
    isItemInputterUpToDate: false,
    periodHashAccess: PeriodHashAccess,
    periodList: periodList
  });
  
  // .catch((error) => {
  //   console.log(error);
  // });
 }

 generateWasteForm() {
  const cardList = [];

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
    }
  })
  .then((response) => {
    console.log(response);
  })
  
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
      </ControlGroup>
      </div>;

    const weekTabs =
      <Tabs 
      id="weekTabs" 
      onChange={(TabId) => this.setWeekday(TabId)} 
      className="bp3-tabs">
        <Tab id="1" title="Monday" className="singleTab"/>
        <Tab id="2" title="Tuesday" className="singleTab"/>
        <Tab id="3" title="Wednesday" className="singleTab"/>
        <Tab id="4" title="Thursday" className="singleTab"/>
        <Tab id="5" title="Friday" className="singleTab"/>
        <Tab id="6" title="Saturday" className="singleTab"/>
        <Tab id="7" title="Sunday" className="singleTab"/>
      </Tabs>;

    const contentPanel =
      <div className="content-panel">
        <div className="header">
          {panelTabs}
        </div>
        <div className="period-panel">
          {periodSelector}
          {weekTabs}
        </div>
        {this.state.contentFromServer}
      </div>;
      
    return (
      <div className="app">
        {itemPanel}{contentPanel}
      </div>
    );
  }
}

export default App;