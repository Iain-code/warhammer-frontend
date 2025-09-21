import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import MyBarChart from './Chart'
import ModelContext from '../../contexts/modelContext'
import { registerables } from 'chart.js'

const Fight = ({ wargear, rules, strengthModifier, toughnessModifier }) => {
  const [model] = useContext(ModelContext)
  const [hits, setHits] = useState(null)
  const [wounds, setWounds] = useState(null)
  const [failedSaves, setFailedSaves] = useState(null)
  const [damage, setDamage] = useState(null)
  const [unitSize, setUnitSize] = useState(1)
  const [modelsKilled, setModelsKilled] = useState(null)
  const [toggle, setToggle] = useState(false)
  const [hitRoll, setHitRoll] = useState(null)
  const [woundRolls, setWoundRoll] = useState(null)
  const [damageRoll, setDamageRoll] = useState(null)
  const [woundModifier, setWoundModifier] = useState(null)
  const [damageModifier, setDamageModifier] = useState(null)
  
  const defender = model.defence
  const hitTarget = Number(wargear.BS_WS)
  let strength = Number(wargear.strength)
  let toughness = Number(defender.T)
  let attacks = 0

  const splitDiceType = (dice) => {
    const parts = dice.toUpperCase().split("D")
    return parseInt(parts[1], 10)
  }

  const splitDiceAmount = (dice) => {
    const parts = dice.toUpperCase().split("D")
    return parseInt(parts[0], 10)
  }
  
  if (wargear.attacks.length === 1) {
    attacks = Number(wargear.attacks)
  }

  if (wargear.attacks.length === 2) {
    const diceTypeToRoll = splitDiceType(wargear.attacks)
    if (diceTypeToRoll === 3) {
      attacks = 2
    }
    if (diceTypeToRoll === 6) {
      attacks = 3.5
    }
  }

  if (wargear.attacks.length === 3) {
    const diceTypeToRoll = splitDiceType(wargear.attacks)
    const diceAmountToRoll = splitDiceAmount(wargear.attacks)
    if (diceTypeToRoll === 3) {
      if (diceAmountToRoll === 1) {
        attacks = 2
      }
      if (diceAmountToRoll === 2) {
        attacks = 4
      }
      if (diceAmountToRoll === 3) {
        attacks = 6
      }
      if (diceAmountToRoll === 4) {
        attacks = 8
      }
    }
    if (diceTypeToRoll === 6) {
      if (diceAmountToRoll === 2) {
        attacks = 7
      }
      if (diceAmountToRoll === 3) {
        attacks = 10.5
      }
      if (diceAmountToRoll === 4) {
        attacks = 14
      }
    }
  }

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

  const woundCalculation = (results, localHits) => {
    let modifier = 0
    let successfulWounds = 0

    if (strengthModifier !== 0) {
      strength = strength + Number(strengthModifier)
    }
    if (toughnessModifier !== 0) {
      toughness = toughness + Number(toughnessModifier)
    }

    if (strength >= (toughness * 2)) {
      modifier = 2
    } else if (strength === toughness) {
      modifier = 4
    } else if (strength * 2 < toughness) {
      modifier = 6
    } else if (strength < toughness) {
      modifier = 5
    } else if (strength > toughness) {
      modifier = 3
    }

    if (rules.isPlusWound && modifier > 2) {
      modifier = modifier - 1
    }
    if (rules.isMinusWound && modifier < 6) {
      modifier = modifier + 1
    }

    if (rules.isLethal) {
      successfulWounds += results[6]
      localHits -= results[6]

      if (rules.isCrit5) {
        successfulWounds += results[5]
        localHits -= results[5]
      }
    }

    const woundRoll = diceRoll(localHits)
    successfulWounds += woundRollSort(woundRoll, modifier)
    let reRoll = 0
    let failedRollsWithoutLethals = successfulWounds

    if (rules.isTwinLinked) {
      if (rules.isLethal) {
        failedRollsWithoutLethals = successfulWounds - results[6]
        if (rules.isCrit5) {
          failedRollsWithoutLethals = successfulWounds - results[5]
        }
      }
      reRoll = (woundRoll[1] + woundRoll[2] + woundRoll[3] + woundRoll[4] + woundRoll[5] + woundRoll[6]) - failedRollsWithoutLethals
      const rolled = diceRoll(reRoll)
      successfulWounds += woundRollSort(rolled, modifier)
    }

    setWoundRoll(woundRoll)
    setWoundModifier(modifier)
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

  const handleCalculations = () => {
    const unitAttacks = unitSize * attacks

    const results = diceRoll(10000 * unitAttacks)
    setHitRoll(results)

    const localHits = hitCalculation(results, hitTarget)
    setHits(localHits)

    const localWounds = woundCalculation(results, localHits)
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
    let ap = Number(String(wargear.AP).replace("-", ""))
    let save = (Number(defender.Sv.replace("+", ""))) + ap
    let inv_save

    if (defender.inv_sv !== '' || defender.inv_sv !== "-" || defender.inv_sv === null) {
      inv_save = Number(defender.inv_sv)
    }
    if (save > 6) {
      save = 0
    }
    if (inv_save === Number && inv_save < save) {
      save = inv_save
    }

    switch (save) {
    case 2: return 5/6
    case 3: return 4/6
    case 4: return 3/6
    case 5: return 2/6
    case 6: return 1/6
    default: return 0
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
    console.log('passed:', passed)

    const failed = localWounds - passed
    console.log('failed:', failed)
    const failedWithDev = failed + devs
    console.log('failedwithDev:', failedWithDev)

    return (Number(failedWithDev.toFixed(2)))
  }

  const damageCalculation = (localFailedSaves) => {
    const damage = localFailedSaves * wargear.damage

    return Number(damage)
  }

  const modelsCalculation = (localDamage) => {
    const killed = localDamage / defender.W
    return killed
  }

  return (
    <div>
      <div className='flex flex-col lg:w-1/6 mx-auto text-center m-4 text-white'>
        <label htmlFor="unitSlider" className="mb-2">
            Attacking Model Count: <span className="font-bold">{unitSize}</span>
        </label>
        <input
          id='unitSlider'
          className='bg-neutral-600 rounded-sm text-white text-center' 
          type='range' 
          min='1'
          max='20'
          value={unitSize}
          onChange={(e) => setUnitSize(e.target.value)}
        />
      </div>
      <div className='flex flex-col items-center'>
        <button
          onClick={() => handleCalculations()}
          className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 
              overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
               group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none 
               focus:ring-pink-200"
        >
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
          Calculate Fight Statistics</span></button>
        {toggle &&
        <div className='w-full mb-6'>
          <h2 className='text-white pt-5 underline justify-center flex'>Fight Calculations</h2>
          <br />
          <div className='text-white flex flex-wrap gap-4 justify-center'>
            <div className='flex items-center text-center justify-center bg-neutral-600 border rounded-xl border-neutral-600 lg:w-1/4 lg:h-[100px]'>
            Average Successful Hits
              <br />
              {(hits / 10000).toFixed(2) }
            </div>
            <div className='flex items-center text-center justify-center bg-neutral-600 border rounded-xl border-neutral-600 lg:w-1/4 lg:h-[100px]'>
            Average Successful Wounds
              <br />
              {(wounds / 10000).toFixed(2)}
            </div>
            <div className='flex items-center text-center justify-center bg-neutral-600 border rounded-xl border-neutral-600 lg:w-1/4 lg:h-[100px]'>
            Average Wounds Through Saves
              <br />
              {(failedSaves / 10000).toFixed(2)}
            </div>
            <div className='flex items-center text-center justify-center bg-neutral-600 border rounded-xl border-neutral-600 lg:w-1/4 lg:h-[100px]'>
            Damage
              <br />
              {(damage / 10000).toFixed(2)}
            </div>
            <div className='flex items-center text-center justify-center bg-neutral-600 border rounded-xl border-neutral-600 lg:w-1/4 lg:h-[100px]'>
            Models killed
              <br />
              {(modelsKilled / 10000).toFixed(2)}
            </div>
          </div>
        </div>
        }
        <div className="flex flex-wrap gap-4 w-3/4">
          {hitRoll && <div className="flex-1 min-w-[240px] h-64"><MyBarChart input={hitRoll} name="Hit Rolls" modifier={hitTarget} /></div>}
          {woundRolls && <div className="flex-1 min-w-[240px] h-64"><MyBarChart input={woundRolls} name="Wound Rolls" modifier={woundModifier} /></div>}
          {damageRoll&& <div className="flex-1 min-w-[240px] h-64"><MyBarChart input={damageRoll} name="Damage Rolls" modifier={damageModifier}/></div>}
        </div>
      </div>
    </div>
  )
}

Fight.propTypes = {
  wargear: PropTypes.object.isRequired,
  rules: PropTypes.object.isRequired,
  defender: PropTypes.object.isRequired,
  strengthModifier: PropTypes.number,
  toughnessModifier: PropTypes.number
}

export default Fight