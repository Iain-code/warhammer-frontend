import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import RosterContext from '../../contexts/rosterContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import modelService from '../../requests/models'
import UserContext from '../../contexts/userContext'
import ArmyList from './ArmyList'

const Roster = ({ selectedUnits, setSelectedUnits, faction }) => {

  const user = useContext(UserContext)
  const queryClient = useQueryClient();
  const [roster, rosterDispatch] = useContext(RosterContext)
  const [armyName, setArmyName] = useState('')

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
      window.confirm('army list saved'),
      queryClient.invalidateQueries({ queryKey: ['armyList']})
    },
    onError: (error) => {
      console.error('failed to save army list:', error)
    }
  })

  const saveArmy = () => {

    if (armyName === null || armyName === '') {
      return window.confirm('please insert army name')
    }
    
    const army = Object.values(selectedUnits)
      .filter(arr => arr.length > 0 && arr[0]?.datasheet_id)
      .map(unit => unit.map(singleUnit => singleUnit.datasheet_id)).flat()


    const collectedData = {
      user_id: user[0].id,
      army_list: army,
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
    <div className='lg:sticky lg:top-24 h-screen overflow-auto'>
      <div><ArmyList SetSelectedUnits={setSelectedUnits} /></div>
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
        <tbody className=''>
          <tr><th colSpan={3} className='text-xl text-orange-600'>Enhancements</th></tr>
          {roster.enhancement && roster.enhancement.map(e =>
            <tr
              key={e}
              className="hover:bg-[#2a2a2a]"
            >
              <td colSpan={3} className="px-4 py-4 border-b border-[#333] text-center">{e}</td>
            </tr>
          )}
        
          {selectedUnits.character.length > 0 && <tr><th colSpan={3} className='text-xl text-orange-600'>Characters</th></tr>}
          {selectedUnits.character && selectedUnits.character.map(unit =>
            <tr key={unit.instance} className="hover:bg-[#2a2a2a]">
              <td className="px-4 py-4 border-b border-[#333]">{unit.name}</td>
              <td className="px-4 py-4 border-b border-[#333] text-center">{unit.unitPoints.cost}</td>
              <td className="px-4 py-4 border-b border-[#333] text-center"><button onClick={() => removeFromRoster(unit, 'character')}>Remove</button></td>
            </tr>
          )}
          {selectedUnits.battleline > 0 && <tr><th colSpan={3} className='text-xl text-orange-600'>Battleline</th></tr>}
          {selectedUnits.battleline && selectedUnits.battleline.map(unit => 
            <tr key={unit.instance} className="hover:bg-[#2a2a2a]">
              <td className="px-4 py-4 border-b border-[#333]">{unit.name}</td>
              <td className="px-4 py-4 border-b border-[#333] text-center">{unit.unitPoints.cost}</td>
              <td className="px-4 py-4 border-b border-[#333] text-center"><button onClick={() => removeFromRoster(unit, 'battleline')}>Remove</button></td>
            </tr>
          )}
          {selectedUnits.transport.length > 0 && <tr><th colSpan={3} className='text-xl text-orange-600'>Transport</th></tr>}
          {selectedUnits.transport && selectedUnits.transport.map(unit => 
            <tr key={unit.instance} className="hover:bg-[#2a2a2a]">
              <td className="px-4 py-4 border-b border-[#333]">{unit.name}</td>
              <td className="px-4 py-4 border-b border-[#333] text-center">{unit.unitPoints.cost}</td>
              <td className="px-4 py-4 border-b border-[#333] text-center"><button onClick={() => removeFromRoster(unit, 'transport')}>Remove</button></td>
            </tr>
          )}
          {selectedUnits.monster > 0 && <tr><th colSpan={3} className='text-xl text-orange-600'>Monsters</th></tr>}
          {selectedUnits.monster && selectedUnits.monster.map(unit => 
            <tr key={unit.instance} className="hover:bg-[#2a2a2a]">
              <td className="px-4 py-4 border-b border-[#333]">{unit.name}</td>
              <td className="px-4 py-4 border-b border-[#333] text-center">{unit.unitPoints.cost}</td>
              <td className="px-4 py-4 border-b border-[#333] text-center"><button onClick={() => removeFromRoster(unit, 'monster')}>Remove</button></td>
            </tr>
          )}
          {selectedUnits.vehicle.length > 0 && <tr><th colSpan={3} className='text-xl text-orange-600'>Vehicle</th></tr>}
          {selectedUnits.vehicle && selectedUnits.vehicle.map(unit => 
            <tr key={unit.instance} className="hover:bg-[#2a2a2a]">
              <td className="px-4 py-4 border-b border-[#333]">{unit.name}</td>
              <td className="px-4 py-4 border-b border-[#333] text-center">{unit.unitPoints.cost}</td>
              <td className="px-4 py-4 border-b border-[#333] text-center"><button onClick={() => removeFromRoster(unit, 'vehicle')}>Remove</button></td>
            </tr>
          )}
          {selectedUnits.mounted.length > 0 && <tr><th colSpan={3} className='text-xl text-orange-600'>Mounted</th></tr>}
          {selectedUnits.mounted && selectedUnits.mounted.map(unit => 
            <tr key={unit.instance} className="hover:bg-[#2a2a2a]">
              <td className="px-4 py-4 border-b border-[#333]">{unit.name}</td>
              <td className="px-4 py-4 border-b border-[#333] text-center">{unit.unitPoints.cost}</td>
              <td className="px-4 py-4 border-b border-[#333] text-center"><button onClick={() => removeFromRoster(unit, 'mounted')}>Remove</button></td>
            </tr>
          )}
          {selectedUnits.aircraft.length > 0 && <tr><th colSpan={3} className='text-xl text-orange-600'>Aircraft</th></tr>}
          {selectedUnits.aircraft && selectedUnits.aircraft.map(unit => 
            <tr key={unit.instance} className="hover:bg-[#2a2a2a]">
              <td>{unit.name}</td>
              <td>{unit.unitPoints.cost}</td>
              <td><button onClick={() => removeFromRoster(unit, 'aircraft')}>Remove</button></td>
            </tr>
          )}
          {selectedUnits.infantry.length > 0 && <tr><th colSpan={3} className='text-xl text-orange-600'>Infantry</th></tr>}
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
      <input 
        type='text' 
        value={armyName} 
        onChange={(event) => setArmyName(event.target.value)} 
        style={{ color: "black", background: "white" }}
        placeholder='Input Army Name'
      />
      <button
        onClick={saveArmy}
        className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded border border-orange-600 m-2"
      >Save Army</button>
      <button
        onClick={() => clearRoster()}
        className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded border border-orange-600 m-2"
      >Clear</button>
    </div>}
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