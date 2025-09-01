import { useState } from 'react'
import React from 'react'
import CheckBoxes from './CheckBoxes'
import Fight from './Fight'
import PropTypes from 'prop-types'

const ExtraRules = ({ wargear, defender }) => {
  const [strengthGain, setStrengthGain] = useState(0)
  const [toughnessGain, setToughnessGain] = useState(0)
  const [extraRules, setExtraRules] = useState({
    isSustained: false,
    isLethal: false,
    isCrit5: false,
    isDev: false,
    isIgnoreCover: false,
    isTorrent: false,
    isTwinLinked: false,
    isPlusHit: false,
    isPlusWound: false,
    isMinusHit: false,
    isMinusWound: false,
  })

  const handleCheckboxChange = (stateToChange) => {
    setExtraRules(prev => ({
      ...prev, [stateToChange]: !prev[stateToChange]
    }))
  }

  if (!wargear) {
    return <div></div>
  }

  return (
    <div>
      <div>
        <h1 className='flex justify-center text-3xl text-white shadow:lg'>Special Rules</h1>
      </div>
      <div> 
        <br />
        <CheckBoxes handleCheckboxChange={handleCheckboxChange}/>
        <div className='flex flex-col lg:w-1/6 sm:w-3/4 mx-auto text-white justify-center mt-6'>
          <label htmlFor="strSlider" className="block mb-2">
            Weapon Strength Gain/Loss - Modifier: <span className="font-bold">{strengthGain}</span>
          </label>
          <input
            id="strSlider"
            type='range'
            min='-10'
            max='10'
            value={strengthGain}
            onChange={(e) => setStrengthGain(e.target.value)}
            className='my-2 mb-6'
          />
          <label htmlFor="toughSlider" className="block mb-2">
            Defender Toughness Gain/Loss - Modifier: <span className="font-bold">{toughnessGain}</span>
          </label>
          <input
            id="toughSlider"
            type='range'
            min='-10'
            max='10'
            value={toughnessGain}
            onChange={(e) => setToughnessGain(e.target.value)}
          />
        </div>
        <Fight
          strengthModifier={strengthGain}
          toughnessModifier={toughnessGain}
          wargear={wargear} 
          rules={extraRules} 
          defender={defender} 
        />
      </div>
    </div>
  )
}


ExtraRules.propTypes = {
  wargear: PropTypes.object,
  defender: PropTypes.object
}

export default ExtraRules