import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Login from '../src/components/Login/Login';
import Invitation from '../src/components/Invitation/Invitation';


class App extends Component {
  state = {
    loginForm: false,
    registerForm: false,
    jwt_token: '',
    userDetail: [
      {id: ""},
      {email: ""},
      {username: ""},
      {role: ""},
    ] 
  }

  loginForm = () => {
    this.setState({
      loginForm: true,
      registerForm: false
    });
    console.log(this.state);
  }

  registerForm = () => {
    this.setState({
      loginForm: false,
      registerForm: true
    });
    console.log(this.state);
  }

  register = (e) => {
    e.preventDefault();
    // debugger
    const username = e.target.username.value
    const email = e.target.email.value
    const password = e.target.password.value
    const password_confirmation = e.target.password_confirmation.value
    const request = {"user": {"username": username, "email": email, "password": password,"password_confirmation": password_confirmation}}
    // console.log(request)
    axios.post("http://localhost:5000/users/create", request)
        .then(res => {
          console.log(res);
          console.log(res.data);
        })
        .catch(function (error) {
          console.log(error);
        });
  };


  render() {

    //login/register 
    var form = "";
    if(this.state.loginForm === true) {
        form = (
          <Login />
        )
    };

    if(this.state.registerForm === true) {
      form = (
        <form onSubmit={this.register}>

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
            type="password_confirmation"
          />
          <br />

          <button type="submit">
              Register
          </button>
        </form>
      )
    };

    // let loginRegisterButtons = '';
    // if (this.state.jwt_token === '') {
    //   loginRegisterButtons = (

    //   )
    // }

    let invite = ''
    if (this.state.jwt_token !== '') {
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
