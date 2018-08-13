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
    selectedWeekday: "monday",
    categoryList: [],
    categoryHashAccess: null,
    isCategoryListPopulated: false,
    isItemInputterReadyToLoad: false,
    isItemInputterUpToDate: false
    
  }

 }

 componentDidMount() {
  this.loadCategories();

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

 loadCategories() {
  console.log("Loading categories");
  let categoryList = [];
  const CategoryHashAccess = {};
  let i = -1;

  axios({
    method: 'post',
    url: 'http://localhost:3001',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      isReceive: true,
      isReceivingCategories: true
    }
  })
  .then((response) => {

    response.data.forEach((category) => {
      i++;
      categoryList.push(category);
      CategoryHashAccess[category.name] = category;
      console.log("Added " + CategoryHashAccess[categoryList[i].name].name);

    });

  })
  .then(() => {
    this.setState({
      categoryList: categoryList, 
      categoryHashAccess: CategoryHashAccess,
      isCategoryListPopulated: true,
      isItemInputterUpToDate: false
    });
  })
  .catch((error) => {
    console.log(error);
  });
 }

 // generateWasteForm() {
  
 // }

 setWeekday(newId) {
  console.log("Changed to: " + newId);
  this.setState({selectedWeekday: newId});
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
        <MenuItem text="Test Period" key="test"/>
      </Menu>;

    const periodSelector =
      <div className="period-selector bp3-dark">
      <ControlGroup >

        <Popover content={periodMenu} position={Position.BOTTOM}>
          <Button icon="share" text="Select Period"/>
        </Popover>
        <Button text="Add Period"/>
      </ControlGroup>
      </div>;

    const weekTabs =
      <Tabs 
      id="weekTabs" 
      onChange={(TabId) => this.setWeekday(TabId)} 
      className="bp3-tabs">
        <Tab id="monday" title="Monday" className="singleTab"/>
        <Tab id="tuesday" title="Tuesday" className="singleTab"/>
        <Tab id="wednesday" title="Wednesday" className="singleTab"/>
        <Tab id="thursday" title="Thursday" className="singleTab"/>
        <Tab id="friday" title="Friday" className="singleTab"/>
        <Tab id="saturday" title="Saturday" className="singleTab"/>
        <Tab id="sunday" title="Sunday" className="singleTab"/>
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
        {"I am content."}
      </div>;
      

    return (
      <div className="app">
        {itemPanel}{contentPanel}
      </div>
    );
  }
}

export default App;
