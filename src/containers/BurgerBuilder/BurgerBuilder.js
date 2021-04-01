import React, { Component } from 'react';
import Auxiliary from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from './../../components/UI/Modal/Modal';
import OrderSummary from './../../components/Burger/OrderSummary/OrderSummary';
import axios from './../../axios-orders';
import Spinner from './../../components/UI/Spinner/Spinner';
 
const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component{
    state = {
        ingredients : null,
        totalPrice : 0,
        purschasable: false,
        purschasing : false,
        loading : false
    }

    componentDidMount () {
        console.log(this.props)
        axios.get('https://burger-builder-react-deb46-default-rtdb.firebaseio.com/ingredients.json')
        .then(promise => {
            this.setState({ ingredients : promise.data });
            // console.log(promise.data);
        });
    }

    updatePurchaseState (ingredients) {
        // it will get the sum of all ingredients
        const sum = Object.keys(ingredients)
            .map(igkey => {
                return ingredients[igkey];
            })
            .reduce(((sum,el) => {
                return sum + el;
            }),0);

        this.setState({ purschasable : sum > 0 });
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;

        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;

        this.setState({
            totalPrice : newPrice,
            ingredients : updatedIngredients
        });
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if( oldCount <= 0){
            return;
        }
        const updatedCount = oldCount-1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;

        const priceSubtraction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceSubtraction;

        this.setState({
            totalPrice : newPrice,
            ingredients : updatedIngredients
        });
        this.updatePurchaseState(updatedIngredients);

    }

    purschaseHandler = () => {
        this.setState({purschasing : true})
    }

    purchaseCancelHandler = () => {
        this.setState({purschasing : false})
    }

    purchaseContinueHandler = () => {
        const queryParams = [];
        for (let i in this.state.ingredients){
            // it can encodes elements in such a way that it can be used in URL
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }

        queryParams.push('price=' + this.state.totalPrice);
        const queryString = queryParams.join('&');

        this.props.history.push({
            pathname : '/checkout/',
            search : '?' + queryString
        });
    }

    render(){
        const disabledInfo = {
            ...this.state.ingredients
        };
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <=0
        // in disabledInfo -> {salad : true, cheese : false,...} , if true then must be disabled
        }

        let orderSummary = null;
        let burger = <Spinner />

        if(this.state.ingredients){
            burger = (    
            <Auxiliary>
                <Burger ingredients = {this.state.ingredients} />
                    <BuildControls 
                    ingredientAdded = {this.addIngredientHandler}
                    ingredientSubtracted = {this.removeIngredientHandler} 
                    disabled = {disabledInfo}
                    purschasabled = {this.state.purschasable}
                    price = {this.state.totalPrice} 
                    ordered = {this.purschaseHandler}/>
            </Auxiliary> 
            ) 

            orderSummary = <OrderSummary
            orderSummary = {this.state.totalPrice.toFixed(2)}
            purchaseCanceled = {this.purchaseCancelHandler}
            purchaseContinued = {this.purchaseContinueHandler} 
            ingredients = {this.state.ingredients} />
        }
                  
        if(this.state.loading){
            orderSummary = <Spinner />
        }

        return(
            <Auxiliary>
                <Modal 
                    modalClosed = {this.purchaseCancelHandler}
                    show = {this.state.purschasing}>    
                    {orderSummary}
                </Modal>
                    {burger}
            </Auxiliary>
        );
    }
}

export default BurgerBuilder;