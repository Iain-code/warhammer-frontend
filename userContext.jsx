import { createContext, useReducer } from 'react'
import React from 'react'
import PropTypes from 'prop-types'

const userReducer = (state, action) => {
  switch (action.type) {
  case 'user':
    return action.payload
  case 'remove':
    return null
  }
}

const UserContext = createContext()

export const UserContextProvider = ({ children }) => {
  const [user, userDispatch] = useReducer(userReducer, null)
  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {children}
    </UserContext.Provider>
  )
}

UserContextProvider.propTypes = {
  children: PropTypes.object
}

export default UserContext