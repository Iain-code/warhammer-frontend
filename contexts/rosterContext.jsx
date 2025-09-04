import { createContext, useReducer } from 'react'
import React from 'react'
import PropTypes from 'prop-types'

const rosterReducer = (state, action) => {
  switch (action.type) {
  case 'set':
    return {
      ...state, 
      cost: action.payload
    }

  case 'add':
    return {
      ...state,
      cost: state.cost += action.payload
    }

  case 'minus':
    return {
      ...state,
      cost: state.cost -= action.payload
    }

  case 'enhancement':
    return {
      ...state,
      enhancement: state.enhancement ? [ ...state.enhancement, action.payload] : [action.payload] 
    }
  
  case 'remove':
    return {
      cost: state.cost - action.payload.cost,
      enhancement: state.enhancement.filter(item => item !== action.payload.enhancement)
    }

  case 'removeEnhancements':
    return {
      cost: state.cost - action.payload.cost,
      enhancement: []
    }

  case 'reset':
    return {
      cost: 0,
      enhancement: []
    }
  
  default:
    return state;
  }
}

const RosterContext = createContext()

export const RosterContextProvider = ({ children }) => {

  const initialState = {
    cost: 0,
    enhancement: []
  }

  const [roster, rosterDispatch] = useReducer(rosterReducer, initialState)

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