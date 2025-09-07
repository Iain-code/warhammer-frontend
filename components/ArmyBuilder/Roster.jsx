import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import RosterContext from '../../contexts/rosterContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import modelService from '../../requests/models'
import UserContext from '../../contexts/userContext'
import ArmyList from './ArmyList'

const Roster = ({ selectedUnits, setSelectedUnits, faction }) => {

  const user = useContext(UserContext)
  const queryClient = useQueryClient()
  const armyList = queryClient.getQueryData(['armyList'])
  const [roster, rosterDispatch] = useContext(RosterContext)
  const [armyName, setArmyName] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [modalMsg, setModalMsg] = useState('')

  const removeFromRoster = (unit, group) => {
    const filteredUnits = selectedUnits[group].filter(u => u.instance !== unit.instance)
    setSelectedUnits({ ...selectedUnits, [group]: filteredUnits})

    rosterDispatch({
      type: 'minus',
      payload: unit.unitPoints.cost2 || unit.unitPoints.cost
    })
  }

  const saveMutation = useMutation({
    mutationFn: async (collectedData) => await modelService.saveToRoster(collectedData),
    onSuccess: () => {
      setModalMsg('Army list saved successfully'),
      setIsOpen(true)
      queryClient.invalidateQueries({ queryKey: ['armyList']})
    },
    onError: (error) => {
      console.error('failed to save army list:', error)
    }
  })

  const saveArmy = () => {

    if (armyName === null || armyName === '') {
      setModalMsg('please enter an army name')
      setIsOpen(true)
      return
    }

    if (armyList.filter(name => name.name === armyName).length > 0) {
      setModalMsg('army name already taken')
      setIsOpen(true)
      return
    }
  
    const collectedData = {
      user_id: user[0].id,
      army_list: selectedUnits,
      enhancements: roster.enhancement ?? [],
      name: armyName,
      faction: faction
    }
    saveMutation.mutate(collectedData)
  }

  const clearRoster = () => {
    setSelectedUnits({
      character: [],
      battleline: [],
      transport: [],
      mounted: [],
      aircraft: [],
      monster: [],
      vehicle: [],
      infantry: [],
    })
    rosterDispatch({
      type: 'reset'
    })
  }

  return (
    <div className='lg:sticky lg:top-24 h-full'>
      <div><ArmyList setSelectedUnits={setSelectedUnits} /></div>
      {(roster.cost > 0) &&
    <div className="text-white w-full">
      <table className="w-full mx-auto border-collapse bg-[#1b1b1b] rounded-lg text-white">
        <caption className="text-xl py-2">Roster</caption>
        <thead className="bg-[#2a2a2a] px-3 py-3 font-medium border-b-2 border-[#444]">
          <tr className='text-center'>
            <th>Unit Name</th>
            <th>Points Cost</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          <tr><th colSpan={3} className="text-xl text-orange-400">Enhancements</th></tr>

          {(roster.enhancement?.length ?? 0) === 0 ? (
            <tr>
              <td colSpan={3} className="px-4 py-4 text-center text-gray-400 italic">
                No enhancements selected
              </td>
            </tr>
          ) : (
            roster.enhancement.map(e => (
              <tr key={e} className="hover:bg-[#2a2a2a]">
                <td colSpan={3} className="px-4 py-4 border-b border-[#333] text-center">
                  {e}
                </td>
              </tr>
            ))
          )}
        
          {selectedUnits.character.length > 0 && <tr><th colSpan={3} className='text-xl text-orange-400'>Characters</th></tr>}
          {selectedUnits.character && selectedUnits.character.map(unit =>
            <tr key={unit.instance} className="hover:bg-[#2a2a2a]">
              <td className="px-4 py-4 border-b border-[#333]">{unit.name}</td>
              <td className="px-4 py-4 border-b border-[#333] text-center">{unit.unitPoints.cost}</td>
              <td className="px-4 py-4 border-b border-[#333] text-center"><button onClick={() => removeFromRoster(unit, 'character')}>Remove</button></td>
            </tr>
          )}
          {selectedUnits.battleline.length > 0 && <tr><th colSpan={3} className='text-xl text-orange-400'>Battleline</th></tr>}
          {console.log('selectedUnits:', selectedUnits)}
          {selectedUnits.battleline && selectedUnits.battleline.map(unit => 
            <tr key={unit.instance} className="hover:bg-[#2a2a2a]">
              <td className="px-4 py-4 border-b border-[#333]">{unit.name}</td>
              <td className="px-4 py-4 border-b border-[#333] text-center">{unit.unitPoints.cost}</td>
              <td className="px-4 py-4 border-b border-[#333] text-center"><button onClick={() => removeFromRoster(unit, 'battleline')}>Remove</button></td>
            </tr>
          )}
          {selectedUnits.transport.length > 0 && <tr><th colSpan={3} className='text-xl text-orange-400'>Transports</th></tr>}
          {selectedUnits.transport && selectedUnits.transport.map(unit => 
            <tr key={unit.instance} className="hover:bg-[#2a2a2a]">
              <td className="px-4 py-4 border-b border-[#333]">{unit.name}</td>
              <td className="px-4 py-4 border-b border-[#333] text-center">{unit.unitPoints.cost}</td>
              <td className="px-4 py-4 border-b border-[#333] text-center"><button onClick={() => removeFromRoster(unit, 'transport')}>Remove</button></td>
            </tr>
          )}
          {selectedUnits.monster > 0 && <tr><th colSpan={3} className='text-xl text-orange-400'>Monsters</th></tr>}
          {selectedUnits.monster && selectedUnits.monster.map(unit => 
            <tr key={unit.instance} className="hover:bg-[#2a2a2a]">
              <td className="px-4 py-4 border-b border-[#333]">{unit.name}</td>
              <td className="px-4 py-4 border-b border-[#333] text-center">{unit.unitPoints.cost}</td>
              <td className="px-4 py-4 border-b border-[#333] text-center"><button onClick={() => removeFromRoster(unit, 'monster')}>Remove</button></td>
            </tr>
          )}
          {selectedUnits.vehicle.length > 0 && <tr><th colSpan={3} className='text-xl text-orange-400'>Vehicle</th></tr>}
          {selectedUnits.vehicle && selectedUnits.vehicle.map(unit => 
            <tr key={unit.instance} className="hover:bg-[#2a2a2a]">
              <td className="px-4 py-4 border-b border-[#333]">{unit.name}</td>
              <td className="px-4 py-4 border-b border-[#333] text-center">{unit.unitPoints.cost}</td>
              <td className="px-4 py-4 border-b border-[#333] text-center"><button onClick={() => removeFromRoster(unit, 'vehicle')}>Remove</button></td>
            </tr>
          )}
          {selectedUnits.mounted.length > 0 && <tr><th colSpan={3} className='text-xl text-orange-400'>Mounted</th></tr>}
          {selectedUnits.mounted && selectedUnits.mounted.map(unit => 
            <tr key={unit.instance} className="hover:bg-[#2a2a2a]">
              <td className="px-4 py-4 border-b border-[#333]">{unit.name}</td>
              <td className="px-4 py-4 border-b border-[#333] text-center">{unit.unitPoints.cost}</td>
              <td className="px-4 py-4 border-b border-[#333] text-center"><button onClick={() => removeFromRoster(unit, 'mounted')}>Remove</button></td>
            </tr>
          )}
          {selectedUnits.aircraft.length > 0 && <tr><th colSpan={3} className='text-xl text-orange-400'>Aircraft</th></tr>}
          {selectedUnits.aircraft && selectedUnits.aircraft.map(unit => 
            <tr key={unit.instance} className="hover:bg-[#2a2a2a]">
              <td>{unit.name}</td>
              <td>{unit.unitPoints.cost}</td>
              <td><button onClick={() => removeFromRoster(unit, 'aircraft')}>Remove</button></td>
            </tr>
          )}
          {selectedUnits.infantry.length > 0 && <tr><th colSpan={3} className='text-xl text-orange-400'>Infantry</th></tr>}
          {selectedUnits.infantry && selectedUnits.infantry.map(unit => 
            <tr key={unit.instance}>
              <td className="px-4 py-4 border-b border-[#333]">{unit.name}</td>
              <td className="px-4 py-4 border-b border-[#333] text-center">{unit.unitPoints.cost}</td>
              <td className="px-4 py-4 border-b border-[#333] text-center"><button onClick={() => removeFromRoster(unit, 'infantry')}>Remove</button></td>
            </tr>
          )}
          {roster.cost === 0 ? 
            <tr><td colSpan={3} className="text-center text-xl py-2">Total Points 0</td></tr> :
            <tr><td colSpan={3} className="text-center text-xl py-2">Total Points {roster.cost}</td></tr>}
        </tbody>
      </table>
      <div>
        <input 
          type='text' 
          value={armyName} 
          onChange={(event) => setArmyName(event.target.value)} 
          placeholder='Input Roster Name'
          className='flex mx-auto my-1 bg-neutral-600 text-center text-white my-4 rounded-md'
        /> 
      </div>
      <div className='flex justify-center'>
        <button
          onClick={saveArmy}
          className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 
                  overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
                  group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none 
                  focus:ring-pink-200 dark:focus:ring-pink-800"
        ><span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
          Save Army</span></button>
        <button
          onClick={() => clearRoster()}
          className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 
                  overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
                  group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none 
                  focus:ring-pink-200 dark:focus:ring-pink-800"
        ><span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
          Clear</span></button>
      </div>
    </div>}
      {isOpen &&
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 text-center">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl max-w-sm w-full">
            <p className="mb-6 text-white">{modalMsg}</p>
            <button
              onClick={() => setIsOpen(false)}
              className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 
                overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
                group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none 
                focus:ring-pink-200 dark:focus:ring-pink-800"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                Close</span>
            </button>
          </div>
        </div>
      }
    </div>
  )
}

Roster.propTypes = {
  selectedUnits: PropTypes.object,
  rosterTotal: PropTypes.number,
  setSelectedUnits: PropTypes.func,
  faction: PropTypes.string
}

export default Roster