import PropTypes from 'prop-types'
import React from 'react'
import { createContext, useReducer } from 'react'

const modelReducer = (state, action) => {
  switch (action.type) {
  case 'attacker':
    // console.log('ACTION attacker:', action.payload)
    return {
      ...state,
      attack: action.payload
    }
  case 'defender':
    // console.log('ACTION defender', action.payload)
    return {
      ...state,
      defence: action.payload
    }
  case 'remove':
    return {
      attack: null,
      defence: null
    }
  }
}

const ModelContext = createContext()

export const ModelContextProvider = ({ children }) => {
  const [model, modelDispatch] = useReducer(modelReducer, null)

  return (
    <ModelContext.Provider value={[model, modelDispatch]}>
      {children}
    </ModelContext.Provider>
  )
}

ModelContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ModelContext