import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Login from '../src/components/Login/Login';
import Invitation from '../src/components/Invitation/Invitation';


class App extends Component {
  state = {
    loginForm: false,
    registerForm: false,
    jwtToken: '',
    userDetail: [
      {id: ""},
      {email: ""},
      {username: ""},
      {role: ""},
    ],
    invitationToken: '',
    senderId: '',
    invitationDetail: '',
  }

  componentWillMount() {
    // grabbing invitation token from url. Putting invitation detail in state.
    let invitationToken = '';
    var SearchString = window.location.search.substring(1);
    var VariableArray = SearchString.split('&');
    for(var i = 0; i < VariableArray.length; i++){
      var KeyValuePair = VariableArray[i].split('=');
      if(KeyValuePair[0] === 'token'){
        invitationToken = KeyValuePair[1];
        this.setState({
          invitationToken
        });
      }

      axios.get("http://localhost:5000/invitations")
        .then(res => {
            let invitation = []
            for (const inv of res.data) {
              if(inv.invitation_token === this.state.invitationToken) {
                invitation.push(inv);
              }
            };

            this.setState({
              invitationDetail: invitation
            })
        });
    }
  }

  loginForm = () => {
    this.setState({
      loginForm: true,
      registerForm: false
    });
  }

  registerForm = () => {
    console.log(this.state.invitationDetail[0].status);
    // if the url has a token then update the invitation status to viewed when the register button is clicked
    if (this.state.invitationDetail && this.state.invitationDetail[0].status !== 'viewed') {
      const request = {"status": 1}
      let url = "http://localhost:5000/invitation/".concat(this.state.invitationDetail[0].id)
      axios.patch(url, request)
        .then(res => {
            console.log(res.data);
        });
    }

    this.setState({
      loginForm: false,
      registerForm: true
    });

  }

  register = (e) => {
    e.preventDefault();
    const username = e.target.username.value
    const email = e.target.email.value
    const password = e.target.password.value
    const password_confirmation = e.target.password_confirmation.value
    const request = {"user": {"username": username, "email": email, "password": password,"password_confirmation": password_confirmation}}
    axios.post("http://localhost:5000/users/create", request)
        .then(res => {
          console.log(res.data);
          if (this.state.invitationDetail) {
            const request = {"status": 2}
            let url = "http://localhost:5000/invitation/".concat(this.state.invitationDetail[0].id)
            axios.patch(url, request)
              .then(res => {
                  console.log(res.data);
              });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
  };


  render() {

    //login
    var form = "";
    if(this.state.loginForm === true) {
        form = (
          <Login />
        )
    };

    //invitation message and inviter email
    var inv = ""
    if(this.state.invitationDetail) {
      inv = (
        <div className='invDetail'>
          <h1>Invited by: {this.state.invitationDetail[0].sender_email}</h1>
          <h1>Message sent with invite: {this.state.invitationDetail[0].message}</h1>
        </div>
      )
    }


    //register form
    if(this.state.registerForm === true) {
      form = (
        
        <form onSubmit={this.register}>
          {inv}
          <label htmlFor="username">Username: </label>
          <input
            name="username"
            id="username"
            type="username"
          />
          <br />

          <label htmlFor="email">Email: </label>
          <input
            name="email"
            id="email"
            type="email"
          />
          <br /><br />

          <label htmlFor="password">Password: </label>
          <input
            name="password"
            id="password"
            type="password"
          />
          <br /><br />

          <label htmlFor="password_confirmation">Confirm Password: </label>
          <input
            name="password_confirmation"
            id="password_confirmation"
            type="password"
          />
          <br />

          <button type="submit">
              Register
          </button>
        </form>
      )
    };



    let invite = ''
    if (this.state.jwtToken !== '') {
      invite = <Invitation />
    }
      


    return (
      <div className="App">
         <div className='loginRegisterButtons'>
          <br />
          <button onClick={this.loginForm}>Login</button>
          <button onClick={this.registerForm}>Register</button>
          <br />
        </div>

        {form}

        {invite}
        
      </div>
    );
  }
}

export default App;
