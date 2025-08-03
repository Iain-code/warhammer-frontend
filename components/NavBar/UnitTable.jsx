import React, { useState } from 'react'
import PropTypes from 'prop-types'
import './unitTable.css'
import parse, { domToReact } from 'html-react-parser'

const UnitTable = ({ groupedUnits, toShow, addUnitToRoster, keywords, wargear, abilities }) => {

  const [selectedWargear, setSelectedWargear] = useState(null)
  const [selectedKeywords, setSelectedKeywords] = useState(null)
  const [selectedAbilities, setSelectedAbilities] = useState(null)

  const viewKeywords = (unit) => {
    setSelectedKeywords(keywords.filter(item => item.datasheet_id === unit.datasheet_id))
  }

  const viewWargear = (unit) => {
    setSelectedWargear(wargear.filter(item => item.datasheet_id === unit.datasheet_id))
  }

  const closeModal = (str) => {
    if (str === 'wargear') {
      setSelectedWargear(null)
    } else if (str === 'keyword') {
      setSelectedKeywords(null)
    } else if (str === 'abilities') {
      setSelectedAbilities(null)
    }
  }

  const cleanDescription = (d) => {
    return parse(d, {
      replace: domNode => {
        if (domNode.name === 'a') {
          return <span>{domToReact(domNode.children)}</span>;
        }
      }
    })
  }

  const viewAbilities = (unit) => {
    console.log(abilities)
    setSelectedAbilities(abilities.filter(item => item.datasheet_id === unit.datasheet_id))
  }
  
  return (
    <div className=''>
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
              <th>Abilites</th>
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
                <td><button onClick={() => viewKeywords(unit)}>View keywords</button></td>
                <td><button onClick={() => viewWargear(unit)}>View Wargear</button></td>
                <td><button onClick={() => viewAbilities(unit)}>View Abilities</button></td>
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
      {selectedWargear && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Wargear</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Range</th>
                  <th>Attacks</th>
                  <th>Strength</th>
                  <th>AP</th>
                  <th>Damage</th>
                </tr>
              </thead>
              <tbody>
                {selectedWargear.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.type}</td>
                    <td>{item.range}</td>
                    <td>{item.attacks}</td>
                    <td>{item.strength}</td>
                    <td>{item.AP.int32}</td>
                    <td>{item.damage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => closeModal('wargear')}>Close</button>
          </div>
        </div>
      )}
      {selectedKeywords && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Keywords</h2>
            {selectedKeywords.map(word =>
              <p key={word.id}>
                {word.keyword}
              </p>
            )}
            <button onClick={() => closeModal('keyword')}>Close</button>
          </div>
        </div>
      )}
      {selectedAbilities && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Abilities</h2>
            {selectedAbilities.map(ability =>
              <div key={ability.id}>
                <h6>{ability.name}</h6>
                <p>{cleanDescription(ability.description)}</p>
              </div>
            )}
            <button onClick={() => closeModal('abilities')}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

UnitTable.propTypes = {
  groupedUnits: {
    characters: PropTypes.object
  },
  toShow: PropTypes.string,
  addUnitToRoster: PropTypes.func,
  keywords: PropTypes.array,
  wargear: PropTypes.array,
  abilities: PropTypes.array
}

export default UnitTable