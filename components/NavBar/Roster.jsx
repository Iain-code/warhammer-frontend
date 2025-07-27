import React from 'react'
import PropTypes from 'prop-types'

const Roster = ({ selectedUnits, rosterTotal }) => {

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
          <tr><td>Characters</td></tr>
          {selectedUnits.character && selectedUnits.character.map(unit =>
            <tr key={unit.instance}>
              <td>{unit.name}</td>
              <td>{unit.unitPoints.cost}</td>
            </tr>
          )}
          <tr><td>Battleline</td></tr>
          {selectedUnits.battleline && selectedUnits.battleline.map(unit => 
            <tr key={unit.instance}>
              <td>{unit.name}</td>
              <td>{unit.unitPoints.cost}</td>
            </tr>
          )}
          <tr><td>Transport</td></tr>
          {selectedUnits.transport && selectedUnits.transport.map(unit => 
            <tr key={unit.instance}>
              <td>{unit.name}</td>
              <td>{unit.unitPoints.cost}</td>
            </tr>
          )}
          <tr><td>Monsters</td></tr>
          {selectedUnits.monster && selectedUnits.monster.map(unit => 
            <tr key={unit.instance}>
              <td>{unit.name}</td>
              <td>{unit.unitPoints.cost}</td>
            </tr>
          )}
          <tr><td>Vehicle</td></tr>
          {selectedUnits.vehicle && selectedUnits.vehicle.map(unit => 
            <tr key={unit.instance}>
              <td>{unit.name}</td>
              <td>{unit.unitPoints.cost}</td>
            </tr>
          )}
          <tr><td>Mounted</td></tr>
          {selectedUnits.mounted && selectedUnits.mounted.map(unit => 
            <tr key={unit.instance}>
              <td>{unit.name}</td>
              <td>{unit.unitPoints.cost}</td>
            </tr>
          )}
          <tr><td>Aircraft</td></tr>
          {selectedUnits.aircraft && selectedUnits.aircraft.map(unit => 
            <tr key={unit.instance}>
              <td>{unit.name}</td>
              <td>{unit.unitPoints.cost}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        Total Points = {rosterTotal}
      </div>
    </div>
  )
}

Roster.propTypes = {
  selectedUnits: PropTypes.object,
  rosterTotal: PropTypes.number
}

export default Roster