import React from 'react'
import { useContext, useState } from 'react'
import ModelContext from '../../contexts/modelContext'
import PropTypes from 'prop-types'
import './modelWargear.css'
import { useQuery } from '@tanstack/react-query'
import modelService from '../../requests/models'
import parse, { domToReact } from 'html-react-parser'

const ModelProfile = ({ wargear }) => {
  const [model] = useContext(ModelContext)
  const [activeTab, setActiveTab] = useState('attacker')
  const defender = model.defence

  const cleanDescription = (description) => {
    return parse(description, {
      replace: domNode => {
        if (domNode.name === 'a') {
          return <span>{domToReact(domNode.children)}</span>;
        }
      }
    })
  }

  const attackerAbilities = useQuery({
    queryKey: ['attackerAbilities', model.attack],
    queryFn: () => modelService.getAbilitiesForModel(model.attack.datasheet_id),
    enabled: !!model.attack,
    retry: 1,
    refetchOnWindowFocus: false
  })

  const defenderAbilities = useQuery({
    queryKey: ['defenderAbilities', model.defence],
    queryFn: () => modelService.getAbilitiesForModel(model.defence.datasheet_id),
    enabled: !!model.defence,
    retry: 1,
    refetchOnWindowFocus: false
  })

  return (
    <div className='modelTables'>
      <div className='overflow-x-auto'>
        <table className='w-full justify-center mx-auto'>
          <caption className=''>Attackers Wargear Profile</caption>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Range</th>
              <th>BS/WS</th>
              <th>Attacks</th>
              <th>Strength</th>
              <th>AP</th>
              <th>Damage</th>
              <th>Keywords</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{wargear.name}</td>
              <td>{wargear.type}</td>
              <td>{wargear.range}</td>
              <td>{wargear.BS_WS}</td>
              <td>{wargear.attacks}</td>
              <td>{wargear.strength}</td>
              <td>{wargear.AP}</td>
              <td>{wargear.damage}</td>
              <td>{cleanDescription(wargear.description.toUpperCase())}</td>
            </tr>
          </tbody>
        </table>
        <table className='table-fixed w-full justify-center mx-auto'>
          <caption className='w-full justify-center mx-auto'>Defenders Profile</caption>
          <thead>
            <tr>
              <th>Name</th>
              <th>Movement</th>
              <th>Toughness</th>
              <th>Wounds</th>
              <th>Sv</th>
              <th>Inv Sv</th>
              <th>Ld</th>
              <th>OC</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{defender.name}</td>
              <td>{defender.M}</td>
              <td>{defender.T}</td>
              <td>{defender.W}</td>
              <td>{defender.Sv}</td>
              <td>{defender.inv_sv}</td>
              <td>{defender.Ld}</td>
              <td>{defender.OC}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="rounded shadow-lg overflow-hidden">
        <h1 className='py-3 text-xl font-family:sans text-center text-white'>Abilities</h1>
        <div>
          <div className="flex  border-b bg-neutral-600 text-white">
            <button
              className={`flex-1 px-4 py-2 ${
                activeTab === 'attacker' ? "bg-neutral-500 font-bold" : "bg-neutral-700"
              }`}
              onClick={() => setActiveTab('attacker')}
            >
              Attacker
            </button>
            <button
              className={`flex-1 px-4 py-2 ${
                activeTab === 'defender' ? 'bg-neutral-500 font-bold' : 'bg-neutral-700'
              }`}
              onClick={() => setActiveTab('defender')}
            >
              Defender
            </button>
          </div>
        </div>
      </div>
      <div className="flex border-b mx-auto bg-neutral-800 text-white justify-center py-4 mb-4">
        {activeTab === "attacker" && (
          <div>
            {attackerAbilities.data && attackerAbilities.data.map(ability => 
              <div key={ability.Line} className='flex flex-col mx-auto w-3/4 text-center'>
                <h1 className='text-xl mt-5 underline font-semibold'>{ability.Name}</h1>
                <p className='text-lg'>{cleanDescription(ability.Description)}</p>
              </div>
            )}
          </div>
        )}
        {activeTab === "defender" && (
          <div>
            {defenderAbilities.data && defenderAbilities.data.map(ability => 
              <div key={ability.Line} className='flex flex-col mx-auto w-3/4 text-center'>
                <h1 className='text-xl mt-5 underline font-semibold'>{ability.Name}</h1>
                <p className='text-lg'>{cleanDescription(ability.Description)}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

ModelProfile.propTypes = {
  wargear: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    range: PropTypes.string,
    BS_WS: PropTypes.string,
    attacks: PropTypes.string,
    strength: PropTypes.string,
    damage: PropTypes.string,
    AP: PropTypes.string,
    description: PropTypes.string,
  })
}

export default ModelProfile