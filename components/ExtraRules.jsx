import { useState, useEffect } from 'react'
import React from 'react'
import CheckBoxes from './CheckBoxes'
import Fight from './Fight'
import PropTypes from 'prop-types'

const ExtraRules = ({ wargear, defender }) => {
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

  useEffect(() => {
    console.log('Count changed:', extraRules);
  }, [extraRules]);


  if (!wargear) {
    return <div></div>
  }

  return (
    <div>
      <div>
        <h1 className='specialRulesTitle'>Special Rules</h1>
      </div>
      <div> 
        <br />
        <CheckBoxes handleCheckboxChange={handleCheckboxChange}/>
        <Fight
          wargear={wargear} 
          rules={extraRules} 
          defender={defender} 
        />
        {console.log('WARGEAR ---', wargear)}
      </div>
    </div>
  )
}


ExtraRules.propTypes = {
  wargear: PropTypes.object,
  defender: PropTypes.object
}

export default ExtraRules