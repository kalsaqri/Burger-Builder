import React, {Component} from 'react'; 
import Burger from "../../components/Burger/Burger"; 
import BuildControls from "../../components/Burger/BuildControls/BuildControls"; 
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'; 
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';


import axios from "../../axios-orders"; 
import Spinner from '../../components/UI/Spinner/Spinner'; 

const INGREDIENT_PRICES = {
    salad: 0.5, 
    cheese: 0.4, 
    meat: 1.3, 
    bacon: 0.7
}

class BurgerBuilder extends Component {

    state = { 
        // Using firebase for ingredients with axios (componentDidMount)
        ingredients: null,
        totalPrice: 4, 
        purchasable: false, 
        purchasing: false, 
        loading: false, 
        error: null 
    }

    componentDidMount () {
        axios.get('https://react-my-burger-7d950.firebaseio.com/ingredients.json')
        .then(response => {
            this.setState({ingredients: response.data}); 
        })
        .catch(error => {
            this.setState({error: true}); 
        });
    }

    // is burger purchasable? Used to enable/ disable order now button
    updatePurchaseState (ingredients) {

        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey]; 
            })
            .reduce((sum, el) => {
                return sum + el; 
            }, 0);

        this.setState({purchasable: sum > 0}); 

    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]; 
        const updatedCount = oldCount + 1; 

        // Using spread because of good practice and because changing values in this array will not change values in actual ingredients
        const updatedIngredients = {
            ...this.state.ingredients
        }

        updatedIngredients[type] = updatedCount;

        const priceAddition = INGREDIENT_PRICES[type]; 
        const oldPrice = this.state.totalPrice; 
        const newPrice = oldPrice + priceAddition; 

        this.setState({totalPrice: newPrice, ingredients: updatedIngredients}); 

        // Passing updateIngredients because state does not update in time for method
        this.updatePurchaseState(updatedIngredients);
        
    }

    removeIngredientHandler = (type) => { 
        const oldCount = this.state.ingredients[type]; 

        if(oldCount <= 0){
            return; 
        }

        const updatedCount = oldCount - 1; 

        // Using spread because of good practice and because changing values in this array will not change values in actual ingredients
        const updatedIngredients = {
            ...this.state.ingredients
        }

        updatedIngredients[type] = updatedCount;

        const priceDeduction = INGREDIENT_PRICES[type]; 
        const oldPrice = this.state.totalPrice; 
        const newPrice = oldPrice - priceDeduction; 

        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});  

        // Passing updateIngredients because state does not update in time for method
        this.updatePurchaseState(updatedIngredients);          
    }

    purchaseHandler = () => { 
        this.setState({purchasing: true}); 
    } 

    purchaseCancelHandler = () => {
        this.setState({purchasing: false}); 
    }

    purchaseContinueHandler = () => {
        // alert("You continue..."); 
        this.setState({loading: true}); 

        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice, // not good practice, user could manipulate price... usually calculate on server
            customer: {
                name: 'Khaled Alsaqri',
                address: {
                    street: 'Teststreet 1', 
                    zipCode: '12345',
                    country: 'USA'
                }, 
                email: 'test@test.com'
            }, 
            deliveryMethod: 'fastest'
        }

        // order sent to this url on firebase, the order that we are sending (dummy data)
        // then is to log the response from firebase (cancel loading) (close modal)
        // catch is to catch any errors (cancel loading) (close modal)

        axios.post('/orders.json', order)  
            .then(response=> {
                this.setState({loading: false, purchasing: false});
            }) 
            .catch(error => {
                this.setState({loading: false, purchasing: false});
            }); 
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        }; 

        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0; 
        }

        let orderSummary = null; 

        // Burger variable so that we can show a spinner for burger and its components when ingredients is still being 
        // pulled from the backend (firebase) because of componentDidMount 
        let burger = this.state.error ? <p>Ingredients cannot be loaded!</p> : <Spinner />;

        if(this.state.ingredients){
            burger = (
                <>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls 
                        ingredientRemoved = {this.removeIngredientHandler}
                        ingredientAdded = {this.addIngredientHandler} 
                        disabled = {disabledInfo}
                        price = {this.state.totalPrice}
                        purchasable={this.state.purchasable}
                        ordered = {this.purchaseHandler}/>
                </>
            );

            orderSummary = <OrderSummary ingredients = {this.state.ingredients}
                            purchaseCancelled = {this.purchaseCancelHandler}
                            purchaseContinued = {this.purchaseContinueHandler}
                            price = {this.state.totalPrice}/>; 
        }

        if(this.state.loading){
            orderSummary = <Spinner />; 
        }

        // Modal is being rerendered in here unecessary (Performance hit?)
        return(
            <>
                <Modal show = {this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
               {burger}
            </>
        );
    }
}

// Wrapping so this componenet is handled in a default, standardized way (found in HOC folder)
export default withErrorHandler(BurgerBuilder, axios); 