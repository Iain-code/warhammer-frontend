import React from 'react'
import PropTypes from 'prop-types'

const UnitTable = ({ groupedUnits, toShow }) => {

  const viewKeywords = () => {

  }

  const viewWargear = () => {

  }
  
  return (
    <div>
      {toShow &&
        <table className="ABTable">
          <caption>Units Available</caption>
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
            </tr>
          </thead>
          <tbody>
            {console.log('grouped in table:', groupedUnits)}
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
  toShow: PropTypes.string
}

export default UnitTable