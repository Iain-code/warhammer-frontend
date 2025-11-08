import { createContext, useReducer } from "react";
import React from 'react'
import PropTypes from "prop-types";

const defenderReducer = (state, action) => {
  switch (action.type) {
  case 'model':
    return Array.isArray(action.payload) ? [...action.payload] : [];
  case 'remove':
    return action.payload 
  default:
    return state
  }
}

const DefenderContext = createContext()

export const DefenderContextProvider = ({ children }) => {
  const [defender, defenderDispatch] = useReducer(defenderReducer, [])

  return (
    <DefenderContext.Provider value={[defender, defenderDispatch]}>
      {children}
    </DefenderContext.Provider>
  )
}

DefenderContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DefenderContext