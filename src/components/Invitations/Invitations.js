import React from 'react';
import './Invitations.css';



export default class Invitation extends React.Component {

  render() {
    let date = ''
    
    return (
      (this.props.invitationsArray.map((invitation, index) => {
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
    }))
    )
  }
}