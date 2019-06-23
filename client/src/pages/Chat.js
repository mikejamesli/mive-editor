import React, { useState, useEffect } from "react";
import Modal from "../components/modal/modal";
import io from "socket.io-client";
import { endpoint } from "../config";
//import Chatbox from "./components/chatbox/chatbox";

export default function Component(props) {
  const [show, setShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState({ user_id: "", bio: "" });
  const [post, setPost] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [socket] = useState(io(endpoint));

  function getAvatar(userId) {
    return users.find(x => x.id === userId).avatar;
  }

  function showModal(userId) {
    const user = users.find(x => x.id === userId);
    setSelectedUser(user);
    setShow(true);
  }

  function hideModal() {
    setShow(false);
  }

  useEffect(() => {
    getUser(1)
      .then(res =>
        setUsers(() => {
          users.push(res);
          return users;
        })
      )
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    socket.on("chat", function(message) {
      message.key =
        "_" +
        Math.random()
          .toString(36)
          .substr(2, 9);
      setMessages(currentMessages => [...currentMessages, message]);
    });
  }, []);

  //TODO: On new message check if we have the user data if not then fetch it and store it locally
  //const a = this.state.users.find(x => x.id === message.user_id);

  async function getUser(userId) {
    const response = await fetch(`/user/${userId}`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }
  async function handleSubmit(e) {
    e.preventDefault();
    socket.emit("chat", {
      name: "chat",
      message: post,
      timestamp: new Date().toISOString(),
      user_id: 1
    });
    setPost("");
  }

  return (
    <div>
      <Modal show={show} handleClose={hideModal}>
        <p>USERNAME: {selectedUser.id}</p>
        <p>BIO: {selectedUser.bio}</p>
      </Modal>
      <table align="center">
        <tbody>
          {messages.map(message => (
            <tr key={message.key}>
              <td className="name-column">
                <img
                  className="avatar"
                  src={getAvatar(message.user_id)}
                  alt="avatar"
                  onClick={() => showModal(message.user_id)}
                />
              </td>
              <td>{message.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={handleSubmit}>
        <p>
          <strong>Post to Server:</strong>
        </p>
        <input
          type="text"
          value={post}
          onChange={e => setPost(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
