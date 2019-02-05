import React from 'react'; 

import classes from './Button.css';

// Notice how we are passing classes into className (as an array!)
const button = (props) => (
    <button className={[classes.Button, classes[props.btnType]].join(' ')} 
            onClick={props.clicked}>{props.children}</button>
);

export default button; 