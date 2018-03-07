import React from 'react';
import axios from 'axios';
import './Invitations.css';



export default class Invitation extends React.Component {

  state = {
    invitedUsers: []
  }

  componentDidMount() {
    axios.get("http://localhost:5000/invitations")
        .then(res => {
            let invited = []
            for (const inv of res.data) {
              if(inv.sender_id === this.props.id) {
                invited.push(inv);
              }
            };

            this.setState({
              invitedUsers: invited
            })

            console.log(this.state.invitedUsers);
        });
  }


  render() {
    let date = ''
    
    return (
      (this.state.invitedUsers.map((invitation, index) => {
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