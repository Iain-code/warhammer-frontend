import React from 'react'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import userService from '../../requests/users'

const CreateUser = () => {
  const [newUsername, setNewUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const createUserMutation = useMutation({
    mutationFn: async (createUser) => await userService.createUser(createUser),
    onSuccess: (newUser) => {
      window.alert(`User ${newUser.username} has been created. Please login to continue`)
    },
    onError: (error) => {
      if (error.response?.data?.error_msg === "failed to create user") {
        setIsOpen(true)
      }
      console.error('error creating new user', error)
    }
  })

  const handleCreate = (e) => {
    e.preventDefault()
    const createUser = {username: newUsername, password: newPassword}
    createUserMutation.mutate(createUser)
    setNewPassword("")
    setNewUsername("")
  }

  return (
    <div className='createUserForm'>
      <h3>Create User</h3>
      <form className='form1' onSubmit={(e) => handleCreate(e)}>
        <div className="inputRow">
          <input 
            className='createUserInput' 
            type='text' placeholder='Username' 
            onChange={(e) => setNewUsername(e.target.value)} 
            value={newUsername}
          />
          <input 
            className='createUserInput' 
            type='password' 
            placeholder='Password' 
            onChange={(e) => setNewPassword(e.target.value)} 
            value={newPassword}
          />
        </div>
        <button 
          className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 
            overflow-hidden text-xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
            group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none 
            focus:ring-pink-200 dark:focus:ring-pink-800 mt-4" 
          type='submit' 
        >
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
            Create User
          </span>
        </button>
      </form>
      {isOpen &&
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-5000 text-center text-white 
        overflow-y-auto">
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl max-w-sm w-full">
          <p>Username already taken.</p>
          <button 
            onClick={() => setIsOpen(false)}
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 
              overflow-hidden text-xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
              group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none 
              focus:ring-pink-200 dark:focus:ring-pink-800 mt-4"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
            Close
            </span>
          </button>
        </div>
      </div>
      }
    </div>
  )
}

export default CreateUser