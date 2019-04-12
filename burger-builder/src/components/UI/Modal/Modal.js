import React, {Component} from 'react'; 

import classes from './Modal.css'; 
import Backdrop from '../Backdrop/Backdrop'; 

class Modal extends Component {
    // Component only updates when show changes 
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.show !== this.props.show || nextProps.children !== this.props.children; 
    } 

    componentWillUpdate () {
        console.log("[Modal] Inside componentWillUpdate"); 
    }

    render() {
        return (
            <>
                <Backdrop show={this.props.show} clicked={this.props.modalClosed}></Backdrop>
                <div 
                    style = {{
                        transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
                        opacity: this.props.show ? '1' : '0'
                    }}
                    className={classes.Modal}>
                        {this.props.children}
                </div>
            </>
        );
    }
}


export default Modal; 