import React from 'react';
import classes from './Burger.css'; 
import BurgerIngredient from './BurgerIngredient/BurgerIngredient'; 

const burger = (props) => {
    // Object.keys takes keys of Object (e.g. salad) and makes them an array
    // Array object makes an array of given length (e.g. Array (3) is length 3)
    let transformedIngredients = Object.keys(props.ingredients)
        .map(igKey => {
            return [...Array(props.ingredients[igKey])].map((_, i) => {
                return <BurgerIngredient key={igKey + i} type = {igKey}/>; 
            });  
        })
        // Reduce reduces array to single value 
        // Arr is previous value or initial value ([]) and el (current value) to perform function
        .reduce((arr, el) => { 
            return arr.concat(el); 
        }, []);

        console.log(transformedIngredients); 

    if(transformedIngredients.length === 0 ){
        transformedIngredients = <p>Please start adding Ingredients!</p>
    }
    
    return (
        <div className = {classes.Burger}>
            <BurgerIngredient type="bread-top"></BurgerIngredient>
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom"></BurgerIngredient>
        </div>
    );
}; 

export default burger; 