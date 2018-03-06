import React from 'react'
import axios from 'axios';


export default class Invitation extends React.Component {



  handleInvitation = e => {
    e.preventDefault();

    const email = e.target.email.value
    const request = {"email": email, "id": this.props.id}
    axios.post("http://localhost:5000/invitations/create", request)
        .then(res => {
            console.log(res.data);
        });

  }

  render() {

    let inviteForm = '';
      inviteForm = (
        <div className='inviteForm'>
          <form onSubmit={this.handleInvitation}>

            <label htmlFor="email">Email: </label>
            <input
              name="email"
              id="email"
              type="email"
            />
            <br /><br />


            <button type="submit">
                Invite!
            </button>

          </form>
        </div>
      )


    return (
      <div>
        {inviteForm}
      </div>
    )
  }
}
