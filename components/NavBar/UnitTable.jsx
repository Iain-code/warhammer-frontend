import React, { useState } from 'react'
import PropTypes from 'prop-types'
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
        <table className="min-w-[600px] w-full mx-auto border-collapse bg-[#1b1b1b] rounded-lg text-white">
          <thead className="bg-[#2a2a2a] px-3 py-3 font-medium border-b-2 border-[#444]">
            <tr>
              <th>Name</th>
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
              <tr key={unit.datasheet_id} className="hover:bg-[#2a2a2a]">
                <td className="px-4 py-4 border-b border-[#333]">{unit.name}</td>
                <td className="px-4 py-4 border-b border-[#333]"><button onClick={() => viewKeywords(unit)}>View keywords</button></td>
                <td className="px-4 py-4 border-b border-[#333]"><button onClick={() => viewWargear(unit)}>View Wargear</button></td>
                <td className="px-4 py-4 border-b border-[#333]"><button onClick={() => viewAbilities(unit)}>View Abilities</button></td>
                <td className="px-4 py-4 border-b border-[#333]">
                  {unit.unitPoints.description}
                  {unit.unitPoints.description2 && unit.unitPoints.cost2 && (
                    <>
                      <br />
                      {unit.unitPoints.description2}
                    </>
                  )}
                </td>
                <td className="px-4 py-4 border-b border-[#333]">
                  {unit.unitPoints.cost}
                  {unit.unitPoints.cost2 && unit.unitPoints.description2 && (
                    <>
                      <br />
                      <br />
                      {unit.unitPoints.cost2}
                    </>
                  )}
                </td>
                <td className="px-4 py-4 border-b border-[#333]">
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
        <div className="flex bg-black/50 text-white p-4 z-[1000] fixed inset-0 items-center justify-center text-xl">
          <div className="">
            <h2>Wargear</h2>
            <table className="text-center border-collapse w-full">
              <thead>
                <tr className="">
                  <th className="p-2">Name</th>
                  <td className="p-2">Type</td>
                  <th className="p-2">Range</th>
                  <th className="p-2">Attacks</th>
                  <th className="p-2">Strength</th>
                  <th className="p-2">AP</th>
                  <th className="p-2">Damage</th>
                </tr>
              </thead>
              <tbody className="">
                {selectedWargear.map(item => (
                  <tr key={item.id}>
                    <td className='border-b border-collapse border-orange-600 p-2'>{item.name}</td>
                    <td className='border-b border-collapse border-orange-600 p-2'>{item.type}</td>
                    <td className='border-b border-collapse border-orange-600 p-2'>{item.range}</td>
                    <td className='border-b border-collapse border-orange-600 p-2'>{item.attacks}</td>
                    <td className='border-b border-collapse border-orange-600 p-2'>{item.strength}</td>
                    <td className='border-b border-collapse border-orange-600 p-2'>{item.AP.int32}</td>
                    <td className='border-b border-collapse border-orange-600 p-2'>{item.damage}</td>
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