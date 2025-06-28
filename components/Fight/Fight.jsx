import React, { useState } from 'react'
import PropTypes from 'prop-types'
import MyBarChart from './Chart'

const Fight = ({ wargear, rules, defender }) => {
  const [hits, setHits] = useState(null)
  const [wounds, setWounds] = useState(null)
  const [failedSaves, setFailedSaves] = useState(null)
  const [damage, setDamage] = useState(null)
  const [unitSize, setUnitSize] = useState(1)
  const [modelsKilled, setModelsKilled] = useState(null)
  const [toggle, setToggle] = useState(false)
  const [hitRoll, setHitRoll] = useState(null) 

  const attacks = Number(wargear.a.String)
  const hitTarget = Number(wargear.bs_ws.String)
  const strength = Number(wargear.s.String)
  const toughness = Number(defender.T)

  const hitCalculation = (results, hitChance) => {
    let hits = 0
    let updatedResults = { ...results }
    let newResults = null

    if (rules.isSustained) {
      newResults = { ...updatedResults, 6: updatedResults[6] * 2}

      if (rules.isCrit5) {
        newResults = { ...newResults, 5: updatedResults[5] * 2 }
      }
    }
    if (rules.isPlusHit && hitChance > 2) {
      hitChance -= 1
    }
    if (rules.isMinusHit && hitChance < 6) {
      hitChance += 1
    }

    const source = newResults || updatedResults

    if (rules.isTorrent || typeof hitChance != 'number') {
      const torrentHits = updatedResults[1] + updatedResults[2] + updatedResults[3] + updatedResults[4] + updatedResults[5] + updatedResults[6]
      return torrentHits
    } else {
      for (let key in source) {
        if (key >= hitChance) {
          hits += source[key]
        }
      }
      return hits
    }
  }

  const woundCalculation = (localHits) => {
    let modifier = 0
    let successfulWounds = 0

    if (strength > toughness * 2) {
      modifier = 2
    }
    if (strength === toughness) {
      modifier = 4
    }
    if (strength * 2 < toughness) {
      modifier = 6
    }
    if (strength < toughness) {
      modifier = 5
    }
    if (strength > toughness) {
      modifier = 3
    }
    if (rules.isPlusWound && modifier > 2) {
      modifier = modifier - 1
    }
    if (rules.isMinusWound && modifier < 6) {
      modifier = modifier + 1
    }
    if (rules.isLethal) {
      successfulWounds += localHits / 6
      localHits -= successfulWounds
      if (rules.isCrit5) {
        const crit5 = localHits / 6
        successfulWounds += crit5
        localHits -= crit5 
      }
    }
    const woundRoll = diceRoll(localHits)
    successfulWounds += woundRollSort(woundRoll, modifier)
    let reRoll = 0

    if (rules.isTwinLinked) {
      reRoll = (woundRoll[1] + woundRoll[2] + woundRoll[3] + woundRoll[4] + woundRoll[5] + woundRoll[6]) - successfulWounds
      const rolled = diceRoll(reRoll)
      successfulWounds += woundRollSort(rolled, modifier)
    }

    return successfulWounds
  }

  const woundRollSort = (woundRoll, modifier) => {
    let successfulWounds = 0

    for (let key in woundRoll) {
      if (key >= modifier) {
        successfulWounds += woundRoll[key]
      }
    }
    return successfulWounds
  }

  const handleCalculations = (event) => {
    event.preventDefault()
    const unitAttacks = unitSize * attacks

    const results = diceRoll(10000 * unitAttacks)
    setHitRoll(results)

    const localHits = hitCalculation(results, hitTarget)
    setHits(localHits)

    const localWounds = woundCalculation(localHits)
    setWounds(localWounds)

    const localFailedSaves = savesCalculatuion(localWounds)
    setFailedSaves(localFailedSaves)

    const localDamage = damageCalculation(localFailedSaves)
    setDamage(localDamage)

    const localModelsKilled = modelsCalculation(localDamage)
    setModelsKilled(localModelsKilled)
    
    setToggle(true)
  }

  const diceRoll = (amountOfDice) => {
    const results = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}

    for (let i = 0; i < amountOfDice; i++) {
      const dieRoll = Math.floor(Math.random() * 6) + 1
      results[dieRoll]++
    }
    return results
  }

  const calculateSave = () => {
    let ap = wargear.ap.Int32
    let save = Number(defender.Sv.String.replace("+", "")) - ap
    let inv_save

    if (defender.inv_sv.String !== '' || defender.inv_sv.String !== "-" || defender.inv_sv.Valid !== false) {
      inv_save = Number(defender.inv_sv.String)
    }
    if (save > 6) {
      save = 0
    }
    if (inv_save < save) {
      save = inv_save
    }

    switch (save) {
    case 2:
      return 83.3
    case 3:
      return 66.7
    case 4:
      return 50
    case 5:
      return 33.3
    case 6:
      return 16.7
    case 0:
      return 0
    }
  }

  const savesCalculatuion = (localWounds) => {
    let devs = 0
    const savePercentage = calculateSave()

    if (rules.isDev) {
      devs = localWounds / 6
      localWounds -= devs
    }
    const passed = localWounds / 100 * savePercentage

    const failed = localWounds - passed
    const failedWithDev = failed + devs

    return (Number(failedWithDev.toFixed(2)))
  }

  const damageCalculation = (localFailedSaves) => {
    const damage = localFailedSaves * wargear.d.String
    return Number(damage)
  }

  const modelsCalculation = (localDamage) => {
    const killed = localDamage / defender.W.Int32
    return killed
  }

  return (
    <div>
      <div>
        <input 
          className='modelSizeInput' 
          type='text' 
          placeholder='Input Unit Size' 
          onChange={(event) => setUnitSize(event.target.value || 1)}
        />
      </div>
      <div className='fightCalc'>
        <form onSubmit={(event) => handleCalculations(event)}>
          <button type='submit' className='calculate' >Calculate</button>
        </form>
        {toggle &&
        <div>
          <h2 className='fightheader'>Fight Calculations</h2>
          <br />
          <div className='fightInfo'>
            Average Successful Hits: {hits / 10000}
            <br />
            Average Successful Wounds: {wounds / 10000}
            <br />
            Average Wounds Through Saves: {failedSaves / 10000}
            <br />
            Damage: {damage / 10000}
            <br />
            Models killed: {modelsKilled / 10000}
          </div>
          <div className='charts'>
          </div>
        </div>
        }
      </div>
    </div>
  )
}

Fight.propTypes = {
  wargear: PropTypes.object.isRequired,
  rules: PropTypes.object.isRequired,
  defender: PropTypes.object.isRequired
}

export default Fight