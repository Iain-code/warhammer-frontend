import PropTypes from 'prop-types'
import React from 'react'

const Toggle = ({ children, showForm }) => {

  if (showForm) {
    return (
      <div>
        {children}
      </div>
    )
  } else {
    return null
  }
}

Toggle.propTypes = {
  children: PropTypes.node.isRequired,
}
Toggle.propTypes = {
  showForm: PropTypes.string.isRequired,
}

export default Toggle