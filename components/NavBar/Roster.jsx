import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import RosterContext from '../../contexts/rosterContext'
import './armybuilder.css'

const Roster = ({ selectedUnits, setSelectedUnits }) => {

  const [roster, rosterDispatch] = useContext(RosterContext)
  console.log(selectedUnits)

  const removeFromRoster = (unit, group) => {
    const filteredUnits = selectedUnits[group].filter(u => u.instance !== unit.instance)
    setSelectedUnits({ ...selectedUnits, [group]: filteredUnits})

    rosterDispatch({
      type: 'minus',
      payload: unit.unitPoints.cost2 || unit.unitPoints.cost
    })
  }


  return (
    <div className="text-white">
      <table className='ABTable'>
        <caption>Roster</caption>
        <thead>
          <tr>
            <th>Name</th>
            <th>Cost</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          <tr><th colSpan={3} className='text-xl text-orange-600'>Enhancements</th></tr>
          {roster.enhancement && roster.enhancement.map(e =>
            <tr
              key={e}
              className='text-center'
            >
              <td colSpan={3}>{e}</td>
            </tr>
          )}
        
          {selectedUnits.character.length > 0 && <tr><th colSpan={3} className='text-xl text-orange-600'>Characters</th></tr>}
          {selectedUnits.character && selectedUnits.character.map(unit =>
            <tr key={unit.instance}>
              <td>{unit.name}</td>
              <td>{unit.unitPoints.cost}</td>
              <td><button onClick={() => removeFromRoster(unit, 'character')}>Remove</button></td>
            </tr>
          )}
          {selectedUnits.battleline > 0 && <tr><th colSpan={3} className='text-xl text-orange-600'>Battleline</th></tr>}
          {selectedUnits.battleline && selectedUnits.battleline.map(unit => 
            <tr key={unit.instance}>
              <td>{unit.name}</td>
              <td>{unit.unitPoints.cost}</td>
              <td><button onClick={() => removeFromRoster(unit, 'battleline')}>Remove</button></td>
            </tr>
          )}
          {selectedUnits.transport.length > 0 && <tr><th colSpan={3} className='text-xl text-orange-600'>Transport</th></tr>}
          {selectedUnits.transport && selectedUnits.transport.map(unit => 
            <tr key={unit.instance}>
              <td>{unit.name}</td>
              <td>{unit.unitPoints.cost}</td>
              <td><button onClick={() => removeFromRoster(unit, 'transport')}>Remove</button></td>
            </tr>
          )}
          {selectedUnits.monster > 0 && <tr><th colSpan={3} className='text-xl text-orange-600'>Monsters</th></tr>}
          {selectedUnits.monster && selectedUnits.monster.map(unit => 
            <tr key={unit.instance}>
              <td>{unit.name}</td>
              <td>{unit.unitPoints.cost}</td>
              <td><button onClick={() => removeFromRoster(unit, 'monster')}>Remove</button></td>
            </tr>
          )}
          {selectedUnits.vehicle.length > 0 && <tr><th colSpan={3} className='text-xl text-orange-600'>Vehicle</th></tr>}
          {selectedUnits.vehicle && selectedUnits.vehicle.map(unit => 
            <tr key={unit.instance}>
              <td>{unit.name}</td>
              <td>{unit.unitPoints.cost}</td>
              <td><button onClick={() => removeFromRoster(unit, 'vehicle')}>Remove</button></td>
            </tr>
          )}
          {selectedUnits.mounted.length > 0 && <tr><th colSpan={3} className='text-xl text-orange-600'>Mounted</th></tr>}
          {selectedUnits.mounted && selectedUnits.mounted.map(unit => 
            <tr key={unit.instance}>
              <td>{unit.name}</td>
              <td>{unit.unitPoints.cost}</td>
              <td><button onClick={() => removeFromRoster(unit, 'mounted')}>Remove</button></td>
            </tr>
          )}
          {selectedUnits.aircraft.length > 0 && <tr><th colSpan={3} className='text-xl text-orange-600'>Aircraft</th></tr>}
          {selectedUnits.aircraft && selectedUnits.aircraft.map(unit => 
            <tr key={unit.instance}>
              <td>{unit.name}</td>
              <td>{unit.unitPoints.cost}</td>
              <td><button onClick={() => removeFromRoster(unit, 'aircraft')}>Remove</button></td>
            </tr>
          )}
          {selectedUnits.infantry.length > 0 && <tr><th colSpan={3} className='text-xl text-orange-600'>Infantry</th></tr>}
          {selectedUnits.infantry && selectedUnits.infantry.map(unit => 
            <tr key={unit.instance}>
              <td>{unit.name}</td>
              <td>{unit.unitPoints.cost}</td>
              <td><button onClick={() => removeFromRoster(unit, 'infantry')}>Remove</button></td>
            </tr>
          )}
          <tr><td colSpan={3} className='text-center'>Total Points {roster.cost}</td></tr>
        </tbody>
      </table>
    </div>
  )
}

Roster.propTypes = {
  selectedUnits: PropTypes.object,
  rosterTotal: PropTypes.number,
  setSelectedUnits: PropTypes.func
}

export default Roster