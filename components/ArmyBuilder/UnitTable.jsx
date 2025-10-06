import React, { useState } from 'react'
import PropTypes from 'prop-types'
import parse, { domToReact } from 'html-react-parser'
import { useQuery } from '@tanstack/react-query'

const UnitTable = ({ groupedUnits, toShow, addUnitToRoster, wargear, abilities }) => {

  const [selectedWargear, setSelectedWargear] = useState(null)
  const [selectedKeywords, setSelectedKeywords] = useState(null)
  const [selectedAbilities, setSelectedAbilities] = useState(null)

  const viewKeywords = (unit) => {
    const wordsWithIndex = unit.keywords.reduce((arr, word, index) => {
      if (word === '') {
        return arr
      }
      return [...arr, { keyword: word, index: index}]
      
    }, [])
    
    const uniqueWords = []

    wordsWithIndex.forEach(word => {
      const found = uniqueWords.find(keyword => keyword.keyword === word.keyword)
      if (!found) {
        return uniqueWords.push(word)
      }
    })

    setSelectedKeywords(uniqueWords)
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

  const cleanDescription = (description) => {
    return parse(description, {
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

  const keywords = useQuery({
    queryKey: ['armyBuilder', selected]
  })
  
  return (
    <div className='overflow-x-auto'>
      {toShow &&
        <table className="min-w-[600px] w-full mx-auto border-collapse bg-[#1b1b1b] rounded-lg text-white">
          <thead className="bg-[#2a2a2a] px-3 py-3 font-medium border-b-2 border-[#444]">
            <tr>
              <th>Name</th>
              <th>Add</th>
              <th>Points Cost</th>
              <th>Unit Size</th>
              <th>Keywords</th>
              <th>Wargear</th>
              <th>Abilites</th>
              <th>Keywords</th>
            </tr>
          </thead>
          <tbody>
            {groupedUnits.map(unit => (
              <tr key={unit.datasheet_id} className="hover:bg-[#2a2a2a]">
                <td className="px-4 py-4 border-b border-[#333] text-center">{unit.name}</td>
                <td className="px-4 py-4 border-b border-[#333]">
                  <button onClick={() => addUnitToRoster(unit, '')}>Add to Roster</button>
                  {unit.unitPoints.description2 && unit.unitPoints.cost2 && (
                    <div>
                      <p className='border-b my-1'></p>
                      <div>
                        <button onClick={() => addUnitToRoster(unit, 'cost2')}>Add to Roster</button>
                      </div>
                    </div>
                   
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
                <td className="px-4 py-4 border-b border-[#333] text-center">
                  {unit.unitPoints.description}
                  {unit.unitPoints.description2 && unit.unitPoints.cost2 && (
                    <>
                      <br />
                      {unit.unitPoints.description2}
                    </>
                  )}
                </td>
                <td className="px-4 py-4 border-b border-[#333] text-center"><button onClick={() => viewKeywords(unit)}>View keywords</button></td>
                <td className="px-4 py-4 border-b border-[#333] text-center"><button onClick={() => viewWargear(unit)}>View Wargear</button></td>
                <td className="px-4 py-4 border-b border-[#333] text-center"><button onClick={() => viewAbilities(unit)}>View Abilities</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      }
      {selectedWargear && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 text-white overflow-y-auto"> 
          <div className="bg-[#1b1b1b] p-6 rounded-xl shadow-lg max-w-4xl w-full text-center max-h-[80vh] overflow-y-auto">
            <div>
              <h2 className="text-xl text-orange-500 font-bold mb-4">Wargear</h2>
              <table className="min-w-[600px] w-full mx-auto border-collapse bg-[#1b1b1b] rounded-lg text-white">
                <thead className="bg-[#2a2a2a] px-3 py-3 font-medium border-b-2 border-[#444]">
                  <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Range</th>
                    <th className="p-2">Attacks</th>
                    <th className="p-2">Strength</th>
                    <th className="p-2">AP</th>
                    <th className="p-2">Damage</th>
                  </tr>
                </thead>
                <tbody className="">
                  {selectedWargear.map(item => (
                    <tr key={item.id} className="hover:bg-[#2a2a2a]">
                      <td className="px-4 py-4 border-b border-[#333] text-center">{item.name}</td>
                      <td className="px-4 py-4 border-b border-[#333] text-center">{item.type}</td>
                      <td className="px-4 py-4 border-b border-[#333] text-center">{item.range}</td>
                      <td className="px-4 py-4 border-b border-[#333] text-center">{item.attacks}</td>
                      <td className="px-4 py-4 border-b border-[#333] text-center">{item.strength}</td>
                      <td className="px-4 py-4 border-b border-[#333] text-center">{item.AP.int32}</td>
                      <td className="px-4 py-4 border-b border-[#333] text-center">{item.damage}</td>
                    </tr> 
                  ))}
                </tbody>
              </table>
              <button 
                onClick={() => closeModal('wargear')}
                className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded border border-orange-600 m-2"
              >Close</button>
            </div>
          </div>
        </div>
      )}
      
      {selectedKeywords && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 text-center text-white 
        max-h-1/2 overflow-y-auto">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl max-w-sm w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl text-orange-500 font-bold mb-4">Keywords</h2>
            {selectedKeywords.map(word =>
              <p key={word.index} className="mb-6">
                {word.keyword}
              </p>
            )}
            <button 
              onClick={() => closeModal('keyword')}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg shadow-lg"
            >Close</button>
          </div>
        </div>
      )}
      {selectedAbilities && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 text-center text-white overflow-y-auto">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl max-w-sm w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl text-orange font-bold mb-4 text-orange-500">Abilities</h2>
            {selectedAbilities.map(ability =>
              <div className='mt-8' key={ability.id}>
                <h6 className="text-l text-orange font-bold mb-4 text-orange-500 pt-2">{ability.name}</h6>
                <p>{cleanDescription(ability.description)}</p>
              </div>
            )}
            <button 
              onClick={() => closeModal('abilities')}
              className="px-4 py-2 mt-9 bg-orange-500 hover:bg-orange-600 rounded-lg shadow-lg"
            >Close</button>
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