import { useState } from 'react'
import React from 'react'
import CheckBoxes from './CheckBoxes'
import Fight from './Fight'
import PropTypes from 'prop-types'

const ExtraRules = ({ wargear }) => {
  const [strengthGain, setStrengthGain] = useState(0)
  const [toughnessGain, setToughnessGain] = useState(0)
  const [attacksGain, setAttacksGain] = useState(0)
  const [unitSize, setUnitSize] = useState(1)
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
    isAoC: false,
    isFNP5: false,
    isFNP6: false,
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
    <div className=''>
      <div>
        <h1 className='flex justify-center text-3xl text-white my-4'>Special Rules</h1>
      </div>
      <div className='flex flex-col items-center lg:flex-row'>
        <div className='w-1/2'>
          <CheckBoxes handleCheckboxChange={handleCheckboxChange} />
        </div>
        <div className='flex flex-col justify-evenly w-1/2'>
          <div className='flex flex-col lg:flex-col md:w-3/4 sm:w-3/4 mx-auto text-white justify-center'>
            <div className='flex flex-col'>
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
            </div>
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
              className='my-2 mb-6'
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
              className='my-2 mb-6'
            />
            <div className='flex flex-col md:w-3/4 sm:w-3/4 lg:w-full mx-auto text-white justify-center'>
              <label htmlFor="unitSlider" className="mb-2 text-center">
                  Attacking Model Count: <span className="font-bold">{unitSize}</span>
              </label>
              <input
                id='unitSlider' 
                type='range' 
                min='1'
                max='20'
                value={unitSize}
                onChange={(e) => setUnitSize(e.target.value)}
                className='my-2 mb-6'
              />
            </div>
          </div>
        </div>
      </div>
      <div className='mt-4'>
        <Fight
          strengthModifier={strengthGain}
          toughnessModifier={toughnessGain}
          attacksModifier={attacksGain}
          wargear={wargear} 
          rules={extraRules}
          unitSize={unitSize}
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