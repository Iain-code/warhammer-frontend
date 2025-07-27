import React from 'react'
import PropTypes from 'prop-types'

const UnitTable = ({ groupedUnits, toShow, addUnitToRoster }) => {

  const viewKeywords = () => {

  }

  const viewWargear = () => {

  }
  
  return (
    <div>
      {toShow &&
        <table className="ABTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Movement</th>
              <th>Toughness</th>
              <th>Save</th>
              <th>Inv Save</th>
              <th>Ld</th>
              <th>OC</th>
              <th>Keywords</th>
              <th>Wargear</th>
              <th>Unit Size</th>
              <th>Points Cost</th>
              <th>Add to Roster</th>
            </tr>
          </thead>
          <tbody>
            {groupedUnits.map(unit => (
              <tr key={unit.datasheet_id}>
                <td>{unit.name}</td>
                <td>{unit.M}</td>
                <td>{unit.T}</td>
                <td>{unit.Sv}</td>
                <td>{unit.inv_sv}</td>
                <td>{unit.Ld}</td>
                <td>{unit.OC}</td>
                <td><button onClick={() => viewKeywords()}>View keywords</button></td>
                <td><button onClick={() => viewWargear()}>View Wargear</button></td>
                <td>
                  {unit.unitPoints.description}
                  {unit.unitPoints.description2 && unit.unitPoints.cost2 && (
                    <>
                      <br />
                      {unit.unitPoints.description2}
                    </>
                  )}
                </td>
                <td>
                  {unit.unitPoints.cost}
                  {unit.unitPoints.cost2 && unit.unitPoints.description2 && (
                    <>
                      <br />
                      <br />
                      {unit.unitPoints.cost2}
                    </>
                  )}
                </td>
                <td>
                  <button onClick={() => addUnitToRoster(unit, '')}>Add</button>
                  {unit.unitPoints.description2 && unit.unitPoints.cost2 && (
                    <>
                      <br />
                      <br />
                      <button onClick={() => addUnitToRoster(unit, 'cost2')}>Add</button>
                    </>)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  )
}

UnitTable.propTypes = {
  groupedUnits: {
    characters: PropTypes.object
  },
  toShow: PropTypes.string,
  addUnitToRoster: PropTypes.func
}

export default UnitTable