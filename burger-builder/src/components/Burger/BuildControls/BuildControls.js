import React from 'react'; 

import classes from "./BuildControls.css"; 
import BuildControl from './BuildControl/BuildControl'; 

const controls = [
    { label: 'Salad', type: 'salad'},
    { label: 'Bacon', type: 'bacon'},
    { label: 'Cheese', type: 'cheese'},
    { label: 'Meat', type: 'meat'},
];

// In disable {salad: true, meat: false, etc}
const buildControls = (props) => (
    <div className = {classes.BuildControls}>
        <p>Current Price: <strong>{props.price.toFixed(2)}</strong></p>
        {controls.map(ctrl => (
            <BuildControl 
            removed = {() => props.ingredientRemoved(ctrl.type)}
            added={() => props.ingredientAdded(ctrl.type)}
            key={ctrl.label} 
            label = {ctrl.label} 
            disable = {props.disabled[ctrl.type]}/>
        ))}
        <button 
            className={classes.OrderButton}
            disabled = {!props.purchasable}
            onClick = {props.ordered}>ORDER NOW</button>
    </div>
);

export default buildControls;