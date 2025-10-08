import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import MyBarChart from './Chart'
import ModelContext from '../../contexts/modelContext'

const Fight = ({ wargear, rules, strengthModifier, toughnessModifier, attacksModifier }) => {
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
  let attacks = Number(wargear.attacks) + (Number(attacksModifier) || 0)
  let damagePerAttack = 0

  const splitDiceType = (dice) => {
    const parts = dice.toUpperCase().split("D")
    return parseInt(parts[1], 10)
  }

  const splitDiceAmount = (dice) => {
    const parts = dice.toUpperCase().split("D")
    return parseInt(parts[0], 10)
  }

  if (wargear.attacks.length === 2 && wargear.attacks.toUpperCase().charAt(0) === "D") {
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

  if (wargear.attacks.length === 4) {
    const attacksAddition = wargear.attacks.split("+")
    let type = splitDiceType(attacksAddition[0])

    if (Number(type) === 6) {
      attacks = 3.5 + Number(attacksAddition[1])
    }
    if (Number(type) === 3) {
      attacks = 2 + Number(attacksAddition[1])
    }
  }


  const hitCalculation = (results, hitChance) => {
    let hits = 0
    let updatedResults = { ...results }

    if (rules.isReRollHits) {
      let failedHitsToReRoll = 0

      for (let numberRolled in updatedResults) {
        if (Number(numberRolled) < hitChance) {
          failedHitsToReRoll += updatedResults[numberRolled]
          updatedResults[numberRolled] = 0
        }
      }
      const reRolledHits = diceRoll(failedHitsToReRoll)

      for (let key in reRolledHits) {
        updatedResults[key] = (updatedResults[key] || 0) + (reRolledHits[key] || 0)
      }
    }

    if (rules.isReRollHits1) {
      const reRoll1s = diceRoll(updatedResults[1])
      
      for (let key in reRoll1s) {
        updatedResults[key] = (updatedResults[key] || 0) + (reRoll1s[key] || 0)
      }
    }

    if (rules.isSustained) {
      updatedResults = { ...updatedResults, 6: updatedResults[6] * 2}

      if (rules.isCrit5) {
        updatedResults = { ...updatedResults, 5: updatedResults[5] * 2 }
      }
    }

    if (rules.isPlusHit && hitChance > 2) {
      hitChance -= 1
    }

    if (rules.isMinusHit && hitChance < 6) {
      hitChance += 1
    }


    if (rules.isTorrent || typeof hitChance != 'number' || Number.isNaN(hitChance)) {
      const torrentHits = Object.values(updatedResults).reduce((total, value) => total + value, 0)
      return torrentHits
    }

    for (let key in updatedResults) {
      if (Number(key) >= hitChance) {
        hits += updatedResults[key]
      }
    }

    return hits
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

    if (rules.isReRollWounds1) {
      const reRolled1 = diceRoll(results[1])
 
      for (let key in reRolled1) {
        localHits = localHits += (reRolled1[key] || 0)
      }
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
      reRoll = (Object.values(woundRoll).reduce((total, value) => total + value, 0)) - failedRollsWithoutLethals
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

    if (defender.inv_sv && defender.inv_sv !== '-') {
      inv_save = Number(String(defender.inv_sv).replace("+", ""))
    }
    if (rules.isWithCover) {
      save -= 1
    }
    if (rules.isAoC) {
      save -= 1
    }
    if (save > 6) {
      save = 0
    }
    if (inv_save < save) {
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
    const passRate = calculateSave()

    if (rules.isDev) {
      devs = localWounds / 6
      localWounds -= devs
    }

    const passed = localWounds * passRate
    const failed = localWounds - passed
    const failedWithDev = failed + devs

    return (Number(failedWithDev.toFixed(2)))
  }

  const damageCalculation = (localFailedSaves) => {
    let modifiedDamage = wargear.damage
    let type = 0
    let amount = 0

    if (modifiedDamage.length === 3) {
      amount = splitDiceAmount(modifiedDamage)
      type = splitDiceType(modifiedDamage)

      if (Number(amount) === 2 && Number(type) === 6) {
        modifiedDamage = 7
      }
      if (Number(amount) === 3 && Number(type) === 6) {
        modifiedDamage = 10.5
      }
    }

    if (modifiedDamage.length === 2) {
      type = splitDiceType(modifiedDamage)

      if (Number(type) === 3) {
        modifiedDamage = 2
      }
      if (Number(type) === 6) {
        modifiedDamage = 3.5
      }
    }

    if (modifiedDamage.length === 4) {
      type = splitDiceType(modifiedDamage)

      const damageSplit = modifiedDamage.split("+")

      if (Number(type) === 3) {
        modifiedDamage = 2 + Number(damageSplit[1])
      }
      if (Number(type) === 6) {
        modifiedDamage = 3.5 + Number(damageSplit[1])
      }
    }

    if (wargear.damage > 1 && rules.isMinusDamage) {
      modifiedDamage -= 1
    }

    let fnpProb = 0
    if (rules.isFNP5) fnpProb = Math.max(fnpProb, 2/6)
    if (rules.isFNP6) fnpProb = Math.max(fnpProb, 1/6)

    const effectiveDamagePerAttack = modifiedDamage * (1 - fnpProb)

    damagePerAttack = effectiveDamagePerAttack

    const totalDamage = Number(localFailedSaves) * effectiveDamagePerAttack
    return Number(totalDamage.toFixed(2))
  }

  const modelsCalculation = (localDamage) => {
    const dmgPerAttack = Number(damagePerAttack)

    const woundsPerModel = Number(defender.W)

    const attacksCount = Math.floor(localDamage / dmgPerAttack)

    const attacksPerKill = Math.ceil(woundsPerModel / dmgPerAttack)

    const killed = attacksCount / attacksPerKill

    return Number(killed)
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
          <h2 className='text-white pt-5 underline justify-center flex flex'>Fight Calculations</h2>
          <div className='text-white flex flex-col lg:flex-row lg:flex-wrap gap-4 justify-center'>
            <div className='flex flex-col items-center text-center justify-center bg-neutral-600 border rounded-xl border-neutral-600 lg:w-1/4 lg:h-[100px]'>
              Average Successful Hits
              <div>
                {(hits / 10000).toFixed(2) }
              </div>
            </div>
            <div className='flex flex-col items-center text-center justify-center bg-neutral-600 border rounded-xl border-neutral-600 lg:w-1/4 lg:h-[100px]'>
              Average Successful Wounds
              <div>
                {(wounds / 10000).toFixed(2)}
              </div>
            </div>
            <div className='flex flex-col items-center text-center justify-center bg-neutral-600 border rounded-xl border-neutral-600 lg:w-1/4 lg:h-[100px]'>
            Average Wounds Through Saves
              <div>
                {(failedSaves / 10000).toFixed(2)}
              </div>
            </div>
            <div className='flex flex-col items-center text-center justify-center bg-neutral-600 border rounded-xl border-neutral-600 lg:w-1/4 lg:h-[100px]'>
              Total Damage
              <div>
                {(damage / 10000).toFixed(2)}
              </div>
            </div>
            <div className='flex flex-col items-center text-center justify-center bg-neutral-600 border rounded-xl border-neutral-600 lg:w-1/4 lg:h-[100px]'>
            Models killed
              <div>
                {(modelsKilled / 10000).toFixed(2)}
              </div>
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
  toughnessModifier: PropTypes.number,
  attacksModifier: PropTypes.number
}

export default Fight