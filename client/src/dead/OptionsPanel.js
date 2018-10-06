import React, {Component} from 'react';
import {Card, Elevation} from from "@blueprintjs/core";

//This will eventually decouple the side panel from the waste page of
//Food-Manager. I'm setting it aside for now, as I have limited time
//to develop the application, so I must refactor it later.

class OptionsPanel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isVisible: true
		}
	}

	render() {
		let panel = null;
		if(this.state.isVisible){}

		const itemPanel = 
      <div className="item-panel">
        <Card elevation={Elevation.TWO} className="panel-card" >
          {itemPanelForm}
          <p/>
        </Card>
      </div>;

		return itemPanel;
	}
}

export default OptionsPanel;