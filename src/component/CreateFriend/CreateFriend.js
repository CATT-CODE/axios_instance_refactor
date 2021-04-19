import React, { Component } from 'react';
import Axios from "../lib/axios/Axios";
import setAuthToken from '../lib/axios/setAuthToken'

export class CreateFriend extends Component {
    state = {
        firstName: "",
        lastName: "",
        mobileNumber: "",
        nickname: "",
        isError: false,
        errorObj: {},
        isLoading: false,
        friendsArray: [],
    };

    componentDidMount = async () => {
        this.setState({
            isLoading: true,
        });
        
        try {
            let jwtToken = localStorage.getItem("jwtToken")
            let payload = await Axios.get("/friends/get-all-friends", setAuthToken(jwtToken));

            this.setState({
                isLoading: false,
                friendsArray: payload.data.friends,
            })

        } catch (e) {
            console.log(e);
        }
    }

    handleCreateFriend = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleOnSubmit = async (event) => {
        event.preventDefault();
        const { firstName, lastName, mobileNumber, nickname } = this.state;
        let jwtToken = localStorage.getItem('jwtToken')
        try {
            let payload = await Axios.post("/friends/create-friend", {
                firstName,
                lastName,
                mobileNumber,
                nickname,
            },
            setAuthToken(jwtToken));

            let newFriendsArray = [...this.state.friendsArray, payload.data]

            this.setState({
                firstName: "",
                lastName: "",
                mobileNumber: "",
                nickname: "",
                friendsArray: newFriendsArray,
            });
        } catch (e) {
            console.log(e.response);
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

    showFriendsArray = () => {
        return this.state.friendsArray.map((item) => {
          return (
              <tr key={item._id}>
                <td>{item.firstName}</td>
                <td>{item.lastName}</td>
                <td>{item.nickname}</td>
                <td>{item.mobileNumber}</td>
              </tr>
          );
        });
      };
    
    render() {
        const { firstName, lastName, nickname, mobileNumber, isError} = this.state;
        return (
            <>
                <div className="form-body">
                            <main className="form-signin">
                                {isError && this.showErrorMessageObj()}
                            <form onSubmit={this.handleOnSubmit}>
                                <h1 className="h3 mb-3 font-weight-normal">Create Friend</h1>
                                    <label htmlFor="inputFirstName" className="sr-only">First Name</label>
                                    <input type="text" id="inputFirstName" className="form-control" placeholder="First Name" name= "firstName" value={firstName} onChange={this.handleCreateFriend} pattern="[A-Za-z]*" required autoFocus />

                                    <label htmlFor="inputLastName" className="sr-only">Last Name</label>
                                    <input type="text" id="inputLastName" className="form-control" placeholder="Last Name" name="lastName" value={lastName} onChange={this.handleCreateFriend} pattern="[A-Za-z]*" required autoFocus />
    
                                    <label htmlFor="inputNickname" className="sr-only">Nickname</label>
                                    <input type="text" id="inputNickname" className="form-control" placeholder="Nickname" name="nickname" value={nickname} onChange={this.handleCreateFriend} required />

                                    <label htmlFor="inputMobileNumber" className="sr-only">Mobile Number</label>
                                    <input type="text" id="inputMobileNumber" className="form-control" placeholder="Mobile Number" name="mobileNumber" value={mobileNumber} onChange={this.handleCreateFriend} required />

                                    <button className="btn btn-lg btn-primary btn-block" type="submit" disabled={isError ? true : false}>Create</button>
                            </form>
                </main>
                ;
                            </div>

                            <div>
                  {this.state.isLoading ? (
                    <span>...loading</span>
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <table style={{ margin: "0 auto" }}>
                        <thead>
                        <tr>
                          <th style={{ width: "10%" }}>First Name</th>
                          <th>Last Name</th>
                          <th>Nickname</th>
                          <th>Mobile Number</th>
                        </tr>

                        {this.showFriendsArray()}
                        </thead>
                      </table>
                    </div>
                  )}
                </div>
            </>
        )
    }
}

export default CreateFriend
