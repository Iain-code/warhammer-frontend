import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import RosterContext from '../../contexts/rosterContext'

const Roster = ({ selectedUnits, setSelectedUnits }) => {

  const [roster, rosterDispatch] = useContext(RosterContext)

  const removeFromRoster = (unit, group) => {

    const filteredUnits = selectedUnits[group].filter(u => u.instance !== unit.instance)
    setSelectedUnits({ ...selectedUnits, [group]: filteredUnits})

    rosterDispatch({
      type: 'minus',
      payload: unit.unitPoints.cost2 || unit.unitPoints.cost
    })
  }


  return (
    <div>
      <table>
        <caption>Roster</caption>
        <thead>
          <tr>
            <th>Name</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr><th>Enhancements</th></tr>
          <tr>
            {roster.enhancement && roster.enhancement.map(e => 
              <td key={e}>{e}</td>
            )}
          </tr>
          <tr><th>Characters</th></tr>
          {selectedUnits.character && selectedUnits.character.map(unit =>
            <tr key={unit.instance}>
              <td>{unit.name}</td>
              <td>{unit.unitPoints.cost}</td>
              <td><button onClick={() => removeFromRoster(unit, 'character')}>Remove</button></td>
            </tr>
          )}
          <tr><th>Battleline</th></tr>
          {selectedUnits.battleline && selectedUnits.battleline.map(unit => 
            <tr key={unit.instance}>
              <td>{unit.name}</td>
              <td>{unit.unitPoints.cost}</td>
              <td><button onClick={() => removeFromRoster(unit, 'battleline')}>Remove</button></td>
            </tr>
          )}
          <tr><th>Transport</th></tr>
          {selectedUnits.transport && selectedUnits.transport.map(unit => 
            <tr key={unit.instance}>
              <td>{unit.name}</td>
              <td>{unit.unitPoints.cost}</td>
              <td><button onClick={() => removeFromRoster(unit, 'transport')}>Remove</button></td>
            </tr>
          )}
          <tr><th>Monsters</th></tr>
          {selectedUnits.monster && selectedUnits.monster.map(unit => 
            <tr key={unit.instance}>
              <td>{unit.name}</td>
              <td>{unit.unitPoints.cost}</td>
              <td><button onClick={() => removeFromRoster(unit, 'monsters')}>Remove</button></td>
            </tr>
          )}
          <tr><th>Vehicle</th></tr>
          {selectedUnits.vehicle && selectedUnits.vehicle.map(unit => 
            <tr key={unit.instance}>
              <td>{unit.name}</td>
              <td>{unit.unitPoints.cost}</td>
              <td><button onClick={() => removeFromRoster(unit, 'vehicles')}>Remove</button></td>
            </tr>
          )}
          <tr><th>Mounted</th></tr>
          {selectedUnits.mounted && selectedUnits.mounted.map(unit => 
            <tr key={unit.instance}>
              <td>{unit.name}</td>
              <td>{unit.unitPoints.cost}</td>
              <td><button onClick={() => removeFromRoster(unit, 'mounted')}>Remove</button></td>
            </tr>
          )}
          <tr><th>Aircraft</th></tr>
          {selectedUnits.aircraft && selectedUnits.aircraft.map(unit => 
            <tr key={unit.instance}>
              <td>{unit.name}</td>
              <td>{unit.unitPoints.cost}</td>
              <td><button onClick={() => removeFromRoster(unit, 'aircraft')}>Remove</button></td>
            </tr>
          )}
          <tr><th>Infantry</th></tr>
          {selectedUnits.infantry && selectedUnits.infantry.map(unit => 
            <tr key={unit.instance}>
              <td>{unit.name}</td>
              <td>{unit.unitPoints.cost}</td>
              <td><button onClick={() => removeFromRoster(unit, 'infantry')}>Remove</button></td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        Total Points = {roster.cost}
      </div>
    </div>
  )
}

Roster.propTypes = {
  selectedUnits: PropTypes.object,
  rosterTotal: PropTypes.number,
  setSelectedUnits: PropTypes.func
}

export default Roster