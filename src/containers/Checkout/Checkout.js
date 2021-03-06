import React, {Component} from 'react';
import CheckoutSummary from './../../components/Order/CheckoutSummary/CheckoutSummary';
import {Route} from 'react-router-dom';
import ContactData from './ContactData/ContactData';

// checkout summary
// preview button, cancel button

class Checkout extends Component{

    state = {
        ingredients: null,
        totalprice: 0
    }

    
    componentWillMount () {
        // console.log(this.props);
        const query = new URLSearchParams(this.props.location.search);   
        const ingredientGot = {};
        let price = 0;
        for (let param of query.entries()){
            // ['salad', '1']
            // [name , value]
            if( param[0] === 'price'){
                price = +param[1];
            }else{
                ingredientGot[param[0]] = +param[1];
            }
        }
        // console.log(ingredientGot)
        this.setState({ ingredients: ingredientGot, totalprice : price })
    }

    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    }

    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    }

    render(){
        return(
            <div>
                <CheckoutSummary 
                    ingredients={this.state.ingredients}
                    checkoutCancelled={this.checkoutCancelledHandler}
                    checkoutContinued={this.checkoutContinuedHandler}/>

                <Route 
                    path={this.props.match.path + '/contact-data/'} 
                    render = {(props) => (<ContactData ingredients = {this.state.ingredients} price = {this.state.totalprice} {...props}/>)}
                    />
            </div>
        )
    }
}

export default Checkout;