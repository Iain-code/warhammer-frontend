import React from 'react'
import { useContext } from 'react'
import ModelContext from '../modelContext'
import PropTypes from 'prop-types'

const ModelProfile = ({ wargear }) => {
  const [model] = useContext(ModelContext)
  const defender = model.defence
  console.log('defender:', defender)

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
            <td>{wargear.name.String}</td>
            <td>{wargear.type.String}</td>
            <td>{wargear.range.String}</td>
            <td>{wargear.bs_ws.String}</td>
            <td>{wargear.a.String}</td>
            <td>{wargear.s.String}</td>
            <td>{wargear.ap.Int32}</td>
            <td>{wargear.d.String}</td>
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
            <td>{defender.W.Int32}</td>
            <td>{defender.Sv.String}</td>
            <td>{defender.inv_sv.String}</td>
            <td>{defender.Ld.String}</td>
            <td>{defender.OC.String}</td>
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
    bs_ws: PropTypes.string,
    a: PropTypes.string,
    s: PropTypes.string,
    d: PropTypes.string,
    ap: PropTypes.string,
  })
}

export default ModelProfile