import React, { Component } from "react";
import { debounce } from "lodash";
import Axios from "../lib/axios/Axios";
import {toast} from 'react-toastify'
import jwtDecode from 'jwt-decode';

export class Profile extends Component {
    constructor(props) {
    super(props);
    this.state = {
        email: "",
        oldPassword: "",
        isError: false,
        newPassword: "",
        confirmNewPassword: "",
        errorObj: {},
    };
    this._isMounted = true;
        this.onChangeDebounce = debounce(this.onChangeDebounce, 1000);
    }
    handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            let getJwtTokenFromStorage = localStorage.getItem('jwtToken'); 
            let decodedJwtToken =  jwtDecode(getJwtTokenFromStorage);
            if (this.state.newPassword === this.state.confirmNewPassword) {
                let success = await Axios.put("users/update-user-password", {
                    email: decodedJwtToken.email,
                    newPassword: this.state.newPassword, 
                    oldPassword: this.state.oldPassword, },
                    )
                    console.log(success);
                    if (success.data.payload) {
                        this.props.handleUserLogout();
                        this.props.history.push("/login")
                    }
                    toast.success('Password changed successfully.', {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                } else {
                toast.error(e.response.data, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
                return;
            }
        } catch (e) {
            
        }
    };

    onChangeDebounce = () => {
        let errorObj = {};
        if (this.state.newPassword !== this.state.confirmNewPassword) {
            errorObj.checkConfirmPassword = "Sorry, Your password does not match!";
    }
  // if (!isStrongPassword(this.state.password)) {
  //   errorObj.checkPasswordStrength =
  //     "Password must be 8 characters long + 1 uppercase + 1 lowercase + special characters !@#$%^&*()";
  // }
  if (Object.keys(errorObj).length > 0) {
    this.setState({
    isError: true,
    errorObj: errorObj,
    });
  } else {
    this.setState({
    isError: false,
    errorObj: {},
    });
  }
  };
  handleOnPasswordChange = (event) => {
  this.setState(
    {
    [event.target.name]: event.target.value,
    },
    () => {
      if (this._isMounted) {
        this.onChangeDebounce();
      }
    }
    );

  };
  handleOldPasswordChange = (event) => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      });
    };
  showErrorMessageObj = () => {
  let errorMessageArray = Object.values(this.state.errorObj);
  return errorMessageArray.map((errorMessage, index) => {
    return (
    <div key={index} className="alert alert-danger">
      {errorMessage}
    </div>
    );
  });
  };
  componentWillUnmount() {
    this._isMounted = false;
  }
  
  render() {
  const { newPassword, confirmNewPassword, isError, oldPassword } = this.state;
  return (
    <div className="form-body">
    <main className="form-signin">
      {isError && this.showErrorMessageObj()}
      <form onSubmit={this.handleOnSubmit}>
      <h1 className="h3 mb-3 fw-normal">Change Password</h1>
      
      <label htmlFor="oldPassword" className="visually-hidden">
        Old Password
      </label>
      <input
        //type="password"
        type="text"
        id="oldPassword"
        className="form-control"
        placeholder="Old Password"
        required
        name="oldPassword"
        value={oldPassword}
        onChange={this.handleOldPasswordChange}
      />
      <br/>
      <label htmlFor="inputPassword" className="visually-hidden">
        New Password
      </label>
      <input
        //type="password"
        type="text"
        id="inputPassword"
        className="form-control"
        placeholder="New Password"
        required
        name="newPassword"
        value={newPassword}
        onChange={this.handleOnPasswordChange}
      />
      <label htmlFor="inputConfirmPassword" className="visually-hidden">
        Confirm New Password
      </label>
      <input
        //type="password"
        type="text"
        id="inputConfirmPassword"
        className="form-control"
        placeholder="Confirm New Password"
        required
        name="confirmNewPassword"
        value={confirmNewPassword}
        onChange={this.handleOnPasswordChange}
      />
      <button
        className="w-100 btn btn-lg btn-primary"
        type="submit"
        disabled={isError ? true : false}
      >
        Change Password
      </button>
      </form>
    </main>
    ;
    </div>
  );
  }
}
export default Profile;
