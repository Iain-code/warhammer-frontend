import React from 'react'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import UserContext from '../../contexts/userContext'
import userService from '../../requests/users'
import './login.css'
import CreateUser from './CreateUser'

const Login = () => {
  const [, userDispatch] = useContext(UserContext)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showCreateUser, setShowCreateUser] = useState(false)
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: (credentials) => userService.login(credentials),
    onSuccess: (newUser) => {
      userDispatch({
        type: 'user',
        payload: {
          username: newUser.username,
          id: newUser.id,
          token: newUser.token,
          isAdmin: newUser.is_admin
        }
      })
      navigate('/')
      const loginData = {
        token: newUser.token,
        username: newUser.username,
        is_admin: newUser.is_admin,
        id: newUser.id
      }

      window.localStorage.setItem('loggedInUser', JSON.stringify(loginData))
    },
    onError: (error) => {
      console.error('error logging in ---', error)
    }
  })

  const handleLogin = (e) => {
    e.preventDefault()
    const credentials = {username: username, password: password}
    loginMutation.mutate(credentials)
  }

  return (
    <div className='flex flex-col'>
      <div className='text-center'>
        <h3>Login</h3>
        <form 
          onSubmit={(e) => handleLogin(e)}
          className='lg:w-3/4 mx-auto py-4'
        >
          <div className=''>
            <div className='mx-auto'>
              <input 
                className='lg:w-1/3 bg-neutral-800 rounded-lg border border-white border-2 text-gray-300 text-center placeholder:text-grey-300 py-2 my-2' 
                type='text' 
                placeholder='Username' 
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
            <div>
              <input 
                className='lg:w-1/3 bg-neutral-800 rounded-lg border border-white border-2 text-gray-300 text-center placeholder:text-grey-300 py-2 my-2'
                type='password' 
                placeholder='Password' 
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          </div>
          <button 
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 
              overflow-hidden text-xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
              group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none 
              focus:ring-pink-200 dark:focus:ring-pink-800 mt-4" 
            type='submit'
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
            Login</span>
          </button>
        </form>
      </div>
      <div>
        <div className='flex justify-center'>
          <button 
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 
            overflow-hidden text-xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
            group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none 
            focus:ring-pink-200 dark:focus:ring-pink-800 mt-4"
            onClick={() => setShowCreateUser(!showCreateUser)}
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
            Sign Up</span>
          </button>
        </div>
        {showCreateUser && 
          <CreateUser />
        }
      </div>
    </div>
  )
}

export default Login
