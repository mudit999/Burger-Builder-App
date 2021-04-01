import React, { Component } from 'react';
import classes from './ContactData.module.css';
import axios from './../../../axios-orders';
import Spinner from './../../../components/UI/Spinner/Spinner';

class ContactData extends Component{
    state = {
        name: '',
        email: '',
        address: '',
        pincode: 0,
        loading : false
    }

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({ loading : true })
        const orderData = {
            ingredients : this.props.ingredients,
            totalPrice : this.props.price,
            customerDetails: {
                name: this.state.name,
                email : this.state.email,
                address : this.state.address,
                pincode : this.state.pincode
            },
        };

        axios.post('/orders.json', orderData)
        .then(response => {
            this.setState({ loading : false });
            this.props.history.push('/')
        })
        .catch(error => {
            this.setState({ loading : false })
        })
    }

    changeNameHandler = (event) => {
        this.setState({name : event.target.value});
    }

    changeEmailHandler = (event) => {
        this.setState({email : event.target.value});
    }

    changeAddressHandler = (event) => {
        this.setState({address : event.target.value});
    }

    changePincodeHandler = (event) => {
        this.setState({pincode : event.target.value});
    }

    render(){

        let form = (
            <form onSubmit = {this.orderHandler}>
                    <input className = {classes.Input} type='text' name='name' placeholder='Your Name' onChange = {this.changeNameHandler} required/>
                    <input className = {classes.Input} type='email' name='email' placeholder='Your Mail'onChange = {this.changeEmailHandler} required/>
                    <input className = {classes.Input} type='text' name='address' placeholder='Your Address' onChange = {this.changeAddressHandler} required/>
                    <input className = {classes.Input} type='number' name='pincode' placeholder='Pincode' onChange = {this.changePincodeHandler} required/>
                    <input className = {classes.Submit} type="submit" value="ORDER" />
            </form>
        )

        if(this.state.loading){
            form = <Spinner />
        }

        return(
            <div className={classes.ContactData}>
                <h3>Enter your Contact Data</h3>
                <h5>All fields are mandatory</h5>
                {form}
            </div>
        )
    }
}

export default ContactData;