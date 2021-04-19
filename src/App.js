import React, { Component } from 'react';
import MainRouter from './MainRouter'
import {ToastContainer} from 'react-toastify'
import jwtDecode from "jwt-decode";


import "react-toastify/dist/ReactToastify.css"

export class App extends Component {
  state = {
    user: null,
  }
  
  componentDidMount() {
    let getJwtToken = localStorage.getItem('jwtToken');
    console.log(getJwtToken);
    if (getJwtToken) {
      const currentTime = Date.now()/1000;
      console.log(currentTime);
      let decodedJwtToken = jwtDecode(getJwtToken);
      console.log(decodedJwtToken);
      if (decodedJwtToken.exp < currentTime) {
        this.handleUserLogout();
      } else {
        this.handleUserLogin(decodedJwtToken)
      }
    }
  }

  handleUserLogin = (user) => {
    this.setState({
      user: {
        email: user.email,
      }
    })
  }

  handleUserLogout = () => {
    localStorage.removeItem('jwtToken');
    this.setState({
      user: null,
    })
  }

  render() {
    return (
      <>
        <ToastContainer />
        <MainRouter user={this.state.user} handleUserLogin={this.handleUserLogin} handleUserLogout={this.handleUserLogout} />
      </>
    )
  }
}

export default App
