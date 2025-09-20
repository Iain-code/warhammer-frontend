import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import Home from "../components/NavBar/Home";
import Login from "../components/NavBar/Login";
import ArmyBuilder from "../components/ArmyBuilder/ArmyBuilder";
import About from "../components/NavBar/About";
import UserContext from "../contexts/userContext";
import Logout from '../components/NavBar/Logout.jsx'
import userService from '../requests/users'
import Admin from '../components/Admin/Admin.jsx'

const App = () => {
  const [user, userDispatch] = useContext(UserContext)
  const [showMenu, setShowMenu] = useState(false)

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

  console.log("API base:", import.meta.env.VITE_API_BASE);

  return (
    <Router>
      <nav className="flex items-center justify-between px-4 py-3 bg-gray-900 text-white">
        <div className="flex items-center">
          <a href="/">
            <img src="logo.png" alt="Logo" className="h-14 md:w-14 min-w-14 min-h-14" />
          </a>
          <div className="pl-1 ml-5">
            <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-widest text-pink-300">
            Average Dice
            </h1>
          </div>
        </div>

        <div className="hidden lg:flex lg:justify-evenly gap-x-10 justify-end text-center mr-5 items-center text-2xl font-family-sans w-1/2">
          <Link to="/" className="hover:text-pink-300 transition-colors duration-500">Home</Link>
          <Link to="/about" className="hover:text-pink-300 transition-colors duration-500">About</Link>
          <Link to="/armybuilder" className="hover:text-pink-300 transition-colors duration-500">Army Builder</Link>
          {!user ? (
            <Link to="/login" className="hover:text-pink-300">Login</Link>
          ) : (
            <Logout />
          )}
        </div>
        <div className="lg:hidden">
          <button
            className="p-2 rounded hover:bg-gray-800 md:mr-2"
            onClick={() => setShowMenu(!showMenu)}
          >
            ☰
          </button>
        </div>
      </nav>

      {showMenu && 
      <div className="lg:hidden bg-gray-800 text-white px-4 py-2 space-y-2">
        <Link to="/" className="block hover:text-pink-300 justify-center flex transition-colors duration-500">Home</Link>
        <Link to="/about" className="block hover:text-pink-300 justify-center flex transition-colors duration-500">About</Link>
        <Link to="/armybuilder" className="block hover:text-pink-300 justify-center flex transition-colors duration-500">Army Builder</Link>
        {!user ? (
          <Link to="/login" className="hover:text-pink-300 justify-center flex bg-gray-800">Login</Link>
        ) : (
          <div className="flex justify-center">
            <Logout />
          </div>
        )}
      </div>
      }

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/armybuilder" element={<ArmyBuilder />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admins" element={<Admin user={user} />} />
      </Routes>
    </Router>
  );
};

export default App;
