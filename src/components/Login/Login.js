import React from 'react'
import axios from 'axios';
import Invitation from '../Invitation/Invitation';
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
    test: false,
    invitedUsers: [],
    token: ''
  }


  handleLogin = e => {
    e.preventDefault();

    const email = e.target.email.value
    const password = e.target.password.value
    const request = {"auth": {"email": email, "password": password}}
    axios.post("http://localhost:5000/user_token", request)
        .then(res => {
          this.setState({jwt_token: res.data.jwt})
          const AuthStr = 'Bearer '.concat(this.state.jwt_token);
          axios.get("http://localhost:5000/users/current", { headers: { Authorization: AuthStr } })
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
    console.log('worked');
    axios.get("http://localhost:5000/invitations")
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
        console.log(this.state.invitedUsers);
      });
  
  }

  handleInvitation = e => {
    e.preventDefault();
    const email = e.target.email.value
    const message = e.target.message.value
    const request = {"email": email, "id": this.state.userDetail[0].id, "message": message, "sender_email": this.state.userDetail[1].id}
    axios.post("http://localhost:5000/invitations/create", request)
        .then(res => {
            this.setState({token: res.data.invitation_token}) 
            console.log(res.data.invitation_token);
            this.handleInvitations();
        });
  }



  render() {

    if (this.state.userDetail[0].id !== '') {

      let id = this.state.userDetail[0].id
      let email = this.state.userDetail[1].email
      let username = this.state.userDetail[2].username
      let role = this.state.userDetail[3].role

      var userInformation = 
        <div className='user-detail'>
          {/* <h1>ID: {id}</h1>
          <h1>Email: {email}</h1> */}
          <h1>Hello {username}</h1>
          {/* <h1>Role: {role}</h1> */}
        </div>
      
    }



    // pass user id to allow user to get a list of invitations they've sent
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

    let date = ''

    // creating invitation
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
        <h1>{'localhost:3000/?token='.concat(this.state.token)}</h1>
      )
    };

    return (
      
      
      <div>
        <form onSubmit={this.handleLogin} className='loginForm' style={{display: this.state.displayLogin ? 'block' : 'none' }}>

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

          <button type="submit">
              Login
          </button>

        </form>

        <div className='inviationForm'>
          {invitationForm}
          {invitationLink}
        </div>

        { userInformation }
        { invitations }
        
        
      </div>

      
      

    )
  }
}
