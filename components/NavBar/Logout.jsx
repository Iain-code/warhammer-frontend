import React from 'react'
import UserContext from '../../contexts/userContext'
import { useContext } from 'react'

const Logout = () => {
  const [, userDispatch] = useContext(UserContext)

  const handleLogout = () => {
    userDispatch({
      type: 'remove'
    })
    window.localStorage.clear()
  }

  return (
    <div>
      <button 
        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 
              overflow-hidden text-xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
              group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none 
              focus:ring-pink-200 dark:focus:ring-pink-800 my-3"
        onClick={handleLogout}
      >
        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
            Logout
        </span>
      </button>
    </div>
  )
}

export default Logout