import { createContext, useReducer } from 'react'
import React from 'react'
import PropTypes from 'prop-types'

const rosterReducer = (state, action) => {
  switch (action.type) {
  case 'roster':
    return action.payload
  case 'remove':
    return action.payload
  }
}

const RosterContext = createContext()

export const RosterContextProvider = ({ children }) => {
  const [roster, rosterDispatch] = useReducer(rosterReducer, null)
  return (
    <RosterContext.Provider value={[roster, rosterDispatch]}>
      {children}
    </RosterContext.Provider>
  )
}

RosterContextProvider.propTypes = {
  children: PropTypes.object
}

export default RosterContext