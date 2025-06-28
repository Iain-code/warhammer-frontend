import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";
import React, { useContext, useEffect } from "react";
import Home from "../components/NavBar/Home";
import Login from "../components/NavBar/Login";
import ArmyBuilder from "../components/NavBar/ArmyBuilder";
import About from "../components/NavBar/About";
import UserContext from "../userContext";
import Logout from '../components/NavBar/Logout.jsx'

const App = () => {
  const [user, userDispatch] = useContext(UserContext)

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedInUser')
    if (loggedUser) {
      const newUser = JSON.parse(loggedUser)
      userDispatch({
        type: 'user',
        payload: {
          username: newUser.email,
          id: newUser.id,
          token: newUser.token,
          isAdmin: newUser.is_admin
        }
      })
    }
  }, [userDispatch])

  return (
    <Router>
      <nav className="navBar">
        <a href="/" >
          <img src='logo.png' alt="Logo" className="logo" />
        </a>
        <h1 className="title">Average Dice</h1>
        <Link className="home" to="/">Home</Link>
        <Link className="about" to="/about">About</Link>
        <Link className="armybuilder" to="/armybuilder">Army Builder</Link>
        {!user ? <Link className="login" to="/login" >Login</Link> : <Logout />}
      </nav>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/armybuilder" element={<ArmyBuilder />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
