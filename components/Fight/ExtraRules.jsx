import { useState } from 'react'
import React from 'react'
import CheckBoxes from './CheckBoxes'
import Fight from './Fight'
import PropTypes from 'prop-types'

const ExtraRules = ({ wargear }) => {
  const [strengthGain, setStrengthGain] = useState(0)
  const [toughnessGain, setToughnessGain] = useState(0)
  const [attacksGain, setAttacksGain] = useState(0)
  const [extraRules, setExtraRules] = useState({
    isSustained: false,
    isLethal: false,
    isCrit5: false,
    isDev: false,
    isWithCover: false,
    isTorrent: false,
    isTwinLinked: false,
    isPlusHit: false,
    isPlusWound: false,
    isMinusHit: false,
    isMinusWound: false,
    isMinusDamage: false,
    isReRollHits: false,
    isReRollHits1: false,
    isReRollWounds1: false,
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
        <CheckBoxes handleCheckboxChange={handleCheckboxChange}/>
        <div className='flex flex-col lg:w-1/6 md:w-3/4 sm:w-3/4 mx-auto text-white justify-center mt-6'>
          <label htmlFor="strSlider" className="mb-2 text-center">
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
          <label htmlFor="toughSlider" className="mb-2 text-center">
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
          <label htmlFor="attacksSlider" className="mb-2 text-center">
            Attacks Amount Gain/Loss - Modifier: <span className="font-bold">{attacksGain}</span>
          </label>
          <input
            id="attacksSlider"
            type='range'
            min='-10'
            max='10'
            value={attacksGain}
            onChange={(e) => setAttacksGain(e.target.value)}
          />
        </div>
        <Fight
          strengthModifier={strengthGain}
          toughnessModifier={toughnessGain}
          attacksModifier={attacksGain}
          wargear={wargear} 
          rules={extraRules}
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