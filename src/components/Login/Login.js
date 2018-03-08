import React from 'react'
import axios from 'axios';

import Invitations from '../Invitations/Invitations';


export default class Login extends React.Component {

  state = {
    jwt_token: '',
    userDetail: [
      {id: ""},
      {email: ""},
      {username: ""},
      {role: ""},
    ],
    displayLogin: true,
    invitedUsers: [],
    token: ''
  }


  handleLogin = e => {
    e.preventDefault();

    const email = e.target.email.value
    const password = e.target.password.value
    const request = {"auth": {"email": email, "password": password}}
    axios.post("https://api-flow.herokuapp.com/user_token", request)
        .then(res => {
          this.setState({jwt_token: res.data.jwt})
          const AuthStr = 'Bearer '.concat(this.state.jwt_token);
          axios.get("https://api-flow.herokuapp.com/users/current", { headers: { Authorization: AuthStr } })
            .then(res => {
              this.setState({
                userDetail: [
                  {id: res.data.id},
                  {email: res.data.email},
                  {username: res.data.username},
                  {role: res.data.role},
              ]});
            this.setState({displayLogin: !this.state.displayLogin})
            this.handleInvitations();
          });
        })
        .catch(function (error) {
          console.log(error);
        });
  }

  handleInvitations = () => {
    axios.get("https://api-flow.herokuapp.com/invitations")
      .then(res => {
        let invited = []
        for (const inv of res.data) {
          if(inv.sender_id === this.state.userDetail[0].id) {
            invited.push(inv);
          }
        };

        this.setState({
          invitedUsers: invited
        })
      });
  
  }

  handleInvitation = e => {
    e.preventDefault();
    const email = e.target.email.value
    const message = e.target.message.value
    const request = {"email": email, "id": this.state.userDetail[0].id, "message": message, "sender_email": this.state.userDetail[1].email}
    axios.post("https://api-flow.herokuapp.com/invitations/create", request)
        .then(res => {
            this.setState({token: res.data.invitation_token}) 
            this.handleInvitations();
        });
  }



  render() {

    if (this.state.userDetail[0].id !== '') {

      let username = this.state.userDetail[2].username

      var userInformation = 
        <div className='user-detail'>
          <h1>Hello {username}</h1>
        </div>
      
    }



    // pass invited users to invitations component
    let invitations = ''
    if (this.state.userDetail[0].id !== '') {
      invitations = (
        <div>
          <h1>Your Invitations</h1>
          <Invitations
          invitationsArray={this.state.invitedUsers}/> 
        </div>
      )
    }

    // creating invitation form
    let invitationForm = ''
    if (this.state.jwt_token !== '') {
      invitationForm = (
        <div className='inviteForm'>
          <textarea name="message" form="invitationForm" placeholder='Enter text here...'></textarea>
          <form onSubmit={this.handleInvitation} id="invitationForm">

            <label htmlFor="email">Email: </label>
            <input
              name="email"
              id="email"
              type="email"
            />
            <br />


            <button type="submit">
                Invite!
            </button>

          </form>
        </div>
      )
    }

    
    let invitationLink = ''
    if (this.state.token !== '') {
      invitationLink = (
        <h1>{'https://front-end-flow.herokuapp.com/?token='.concat(this.state.token)}</h1>
      )
    };

    return (
      
      
      <div>
        <form onSubmit={this.handleLogin} className='loginForm' style={{display: this.state.displayLogin ? 'block' : 'none' }}>

          <div className='userInput'>
            <input
              placeholder="E-mail"
              name="email"
              id="email"
              type="text"
            />
          </div>

          <div className='userInput'>
            <input
              placeholder="Password"
              name="password"
              id="password"
              type="password"
            />
          </div>

          <button type="submit">
              Login
          </button>

        </form>

        { userInformation }

        <div className='inviationForm'>
          {invitationForm}
          {invitationLink}
        </div>

      
        { invitations }
        
        
      </div>

      
      

    )
  }
}
