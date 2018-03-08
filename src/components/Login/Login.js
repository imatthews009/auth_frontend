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
    invitedUsers: []
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
            this.invitationHandler();
          });
        })
        .catch(function (error) {
          console.log(error);
        });
  }

  invitationHandler = () => {
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

  test = () => {
    console.log(this.state.invitedUsers);
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

    // pass user id and email to invitation as props to create new invitation
    let invitationForm = ''
    if (this.state.jwt_token !== '') {
      invitationForm = <Invitation
                        id={this.state.userDetail[0].id}
                        email={this.state.userDetail[1].email}
                        renderInvitations={this.invitationHandler}/>
    }

    // pass user id to allow user to get a list of invitations they've sent
    let invitations = ''
    if (this.state.userDetail[0].id !== '') {
      invitations = (
        <div>
          <h1>Your Invitations</h1>
          <Invitations
          id={this.state.userDetail[0].id}
          test={this.props.test}/> 
        </div>
      )
    }

    let date = ''

    return (
      
      
      <div>
        <button onClick={this.test}>test</button>
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

          <button type="submit" onClick={this.rerenderInvitations}>
              Login
          </button>

        </form>
        { userInformation }
        { invitationForm }
        {/* { invitations } */}
        
        {this.state.invitedUsers.map((invitation, index) => {
          if (invitation.viewed_at) {
            date = invitation.viewed_at
          } else {
            date = invitation.created_at
          }
          return (

            <div className="inviteStatus">
              <h2>E-mail: {invitation.email}</h2>
              <h2>This invitation was {invitation.status} {date.substring(0,10)} </h2>
            </div>
          )
        })}
        
      </div>

      
      

    )
  }
}
