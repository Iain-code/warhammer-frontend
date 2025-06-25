import React from 'react'
import PropTypes from 'prop-types'

const CheckBoxes = ({ handleCheckboxChange }) => {

  const changeRule = (ruleName) => {
    handleCheckboxChange(ruleName)
  }

  return (
    <div className='boxes'>
      <label className='label'>
        <input
          className='box'
          type="checkbox"
          onChange={() => changeRule('isSustained')}
        />
        <br />
        Sustained
      </label>
      
      <label className='label'>
        <input
          className='box'
          type="checkbox"
          onChange={() => changeRule('isLethal')}
        />
        <br />
        Lethal
      </label>
      
      <label className='label'>
        <input
          className='box'
          type="checkbox"
          onChange={() => changeRule('isCrit5')}
        />
        <br />
        Critical 5s
      </label>
      <label className='label'>
        <input
          className='box'
          type="checkbox"
          onChange={() => changeRule('isDev')}
        />
        <br />
        Devestating Wounds
      </label>
      <label className='label'>
        <input
          className='box'
          type="checkbox"
          onChange={() => changeRule('isIgnoreCover')}
        />
        <br />
        Ignore Cover
      </label>
      <label className='label'>
        <input
          className='box'
          type="checkbox"
          onChange={() => changeRule('isTorrent')}
        />
        <br />
        Torrent
      </label>
      <label className='label'>
        <input
          className='box'
          type="checkbox"
          onChange={() => changeRule('isTwinLinked')}
        />
        <br />
        Twin Linked
      </label>
      <label className='label'>
        <input
          className='box'
          type="checkbox"
          onChange={() => changeRule('isPlusHit')}
        />
        <br />
        Plus to Hit
      </label>
      <label className='label'>
        <input
          className='box'
          type="checkbox"
          onChange={() => changeRule('isPlusWound')}
        />
        <br />
        Plus to Wound
      </label>
      <label className='label'>
        <input
          className='box'
          type="checkbox"
          onChange={() => changeRule('isMinusHit')}
        />
        <br />
        Minus to Hit
      </label>
      <label className='label'>
        <input
          className='box'
          type="checkbox"
          onChange={() => changeRule('isMinusWound')}
        />
        <br />
        Minus to Wound
      </label>
    </div>
  )
}

CheckBoxes.propTypes = {
  handleCheckboxChange: PropTypes.func.isRequired
}


export default CheckBoxes