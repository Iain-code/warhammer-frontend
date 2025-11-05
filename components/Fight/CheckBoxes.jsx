import React from 'react'
import PropTypes from 'prop-types'

const CheckBoxes = ({ handleCheckboxChange }) => {

  const changeRule = (ruleName) => {
    handleCheckboxChange(ruleName)
  }

  return (
    <div className='flex flex-col lg:flex-row w-3/4 mx-auto gap-2 text-white'>
      <div className='flex flex-col w-1/2 items-start w-full border-b mb-4 lg:border-0'>
        <h1 className='text-white text-xl mx-auto my-4'>Attacking Buffs</h1>
        <label className='flex flex-1 flex-row py-2 gap-x-2'>
          <input
            className='tick-boxes-box'
            type="checkbox"
            onChange={() => changeRule('isSustained')}
          />
          Sustained
        </label>
        
        <label className='flex flex-1 flex-row py-2 gap-x-2'>
          <input
            className='tick-boxes-box'
            type="checkbox"
            onChange={() => changeRule('isLethal')}
          />
          Lethal
        </label>
        <label className='flex flex-1 flex-row py-2 gap-x-2'>
          <input
            className='tick-boxes-box'
            type="checkbox"
            onChange={() => changeRule('isCrit5')}
          />
          Critical 5s
        </label>
        <label className='flex flex-1 flex-row py-2 gap-x-2'>
          <input
            className='tick-boxes-box'
            type="checkbox"
            onChange={() => changeRule('isDev')}
          />
          Dev Wounds
        </label>
        <label className='flex flex-1 flex-row py-2 gap-x-2'>
          <input
            className='tick-boxes-box'
            type="checkbox"
            onChange={() => changeRule('isTorrent')}
          />
          Torrent
        </label>
        <label className='flex flex-1 flex-row py-2 gap-x-2'>
          <input
            className='tick-boxes-box'
            type="checkbox"
            onChange={() => changeRule('isTwinLinked')}
          />
          Twin Linked
        </label>
        <label className='flex flex-1 flex-row py-2 gap-x-2'>
          <input
            className='tick-boxes-box'
            type="checkbox"
            onChange={() => changeRule('isPlusHit')}
          />
          +1 to Hit
        </label>
        <label className='flex flex-1 flex-row py-2 gap-x-2'>
          <input
            className='tick-boxes-box'
            type="checkbox"
            onChange={() => changeRule('isPlusWound')}
          />
          +1 to Wound
        </label>
        <label className='flex flex-1 flex-row py-2 gap-x-2'>
          <input
            className='tick-boxes-box'
            type="checkbox"
            onChange={() => changeRule('isReRollHits')}
          />
          Re-roll Hits
        </label>
        <label className='flex flex-1 flex-row py-2 gap-x-2'>
          <input
            className='tick-boxes-box'
            type="checkbox"
            onChange={() => changeRule('isReRollHits1')}
          />
          Re-roll Hits of 1
        </label>
        <label className='flex flex-1 flex-row py-2 gap-x-2 mb-4'>
          <input
            className='tick-boxes-box'
            type="checkbox"
            onChange={() => changeRule('isReRollWounds1')}
          />
          Re-roll Wounds of 1
        </label>
      </div>

      <div className='flex flex-col items-start w-full border-b mb-4 lg:border-0'>
        <h1 className='text-white text-xl mx-auto my-4 semi-bold'>Defensive Buffs</h1>
        <div className="flex flex-col items-start">
          <label className='flex flex-1 flex-row py-2 gap-x-2'>
            <input
              className='tick-boxes-box'
              type="checkbox"
              onChange={() => changeRule('isWithCover')}
            />
            With Cover
          </label>
          <label className='flex flex-1 flex-row py-2 gap-x-2'>
            <input
              className='tick-boxes-box'
              type="checkbox"
              onChange={() => changeRule('isMinusHit')}
            />
            -1 to Hit
          </label>
          <label className='flex flex-1 flex-row py-2 gap-x-2'>
            <input
              className='tick-boxes-box'
              type="checkbox"
              onChange={() => changeRule('isMinusWound')}
            />
            -1 to Wound
          </label>
          <label className='flex flex-1 flex-row py-2 gap-x-2'>
            <input
              className='tick-boxes-box'
              type="checkbox"
              onChange={() => changeRule('isMinusDamage')}
            />
            -1 Damage
          </label>
          <label className='flex flex-1 flex-row py-2 gap-x-2'>
            <input
              className='tick-boxes-box'
              type="checkbox"
              onChange={() => changeRule('isAoC')}
            />
            AoC
          </label>
          <label className='flex flex-1 flex-row py-2 gap-x-2'>
            <input
              className='tick-boxes-box'
              type="checkbox"
              onChange={() => changeRule('isFNP5')}
            />
            Feel No Pain 5+
          </label>
          <label className='flex flex-1 flex-row py-2 gap-x-2 mb-4'>
            <input
              className='tick-boxes-box'
              type="checkbox"
              onChange={() => changeRule('isFNP6')}
            />
            Feel No Pain 6+
          </label>
        </div>
      </div>
    </div>
  )
}

CheckBoxes.propTypes = {
  handleCheckboxChange: PropTypes.func.isRequired
}


export default CheckBoxes