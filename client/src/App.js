import React, { Component } from "react";
import "./App.css";
import Chat from "./pages/Chat";
import { Router } from "@reach/router";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Chat path="/" />
        </Router>
      </div>
    );
  }
}

export default App;
