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
        <button className='createUserButton' type='submit' >Create User</button>
      </form>
      {isOpen &&
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-5000 text-center text-white 
        overflow-y-auto">
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl max-w-sm w-full">
          <p>Username already taken.</p>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded border border-orange-600 m-2"
          >Close</button>
        </div>
      </div>
      }
    </div>
  )
}

export default CreateUser