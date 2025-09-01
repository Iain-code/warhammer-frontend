import React from 'react'
import PropTypes from 'prop-types'

const CheckBoxes = ({ handleCheckboxChange }) => {

  const changeRule = (ruleName) => {
    handleCheckboxChange(ruleName)
  }

  return (
    <div className='flex flex-wrap justify-center font-semibold text-xl w-3/4 mx-auto gap-3'>
      <label className='flex flex-1 flex-col justify-center text-center text-white hover:bg-white/10 hover:shadow-xl bg-white/5 py-2 rounded-xl shadow-lg'>
        <input
          className='tick-boxes-box'
          type="checkbox"
          onChange={() => changeRule('isSustained')}
        />
        Sustained
      </label>
      
      <label className='flex flex-1 flex-col justify-center text-center text-white hover:bg-white/10 hover:shadow-xl bg-white/5 py-2 rounded-xl shadow-lg'>
        <input
          className='tick-boxes-box'
          type="checkbox"
          onChange={() => changeRule('isLethal')}
        />
        Lethal
      </label>
      
      <label className='flex flex-1 flex-col justify-center text-center text-white hover:bg-white/10 hover:shadow-xl bg-white/5 py-2 rounded-xl shadow-lg'>
        <input
          className='tick-boxes-box'
          type="checkbox"
          onChange={() => changeRule('isCrit5')}
        />
        Critical 5s
      </label>
      <label className='flex flex-1 flex-col justify-center text-center text-white hover:bg-white/10 hover:shadow-xl bg-white/5 py-2 rounded-xl shadow-lg'>
        <input
          className='tick-boxes-box'
          type="checkbox"
          onChange={() => changeRule('isDev')}
        />
        Dev Wounds
      </label>
      <label className='flex flex-1 flex-col justify-center text-center text-white hover:bg-white/10 hover:shadow-xl bg-white/5 py-2 rounded-xl shadow-lg'>
        <input
          className='tick-boxes-box'
          type="checkbox"
          onChange={() => changeRule('isIgnoreCover')}
        />
        Ignore Cover
      </label>
      <label className='flex flex-1 flex-col justify-center text-center text-white hover:bg-white/10 hover:shadow-xl bg-white/5 py-2 rounded-xl shadow-lg'>
        <input
          className='tick-boxes-box'
          type="checkbox"
          onChange={() => changeRule('isTorrent')}
        />
        Torrent
      </label>
      <label className='flex flex-1 flex-col justify-center text-center text-white hover:bg-white/10 hover:shadow-xl bg-white/5 py-2 rounded-xl shadow-lg'>
        <input
          className='tick-boxes-box'
          type="checkbox"
          onChange={() => changeRule('isTwinLinked')}
        />
        Twin Linked
      </label>
      <label className='flex flex-1 flex-col justify-center text-center text-white hover:bg-white/10 hover:shadow-xl bg-white/5 py-2 rounded-xl shadow-lg'>
        <input
          className='tick-boxes-box'
          type="checkbox"
          onChange={() => changeRule('isPlusHit')}
        />
        +1 to Hit
      </label>
      <label className='flex flex-1 flex-col justify-center text-center text-white hover:bg-white/10 hover:shadow-xl bg-white/5 py-2 rounded-xl shadow-lg'>
        <input
          className='tick-boxes-box'
          type="checkbox"
          onChange={() => changeRule('isPlusWound')}
        />
        +1 to Wound
      </label>
      <label className='flex flex-1 flex-col justify-center text-center text-white hover:bg-white/10 hover:shadow-xl bg-white/5 py-2 rounded-xl shadow-lg'>
        <input
          className='tick-boxes-box'
          type="checkbox"
          onChange={() => changeRule('isMinusHit')}
        />
        -1 to Hit
      </label>
      <label className='flex flex-1 flex-col justify-center text-center text-white hover:bg-white/10 hover:shadow-xl bg-white/5 py-2 rounded-xl shadow-lg'>
        <input
          className='tick-boxes-box'
          type="checkbox"
          onChange={() => changeRule('isMinusWound')}
        />
        -1 to Wound
      </label>
    </div>
  )
}

CheckBoxes.propTypes = {
  handleCheckboxChange: PropTypes.func.isRequired
}


export default CheckBoxes