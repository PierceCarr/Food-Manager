import React, { Component } from 'react';
import ItemInputter from './ItemInputter.js';
import './App.css';



class App extends Component {
 constructor() {
  super();

  this.state = {
    message: "Let's load the fridge:"
  }

 }

  render() {
    return (
      <div className="App">
          <h1 className="App-title">{this.state.message}</h1>
          <ItemInputter/>
      </div>
    );
  }
}

export default App;
