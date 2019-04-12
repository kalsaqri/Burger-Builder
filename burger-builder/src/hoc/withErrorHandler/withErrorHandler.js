import React, {Component} from 'react'; 

import Modal from '../../components/UI/Modal/Modal'; 

// This higher order componenet is used to wrap any component that is being exported 
// in order to give it a standardized way of error handling 
// "Global error handling"

// axios used to pass error
// class factory so we can have lifecycle hooks and states... keeps producing classes (this is why there is no name for the class) 
const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component {
        state = {
            error: null
        }

        // using constructor instead so that code is executed when this componenet gets created rather
        // so it can take in account componenentDidMount in Burger component 
        constructor(props){
            super(props); 
            this.reqInterceptor = axios.interceptors.request.use(req => {
                // clear null state before request sent 
                this.setState({error: null});
                return req; 
            });

            // interceptors intercept the requests or response before they are handled by then and catch
            // first param is to do something with the response data, which we do not want to do here so we instantly return it 
            this.respInterceptor = axios.interceptors.response.use(res => res, error => {
                this.setState({error: error}); 
            });
        } 


        // Better optomize code by unsetting interceptors here when unmounting 
        componentWillUnmount() { 
            // TESTING: console.log('Will Unmount', this.reqInterceptor, this.respInterceptor); 
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.respInterceptor);
        }

        // this is used so that when the user clicks away from the modal, error is reset 
        errorConfirmedHandler = () => {
            this.setState({error: null}); 
        }

        render() {
            return  (
            <>
                <Modal show = {this.state.error} modalClosed = {this.errorConfirmedHandler}>
                    {this.state.error ? this.state.error.message : null}
                </Modal>
                <WrappedComponent {...this.props} /> 
            </>);
        }
    } 
}

export default withErrorHandler; 