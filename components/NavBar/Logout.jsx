import React from 'react'
import UserContext from '../../contexts/userContext'
import { useContext } from 'react'

const Logout = () => {
  const [user, userDispatch] = useContext(UserContext)

  const handleLogout = () => {
    userDispatch({
      type: 'remove'
    })
    window.localStorage.clear()
  }

  return (
    <div>
      <div className="loggedIn">Logged in as {user.username}</div>
      <button className='logoutButton' onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Logout