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
    <div className='flex flex-col mx-auto justify-center'>
      <div className='text-center'>
        <h3>Login</h3>
        <form className='form1' onSubmit={(e) => handleLogin(e)}>
          <div>
            <input className='loginInput' type='text' placeholder='username' onChange={(event) => setUsername(event.target.value)}/>
            <input className='loginInput' type='password' placeholder='password' onChange={(event) => setPassword(event.target.value)}/>
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
        <CreateUser />
      </div>
    </div>
  )
}

export default Login
