import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useState } from 'react'

const Fight = ({ wargear, rules, defender }) => {
  const [hits, setHits] = useState(null)
  const [wounds, setWounds] = useState(null)
  const [failedSaves, setFailedSaves] = useState(null)
  const [damage, setDamage] = useState(null)

  const hitCalculation = (results, hitChance) => {
    let hits = 0
    let updatedResults = { ...results }
    let newResults = null

    if (rules.isSustained) {
      newResults = { ...updatedResults, 6: updatedResults[6] * 2}

      if (rules.isCrit5) {
        newResults = { ...newResults, [5]: updatedResults[5] * 2 }
      }
    }
    if (rules.isLethal) {
      newResults = { ...updatedResults, lethals: updatedResults[6]}

      if (rules.isCrit5) {
        newResults = { ...newResults, 5: updatedResults[5] * 2}
      }
    }
    if (rules.isPlusHit && hitChance > 2) {
      hitChance = hitChance - 1
    }
    if (rules.isMinusHit && hitChance < 6) {
      hitChance = hitChance + 1
    }

    if (newResults) {
      for (let key in newResults) {
        if (key >= hitChance) {
          hits += newResults[key]
        }
      }
      setHits(hits)
    } else if (rules.isTorrent) {
      const torrentHits = updatedResults[1] + updatedResults[2] + updatedResults[3] + updatedResults[4] + updatedResults[5] + updatedResults[6]
      setHits(torrentHits)
    } else {
      for (let key in updatedResults) {
        if (key >= hitChance) {
          hits += updatedResults[key]
        }
      }
      setHits(hits)
    }
  }

  const woundCalculation = () => {
    let modifier = 0

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

    const woundRoll = diceRoll(hits)
    let successfulWounds = woundRollSort(woundRoll, modifier)
    let reRoll = 0

    if (rules.isTwinLinked) {
      reRoll = (woundRoll[1] + woundRoll[2] + woundRoll[3] + woundRoll[4] + woundRoll[5] + woundRoll[6]) - successfulWounds
      const rolled = diceRoll(reRoll)
      successfulWounds = successfulWounds + woundRollSort(rolled, modifier)
    }
    setWounds(successfulWounds)
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

  useEffect(() => {
    console.log('useEffect Hits:', hits)
    console.log('useEffect Wounds:', wounds)
    console.log('useEffect failed Saves', failedSaves)
  }, [wounds, hits, failedSaves])
  
  const attacks = Number(wargear.a.String)
  const hitTarget = Number(wargear.bs_ws.String)
  const strength = Number(wargear.s.String)
  const toughness = Number(defender.T)

  const handleCalculations = (event) => {
    event.preventDefault()
    const results = diceRoll(10000 * attacks)
    hitCalculation(results, hitTarget)
    woundCalculation()
    savesCalculatuion()
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
    console.log('ap ---', ap)
    let save = Number(defender.Sv.String.replace("+", "")) - ap
    let inv_save
    console.log('SAVE:', save)
    console.log('INV SV:', inv_save)

    if (defender.inv_sv.String !== '' || defender.inv_sv.String !== "-" || defender.inv_sv.Valid !== false) {
      inv_save = Number(defender.inv_sv.String)
    }
    if (save > 6) {
      save = 0
    }
    console.log('save before invun', save)
    if (inv_save < save) {
      save = inv_save
    }
    console.log('invun save:', inv_save)
    console.log('save after invun', save)
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

  const savesCalculatuion = () => {
    const savePercentage = calculateSave()
    const passed = wounds / 100 * savePercentage

    let rounded = Number(passed.toFixed(2))

    console.log('Passed saves calculation ---', rounded)
    const failed = wounds - passed
    setFailedSaves(Number(failed.toFixed(2)))
  }

  const damageCalculation = () => {
    const damage = failedSaves * wargear.d.String
    return Number(damage)
  }

  return (
    <div className='fightCalc'>
      <form onSubmit={(event) => handleCalculations(event)}>
        <button type='submit'>Calculate</button>
      </form>
      <h2 className='fightheader'>Fight Calculations</h2>
      <br />
      <div className='fightInfo'>
        Average Successful Hits: {hits && hits / 10000}
        <br />
        Average Successful Wounds: {wounds && wounds / 10000}
        <br />
        Average Failed Saves: {failedSaves && failedSaves / 10000}
        <br />
        Damage:
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