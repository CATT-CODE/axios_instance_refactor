import React, { Component } from 'react'
import "./SignUp.css"
import {debounce} from 'lodash'
import {isStrongPassword} from 'validator';
import {toast} from 'react-toastify'
import { checkIsUserLoggedIn } from "../lib/helpers"
import Axios from "../lib/axios/Axios";


export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            isError: false,
            errorObj: {},
        }
        this.onChangeDebounce = debounce(this.onChangeDebounce, 1000);
    }

    componentDidMount() {
        if (checkIsUserLoggedIn()) {
            this.props.history.push("/movie-home");
        } else {
            this.props.history.push("/sign-up");
        }
    }

    handleSignup = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    onChangeDebounce = () => {
        let errorObj = {};

            if (this.state.password !== this.state.confirmPassword) {
                    errorObj.checkConfirmPassword = "Password's do not match!";
                
            }
            // if (!isStrongPassword(this.state.password)) {
            //     errorObj.checkPasswordStrength = "Password is not strong!"
            // }
            if (Object.keys(errorObj).length > 0) {
                this.setState({
                    isError: true,
                    errorObj: errorObj,
                })
            } else {
                this.setState({
                    isError: false,
                    errorObj: {},
                })
            }
    };

    handlePasswordChange = (event)  => {
        this.setState({
            [event.target.name]: event.target.value
        },
        () => {
            this.onChangeDebounce();
        });
    }

    handleOnSubmit = async (event) => {
        event.preventDefault();
        let {firstName, lastName, email, password, isError} = this.state;
        
        if (isError) {
            toast.error("Please fix password", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                transition: "slide",
                });
            return;
        }
        try {
            let result = await Axios.post("/users/sign-up", {
                firstName,
                lastName,
                email,
                password
            });
            this.setState({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
            });
            console.log(result);
            toast.success('Success, please login', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
        } catch (e) {
            console.log(e.response);
            toast.error(e.response.data, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                transition: "slide",
                });
        }
    }

    showErrorMessageObj = () => {
        // 
        console.log(this.state.errorObj);
        let errorMessageArray = Object.values(this.state.errorObj);
        return errorMessageArray.map((errorMessage, index) => {
            return (
                <div key={index} className="alert alert-danger">{errorMessage}</div>
            );
        });
    };
    
    render() {
        const { firstName, lastName, email, password, confirmPassword, isError} = this.state;

        return (
            <div className="form-body">
                
                <main className="form-signin">
                    {isError && this.showErrorMessageObj()}
                <form onSubmit={this.handleOnSubmit}>
                <h1 className="h3 mb-3 font-weight-normal">Please sign up</h1>
  <label htmlFor="inputFirstName" className="sr-only">First Name</label>
  <input type="text" id="inputFirstName" className="form-control" placeholder="First Name" name= "firstName" value={firstName} onChange={this.handleSignup} pattern="[A-Za-z]*" required autoFocus />
  
  <label htmlFor="inputLastName" className="sr-only">Last Name</label>
  <input type="text" id="inputLastName" className="form-control" placeholder="Last Name" name="lastName" value={lastName} onChange={this.handleSignup} pattern="[A-Za-z]*" required autoFocus />
  
  <label htmlFor="inputEmail" className="sr-only">Email address</label>
  <input type="email" id="inputEmail" className="form-control" placeholder="Email address" name="email" value={email} onChange={this.handleSignup} required autoFocus />
  
  <label htmlFor="inputPassword" className="sr-only">Password</label>
  <input type="text" id="inputPassword" className="form-control" placeholder="Password" name="password" value={password} onChange={this.handlePasswordChange} required />
  
  <label htmlFor="inputConformEmail" className="sr-only">Confirm Password</label>
  <input type="text" id="inputConfirmPassword" className="form-control" placeholder="Confirm Password" name="confirmPassword" value={confirmPassword} onChange={this.handlePasswordChange} required />
  
  <button className="btn btn-lg btn-primary btn-block" type="submit" disabled={isError ? true : false}>Sign in</button>
                </form>
</main>

            </div>
        )
    }
}
