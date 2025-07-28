import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Enhancements = ({ enhancements, faction }) => {
  const [chosen, setChosen] = useState(false)
  const [chosenDetachment, setChosenDetatchment] = useState(null)
  
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

  const addEnhancementToRoster = () => {

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
             {d.name} - {d.cost}
             <button onClick={addEnhancementToRoster}>Select</button>
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