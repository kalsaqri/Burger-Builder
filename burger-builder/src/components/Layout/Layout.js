import React, {Component} from 'react'; 

import classes from "./Layout.css"; 
import Toolbar from "../Navigation/Toolbar/Toolbar"; 
import SideDrawer from "../Navigation/SideDrawer/SideDrawer";

class Layout extends Component {

    state = {
        showSideDrawer: true
    }

    sideDrawerToggleHandler = () => {
        this.setState((prevState) => {
            return {showSideDrawer: !prevState.showSideDrawer}; 
        }); 
    }

    sideDrawerClosedHandler = () => {
        this.setState({showSideDrawer: false}); 
    }

    render() {
        return (
            <>    
                <Toolbar menuClick = {this.sideDrawerToggleHandler}/>
                <SideDrawer open={this.state.showSideDrawer} closed={this.sideDrawerClosedHandler}/>
                <main className = {classes.Content}>
                    {this.props.children}
                </main>
            </>
        )
    }
} 

export default Layout; 