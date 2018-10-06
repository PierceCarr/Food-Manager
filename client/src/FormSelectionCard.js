import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Card, Elevation, RadioGroup, Radio} from '@blueprintjs/core';

class FromSelectionCard extends Component {
	// constructor(props) {
	// 	super(props);
	// }

	render() {
	
		const radios = this.props.radioTitles.map((title) => {
			let isDisabled = false;
			this.props.radiosToDisable.forEach((radio) => {
				if(title === radio) isDisabled = true;
			})

			return (
				<Radio 
					disabled={isDisabled}
					key={title}
					label={title} 
					large={true} 
					value={title} />
			);
		});

		const formSelectionCard = 
	    <Card className="bp3-dark" elevation={Elevation.TWO}>
	      <h3 style={{"marginTop": "0px"}}>
	        {this.props.title}
	      </h3>
	      <RadioGroup 
		      onChange={(event) => this.props.changeFunction(event)}
		      selectedValue={this.props.selected}
		      vertical={true}>
	        {radios}
	      </RadioGroup>
	    </Card>;

		return formSelectionCard;
	}
}

FromSelectionCard.propTypes = {
	changeFunction: PropTypes.func,
	radiosToDisable: PropTypes.arrayOf(PropTypes.string),
	radioTitles: PropTypes.arrayOf(PropTypes.string),
	selected: PropTypes.string,
	title: PropTypes.string
}

export default FromSelectionCard;