import React from 'react'
import { useContext } from 'react'
import ModelContext from '../../contexts/modelContext'
import PropTypes from 'prop-types'
import './modelWargear.css'

const ModelProfile = ({ wargear }) => {
  const [model] = useContext(ModelContext)
  const defender = model.defence

  return (
    <div className='modelTables'>
      <table className='attackTable'>
        <caption className='caption'>Attackers Wargear Profile</caption>
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
          </tr>
        </tbody>
      </table>
      <table className='defenceTable'>
        <caption className='caption'>Defenders Profile</caption>
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
  })
}

export default ModelProfile