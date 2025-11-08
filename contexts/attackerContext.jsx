import { createContext, useReducer } from 'react'
import React from 'react'
import PropTypes from 'prop-types'


const attackerReducer = (state, action) => {
  switch (action.type) {
  case 'model':
    return Array.isArray(action.payload) ? [...action.payload] : []
  case 'remove':
    return [ ...action.payload ]
  default:
    return state
  }
}

const AttackerContext = createContext()

export const AttackerContextProvider = ({ children }) => {
  const [attacker, attackerDispatch] = useReducer(attackerReducer, [])

  return (
    <AttackerContext.Provider value={[attacker, attackerDispatch]}>
      {children}
    </AttackerContext.Provider>
  )
}

AttackerContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AttackerContext