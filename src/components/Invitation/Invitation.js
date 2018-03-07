import React from 'react'
import axios from 'axios';



export default class Invitation extends React.Component {

  state = {
    token: '',
  }

  handleInvitation = e => {
    e.preventDefault();

    console.log(this.props.email);
    const email = e.target.email.value
    const message = e.target.message.value
    const request = {"email": email, "id": this.props.id, "message": message, "sender_email": this.props.email}
    axios.post("http://localhost:5000/invitations/create", request)
        .then(res => {
            this.setState({token: res.data.invitation_token}) 
            console.log(res.data.invitation_token);
        });
  }

  render() {

    let inviteForm = '';
      inviteForm = (
        <div className='inviteForm'>
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
          <textarea name="message" form="invitationForm">Enter text here...</textarea>
        </div>
      )
    
    let invitationLink = ''
    if (this.state.token !== '') {
      invitationLink = (
        <h1>{'localhost:3000/?token='.concat(this.state.token)}</h1>
      )
    };


    return (
      <div>
        {inviteForm}
        {invitationLink}
      </div>
    )
  }
}
