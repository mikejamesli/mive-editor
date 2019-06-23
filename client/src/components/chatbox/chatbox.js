import React from "react";
import "./chatbox.css";

const Chatbox = (props) => {
  return (
    <table align="center">
      <tbody>
        {props.messages.map(message => (
          <tr key={message.key}>
            <td className="name-column">
            <img
                src={this.state.user.avatar}
                alt="avatar"
              /></td>
            <td>{message.message}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Chatbox;
