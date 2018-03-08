import React from 'react'



export default class Invitation extends React.Component {


  render() {

    let inviteForm = '';
      inviteForm = (
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


            <button onClick={this.props.renderInvitations} type="submit">
                Invite!
            </button>

          </form>
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
