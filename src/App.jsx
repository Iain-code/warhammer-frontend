import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";
import React, { useContext, useEffect } from "react";
import Home from "../components/NavBar/Home";
import Login from "../components/NavBar/Login";
import ArmyBuilder from "../components/NavBar/ArmyBuilder";
import About from "../components/NavBar/About";
import UserContext from "../contexts/userContext";
import Logout from '../components/NavBar/Logout.jsx'
import userService from '../requests/users'
import Admin from '../components/NavBar/Admin.jsx'

const App = () => {
  const [user, userDispatch] = useContext(UserContext)

  const isTokenExpired = (token) => {
    if (!token) return true
    
    try {
      const payload64 = token.split('.')[1]
      const payload = JSON.parse(atob(payload64))
      const currentTime = Date.now() / 1000

      return payload.exp < currentTime
    } catch (error) {
      console.error('Invalid token format', error)
      return true
    }
  }

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedInUser')
    if (loggedUser) {
      const newUser = JSON.parse(loggedUser)
      const expiredToken = isTokenExpired(newUser.token)

      const checkToken = async () => {
        try {
          const response = await userService.refresh(newUser.token)
          userDispatch({
            type: 'user',
            payload: {
              username: newUser.username,
              id: newUser.id,
              token: response.token,
              isAdmin: newUser.is_admin
            }
          })
        } catch (error) {
          console.error(error)
          window.localStorage.clear()
          userDispatch({
            type: 'remove'
          })
        }
      }

      if (expiredToken) {
        checkToken()
      } else {
        userDispatch({
          type: 'user',
          payload: {
            username: newUser.username,
            id: newUser.id,
            token: newUser.token,
            isAdmin: newUser.is_admin
          }
        })
      }
    }
  }, [userDispatch])

  return (
    <Router>
      <nav className="navBar">
        <a href="/" >
          <img src='logo.png' alt="Logo" className="logo" />
        </a>
        <h1 className="text-base sm:text-xl md:text-3xl lg:text-5xl text-orange-500 font-sans font-semibold tracking-widest shadow-md">Average Dice</h1>
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
          <Route path="/admins" element={<Admin user={user} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
