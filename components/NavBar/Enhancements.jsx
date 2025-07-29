import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import RosterContext from '../../contexts/rosterContext'
import parse, { domToReact } from 'html-react-parser'

const Enhancements = ({ enhancements, faction }) => {
  const [chosen, setChosen] = useState(false)
  const [chosenDetachment, setChosenDetatchment] = useState(null)
  const [roster, rosterDispatch] = useContext(RosterContext)
  
  if (!enhancements) return

  const armyEnhance = enhancements.filter(e => e.faction_id === faction)

  const detachments = armyEnhance.reduce((object, enhance) => {
    if (!object[enhance.detachment]) {
      object[enhance.detachment] = []
    }

    object[enhance.detachment].push(enhance)
    return object
  }, {})

  const split = Object.entries(detachments)

  const chooseDetachment = (detachmentObj) => {
    console.log(detachmentObj)
    setChosenDetatchment(detachmentObj)
    setChosen(true)
  }
  
  const removeDetachment = () => {
    setChosenDetatchment(null)
    setChosen(false)
  }

  const addEnhancementToRoster = (cost, name) => {
    console.log(roster.enhancement)
    
    if (roster.enhancement && roster.enhancement.includes(name)) {
      rosterDispatch({
        type: 'remove',
        payload: {
          cost: cost,
          enhancement: name
        }
      })
      return
    }

    rosterDispatch({
      type: 'add',
      payload: cost
    })
    rosterDispatch({
      type: 'enhancement',
      payload: name
    })
  }

  const cleanDescription = (d) => {
    return parse(d.description, {
      replace: domNode => {
        if (domNode.name === 'a') {
          return <span>{domToReact(domNode.children)}</span>;
        }
      }
    })
  }
 
  return (
    <div>
      {split.map(e => (
        <div key={e[0]}>
          {e[1].length === 4 && !chosen && (
            <button onClick={() => chooseDetachment(e)}>
              {e[0]}
            </button>
          )}
        </div>
      ))}
      {chosenDetachment &&
       <div>
         <button onClick={removeDetachment}>Change Detachment</button>
         {chosenDetachment[0]}
         {chosenDetachment[1].map(d =>
           <p key={d.id}>
             <span>{d.name} - {d.cost}</span>
             <input type='checkbox' value={d.name} onChange={() => addEnhancementToRoster(d.cost, d.name)}/>
             <br />
             {cleanDescription(d)}
           </p>
         )}
       </div>
      }
    </div>
  )
}

Enhancements.propTypes = {
  enhancements: PropTypes.object,
  faction: PropTypes.string
}

export default Enhancements