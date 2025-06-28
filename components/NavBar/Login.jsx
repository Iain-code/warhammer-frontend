import React from 'react'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import UserContext from '../../userContext'
import userService from '../../requests/users'
import './login.css'

const CreateUser = () => {
  const [userDispatch] = useContext(UserContext)
  const [newUsername, setNewUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")

  const createUserMutation = useMutation({
    mutationFn: async (createUser) => await userService.createUser(createUser),
    onSuccess: (newUser) => {
      userDispatch({
        type: 'user',
        payload: newUser
      })
      console.log('new user dispatch ---', newUser)
    },
    onError: (error) => {
      console.error('error creating new user ---', error)
    }
  })

  const handleCreate = (e) => {
    e.preventDefault()
    const createUser = {email: newUsername, password: newPassword}
    console.log('createUser ---', createUser)

    const response = createUserMutation.mutate(createUser)
    setNewPassword("")
    setNewUsername("")
    console.log('response ---', response)
  }

  return (
    <div className='createUserForm'>
      <h3>Create User</h3>
      <form className='form1' onClick={(e) => handleCreate(e)}>
        <div className="inputRow">
          <input className='createUserInput' type='text' placeholder='Username' onChange={(e) => setNewUsername(e.target.value)} />
          <input className='createUserInput' type='password' placeholder='Password' onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <button className='createUserButton' type='submit' >Create User</button>
      </form>
    </div>
  )
}


const Login = () => {
  const [, userDispatch] = useContext(UserContext)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: (credentials) => userService.login(credentials),
    onSuccess: (newUser) => {
      userDispatch({
        type: 'user',
        payload: {
          username: newUser.email,
          id: newUser.id,
          token: newUser.token,
          isAdmin: newUser.is_admin
        }
      })
      navigate('/')
      const loginData = {
        token: newUser.token,
        email: newUser.email,
        is_admin: newUser.is_admin
      }

      window.localStorage.setItem('loggedInUser', JSON.stringify(loginData))
      console.log('local storage:', window.localStorage)
    },
    onError: (error) => {
      console.error('error loggin in ---', error)
    }
  })

  const handleLogin = (e) => {
    e.preventDefault()
    const credentials = {email: username, password: password}
    const response = loginMutation.mutate(credentials)
    console.log('response:', response)
  }

  return (
    <div>
      <div className='loginForm'>
        <h3>Login</h3>
        <form className='form1' onSubmit={(e) => handleLogin(e)}>
          <div>
            <input className='loginInput' type='text' placeholder='username' onChange={(event) => setUsername(event.target.value)}/>
            <input className='loginInput' type='password' placeholder='password' onChange={(event) => setPassword(event.target.value)}/>
          </div>
          <button className='loginButton' type='submit' >Login</button>
        </form>
      </div>
      <div>
        <CreateUser />
      </div>
    </div>
  )
}

export default Login
