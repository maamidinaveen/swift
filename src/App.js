import { Component } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import UserContext from "./context/UserContext";

import Profile from "./components/Profile";
import Comments from "./components/Comments";

class App extends Component {
  state = {
    userData: {},
  };

  componentDidMount() {
    this.getUserData();
  }

  getUserData = async () => {
    const apiUrl = `https://jsonplaceholder.typicode.com/users`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    this.setState({
      userData: data[0],
    });
  };

  render() {
    const { userData } = this.state;
    return (
      <UserContext.Provider
        value={{
          userData,
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Profile />} />
            <Route path="/comments" element={<Comments />} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    );
  }
}

export default App;
